#!/usr/bin/env python3
"""PICS-2: take something OUT of a lane folder (lib.json, map.json, pics/, sources.md) before it is merged.
  python3 -I tools/pics-lane-rm.py <lane> pic <pic-id> [...]     remove a picture: its lib entry, file, source line and EVERY link to it
  python3 -I tools/pics-lane-rm.py <lane> link "ID|question" [...] remove single links (the picture stays if other links use it)
  python3 -I tools/pics-lane-rm.py <lane> unused                  remove pictures no link uses any more (file, lib entry, source line)
Prints what it removed. Never touches src/ or web/ (for live pictures, write an un-link in the pull request instead)."""
import json, os, sys
def load(p, d):
  return json.load(open(p, encoding='utf8')) if os.path.exists(p) else d
def main():
  if len(sys.argv) < 3: print(__doc__); sys.exit(1)
  lane, cmd, items = sys.argv[1], sys.argv[2], sys.argv[3:]
  lp, mp, sp = (os.path.join(lane, f) for f in ('lib.json', 'map.json', 'sources.md'))
  lib, mp_ = load(lp, {}), load(mp, {})
  drop_pics, drop_links = set(), set()
  if cmd == 'pic':
    for pid in items:
      if pid not in lib: print('not in this lane:', pid); continue
      drop_pics.add(pid); drop_links |= {k for k, v in mp_.items() if v.get('id') == pid}
  elif cmd == 'link':
    for k in items:
      if k in mp_: drop_links.add(k)
      else: print('no such link:', k)
  elif cmd != 'unused': print(__doc__); sys.exit(1)
  for k in drop_links: mp_.pop(k, None); print('link removed:', k)
  if cmd in ('link', 'unused'):
    used = {v.get('id') for v in mp_.values()}
    if cmd == 'unused': drop_pics |= {p for p in lib if p not in used}
  files = set()
  for pid in drop_pics:
    f = lib.pop(pid, {}).get('file')
    if f:
      files.add(f); fp = os.path.join(lane, 'pics', f)
      if os.path.exists(fp) and f not in {v.get('file') for v in lib.values()}: os.remove(fp)
    print('picture removed:', pid)
  if os.path.exists(sp) and files:
    keep = [l for l in open(sp, encoding='utf8').read().split('\n') if l.strip() and l[2:].split(' | ')[0] not in files]
    open(sp, 'w', encoding='utf8').write(''.join(l + '\n' for l in keep))
  json.dump(lib, open(lp, 'w', encoding='utf8'), ensure_ascii=False, indent=1)
  json.dump(mp_, open(mp, 'w', encoding='utf8'), ensure_ascii=False, indent=1)
  print(len(lib), 'pictures,', len(mp_), 'links left in', lane)
main()
