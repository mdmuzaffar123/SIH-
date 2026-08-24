from pydantic import BaseModel
class LocationResult(BaseModel): name: str; district: str; state: str; country: str = 'India'; latitude: float; longitude: float; type: str = 'district'
