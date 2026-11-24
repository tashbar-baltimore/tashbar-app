#!/usr/bin/env python3
"""Puts the 2.0 site (v2/dist) on its OWN Firebase Hosting site, separate from 1.0. Run only by .github/workflows/publish-v2.yml.
Lives outside v2/ so every look link uses this one copy (a look link replaces v2/ with the pull request's own files).
Usage: python3 .github/scripts/publish-v2.py <project-id> <site-id> <access-token-file> <channel-or-live> [note]
  live         -> https://<site-id>.web.app (only after the v2-gate saw an approver's yes)
  pr-<number>  -> a private look link for that pull request (2.0 itself unchanged)
Creates the 2.0 site the first time if it does not exist. If Google refuses, it says what the HoS should click (it never changes permissions)."""
import sys, os, json, gzip, hashlib, urllib.request, urllib.error
proj, site, tokfile, where = sys.argv[1], sys.argv[2], sys.argv[3], sys.argv[4]; note = sys.argv[5] if len(sys.argv) > 5 else '2.0 publish'
TOK = open(tokfile).read().strip(); ROOT = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))), 'v2', 'dist')
API = os.environ.get('V2_HOSTING_API', 'https://firebasehosting.googleapis.com/v1beta1')   # changed only by the self-test
def call(method, url, body=None, raw=None, ctype='application/json'):
    data = raw if raw is not None else (json.dumps(body).encode() if body is not None else None)
    req = urllib.request.Request(url, data=data, method=method, headers={'Authorization': 'Bearer ' + TOK, 'x-goog-user-project': proj, 'Content-Type': ctype})
    with urllib.request.urlopen(req, timeout=300) as r:
        t = r.read(); return json.loads(t) if t and raw is None else {}
# Does the 2.0 site exist? (A site is found under its project; asking for sites/<id> alone always says 404.)
try:
    call('GET', f'{API}/projects/{proj}/sites/{site}')
except urllib.error.HTTPError as e:
    if e.code != 404: raise
    try:
        call('POST', f'{API}/projects/{proj}/sites?siteId={site}', {})
        print(f'Made the new 2.0 website: https://{site}.web.app')
    except urllib.error.HTTPError as e2:
        if e2.code == 409: print(f'The 2.0 website {site} is already there.')   # 409 = it already exists: carry on
        else:
          print(f'Google did not let the publisher make the 2.0 website ({e2.code}). HoS: open console.firebase.google.com -> project {proj} -> Hosting -> '
                f'"Add another site" -> type {site} -> Add. Then run publish-v2 again. (Nothing was changed.)'); sys.exit(1)
files, blobs = {}, {}
for d, _, fs in os.walk(ROOT):
    for f in fs:
        p = os.path.join(d, f); gz = gzip.compress(open(p, 'rb').read(), 9, mtime=0); h = hashlib.sha256(gz).hexdigest()
        files['/' + os.path.relpath(p, ROOT).replace(os.sep, '/')] = h; blobs[h] = gz
cfg = {'headers': [{'glob': '**/*.@(html|json|js)', 'headers': {'Cache-Control': 'no-cache'}}]}
ver = call('POST', f'{API}/sites/{site}/versions', {'config': cfg})['name']
res = call('POST', f'{API}/{ver}:populateFiles', {'files': files})
for h in res.get('uploadRequiredHashes', []): call('POST', f"{res['uploadUrl']}/{h}", raw=blobs[h], ctype='application/octet-stream')
call('PATCH', f'{API}/{ver}?update_mask=status', {'status': 'FINALIZED'})
if where == 'live':
    call('POST', f'{API}/sites/{site}/releases?versionName={ver}', {'message': note})
    print(f'2.0 LIVE: {len(files)} files on https://{site}.web.app')
else:
    try: call('POST', f'{API}/sites/{site}/channels?channelId={where}', {'ttl': '1209600s'})
    except urllib.error.HTTPError: pass   # the look link already exists
    call('POST', f'{API}/sites/{site}/channels/{where}/releases?versionName={ver}', {'message': note})
    url = call('GET', f'{API}/sites/{site}/channels/{where}').get('url', '')
    print(f'LOOK LINK (2.0 itself not changed): {url}')
    with open(os.environ.get('V2_LINK_FILE', '/tmp/v2link.txt'), 'w') as fh: fh.write(url)
