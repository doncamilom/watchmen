import boto3
from dotenv import load_dotenv
import os
import json
import matplotlib.pyplot as plt
import base64


load_dotenv(".env")
region = "us-west-2"

# Initialize Bedrock client
client = boto3.client("bedrock-runtime", region_name=region)

# These are the 2 inputs: the text prompt and the image file path
user_prompt = "Describe the image"
img_path = "imgs/port.webp"

# Read the image file and encode it to base64
with open(img_path, "rb") as image_file:
    encoded_image = base64.b64encode(image_file.read()).decode("utf-8")

user_message = {
    "role": "user",
    "content": [
        {
            "type": "image",
            "source": {
                "type": "base64",
                "media_type": "image/webp",
                "data": encoded_image,
            },
        },
        {"type": "text", "text": "Please describe the content of this image."},
    ],
}

model_id = "anthropic.claude-3-5-sonnet-20241022-v2:0"
# Create the payload as per Claude's API requirements
payload = {
    "anthropic_version": "bedrock-2023-05-31",
    "max_tokens": 512,
    "temperature": 0.7,
    "messages": [user_message],
}

# Invoke the model
response = client.invoke_model(
    modelId=model_id, body=json.dumps(payload), contentType="application/json"
)

# Read and parse the response
result = json.loads(response["body"].read())
result["content"][0]["text"]
print(result["content"][0]["text"])
