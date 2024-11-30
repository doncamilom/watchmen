from fastapi import FastAPI, File, UploadFile, Form
from fastapi.responses import JSONResponse
from PIL import Image
import io
import torch
from transformers import Owlv2Processor, Owlv2ForObjectDetection
from typing import List
import numpy as np

app = FastAPI()

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
print(device)
# Load model and processor
processor = Owlv2Processor.from_pretrained("google/owlv2-large-patch14-ensemble")
model = Owlv2ForObjectDetection.from_pretrained("google/owlv2-large-patch14-ensemble").to(device)

def process_img(image, texts: List[str]):
    inputs = processor(text=texts, images=image, return_tensors="pt").to(device)

    model.eval()

    # Get predictions
    with torch.no_grad():
        outputs = model(**inputs)

    target_sizes = torch.Tensor([image.size[::-1]])
    results = processor.post_process_object_detection(outputs=outputs, threshold=0.1, target_sizes=target_sizes)

    i = 0
    boxes, scores, labels = results[i]["boxes"], results[i]["scores"], results[i]["labels"]
    return boxes, scores, labels

@app.post("/detect_objects/")
async def detect_objects(
    file: UploadFile = File(...),
    texts: str = Form(...),
    threshold: float = Form(0.5)
):
    # Read and process the uploaded image
    contents = await file.read()
    image = Image.open(io.BytesIO(contents)).convert('RGB')

    # Process the texts
    texts = eval(texts)  # Convert string representation of list to actual list

    # Perform object detection
    boxes, scores, labels = process_img(image, texts)

    # Prepare results
    results = []
    for box, score, label in zip(boxes, scores, labels):
        if score > threshold:
            box = [round(i, 2) for i in box.tolist()]
            results.append({
                "label": texts[0][label],
                "confidence": round(score.item(), 3),
                "box": box
            })

    return JSONResponse(content={"results": results})

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=4390)