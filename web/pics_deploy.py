#!/usr/bin/env python3
"""PICS-1: adds web/pics/* to the LIVE Firebase Hosting site WITHOUT rebuilding it.
It clones the version that is live now (every file and setting stays exactly as it is), adds /pics/<file> for each picture,
and releases that. Use it when only pictures changed; web/refresh.sh (full rebuild) also ships web/pics.
Usage: python3 web/pics_deploy.py <project-id> <access-token-file> [release note]   (the token is read from a file, never printed)"""
import sys, os, json, gzip, hashlib, time, urllib.request
proj, tokfile = sys.argv[1], sys.argv[2]; note = sys.argv[3] if len(sys.argv) > 3 else 'pictures'
TOK = open(tokfile).read().strip(); PICS = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'pics')
API = 'https://firebasehosting.googleapis.com/v1beta1'
def call(method, url, body=None, raw=None, ctype='application/json'):
    data = raw if raw is not None else (json.dumps(body).encode() if body is not None else None)
    req = urllib.request.Request(url, data=data, method=method, headers={'Authorization': 'Bearer ' + TOK, 'x-goog-user-project': proj, 'Content-Type': ctype})
    with urllib.request.urlopen(req, timeout=300) as r:
        t = r.read(); return json.loads(t) if t and raw is None else {}
site = f'sites/{proj}'
live = call('GET', f'{API}/{site}/releases?pageSize=1')['releases'][0]['version']['name']
op = call('POST', f'{API}/{site}/versions:clone', {'sourceVersion': live, 'finalize': False})
for _ in range(120):
    if op.get('done'): break
    time.sleep(2); op = call('GET', f"{API}/{op['name']}")
if 'error' in op or not op.get('done'): sys.exit('clone failed: ' + json.dumps(op.get('error', 'timeout'))[:300])
ver = op['response']['name']
files, blobs = {}, {}
for f in sorted(os.listdir(PICS)):
    if f.startswith('.') or f.endswith('.md'): continue
    gz = gzip.compress(open(os.path.join(PICS, f), 'rb').read(), 9, mtime=0); h = hashlib.sha256(gz).hexdigest()
    files['/pics/' + f] = h; blobs[h] = gz
res = call('POST', f'{API}/{ver}:populateFiles', {'files': files})
need = res.get('uploadRequiredHashes', []); up = res.get('uploadUrl')
for h in need: call('POST', f'{up}/{h}', raw=blobs[h], ctype='application/octet-stream')
fin = call('PATCH', f'{API}/{ver}?update_mask=status', {'status': 'FINALIZED'})
call('POST', f'{API}/{site}/releases?versionName={ver}', {'message': note})
print(f'live site copied from {live.split("/")[-1]} with {fin.get("fileCount", "?")} files; added {len(files)} pictures ({len(need)} uploaded)')
