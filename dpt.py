import boto3
from dotenv import load_dotenv
import os
import json
import matplotlib.pyplot as plt
import base64

load_dotenv(".env")
from sagemaker.huggingface import HuggingFaceModel

region = "us-west-2"

# # Initialize Bedrock client
# client = boto3.client("bedrock-runtime", region_name=region)

# # These are the 2 inputs: the text prompt and the image file path
# user_prompt = "Describe the image"
# img_path = "imgs/port.webp"

# # Read the image file and encode it to base64
# with open(img_path, "rb") as image_file:
#     encoded_image = base64.b64encode(image_file.read()).decode("utf-8")

# Define the IAM role for SageMaker
# role = "arn:aws:iam::513016770698:role/service-role/AmazonSageMaker-ExecutionRole-20241130T211912"  # Replace with your role ARN
role = "arn:aws:iam::513016770698:role/service-role/AmazonSageMaker-ExecutionRole-20241130T214850"

# Specify the Hugging Face model and task
hub = {
    'HF_MODEL_ID': 'Intel/dpt-large',  # Hugging Face model ID
    'HF_TASK': 'depth-estimation',     # Task type
}

# Create a HuggingFaceModel object
huggingface_model = HuggingFaceModel(
    transformers_version="4.12",  # Transformers version
    pytorch_version="1.9.1",       # PyTorch version
    py_version="py38",            # Python version
    env=hub,
    role=role
)

# Deploy the model to an endpoint
predictor = huggingface_model.deploy(
    initial_instance_count=1,          # Number of instances
    instance_type="ml.m5.xlarge"       # Instance type (use ml.g4dn.xlarge for GPU)
)