from typing import List
from llama_index.core.workflow import (
    Event,
    StartEvent,
    StopEvent,
    step,
    Context
)
# from llama_index.llms.openai import OpenAI
from llama_index.llms.bedrock import Bedrock

from dotenv import load_dotenv
load_dotenv()

from watchmen.tools import owlvit

import os
from PIL import Image
from watchmen.logging_config import setup_logger
from base import ImageAnalysisEvent, MetaFlow
from datetime import datetime, timedelta, time
import json
from prompts import code_write_prompt

logger = setup_logger()

class QueryImagesEvent(Event):
    query: str
    images: List[str]

class KeywordsEvent(Event):
    query: str
    keywords: str


class Agent(MetaFlow):
    # llm = OpenAI(model="gpt-4o")
    llm = Bedrock(
        model = "anthropic.claude-3-5-sonnet-20241022-v2:0",
        aws_access_key_id=os.getenv("AWS_ACCESS_KEY_ID"),
        aws_secret_access_key=os.getenv("AWS_SECRET_ACCESS_KEY"),
        aws_session_token=os.getenv("AWS_SESSION_TOKEN"),
        region_name=os.getenv("AWS_DEFAULT_REGION"),
        max_tokens=1000,
    )

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
        code = response.text.split('<code>')[1].split('</code>')[0]
        if "python" in code:
            code = code.split("python")[1].split("```")[0]
        exec(code, locals())

        return QueryImagesEvent(
            query=query,
            images=namespace["images"]
        )

    @step
    async def kw_extract(self, ev: StartEvent) -> KeywordsEvent:
        logger.info("Extracting keywords")
        query = ev.query

        prompt = (f"Extract keywords for the objects the user wants to know about."
        "Respond with a list of keywords that describe the objects the user wants to know about. "
        "Format: [\"keyword1\", \"keyword2\", ...]."
        f"\n\nUser query: {query}.")
        response = self.llm.complete(prompt)
        print(response)
        return KeywordsEvent(
            query=query,
            keywords=str(response),
        )

    @step
    async def process_image(self, ctx: Context, ev: QueryImagesEvent) -> ImageAnalysisEvent:
        kws = eval(kev.keywords)
        owlans = owlvit([kws], ev.images)
        imgevent = ImageAnalysisEvent(query=ev.query, analysis=str(owlans))
        ctx.write_event_to_stream(imgevent)
        return imgevent

    @step
    async def finish_summary(self, ev: ImageAnalysisEvent) -> StopEvent:
        analysis = eval(kev.analysis)['results']

        # Don't give confidence scores to llm
        for a in analysis:
            a.pop('confidence', None)

        prompt = (f"A user is requesting information about a boat. Here's the user query: {ev.query}."
        f"An image analysis software has analyzed the image and concluded the following: {analysis}."
        "Answer the user's question based on the information provided.")

        response = self.llm.complete(prompt)
        return StopEvent(result=str(response))
            
async def main():
    agent = Agent(timeout=60, verbose=False)
    result = await agent.irun(query="How many boats were there at 12?")
    return result

if __name__ == "__main__":
    import asyncio
    out = asyncio.run(main())
    print(out['response'])
    print(out['results']['results'])
