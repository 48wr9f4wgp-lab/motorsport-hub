import fs from 'node:fs';
import path from 'node:path';

const root=path.resolve(import.meta.dirname,'..');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const assert=(ok,msg)=>{if(!ok)throw new Error(msg)};
const parse=(name,src)=>{try{new Function(src)}catch(e){throw new Error(`${name}: syntax error: ${e.message}`)}};

const files={
 loader:read('scriptable-loader.js'),
 router:read('motorsport-hub.js'),
 reliability:read('motorsport-reliability-v890.js'),
 visual:read('motorsport-universal-v871.js'),
 core:read('motorsport-core-v841.js'),
 hq:read('motorsport-hq-core.js'),
 fdj:read('fdj-widget.js'),
 d1:read('d1gp-action-v882.js'),
 d1base:read('d1gp-widget.js'),
};

for(const [name,src] of Object.entries(files))parse(name,src);

for(const token of ['F1','WEC','WRC','SUPERGT','MOTOGP','FDJ','D1GP'])
 assert(files.router.includes(token),`router missing category ${token}`);

for(const marker of ['Motorsport Hub','module router','v8.6.0',"'FDJ'",'motorsport-core-v841.js','motorsport-hq-core.js','fdj-widget.js','Script.complete()'])
 assert(files.router.includes(marker),`loader-v4 compatibility marker missing: ${marker}`);

assert(files.router.includes('motorsport-reliability-v890.js'),'router is not using v8.9 reliability pass');
assert(files.router.includes('d1gp-action-v882.js'),'router lost D1GP action module');
assert(files.reliability.includes('F1_PARTIAL'),'F1 atomic refresh guard missing');
assert(files.reliability.includes('fia.com/events/world-rally-championship/season-2026/standings'),'FIA WRC fallback source missing');

for(const token of ['6 Hours of Barcelona','6 Hours of Monza','Rally Saudi Arabia','Valencia Grand Prix','第8戦 MOTEGI'])
 assert(files.reliability.includes(token),`season-tail calendar missing: ${token}`);

assert(files.reliability.includes("META[m]||['','']"),'WEC unknown-manufacturer fallback missing');
assert(files.reliability.includes("no?'No.'+no:''"),'SUPER GT unknown-car fallback missing');
assert(files.visual.includes('Final Visual Polish'),'v8.7.1 visual lock source missing');
assert(files.fdj.includes('formulad.jp/2026-fdj-standings'),'FDJ live standings source missing');
assert(files.d1base.includes('d1gp.co.jp'),'D1GP live source missing');
assert(files.d1.includes('King%20of%20Europe'),'D1GP action hero missing');

console.log('Motorsport Hub release gate: PASS');
