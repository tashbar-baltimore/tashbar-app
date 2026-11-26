/* window.TLK: the button system as small helpers that return HTML, so every screen writes the same buttons.
   attrs = the screen's own attributes for its click handler, e.g. 'data-act="quit"'. No slash-slash in this file. */
(function(){
if(window.TLK) return;
var esc=function(s){ return String(s==null?'':s).replace(/[&<>"]/g,function(c){ return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]; }); };
var A=function(a){ return a?' '+a:''; };
/* the X and the house are drawn so their middle is exactly the middle of the circle */
var X_SVG='<svg viewBox="0 0 18 18" aria-hidden="true"><path d="M4 4l10 10M14 4L4 14" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/></svg>';
var HOME_SVG='<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M3.25 8.75 10 2.75l6.75 6v7.5a1 1 0 0 1-1 1H12.6v-4.6H7.4v4.6H4.25a1 1 0 0 1-1-1z" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linejoin="round"/></svg>';
/* the back arrow: shaft 4.25-15.75 and head 4.75-15.25 around (10,10), so it sits exactly in the middle */
var BACK_SVG='<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M15.75 10H4.25M9.5 4.75 4.25 10l5.25 5.25" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
/* the fixed words (HoS 2026-11-23): one word for one moment, on every screen */
var WORDS={ start:'Start', next:'Next', back:'‹ Back', check:'Check', buyIt:'Buy it', send:'Send', notNow:'Not now',
  keepLearning:'Keep learning', leave:'Leave', leaveLesson:'Leave this lesson?', tryAgain:'Try again', money:'My money', canteenMoney:'canteen money',
  close:'Close', home:'Home', readToMe:'Read it to me' };
var KINDS={ money:1, prog:1, now:1, rank:1, lock:1, subj:1 };
window.TLK={ X_SVG:X_SVG, HOME_SVG:HOME_SVG, BACK_SVG:BACK_SVG, WORDS:WORDS, KINDS:KINDS,
  /* MAIN: the one thing to do now (words only) */
  main:function(text,attrs,extra){ return '<button type="button" class="tlk tlk-main'+(extra?' '+extra:'')+'"'+A(attrs)+'>'+esc(text)+'</button>'; },
  /* QUIET: every other choice (words only) */
  quiet:function(text,attrs,extra){ return '<button type="button" class="tlk tlk-quiet'+(extra?' '+extra:'')+'"'+A(attrs)+'>'+esc(text)+'</button>'; },
  /* X: closes a pop-up (place "tr") or leaves a lesson (place "tl"; the screen asks "Leave this lesson?" first) */
  x:function(attrs,place,label){ return '<button type="button" class="tlk tlk-x'+(place?' tlk-at-'+place:'')+'" aria-label="'+esc(label||WORDS.close)+'"'+A(attrs)+'>'+X_SVG+'</button>'; },
  /* HOUSE: leaves a full page (My map, My work, My profile), top left. young = a K-3 boy: the bigger button with the house and "Home".
     TLK.young(grade): true for K (0) through grade 3. */
  home:function(attrs,place,young){ return '<button type="button" class="tlk tlk-home'+(young?' tlk-home-k3':'')+(place===''?'':' tlk-at-'+(place||'tl'))+'" aria-label="'+WORDS.home+'"'+A(attrs)+'>'+HOME_SVG+(young?'<span>'+WORDS.home+'</span>':'')+'</button>'; },
  /* BACK (HoS 2026-11-24): back to the menu page he came from (only on a page he reached from another menu; never on the home or a pop-up).
     Grade 4+: round 44 px, the arrow only. young = a K-3 boy: the bigger button with the arrow and the word "Back". Top left, before the house. */
  back:function(attrs,place,young){ return '<button type="button" class="tlk tlk-back'+(young?' tlk-back-k3':'')+(place===''?'':' tlk-at-'+(place||'tl'))+'" aria-label="Back"'+A(attrs)+'>'+BACK_SVG+(young?'<span>Back</span>':'')+'</button>'; },
  young:function(grade){ var g=Number(grade); return grade!=null&&grade!==''&&!isNaN(g)&&g<=3; },
  /* TOOL: a round button with one icon (Read it to me, music, hint); its name shows on hold or hover */
  tool:function(icon,label,attrs){ return '<button type="button" class="tlk tlk-tool" aria-label="'+esc(label)+'" title="'+esc(label)+'"'+A(attrs)+'>'+icon+'</button>'; },
  /* INFORMATION: a soft pill or box; kind = money, prog, now, rank, lock or subj (never a button) */
  pill:function(kind,text){ return '<span class="tlk-pill tlk-'+(KINDS[kind]?kind:'prog')+'">'+esc(text)+'</span>'; },
  box:function(kind,label,value){ return '<span class="tlk-box tlk-'+(KINDS[kind]?kind:'prog')+'"><small>'+esc(label)+'</small><b>'+esc(value)+'</b></span>'; },
  /* a question pop-up's inside: title, a line, the main button and a quiet "Not now" (no X) */
  ask:function(o){ o=o||{}; return '<div class="tlk-ask">'+(o.icon?'<div aria-hidden="true" style="font-size:40px;line-height:1">'+o.icon+'</div>':'')+'<h2 style="margin:0">'+esc(o.title||'')+'</h2>'+(o.text?'<p style="margin:0">'+esc(o.text)+'</p>':'')+
    '<div class="tlk-actions">'+window.TLK.main(o.yes||WORDS.start,o.yesAttrs)+window.TLK.quiet(o.no||WORDS.notNow,o.noAttrs)+'</div></div>'; }
};
})();
