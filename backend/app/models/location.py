from dataclasses import dataclass
@dataclass(frozen=True)
class LocationModel: name: str; district: str; state: str; latitude: float; longitude: float
