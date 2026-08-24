from app.utils.validation import normalize_query
LOCATIONS=[{'name':'Raipur','district':'Raipur','state':'Chhattisgarh','latitude':21.2514,'longitude':81.6296},{'name':'Bilaspur','district':'Bilaspur','state':'Chhattisgarh','latitude':22.0797,'longitude':82.1409},{'name':'Durg','district':'Durg','state':'Chhattisgarh','latitude':21.1904,'longitude':81.2849},{'name':'Bastar','district':'Bastar','state':'Chhattisgarh','latitude':19.1071,'longitude':81.9535},{'name':'Korba','district':'Korba','state':'Chhattisgarh','latitude':22.3595,'longitude':82.7501},{'name':'Surguja','district':'Surguja','state':'Chhattisgarh','latitude':23.1163,'longitude':83.1951},{'name':'Dantewada','district':'Dantewada','state':'Chhattisgarh','latitude':18.8998,'longitude':81.3453}]
def search_locations(query):
    q=normalize_query(query); return [x for x in LOCATIONS if q in normalize_query(x['name']) or q in normalize_query(x['state'])]
def resolve_location(name,state=None):
    return next((x for x in search_locations(name) if not state or normalize_query(x['state'])==normalize_query(state)),None)
