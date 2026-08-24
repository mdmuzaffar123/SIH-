SUPPORTED_LAYERS={'satellite','solar','water','nightlights','vegetation','temperature'}
def layer_config(location,layer): return {'success':True,'layer':layer,'tileUrl':None,'center':{'latitude':location['latitude'],'longitude':location['longitude']},'zoom':9,'legend':[{'label':'Low','value':'0-2'},{'label':'Medium','value':'2-5'},{'label':'High','value':'5+'}]}
