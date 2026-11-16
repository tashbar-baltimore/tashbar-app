# Gets a short-lived Google token from the clasp sign-in. Writes it to the file named on the command line; never prints it.
import json,urllib.request,urllib.parse,os,sys
d=json.load(open(os.path.expanduser('~/.clasprc.json')))
def find(o,k):
    if isinstance(o,dict):
        if k in o and isinstance(o[k],str): return o[k]
        for v in o.values():
            r=find(v,k)
            if r: return r
rt=find(d,'refresh_token'); cid=find(d,'client_id') or find(d,'clientId'); cs=find(d,'client_secret') or find(d,'clientSecret')
body=urllib.parse.urlencode({'grant_type':'refresh_token','refresh_token':rt,'client_id':cid,'client_secret':cs}).encode()
r=json.load(urllib.request.urlopen(urllib.request.Request('https://oauth2.googleapis.com/token',data=body)))
open(sys.argv[1],'w').write(r['access_token']); os.chmod(sys.argv[1],0o600); print('token ok, scopes include cloud-platform:', 'cloud-platform' in r.get('scope',''))
