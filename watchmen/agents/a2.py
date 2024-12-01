from typing import List
from llama_index.core.workflow import (
    Event,
    StartEvent,
    StopEvent,
    step,
    Context
)
from llama_index.llms.openai import OpenAI
from llama_index.llms.bedrock import Bedrock

from dotenv import load_dotenv
load_dotenv()

from watchmen.tools import owlvit

import os
from PIL import Image
from watchmen.logging_config import setup_logger
from .base import ImageAnalysisEvent, MetaFlow
from datetime import datetime, timedelta, time
import json
from .prompts import code_write_prompt
from llama_index.llms.anthropic import Anthropic

logger = setup_logger()

class QueryImagesEvent(Event):
    query: str
    images: List[str]

class KeywordsEvent(Event):
    query: str
    keywords: str


class TimeAgent(MetaFlow):
    llm = Anthropic(model="claude-3-5-sonnet-20241022")

    # Now we want to make an agent that can query images based on time constraints.
    # e.g. "How many boats were there in the image at 12:00 PM?"
    @step
    async def query_imgs(self, ev: StartEvent) -> QueryImagesEvent:
        """Decide what images to query."""
        logger.info("Querying images")
        query = ev.query
        
        """
        Basically we have the following options:
            - user asks for a specific time
            - user asks for now
            - user asks for a time range
        """

        response = self.llm.complete(code_write_prompt.format(base_path="watchmen/data/frames_platjeoost/segment_", query=query))

        with open("watchmen/data/frames_platjeoost/datedict.json", 'rb') as f:
            datedict = json.load(f)

        namespace = {}
        code = response.text
        if "<code>" in response.text and "</code>" in response.text:
            code = code.split('<code>')[1].split('</code>')[0]
        if "python" in code:
            code = code.split("python")[1].split("```")[0]

        logger.warning(f"Executing the following code: {code}")

        
        exec(code, locals())

        return QueryImagesEvent(
            query=query,
            images=namespace["images"]
        )

    @step
    async def finish_summary(self, ev: QueryImagesEvent) -> StopEvent:
        images = ev.images
        logger.warning(f"Loading the following images for query:\n{ev.query}.\nImages: {images}")
        return StopEvent(result=str(images))
            
async def main():
    agent = TimeAgent(timeout=60, verbose=False)
    result = await agent.irun(query="How many boats were there at 12?")
    return result

if __name__ == "__main__":
    import asyncio
    out = asyncio.run(main())
    print(out['response'])