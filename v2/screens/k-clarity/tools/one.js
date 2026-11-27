// run one v2 test file: node one.js <path>
const t=require(require('path').resolve(process.argv[2]));
(async()=>{const b=await require('playwright').chromium.launch();const r=await t(b);await b.close();
console.log('OK',r.oks.length,'FAIL',r.fails.length);r.fails.slice(0,15).forEach(f=>console.log(' -',f.slice(0,300)));process.exit(0);})();
