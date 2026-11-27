import html
letters_names = "א בּ ב ג ד ה ו ז ח ט י כּ כ ך ל מ ם נ ן ס ע פּ פ ף צ ץ ק ר שׁ שׂ תּ ת".split()
base = "א בּ ב ג ד ה ו ז ח ט י כּ כ ל מ נ ס ע פּ פ צ ק ר שׁ שׂ תּ ת".split()
nek = [("Kometz","ָ","aw"),("Pasach","ַ","ah"),("Segol","ֶ","eh"),("Tzeirei","ֵ","A (as in “day”)"),
       ("Chirik","ִ","ee"),("Cholam","ֹ","O"),("Kubutz","ֻ","oo"),("Shuruk","SH","oo")]
def combo(l, m):
    return l + "וּ" if m=="SH" else l + m
secs = []
secs.append(("Letter names", "Say only the letter's name, the way you say it in class.", "בּ → “Beis”", letters_names))
secs.append(("Nekudah names", "Say only the nekudah's name.", "◌ָ → “Kometz”", ["◌"+m if m!="SH" else "וּ" for _,m,_ in nek]))
secs.append(("Nekudah sounds alone", "Say only the sound, nothing else.", "אָ → “aw”", ["א"+m for _,m,_ in nek[:7]]))
lone = [("בּ","b"),("ב","v"),("ג","g"),("ד","d"),("ה","h"),("ו","v"),("ז","z"),("ח","ch"),("ט","t"),("י","y"),("כּ","k"),("כ","ch"),("ל","l"),("מ","m"),("נ","n"),("ס","s"),("פּ","p"),("פ","f"),("צ","tz"),("ק","k"),("ר","r"),("שׁ","sh"),("שׂ","s"),("תּ","t"),("ת","s")]
LONE = ("Each letter's own sound, alone", "Say only the letter's own sound, short, with no vowel after it: “b”, not “buh” or “baw”. (Alef and Ayin are not here: they are quiet.) The small English letters next to each one are only a reminder.", "בּ → “b”", [l+"|"+h for l,h in lone])
for name,m,snd in nek:
    secs.append((f"{name} with every letter", "The Mesorah way: nekudah, letter, sound.",
                 f"{combo('בּ',m)} → “{name}, Beis, b{snd if not snd.startswith('A') else 'A'}”", [combo(l,m) for l in base]))
secs.append(LONE)
import sys
if len(sys.argv)>1: secs=[LONE]
total = sum(len(s[3]) for s in secs)
out = ['<!doctype html><html><head><meta charset="utf-8"><title>Kriyah recording script</title><style>',
'@page{size:letter;margin:14mm}body{font-family:"Liberation Sans",sans-serif;color:#111}',
'h1{font-size:22pt;margin:0 0 4px}h2{font-size:17pt;margin:0 0 4px;page-break-before:always}h2.first{page-break-before:auto}',
'.how{font-size:12.5pt;margin:2px 0}.grid{display:grid;grid-template-columns:repeat(4,1fr);gap:6px;margin-top:10px}',
'.c{border:1.5px solid #888;border-radius:8px;padding:4px 8px;display:flex;justify-content:space-between;align-items:center}',
'.n{font-size:11pt;color:#555}.h{font-family:"FreeSerif","DejaVu Sans";font-size:40pt;direction:rtl;line-height:1.25}',
'.say{font-size:13pt;background:#fff6d6;padding:6px 10px;border-radius:6px;margin:6px 0}</style></head><body>']
if len(secs)>1: out.append(f'<h1>Kindergarten Kriyah — recording script</h1><p class="how">{len(secs)} sections, {total} items in all. Go across each row, left to right, in number order. Pause 2 seconds after each one.</p>')
for i,(t,how,ex,items) in enumerate(secs,1):
    i = 12 if t==LONE[0] else i
    out.append(f'<h2 class="{"first" if i==1 or len(secs)==1 else ""}">Section {i}: {html.escape(t)} ({len(items)})</h2>')
    out.append(f'<p class="how">Start the recording, say <b>“Section {i}”</b>, then read. {html.escape(how)}</p>')
    out.append(f'<div class="say">Example: <span style="font-family:FreeSerif;font-size:20pt">{ex}</span></div><div class="grid">')
    for j,it in enumerate(items,1):
        h_,_,tip = it.partition("|")
        tip = f'<span class="n" style="font-size:14pt;color:#333">{tip}</span>' if tip else ''
        out.append(f'<div class="c"><span class="n">{j}</span>{tip}<span class="h">{h_}</span></div>')
    out.append('</div>')
out.append('</body></html>')
open(sys.argv[1] if len(sys.argv)>1 else "recording-script.html","w").write("\n".join(out))
print(len(secs), total)
