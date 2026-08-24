def build_recommendations(data):
    result=[]; solar=data['solar']; water=data['water']; night=data['nightLights']
    if solar.get('potential') is not None and night.get('averageRadiance') is not None: result.append({'type':'solar','title':'Prioritize decentralized solar','reason':'Strong solar potential and the night-light energy-access proxy are available.','priority':'High'})
    if water.get('stressIndex') is not None: result.append({'type':'water','title':'Assess solar-powered water systems','reason':'The configured water indicator requires assessment.','priority':'High' if water['stressIndex']>=.6 else 'Medium'})
    return result or [{'type':'assessment','title':'Complete validated dataset assessment','reason':'Solar and water datasets are not configured for live recommendations.','priority':'Review'}]
