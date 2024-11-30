from llama_index.core.workflow import (
    Event,
    StartEvent,
    StopEvent,
    Workflow,
    step,
)
from llama_index.llms.openai import OpenAI
from dotenv import load_dotenv
load_dotenv()

from typing import List

from watchmen.tools import owlvit

from PIL import Image
from watchmen.logging_config import setup_logger
logger = setup_logger()


class KeywordsEvent(Event):
    query: str
    keywords: str

class ImageAnalysisEvent(Event):
    analysis: str


class Agent(Workflow):
    llm = OpenAI(model="gpt-4o")

    @step
    async def kw_extract(self, ev: StartEvent) -> KeywordsEvent:
        logger.info("Extracting keywords")
        query = ev.query

        prompt = (f"Extract keywords for the objects the user wants to know about."
        "Respond with a list of keywords that describe the objects the user wants to know about. "
        "Format: [\"keyword1\", \"keyword2\", ...]."
        f"\n\nUser query: {query}.")
        response = await self.llm.acomplete(prompt)
        return KeywordsEvent(
            query=query,
            keywords=str(response),
        )

    @step
    async def process_image(self, ev: KeywordsEvent) -> ImageAnalysisEvent:
        logger.warning("Printing keywords")
        print(ev)

        kws = [eval(ev.keywords)]
        owlans = owlvit(kws, "boat.png")
        return ImageAnalysisEvent(query=ev.query, analysis=str(owlans))

    @step
    async def finish_summary(self, ev: ImageAnalysisEvent) -> StopEvent:
        prompt = (f"A user is requesting information about a boat. Here's the user query: {ev.query}."
        f"An image analysis software has analyzed the image and concluded the following: {ev.analysis}."
        "Answer the user's question based on the information provided.")

        response = await self.llm.acomplete(prompt)
        return StopEvent(result=str(response))


async def main():
    w = Agent(timeout=60, verbose=False)
    result = await w.run(query="how many clouds are in this picture?")
    print(str(result))

if __name__ == "__main__":
    import asyncio
    asyncio.run(main())
