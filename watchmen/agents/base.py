
from llama_index.core.workflow import Workflow, Event


class ImageAnalysisEvent(Event):
    analysis: str

class MetaFlow(Workflow):
    async def irun(self, query: str):
        intermeds = {}

        handler = self.run(query=query)
        async for event in handler.stream_events():
            if isinstance(event, ImageAnalysisEvent):
                intermeds['image_analysis'] = event.analysis
        result = await handler

        return {
            "results": eval(intermeds['image_analysis']) if 'image_analysis' in intermeds else {},
            "response": result
        }
