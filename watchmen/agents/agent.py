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
from base import ImageAnalysisEvent, MetaFlow

import os
from PIL import Image
from watchmen.logging_config import setup_logger
logger = setup_logger()


class KeywordsEvent(Event):
    query: str
    keywords: str


class SingleQueryAgent(MetaFlow):
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
        owlans = owlvit([kws], "boat.png")
        imgevent = ImageAnalysisEvent(query=ev.query, analysis=str(owlans))
        ctx.write_event_to_stream(imgevent)
        return imgevent

    @step
    async def finish_summary(self, ev: ImageAnalysisEvent) -> StopEvent:
        analysis = eval(ev.analysis)['results']

        for a in analysis:
            a.pop('confidence', None)

        prompt = (f"A user is requesting information. Here's the user query: {ev.query}."
        f"An image analysis software has analyzed the image and concluded the following: {analysis}."
        "Answer the user's question based on the information provided.")

        response = self.llm.complete(prompt)
        return StopEvent(result=str(response))


from llama_index.agent.openai import OpenAIAgent
from llama_index.core.tools import FunctionTool

sqa = SingleQueryAgent(timeout=60, verbose=False)

async def find_bounding_boxes(query):
    """Identify relevant objects in the image. This tool is always used before the image analysis tool."""
    response = await sqa.irun(query=query)
    response['results'].pop('image', None)
    return str(response)

tools = [
    FunctionTool.from_defaults(
        async_fn=find_bounding_boxes,
    ),
]


# Make an image analysis agent, and add it as a tool.
from pydantic import BaseModel
from typing import Optional
from llama_index.multi_modal_llms.openai import OpenAIMultiModal



import io
import base64
import numpy as np
from typing import List
from PIL import Image, ImageDraw

def _draw_box(image, box):
       # Create a copy of the image to avoid modifying the original
    image_copy = image.copy()
    
    # Create a drawing object
    draw = ImageDraw.Draw(image_copy)
    
    # Round the box coordinates
    box = [round(i, 2) for i in box]
    
    # Draw the rectangle
    draw.rectangle(box, outline='red', width=2)
    
    # Save the image to a bytes buffer
    buffered = io.BytesIO()
    image_copy.save(buffered, format="PNG")
    
    # Encode the image to base64
    img_str = base64.b64encode(buffered.getvalue())
    base64_string = img_str.decode('utf-8')
    
    return base64_string


vlm = OpenAIMultiModal(model="gpt-4o")
def analyze_specific_bounding_box(query: str, currim: str):
    import anthropic

    load_dotenv()
    client = anthropic.Anthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))
    message = client.messages.create(
        model="claude-3-5-sonnet-20241022",
        max_tokens=1024,
        messages=[
            {
                "role": "user",
                "content": [
                    {
                        "type": "image",
                        "source": {
                            "type": "base64",
                            "media_type": "image/png",
                            "data": currim,
                        },
                    },
                    {
                        "type": "text",
                        "text": query,
                    }
                ],
            }
        ],
    )
    return message.content[0].text


class iAgent(OpenAIAgent):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

    def ichat(self, query: str, metadata: dict):
        # Take the relevant metadata and pass it to the agent
        # Update current image in tool
        logger.info("Updating current image in tool")
        baseim = Image.open('boat.png').convert('RGB')
        imanal = None
        if 'box' in metadata:
            if metadata['box'] is not None:
                currim = _draw_box(image=baseim, box=metadata['box'])
                logger.info("Getting image analysis")
                imanal = analyze_specific_bounding_box(query, currim)

        iquery = (
            f"User query: {query}.\n"
            f"Relevant information from the object selected by the user: {metadata}.\n"
        )

        if imanal:
            iquery += f"Image analysis: {imanal}."

        return self.chat(iquery), intermed_outs


if __name__ == "__main__":
    agent = iAgent.from_tools(tools, verbose=True, max_function_calls=1)

    inp = input("User: ")
    while inp != "exit":
        response = agent.ichat(inp, metadata={"box": [10, 100, 200, 300]})
        print(f"Bot: {str(response)}")
        inp = input("User: ")