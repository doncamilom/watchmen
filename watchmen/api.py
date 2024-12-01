
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import asyncio
from typing import Dict
# from watchmen.agents.agent import Agent
from watchmen.logging_config import setup_logger
from llama_index.agent.openai import OpenAIAgent
from llama_index.core.tools import FunctionTool
from watchmen.agents.agent import iAgent, SingleQueryAgent
from typing import Any


import nest_asyncio
nest_asyncio.apply()

sqa = SingleQueryAgent(timeout=60, verbose=False)

async def find_bounding_boxes(query):
    """Identify relevant objects in the image. This tool is always used before the image analysis tool."""
    response = await sqa.irun(query=query)
    return response['response']

tools = [
    FunctionTool.from_defaults(
        async_fn=find_bounding_boxes,
    ),
]

agent = iAgent.from_tools(tools, verbose=True)


app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

class RequireData(BaseModel):
    query: str
    data: Dict[str, Any]

class AnalysisRequest(BaseModel):
    require: RequireData

@app.post("/analyze_image")
async def analyze_image(data: AnalysisRequest) -> Dict[str, str]:
    logger = setup_logger()
    try:
        # Extract the query and request data
        logger.info(f"Received request: {data}")
        query = data.require.query
        request_data = data.require.data

        result = agent.ichat(query = query, metadata=request_data)

        return {"result": str(result)}
    except Exception as e:
        logger.error(f"Error processing request: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=9178)