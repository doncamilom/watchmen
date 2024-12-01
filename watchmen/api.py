
import io
import base64
import numpy as np
from typing import List
from PIL import Image, ImageDraw, ImageFont
import matplotlib.pyplot as plt
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import asyncio
from typing import Dict
from watchmen.agents.agent import Agent
from watchmen.agents.a2 import TimeAgent
from watchmen.logging_config import setup_logger
from watchmen.tools import get_snapshot

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

class Query(BaseModel):
    query: str

@app.post("/analyze_image")
async def analyze_image(query: Query) -> Dict[str, str]:
    logger = setup_logger()
    try:
        w = Agent(timeout=60, verbose=False)
        result = await w.irun(query=query.query)

        # Ignore image for now
        result['results'].pop("image", None)

        return {"result": str(result)}
    except Exception as e:
        logger.error(f"Error processing request: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")


@app.post("/select_images")
async def select_images(query: Query) -> Dict[str, List[str]]:
    logger = setup_logger()
    try:
        tima = TimeAgent(timeout=60, verbose=False)
        result = await tima.irun(query=query.query)

        def encode_image(image_path: str) -> str:
            buffered = io.BytesIO()
            image.save(buffered, format="PNG")
            img_str = base64.b64encode(buffered.getvalue())
            base64_string = img_str.decode('utf-8')
            return base64_string

        all_imgs = []
        for im in eval(result['response']):
            image = get_snapshot(im)
            b64img = encode_image(image)
            all_imgs.append(b64img)

        return {"result": all_imgs}
    except Exception as e:
        logger.error(f"Error processing request: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=9178)