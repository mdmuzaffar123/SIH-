from pydantic import BaseModel
class Recommendation(BaseModel): type: str; title: str; reason: str; priority: str
