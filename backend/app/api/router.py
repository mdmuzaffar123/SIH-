from fastapi import APIRouter,HTTPException,Query
from app.core.config import get_settings
from app.core.gee import initialize_gee
from app.services.location_service import search_locations,resolve_location
from app.services.gee_service import analyze_location
from app.services.map_service import SUPPORTED_LAYERS,layer_config
from app.services.recommendation_service import build_recommendations
api_router=APIRouter()
def not_found(): raise HTTPException(404,detail={'success':False,'error':{'code':'LOCATION_NOT_FOUND','message':'The requested location could not be found.'}})
@api_router.get('/api/health')
def health(): return {'success':True,'service':'UrjaDhara GEE API','status':'healthy'}
@api_router.get('/api/health/gee')
def gee_health():
    s=get_settings()
    try: initialize_gee(); return {'success':True,'gee':'mock' if s.use_mock_data else 'connected','project':s.gee_project_id or 'not configured'}
    except RuntimeError: return {'success':False,'gee':'disconnected','project':s.gee_project_id or 'not configured'}
@api_router.get('/api/location/search')
def location_search(q: str=Query(min_length=1,max_length=100)): return {'success':True,'results':search_locations(q)}
@api_router.get('/api/location/boundary')
def boundary(district: str=Query(min_length=1),state: str=Query(min_length=1)):
    x=resolve_location(district,state)
    if not x: not_found()
    lat,lon=x['latitude'],x['longitude']; coords=[[[lon-.4,lat-.3],[lon+.4,lat-.3],[lon+.4,lat+.3],[lon-.4,lat+.3],[lon-.4,lat-.3]]]
    return {'success':True,'type':'FeatureCollection','features':[{'type':'Feature','properties':x,'geometry':{'type':'Polygon','coordinates':coords}}]}
@api_router.get('/api/gee/analysis')
def gee_analysis(location: str=Query(min_length=1,max_length=100),state: str|None=None):
    try: return {'success':True,'data':analyze_location(location,state)}
    except LookupError: not_found()
@api_router.get('/api/gee/map')
def gee_map(location: str=Query(min_length=1),layer: str=Query(pattern='^(satellite|solar|water|nightlights|vegetation|temperature)$')):
    x=resolve_location(location)
    if not x: not_found()
    return layer_config(x,layer)
@api_router.get('/api/recommendations')
def recommendations(location: str=Query(min_length=1)): return {'success':True,'recommendations':build_recommendations(analyze_location(location))}
@api_router.post('/api/gee/compare')
def compare(body: dict):
    locations=body.get('locations',[])
    if not 1<=len(locations)<=5: raise HTTPException(422,detail={'success':False,'error':{'code':'INVALID_REQUEST','message':'Provide between one and five locations.'}})
    return {'success':True,'comparison':[analyze_location(x.get('district',''),x.get('state')) for x in locations]}
@api_router.get('/api/reports/summary')
def report(location: str=Query(min_length=1)):
    data=analyze_location(location); return {'success':True,'report':{'location':data['location'],'indicators':data,'priority':data['overallPriority'],'reasons':data['priorityReasons'],'recommendations':build_recommendations(data),'dataSources':data['dataSources'],'generatedAt':data['generatedAt']}}
