
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import asyncio
from typing import Dict
from watchmen.agents.agent import Agent
from watchmen.logging_config import setup_logger

app = FastAPI()

class Query(BaseModel):
    query: str

@app.post("/analyze_image")
async def analyze_image(query: Query) -> Dict[str, str]:
    logger = setup_logger()
    try:
        w = Agent(timeout=60, verbose=False)
        result = await w.irun(query=query.query)
        return {"result": str(result)}
    except Exception as e:
        logger.error(f"Error processing request: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=9178)