#!/usr/bin/env python3
"""ADD-ONLY site update (firebase builder, 2026-11-18). Like deploy.py, but KEEPS every file that is live now (other builders'
/curriculum/ lesson plans, /pics/ pictures, ...) and only adds or replaces the files in web/dist. Keeps the live headers config.
Usage: python3 web/deploy_add.py <project-id> <access-token-file> [release note]   (the token is read from a file and never printed)"""
import sys, os, json, gzip, hashlib, urllib.request
proj, tokfile = sys.argv[1], sys.argv[2]; note = sys.argv[3] if len(sys.argv) > 3 else 'add-only update'
TOK = open(tokfile).read().strip(); ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'dist')
API = 'https://firebasehosting.googleapis.com/v1beta1'
def call(method, url, body=None, raw=None, ctype='application/json'):
    data = raw if raw is not None else (json.dumps(body).encode() if body is not None else None)
    req = urllib.request.Request(url, data=data, method=method, headers={'Authorization': 'Bearer ' + TOK, 'x-goog-user-project': proj, 'Content-Type': ctype})
    with urllib.request.urlopen(req, timeout=300) as r:
        t = r.read(); return json.loads(t) if t and raw is None else {}
rel = call('GET', f'{API}/sites/{proj}/releases?pageSize=1')['releases'][0]; live = rel['version']
files, tok = {}, ''
while True:
    page = call('GET', f"{API}/{live['name']}/files?pageSize=1000&status=ACTIVE" + (f'&pageToken={tok}' if tok else ''))
    for f in page.get('files', []): files[f['path']] = f['hash']
    tok = page.get('nextPageToken', '')
    if not tok: break
kept = len(files); blobs = {}; changed = 0
for d, _, fs in os.walk(ROOT):
    for f in fs:
        p = os.path.join(d, f); gz = gzip.compress(open(p, 'rb').read(), 9, mtime=0); h = hashlib.sha256(gz).hexdigest()
        path = '/' + os.path.relpath(p, ROOT).replace(os.sep, '/')
        if files.get(path) != h: changed += 1
        files[path] = h; blobs[h] = gz
ver = call('POST', f'{API}/sites/{proj}/versions', {'config': live.get('config', {})})['name']
res = call('POST', f'{API}/{ver}:populateFiles', {'files': files})
need = res.get('uploadRequiredHashes', []); up = res.get('uploadUrl')
for h in need: call('POST', f'{up}/{h}', raw=blobs[h], ctype='application/octet-stream')
call('PATCH', f'{API}/{ver}?update_mask=status', {'status': 'FINALIZED'})
call('POST', f'{API}/sites/{proj}/releases?versionName={ver}', {'message': note})
print(f'kept {kept} live files, added or changed {changed}, uploaded {len(need)}; now {len(files)} files on https://{proj}.web.app')
