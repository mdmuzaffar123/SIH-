import os
os.environ['USE_MOCK_DATA']='true'
from fastapi.testclient import TestClient
from app.main import app
client=TestClient(app)
def test_health(): assert client.get('/api/health').status_code==200
def test_search(): assert client.get('/api/location/search?q=Raipur').json()['results'][0]['district']=='Raipur'
def test_analysis(): assert 'nightLights' in client.get('/api/gee/analysis?location=Dantewada').json()['data']
def test_invalid_location(): assert client.get('/api/gee/analysis?location=Unknown').status_code==404
def test_invalid_layer(): assert client.get('/api/gee/map?location=Raipur&layer=bad').status_code==422
def test_compare(): assert client.post('/api/gee/compare',json={'locations':[{'district':'Raipur','state':'Chhattisgarh'}]}).status_code==200
