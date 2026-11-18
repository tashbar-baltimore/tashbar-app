#!/usr/bin/env python3
"""Puts web/dist on Firebase Hosting through Google's Hosting API.
Usage: python3 web/deploy.py <project-id> <access-token-file> [release note]
The token is read from a file and never printed."""
import sys, os, json, gzip, hashlib, urllib.request
proj, tokfile = sys.argv[1], sys.argv[2]; note = sys.argv[3] if len(sys.argv) > 3 else 'trial'
TOK = open(tokfile).read().strip(); ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'dist')
API = 'https://firebasehosting.googleapis.com/v1beta1'
def call(method, url, body=None, raw=None, ctype='application/json'):
    data = raw if raw is not None else (json.dumps(body).encode() if body is not None else None)
    req = urllib.request.Request(url, data=data, method=method, headers={'Authorization': 'Bearer ' + TOK, 'x-goog-user-project': proj, 'Content-Type': ctype})
    with urllib.request.urlopen(req, timeout=300) as r:
        t = r.read(); return json.loads(t) if t and raw is None else {}
cfg = {'headers': [
  {'glob': '/parts/*.js', 'headers': {'Cache-Control': 'public, max-age=31536000, immutable'}},
  {'glob': '/parts/manifest.json', 'headers': {'Cache-Control': 'no-cache'}},
  {'glob': '/index.html', 'headers': {'Cache-Control': 'no-cache'}},
  {'glob': '/boot.js', 'headers': {'Cache-Control': 'no-cache'}},
  {'glob': '/tools.json', 'headers': {'Cache-Control': 'no-cache'}},
  {'glob': '/sw.js', 'headers': {'Cache-Control': 'no-cache'}},
  {'glob': '/page-hash.json', 'headers': {'Cache-Control': 'no-cache'}},
  {'glob': '/staff/**', 'headers': {'Cache-Control': 'no-cache'}},
  {'glob': '/curriculum/**', 'headers': {'Cache-Control': 'public, max-age=300', 'Access-Control-Allow-Origin': '*'}}]}
ver = call('POST', f'{API}/sites/{proj}/versions', {'config': cfg})['name']
files, blobs = {}, {}
for d, _, fs in os.walk(ROOT):
    for f in fs:
        p = os.path.join(d, f); gz = gzip.compress(open(p, 'rb').read(), 9, mtime=0); h = hashlib.sha256(gz).hexdigest()
        files['/' + os.path.relpath(p, ROOT).replace(os.sep, '/')] = h; blobs[h] = gz
res = call('POST', f'{API}/{ver}:populateFiles', {'files': files})
need = res.get('uploadRequiredHashes', []); up = res.get('uploadUrl')
from concurrent.futures import ThreadPoolExecutor
def put(h):
    for k in range(4):
        try: return call('POST', f'{up}/{h}', raw=blobs[h], ctype='application/octet-stream')
        except Exception:
            if k == 3: raise
with ThreadPoolExecutor(24) as ex: list(ex.map(put, need))
call('PATCH', f'{API}/{ver}?update_mask=status', {'status': 'FINALIZED'})
call('POST', f'{API}/sites/{proj}/releases?versionName={ver}', {'message': note})
print(f'deployed {len(files)} files ({len(need)} uploaded, {sum(len(b) for b in blobs.values())/1048576:.1f} MB compressed) to https://{proj}.web.app')
