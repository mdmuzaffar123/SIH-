import logging
from fastapi import FastAPI,Request
from fastapi.middleware.cors import CORSMiddleware
from app.api.router import api_router
from app.core.config import get_settings
logging.basicConfig(level=logging.INFO,format='%(asctime)s %(levelname)s %(message)s')
s=get_settings(); app=FastAPI(title='UrjaDhara GEE API',version='1.0.0',description='Server-side satellite intelligence for rural infrastructure planning.')
app.add_middleware(CORSMiddleware,allow_origins=[s.frontend_url],allow_credentials=True,allow_methods=['GET','POST'],allow_headers=['*']); app.include_router(api_router)
@app.middleware('http')
async def request_log(request: Request,call_next):
    response=await call_next(request); logging.getLogger(__name__).info('%s %s -> %s',request.method,request.url.path,response.status_code); return response
@app.get('/',include_in_schema=False)
def root(): return {'service':'UrjaDhara GEE API','docs':'/docs'}
