from pydantic import BaseModel, Field
class CompareRequest(BaseModel): locations: list[dict] = Field(min_length=1, max_length=5)
class AnalysisResponse(BaseModel): success: bool = True; data: dict
