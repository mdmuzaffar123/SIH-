from typing import Literal
from pydantic import BaseModel
class MapResponse(BaseModel): success: bool = True; layer: Literal['satellite','solar','water','nightlights','vegetation','temperature']; tileUrl: str | None = None; center: dict; zoom: int; legend: list[dict]
