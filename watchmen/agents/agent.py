from typing import List
from llama_index.core.workflow import (
    Event,
    StartEvent,
    StopEvent,
    Workflow,
    step,
    Context
)
from llama_index.llms.openai import OpenAI
from llama_index.llms.bedrock import Bedrock

from dotenv import load_dotenv
load_dotenv()


from watchmen.tools import owlvit
from .base import ImageAnalysisEvent, MetaFlow

import os
from PIL import Image
from watchmen.logging_config import setup_logger
logger = setup_logger()


class KeywordsEvent(Event):
    query: str
    keywords: str


class Agent(MetaFlow):
    llm = OpenAI(model="gpt-4o")
    # llm = Bedrock(
    #     model = "anthropic.claude-3-5-sonnet-20241022-v2:0",
    #     aws_access_key_id=os.getenv("AWS_ACCESS_KEY_ID"),
    #     aws_secret_access_key=os.getenv("AWS_SECRET_ACCESS_KEY"),
    #     aws_session_token=os.getenv("AWS_SESSION_TOKEN"),
    #     region_name=os.getenv("AWS_DEFAULT_REGION"),
    # )

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
    async def process_image(self, ctx: Context, ev: KeywordsEvent) -> ImageAnalysisEvent:
        kws = eval(ev.keywords)
        owlans = owlvit([kws], ["boat.png"])
        imgevent = ImageAnalysisEvent(query=ev.query, analysis=str(owlans))
        ctx.write_event_to_stream(imgevent)
        return imgevent

    @step
    async def finish_summary(self, ev: ImageAnalysisEvent) -> StopEvent:
        analysis = eval(ev.analysis)['results']

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
    result = await agent.irun(query="how many streams of steam are in this picture?")
    return result

if __name__ == "__main__":
    import asyncio
    out = asyncio.run(main())
    print(out['response'])
    print(out['results']['results'])
