import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';

const arg=(name,fallback='')=>{const p=process.argv.find(x=>x.startsWith(`--${name}=`));return p?p.slice(name.length+3):fallback};
const candidate=path.resolve(arg('candidate','hero-channel-candidate'));
const previous=path.resolve(arg('previous','hero-channel-previous'));
const allowedCategories=new Set(['F1','WEC','WRC','SUPERGT','MOTOGP','FDJ','D1GP','SUPERFORMULA','INDYCAR','NASCAR','GTWCEU','DAKAR']);
const allowedLicenses=new Set(['CC BY 2.0','CC BY 4.0','CC BY-SA 2.0','CC BY-SA 3.0','CC BY-SA 4.0','CC0 1.0']);
const allowedPromotionModes=new Set(['INITIAL','QUALITY_UPGRADE','POOL_ROTATION']);
const base='https://raw.githubusercontent.com/48wr9f4wgp-lab/motorsport-hub/hero-live/hero-channel/assets';
const safe=v=>/^[A-Za-z0-9._-]{1,100}$/.test(String(v||''));
const readJSON=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const parseDate=v=>{const t=Date.parse(String(v||''));return Number.isFinite(t)?t:0};
const liveCore=e=>e?{category:e.category,assetId:e.assetId,version:e.version,sourcePage:e.sourcePage,sourceTitle:e.sourceTitle,author:e.author,license:e.license,sourceYear:e.sourceYear,sourceDate:e.sourceDate,role:e.role,qualityScore:e.qualityScore,images:e.images}:null;

assert(fs.existsSync(candidate),'candidate directory missing');
const channel=readJSON(path.join(candidate,'channel.json'));
const report=readJSON(path.join(candidate,'promotion-report.json'));
assert.equal(channel.schemaVersion,1);
assert.equal(channel.publicationPolicy,'CI_GATED_LIVE_HERO_CHANNEL');
assert(channel.categories&&typeof channel.categories==='object'&&!Array.isArray(channel.categories));
for(const key of ['promoted','poolUpdated','updatedCategories'])assert(Array.isArray(report[key]),`${key} missing`);
assert(report.promotionModes&&typeof report.promotionModes==='object'&&!Array.isArray(report.promotionModes));
assert.equal(new Set(report.promoted).size,report.promoted.length,'duplicate promoted categories');
assert.equal(new Set(report.poolUpdated).size,report.poolUpdated.length,'duplicate pool-updated categories');
assert.equal(new Set(report.updatedCategories).size,report.updatedCategories.length,'duplicate updated categories');
const expectedUpdated=new Set([...report.promoted,...report.poolUpdated]);
assert.deepEqual(new Set(report.updatedCategories),expectedUpdated,'updatedCategories must equal promoted ∪ poolUpdated');
for(const cat of report.promoted){assert(allowedCategories.has(cat),`invalid promoted category ${cat}`);assert(allowedPromotionModes.has(report.promotionModes[cat]),`${cat}: invalid promotion mode`)}
for(const cat of report.poolUpdated)assert(allowedCategories.has(cat),`invalid pool-updated category ${cat}`);
assert(!report.updatedCategories.includes('QA'),'Hero channel must never update QA');

function validateAsset(cat,e,label){
 assert(e&&typeof e==='object',`${label}: asset missing`);
 if(e.category!=null)assert.equal(e.category,cat,`${label}: category mismatch`);
 assert(safe(e.assetId),`${label}: unsafe assetId`);
 assert(safe(e.version),`${label}: unsafe version`);
 assert(allowedLicenses.has(String(e.license||'')),`${label}: license not allowed`);
 assert(String(e.sourcePage||'').startsWith('https://commons.wikimedia.org/wiki/File:'),`${label}: sourcePage must be Wikimedia Commons File page`);
 assert(Number(e.sourceYear)>=2020&&Number(e.sourceYear)<=new Date().getUTCFullYear()+1,`${label}: sourceYear invalid`);
 assert(Number(e.qualityScore)>=.72&&Number(e.qualityScore)<=1,`${label}: qualityScore invalid`);
 for(const [family,w,h] of [['small',720,720],['medium',1380,640]]){
  const img=e.images?.[family];assert(img,`${label}/${family}: image metadata missing`);assert.equal(Number(img.width),w);assert.equal(Number(img.height),h);
  const prefix=`${base}/${cat}/`;assert(String(img.url||'').startsWith(prefix),`${label}/${family}: unexpected URL`);
  const name=path.basename(new URL(img.url).pathname);assert(name.endsWith(`-${family}.jpg`),`${label}/${family}: filename mismatch`);
  const local=path.join(candidate,'assets',cat,name);assert(fs.existsSync(local),`${label}/${family}: asset missing`);assert(fs.statSync(local).size>0,`${label}/${family}: empty asset`);
 }
}

for(const [cat,e] of Object.entries(channel.categories)){
 assert(allowedCategories.has(cat),`invalid live category ${cat}`);assert.equal(e.category,cat);validateAsset(cat,e,cat);
 assert(Array.isArray(e.pool)&&e.pool.length>=1&&e.pool.length<=Number(report.thresholds.poolMaxSize||5),`${cat}: pool size invalid`);
 const ids=e.pool.map(x=>x.assetId);assert.equal(new Set(ids).size,ids.length,`${cat}: duplicate pool asset`);assert(ids.includes(e.assetId),`${cat}: live asset must be in pool`);
 for(const [i,a] of e.pool.entries())validateAsset(cat,a,`${cat}/pool[${i}]`);
 assert(Array.isArray(e.recentAssetIds),`${cat}: recentAssetIds missing`);assert(e.recentAssetIds.length<=Number(report.thresholds.recentHistorySize||2),`${cat}: recent history too large`);assert.equal(new Set(e.recentAssetIds).size,e.recentAssetIds.length,`${cat}: duplicate recent history`);
 assert(parseDate(e.lastRotatedAt)>0,`${cat}: lastRotatedAt missing`);
}

function walk(dir,rel=''){
 if(!fs.existsSync(dir))return;
 for(const ent of fs.readdirSync(dir,{withFileTypes:true})){
  const r=path.join(rel,ent.name),p=path.join(dir,ent.name);assert(!ent.isSymbolicLink?.(),`symlink not allowed: ${r}`);
  if(ent.isDirectory()){assert(r==='assets'||r.startsWith(`assets${path.sep}`),`unexpected directory: ${r}`);walk(p,r);continue;}
  const unix=r.split(path.sep).join('/'),ok=unix==='channel.json'||unix==='promotion-report.json'||/^assets\/[A-Z0-9]+\/[A-Za-z0-9._-]+\.jpg$/.test(unix);assert(ok,`unexpected publish file: ${unix}`);
 }
}
walk(candidate);

if(fs.existsSync(path.join(previous,'channel.json'))){
 const prev=readJSON(path.join(previous,'channel.json')),promoted=new Set(report.promoted),updated=new Set(report.updatedCategories),poolUpdated=new Set(report.poolUpdated);
 for(const [cat,e] of Object.entries(prev.categories||{})){
  const n=channel.categories[cat];assert(n,`${cat}: previous LKG entry was deleted`);
  if(!updated.has(cat)){assert.deepEqual(n,e,`${cat}: unchanged entry mutated`);continue;}
  if(poolUpdated.has(cat)&&!promoted.has(cat))assert.deepEqual(liveCore(n),liveCore(e),`${cat}: pool-only update changed live Hero`);
  if(promoted.has(cat)){
   assert.notEqual(n.assetId,e.assetId,`${cat}: promotion must change live asset`);const mode=report.promotionModes[cat];
   if(mode==='QUALITY_UPGRADE')assert(Number(n.qualityScore)>=Number(e.qualityScore)+Number(report.thresholds.minLkgQualityGain),`${cat}: quality upgrade below margin`);
   if(mode==='POOL_ROTATION'){
    assert(Number(n.qualityScore)>=Math.max(.72,Number(e.qualityScore)-Number(report.thresholds.poolMaxQualityDrop)),`${cat}: pool rotation quality drop too large`);
    const last=parseDate(e.lastRotatedAt)||parseDate(e.promotedAt)||parseDate(e.sourceDate);assert(Date.now()-last>=Number(report.thresholds.rotationMinAgeHours)*3600000,`${cat}: pool rotation before minimum age`);
   }
  }
 }
 for(const cat of report.promoted)if(!prev.categories?.[cat])assert.equal(report.promotionModes[cat],'INITIAL',`${cat}: new live category must use INITIAL mode`);
}

console.log(`Motorsport Hub Hero channel publish validation: PASS (${Object.keys(channel.categories).length} live / ${report.promoted.length} promoted / ${report.poolUpdated.length} pool-only)`);
