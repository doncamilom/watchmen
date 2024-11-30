from typing import List
from PIL import Image
import requests
import json

import logging
logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")


def owlvit(kws: List[str], image_path: str) -> str:
    url = "http://localhost:4390/detect_objects/"
    data = {
        "texts": json.dumps(kws),  # Convert list to JSON string
        "threshold": "0.2"  # Optional, adjust as needed
    }

    files = {
        "file": ("image.jpg", open(image_path, "rb"), "image/jpeg")
    }

    response = requests.post(url, data=data, files=files)

    if response.status_code == 200:
        results = response.json()
        return results
    else:
        logging.error(f"Failed to process image: {response.text}")

if __name__ == "__main__":
    logging.info("Running owlvit API")

    kws = ["boat"]
    image_path = "boat.png"
    results = owlvit(kws, image_path)
    logging.info(results)

    logging.info("Finished running owlvit API")