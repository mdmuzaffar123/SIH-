from datetime import datetime,timezone
from functools import lru_cache
from app.core.config import get_settings
from app.core.gee import initialize_gee
from app.services.location_service import resolve_location
from app.services import nightlight_service,vegetation_service,solar_service,water_service,temperature_service
from app.utils.geometry import point_geometry
@lru_cache(maxsize=128)
def analyze_location(name,state=None):
    loc=resolve_location(name,state)
    if not loc: raise LookupError('The requested location could not be found.')
    s=get_settings(); ee_module=initialize_gee(); geometry=point_geometry(loc['latitude'],loc['longitude']); start,end=s.gee_nightlight_start_date,s.gee_nightlight_end_date
    night,ns=nightlight_service.analyze(geometry,ee_module); veg,vs=vegetation_service.analyze(geometry,start,end,ee_module); sol,ss=solar_service.analyze(geometry,start,end,ee_module); wat,ws=water_service.analyze(geometry,start,end,ee_module); temp,ts=temperature_service.analyze(geometry,start,end,ee_module)
    return {'location':loc,'solar':sol,'water':wat,'nightLights':night,'vegetation':veg,'temperature':temp,'overallPriority':'Not available','priorityScore':None,'priorityReasons':[],'dataSources':ns+vs+ss+ws+ts,'generatedAt':datetime.now(timezone.utc).isoformat()}
