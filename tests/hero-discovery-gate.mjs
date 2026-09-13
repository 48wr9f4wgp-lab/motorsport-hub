import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {execFileSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import {reportFromApiResponses,evaluateCandidate} from '../tools/commons-hero-discovery.mjs';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const config=JSON.parse(fs.readFileSync(path.join(root,'hero-source-discovery.json'),'utf8'));
const fixture=JSON.parse(fs.readFileSync(path.join(root,'tests/fixtures/commons-hero-discovery.json'),'utf8'));
const r=reportFromApiResponses(fixture,config);
assert.equal(r.publicationPolicy,'DISCOVERY_ONLY_NO_RUNTIME_MUTATION');
assert.equal(r.summary.discovered,3);
assert.equal(r.summary.eligibleForReview,1);
const ok=r.candidates.find(x=>x.title==='File:Dakar Rally 2026 Action.jpg');
assert(ok.eligibleForReview);assert.equal(ok.license,'CC BY-SA 4.0');assert.equal(ok.longEdge,4800);assert.equal(ok.sourceYear,2026);assert.equal(ok.author,'Example Author');
const tiny=r.candidates.find(x=>x.title==='File:Dakar tiny.jpg');
assert(tiny.reasons.includes('SOURCE_RESOLUTION_TOO_LOW'));
const bad=r.candidates.find(x=>x.title==='File:Dakar unknown license.jpg');
assert(bad.reasons.includes('LICENSE_NOT_ALLOWED'));
assert(r.candidates.every(x=>x.status==='DISCOVERED_UNAPPROVED'),'Discovery must never mark an asset approved');

const base={title:'File:2026 race car.jpg',mime:'image/jpeg',longEdge:4000,license:'CC BY 4.0',author:'A',sourcePage:'https://commons.wikimedia.org/wiki/File:X',runtimeUrl:'https://upload.wikimedia.org/x.jpg',description:'2026 race car',sourceYear:2026};
const f1={...config,minSourceYear:2020,category:'F1',relevance:{requiredAny:['formula 1','formula one','grand prix'],forbiddenAny:['museum','super formula']}};
const wrong=evaluateCandidate({...base,title:'File:Super Formula Round 5 2026.jpg',description:'Super Formula at Suzuka'},f1);
assert(wrong.reasons.includes('CATEGORY_RELEVANCE_MISMATCH'));
assert(wrong.reasons.includes('CATEGORY_FORBIDDEN_CONTEXT'));
const museum=evaluateCandidate({...base,title:'File:Formula One RB4 museum.jpg',description:'Formula One car in museum'},f1);
assert(museum.reasons.includes('CATEGORY_FORBIDDEN_CONTEXT'));
const action=evaluateCandidate({...base,title:'File:2026 Formula One Grand Prix action.jpg',description:'Formula One Grand Prix race action'},f1);
assert.equal(action.eligibleForReview,true);
const dakar={...config,minSourceYear:2020,category:'DAKAR',relevance:{requiredAny:['dakar'],forbiddenAny:['replica','exhibition','feria']}};
const accentedReplica=evaluateCandidate({...base,title:'File:Réplica Renault 18 Dakar.jpg',description:'Réplica Dakar expuesta en la Feria Internacional'},dakar);
assert(accentedReplica.reasons.includes('CATEGORY_FORBIDDEN_CONTEXT'),'accented replica/exhibition context must be folded and rejected');

const inventory=JSON.parse(fs.readFileSync(path.join(root,'hero-assets.json'),'utf8'));
const expected=['F1','WEC','WRC','SUPERGT','MOTOGP','FDJ','D1GP','SUPERFORMULA','INDYCAR','NASCAR','GTWCEU','DAKAR'];
assert.equal(inventory.schemaVersion,2,'verified Hero inventory schema drift');
for(const id of expected){
  const tmp=path.join(os.tmpdir(),`mh-seed-config-${id.toLowerCase()}.json`);
  execFileSync(process.execPath,[path.join(root,'tools/build-hero-refresh-config.mjs'),`--category=${id}`,`--output=${tmp}`],{cwd:root,stdio:'pipe'});
  const cfg=JSON.parse(fs.readFileSync(tmp,'utf8'));
  fs.rmSync(tmp,{force:true});
  assert(Number(cfg.minSourceYear)>=2020,`${id}: publish freshness floor missing`);
  assert(Array.isArray(cfg.verifiedSeeds)&&cfg.verifiedSeeds.length>=1,`${id}: verified seed inventory missing`);
  for(const seed of cfg.verifiedSeeds){
    const audited=inventory.assets.find(a=>a.assetId===seed.assetId&&a.category===id);
    assert(audited,`${id}: seed is not backed by hero-assets.json`);
    assert.equal(seed.filename,audited.filename,`${id}: seed filename drift`);
    assert.equal(seed.sourcePage,audited.sourcePage,`${id}: seed source page drift`);
    assert.equal(seed.license,audited.license,`${id}: seed license drift`);
  }
}

const superGtSeedCfg={...config,minSourceYear:2020,allowedLicenses:['CC BY 4.0'],category:'SUPERGT',relevance:{requiredAny:['super gt','gt500'],forbiddenAny:['museum','auto messe']}};
const verified=evaluateCandidate({...base,title:'File:MOTUL AUTECH Z 2024 rd.2 FUJI.jpg',description:'race action',sourceYear:2024,verifiedSeed:true,seedFilename:'MOTUL AUTECH Z 2024 rd.2 FUJI.jpg',seedLicense:'CC BY 4.0'},superGtSeedCfg);
assert.equal(verified.eligibleForReview,true,'audited seed must satisfy category identity without fuzzy text relevance');
const forbiddenVerified=evaluateCandidate({...base,title:'File:MOTUL AUTECH Z 2024 rd.2 FUJI.jpg',description:'museum display',sourceYear:2024,verifiedSeed:true,seedFilename:'MOTUL AUTECH Z 2024 rd.2 FUJI.jpg',seedLicense:'CC BY 4.0'},superGtSeedCfg);
assert(forbiddenVerified.reasons.includes('CATEGORY_FORBIDDEN_CONTEXT'),'verified seeds must still obey forbidden-context policy');
const staleVerified=evaluateCandidate({...base,title:'File:D1GP (5679098995).jpg',description:'D1 action',sourceYear:2011,license:'CC BY 2.0',verifiedSeed:true,seedFilename:'D1GP (5679098995).jpg',seedLicense:'CC BY 2.0'}, {...superGtSeedCfg,allowedLicenses:['CC BY 2.0'],category:'D1GP',relevance:{requiredAny:['d1gp'],forbiddenAny:[]}});
assert(staleVerified.reasons.includes('SOURCE_YEAR_TOO_OLD'),'verified seeds must not bypass the publish freshness floor');

const fdjSeed={assetId:'fdj-drift-cc0',filename:'DRIFT-0ae1a2ba-2d7b-4d51-b082-b698f2fbb2f1.jpg',sourcePage:'https://commons.wikimedia.org/wiki/File:DRIFT-0ae1a2ba-2d7b-4d51-b082-b698f2fbb2f1.jpg',author:'Pixabay source; attribution not required',license:'CC0 1.0'};
const seedReport=reportFromApiResponses([{query:'verified-seed:fdj-drift-cc0',seed:fdjSeed,payload:{query:{pages:[{title:'File:DRIFT-0ae1a2ba-2d7b-4d51-b082-b698f2fbb2f1.jpg',imageinfo:[{width:4096,height:2731,mime:'image/jpeg',url:'https://upload.wikimedia.org/fdj.jpg',thumburl:'https://upload.wikimedia.org/fdj-thumb.jpg',timestamp:'2025-01-01T00:00:00Z',extmetadata:{LicenseShortName:{value:'CC0'},Artist:{value:'Pixabay'},Credit:{value:'Own work'},ImageDescription:{value:'drift action'},DateTimeOriginal:{value:'2025-01-01'}}}]}]}}}],{...config,minSourceYear:2020,allowedLicenses:['CC0 1.0'],category:'FDJ',relevance:{requiredAny:['formula drift japan','fdj'],forbiddenAny:[]}});
assert.equal(seedReport.summary.eligibleVerifiedSeeds,1,'verified seed should be eligible after exact-file audit');
assert.equal(seedReport.candidates[0].license,'CC0 1.0','Commons CC0 shorthand must normalize to audited CC0 1.0');
assert.equal(seedReport.candidates[0].eligibleForReview,true,'verified seed must pass without generic relevance text');

console.log('Motorsport Hub Hero discovery gate: PASS');
