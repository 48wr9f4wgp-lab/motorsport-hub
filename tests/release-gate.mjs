import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const assert=(ok,msg)=>{if(!ok)throw new Error(msg)};
const parse=(name,src)=>{try{new Function(src)}catch(e){throw new Error(`${name}: syntax error: ${e.message}`)}};

const files={
 loader:read('scriptable-loader.js'),
 router:read('motorsport-hub.js'),
 reliability:read('motorsport-reliability-v890.js'),
 reliability892:read('motorsport-reliability-v892.js'),
 reliability894:read('motorsport-reliability-v894.js'),
 reliability895:read('motorsport-reliability-v895.js'),
 reliability896:read('motorsport-reliability-v896.js'),
 diagnostics:read('motorsport-diagnostics-v890.js'),
 visual:read('motorsport-universal-v871.js'),
 core:read('motorsport-core-v841.js'),
 hq:read('motorsport-hq-core.js'),
 fdj:read('fdj-widget.js'),
 d1:read('d1gp-reliability-v890.js'),
 d1base:read('d1gp-widget.js'),
 superformula:read('superformula-widget.js'),
 indycar:read('indycar-widget.js'),
 attribution:read('ATTRIBUTION.md'),
 boundary:read('tests/boundary-gate.mjs'),
};

for(const [name,src] of Object.entries(files))if(!['attribution','boundary'].includes(name))parse(name,src);

for(const token of ['F1','WEC','WRC','SUPERGT','MOTOGP','FDJ','D1GP','SUPERFORMULA','INDYCAR'])
 assert(files.router.includes(token),`router missing category ${token}`);

for(const marker of ['Motorsport Hub','module router','v8.6.0',"'FDJ'",'motorsport-core-v841.js','motorsport-hq-core.js','fdj-widget.js','Script.complete()'])
 assert(files.router.includes(marker),`loader-v4 compatibility marker missing: ${marker}`);

assert(files.router.includes('motorsport-reliability-v896.js'),'router lost v8.9.6 stable reliability path');
assert(files.router.includes('d1gp-reliability-v890.js'),'router lost D1GP reliability wrapper');
assert(files.router.includes('superformula-widget.js'),'router is not using SUPER FORMULA module');
assert(files.router.includes('indycar-widget.js'),'router is not using INDYCAR module');
assert(files.router.includes('motorsport-diagnostics-v890.js'),'router lost QA diagnostics');
assert(files.router.includes("'QA'"),'router missing QA selector');
assert(files.diagnostics.includes('QA diagnostics'),'QA diagnostics marker missing');
for(const token of ['F1','WEC','WRC','MotoGP','SUPER GT','FDJ','D1GP','SUPER FORMULA','INDYCAR'])
 assert(files.diagnostics.includes(token),`QA diagnostics missing ${token}`);

assert(files.reliability.includes('F1_PARTIAL'),'F1 atomic refresh guard missing');
assert(files.reliability.includes('fia.com/events/world-rally-championship/season-2026/standings'),'FIA WRC standings source missing');
for(const token of ['6 Hours of Barcelona','6 Hours of Monza','Rally Saudi Arabia','Valencia Grand Prix','第8戦 MOTEGI'])
 assert(files.reliability.includes(token),`season-tail calendar missing: ${token}`);
assert(files.reliability.includes("META[m]||['','']"),'WEC unknown-manufacturer fallback missing');
assert(files.reliability.includes("no?'No.'+no:''"),'SUPER GT unknown-car fallback missing');
assert(files.reliability.includes('4*86400000'),'WRC multi-day hold missing');
assert(files.reliability.includes('40*3600000'),'FDJ weekend hold missing');
assert(files.d1.includes('40*3600000'),'D1GP weekend hold missing');
assert(files.reliability.includes("label:'開催中'"),'multi-day in-event state missing');
assert(files.reliability892.includes('/坪井|山下/'),'SUPER GT driver-name metadata fallback missing');
assert(files.reliability892.includes("s||'GT500'"),'SUPER GT non-empty secondary-line fallback missing');
assert(files.reliability894.includes('TR010 Hybrid')&&files.reliability894.includes('TOYOTA RACING'),'official 2026 WEC Toyota naming guard missing');
assert(files.reliability895.includes("selected==='WEC'?10:8"),'WEC/SUPER GT event hold guard missing');
assert(files.reliability895.includes('hold=4*3600000'),'MotoGP event hold guard missing');
assert(files.reliability896.includes('Osaka%20Auto%20Messe%202025'),'verified SUPER GT CC0 hero replacement missing');
assert(files.reliability896.includes('motorsport-hero-v896-'),'SUPER GT hero cache-bust missing');
assert(files.visual.includes('Final Visual Polish'),'v8.7.1 visual lock source missing');
assert(files.fdj.includes('formulad.jp/2026-fdj-standings'),'FDJ live standings source missing');
assert(files.d1base.includes('d1gp.co.jp'),'D1GP live source missing');
assert(files.d1.includes('King%20of%20Europe'),'D1GP action hero missing');

// SUPER FORMULA expansion gate.
assert(files.superformula.includes('SUPER FORMULA module'),'SUPER FORMULA module marker missing');
assert(files.superformula.includes('superformula.net/sf2/race2026/standings'),'SUPER FORMULA official standings source missing');
for(const token of ['第9・10戦 富士','第11・12戦 鈴鹿','2026-10-11T18:00:00+09:00','SF23'])
 assert(files.superformula.includes(token),`SUPER FORMULA configuration missing: ${token}`);
assert(files.superformula.includes('Igor%20Fraga%20Super%20Formula%20Round%205%20Suzuka%20Post-Race%202026.jpg'),'SUPER FORMULA verified hero missing');
assert(files.boundary.includes('SUPER FORMULA: retain Fuji during double-header weekend'),'SUPER FORMULA weekend boundary coverage missing');

// INDYCAR expansion gate.
assert(files.indycar.includes('INDYCAR module'),'INDYCAR module marker missing');
assert(files.indycar.includes('https://www.indycar.com/standings/'),'INDYCAR official standings source missing');
for(const token of ['Milwaukee Race 1','Milwaukee Race 2','Laguna Seca Finale','Alex Palou','Kyle Kirkwood','Christian Lundgaard'])
 assert(files.indycar.includes(token),`INDYCAR configuration missing: ${token}`);
assert(files.indycar.includes('Alex%20Palou%20%2854686833932%29.jpg'),'INDYCAR verified hero missing');
assert(files.boundary.includes('INDYCAR: advance to Race 2 after Race 1 hold'),'INDYCAR Milwaukee boundary coverage missing');

for(const token of ['Eustace Bagge','TTTNIS','Liauzh','MarcelX42','Rowan Harrison','Tokumeigakarinoaoshima','BWard 1997','Ben Goyette','CC0 1.0 Universal','CC BY 4.0','CC BY-SA 4.0','CC BY-SA 2.0'])
 assert(files.attribution.includes(token),`attribution audit missing: ${token}`);
assert(files.attribution.includes('SUPER FORMULA v9.0.0 hero licensing: **PASS**'),'SUPER FORMULA attribution gate is not closed');
assert(files.attribution.includes('INDYCAR v9.1.0 hero licensing: **PASS**'),'INDYCAR attribution gate is not closed');
assert(!files.attribution.includes('RELEASE BLOCKER FOR PUBLIC DISTRIBUTION'),'stale release blocker remains');
assert(files.boundary.includes('Motorsport Hub boundary gate: PASS'),'boundary gate file missing PASS marker');

console.log('Motorsport Hub release gate: PASS');
