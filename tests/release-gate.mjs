import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import assert from 'node:assert/strict';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const parse=(name,src)=>{try{new Function(src)}catch(e){throw new Error(`${name}: syntax error: ${e.message}`)}};
const router=read('motorsport-hub.js'),loaderV4=read('scriptable-loader.js'),loaderV5=read('scriptable-loader-v5.js');
const registry=JSON.parse(read('category-registry.json')),heroes=JSON.parse(read('hero-assets.json'));
const diagnostics=read('motorsport-diagnostics-v890.js'),attribution=read('ATTRIBUTION.md');

parse('router',router);parse('loader-v4',loaderV4);parse('loader-v5',loaderV5);parse('diagnostics',diagnostics);
assert.equal(registry.schemaVersion,1);assert.equal(registry.routerSchema,5);assert.equal(registry.categories.length,12);assert.equal(registry.qa.id,'QA');
assert.equal(heroes.schemaVersion,2);assert(Array.isArray(heroes.assets)&&heroes.assets.length>=18);

const expectedManifest=[...registry.categories.map(c=>c.id),registry.qa.id].join(',');
assert(router.includes(`MH_CATEGORY_MANIFEST=${expectedManifest}`),'Router category manifest drift');
assert(router.includes('const ROUTER_SCHEMA=5'),'Router schema drift');
assert(!router.includes('motorsport-reliability-v896.js'));assert(!router.includes('d1gp-reliability-v890.js'));assert(!/Request\.prototype\.loadString\s*=/.test(router));assert(!router.includes('hardenExpansionLifecycle'));assert(!router.includes('HARDENING_PATCH_MISMATCH'));assert(!router.includes('replaceExact('));
for(const marker of ['Motorsport Hub','module router','v8.6.0','motorsport-core-v841.js','motorsport-hq-core.js','fdj-widget.js','Script.complete()'])assert(router.includes(marker),`Loader v4 compatibility marker missing: ${marker}`);
for(const marker of ['motorsport-hub-router-v5-candidate.js','motorsport-hub-router-v5-lkg.js','motorsport-hub-router-v5-quarantine.js','new Function'])assert(loaderV5.includes(marker),`Loader v5 safety marker missing: ${marker}`);

const sourceById={};
for(const c of registry.categories){
 assert.equal(c.dataCacheSchema,1,`${c.id}: every current category must use validated data cache schema 1`);
 assert(fs.existsSync(path.join(root,c.module)),`${c.id}: missing module ${c.module}`);
 const src=read(c.module);sourceById[c.id]=src;parse(c.module,src);
 assert(src.includes(c.moduleMarker),`${c.id}: module marker drift`);assert(src.includes('Script.complete()'),`${c.id}: Script.complete missing`);
 assert(router.includes(c.module),`${c.id}: Router is not using registry module`);assert(router.includes(c.moduleCacheKey),`${c.id}: Router cache key drift`);
 assert(src.includes('CACHE_SCHEMA=1'),`${c.id}: cache schema marker missing`);
}

for(const id of ['F1','WEC','WRC','SUPERGT','MOTOGP','FDJ','D1GP']){
 const src=sourceById[id];assert(/flattened .* module|flattened F1 pilot module/.test(src),`${id}: flattened module marker missing`);assert(!src.includes('raw.githubusercontent.com'));assert(!/\beval\s*\(/.test(src));assert(src.includes("lifecycle:'SEASON_ENDED'")||src.includes("lifecycle:'UPCOMING'"));assert(src.includes('SEASON=2026'));
}
for(const id of ['SUPERFORMULA','INDYCAR','NASCAR','GTWCEU']){
 const src=sourceById[id];assert(src.includes('MH_LIFECYCLE_BAKED=1'));assert(src.includes("lifecycle:'SEASON_ENDED'"));assert(src.includes('now>=s&&now<e'));assert(src.includes("?'シーズン終了':'次戦'"));assert(!src.includes('raw.githubusercontent.com'));assert(!/\beval\s*\(/.test(src));assert(src.includes('SEASON=2026'));
}

assert(sourceById.F1.includes('api.jolpi.ca/ergast/f1/2026.json')&&sourceById.F1.includes('driverstandings.json'));assert(sourceById.F1.includes('Promise.all([json(SCHEDULE_SOURCE),json(STANDINGS_SOURCE)])'));assert(sourceById.F1.includes("race:'Abu Dhabi Grand Prix'")&&sourceById.F1.includes('2026-12-06T13:00:00Z'));
assert(sourceById.WEC.includes('fiawec.com/en/page/manufacturers-classification/34'));assert(sourceById.WEC.includes('TR010 Hybrid')&&sourceById.WEC.includes('TOYOTA RACING'));for(const token of ['6 Hours of Barcelona','6 Hours of Monza','hold=10*3600000'])assert(sourceById.WEC.includes(token));
assert(sourceById.WRC.includes('fia.com/events/world-rally-championship/season-2026/standings'));for(const token of ['Rally Saudi Arabia','2026-11-11T09:00:00+03:00','hold=4*86400000','2026 FIA World Rally Championship for Drivers'])assert(sourceById.WRC.includes(token));
assert(sourceById.SUPERGT.includes('supergt.net/driver_ranking?gt_class=gt500&series=2026'));for(const token of ["'36':{name:'坪井 翔 / 山下 健太'","'16':{name:'野尻 智紀 / 佐藤 蓮'","'14':{name:'福住 仁嶺 / 大嶋 和也'",'第8戦 MOTEGI','hold=8*3600000'])assert(sourceById.SUPERGT.includes(token));assert(sourceById.SUPERGT.includes('Osaka%20Auto%20Messe%202025'));
assert(sourceById.MOTOGP.includes('stats.motogp.com/en/world-standing'));for(const token of ['Valencia Grand Prix','Riders','hold=4*3600000'])assert(sourceById.MOTOGP.includes(token));
assert(sourceById.FDJ.includes('formulad.jp/2026-fdj-standings/')&&sourceById.FDJ.includes('hold=40*3600000'));
assert(sourceById.D1GP.includes('d1gp.co.jp/2026d1')&&sourceById.D1GP.includes('King%20of%20Europe')&&sourceById.D1GP.includes('hold=40*3600000'));
assert(sourceById.SUPERFORMULA.includes('superformula.net/sf2/race2026/standings'));assert(sourceById.INDYCAR.includes('https://www.indycar.com/standings/'));assert(sourceById.NASCAR.includes('https://cf.nascar.com/cacher/2026/1/points-feed.json'));assert(sourceById.GTWCEU.includes('gt-world-challenge-europe.com/standings?filter_standing_type=0_0_drivers'));

const dakar=sourceById.DAKAR;
for(const token of ['DAKAR dedicated rally-raid module','MH_LIFECYCLE_BAKED=1','SEASON=2027','PROLOGUE','STAGE 13','2027-01-15T00:00:00+03:00','dakar.com/fr/webview/rankings/stage-13/auto?year=2026','2026 FINAL','総合 CAR','GAP','Dacia%20Sandrider%20GIMS%202024%201X7A2026.jpg'])assert(dakar.includes(token),`DAKAR invariant missing: ${token}`);
assert(!dakar.includes('raw.githubusercontent.com'));assert(!/\beval\s*\(/.test(dakar));assert(dakar.includes("lifecycle:'SEASON_ENDED'"));assert(dakar.includes('now>=s&&now<e'));

for(const token of ['F1','WEC','WRC','MotoGP','SUPER GT','FDJ','D1GP','SUPER FORMULA','INDYCAR','NASCAR','GTWC EUROPE','DAKAR'])assert(diagnostics.includes(token),`QA diagnostics missing ${token}`);
assert(diagnostics.includes('12/12 LIVE'),'QA diagnostics not expanded to twelve routes');

for(const token of ['Eustace Bagge','TTTNIS','Liauzh','MarcelX42','Rowan Harrison','Tokumeigakarinoaoshima','BWard 1997','Ben Goyette','TaurusEmerald','Lukas Raich','Alexander-93','CC0 1.0 Universal','CC BY 4.0','CC BY-SA 4.0','CC BY-SA 2.0'])assert(attribution.includes(token),`ATTRIBUTION.md audit record missing: ${token}`);
assert(!attribution.includes('RELEASE BLOCKER FOR PUBLIC DISTRIBUTION'));

console.log('Motorsport Hub release gate: PASS');
