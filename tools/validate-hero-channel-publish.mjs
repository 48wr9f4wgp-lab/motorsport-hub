import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';

const arg=(name,fallback='')=>{const p=process.argv.find(x=>x.startsWith(`--${name}=`));return p?p.slice(name.length+3):fallback};
const candidate=path.resolve(arg('candidate','hero-channel-candidate'));
const previous=path.resolve(arg('previous','hero-channel-previous'));
const allowedCategories=new Set(['F1','WEC','WRC','SUPERGT','MOTOGP','FDJ','D1GP','SUPERFORMULA','INDYCAR','NASCAR','GTWCEU']);
const allowedLicenses=new Set(['CC BY 2.0','CC BY 4.0','CC BY-SA 2.0','CC BY-SA 3.0','CC BY-SA 4.0','CC0 1.0']);
const base='https://raw.githubusercontent.com/48wr9f4wgp-lab/motorsport-hub/hero-live/hero-channel/assets';
const safe=v=>/^[A-Za-z0-9._-]{1,100}$/.test(String(v||''));
const readJSON=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const sourceTime=e=>{const t=Date.parse(String(e?.sourceDate||''));return Number.isFinite(t)?t:Date.UTC(Number(e?.sourceYear)||0,0,1)};

assert(fs.existsSync(candidate),'candidate directory missing');
const channel=readJSON(path.join(candidate,'channel.json'));
const report=readJSON(path.join(candidate,'promotion-report.json'));
assert.equal(channel.schemaVersion,1);
assert.equal(channel.publicationPolicy,'CI_GATED_LIVE_HERO_CHANNEL');
assert(channel.categories&&typeof channel.categories==='object'&&!Array.isArray(channel.categories));
assert(Array.isArray(report.promoted));
assert.equal(new Set(report.promoted).size,report.promoted.length,'duplicate promoted categories');
for(const cat of report.promoted)assert(allowedCategories.has(cat),`invalid promoted category ${cat}`);
assert(!report.promoted.includes('DAKAR')&&!report.promoted.includes('QA'),'generic channel must not promote DAKAR/QA');

for(const [cat,e] of Object.entries(channel.categories)){
  assert(allowedCategories.has(cat),`invalid live category ${cat}`);
  assert.equal(e.category,cat);
  assert(safe(e.assetId),`${cat}: unsafe assetId`);
  assert(safe(e.version),`${cat}: unsafe version`);
  assert(allowedLicenses.has(String(e.license||'')),`${cat}: license not allowed`);
  assert(String(e.sourcePage||'').startsWith('https://commons.wikimedia.org/wiki/File:'),`${cat}: sourcePage must be Wikimedia Commons File page`);
  assert(Number(e.sourceYear)>=2020&&Number(e.sourceYear)<=new Date().getUTCFullYear()+1,`${cat}: sourceYear invalid`);
  assert(Number(e.qualityScore)>=0.72&&Number(e.qualityScore)<=1,`${cat}: qualityScore invalid`);
  for(const [family,w,h] of [['small',720,720],['medium',1380,640]]){
    const img=e.images?.[family];assert(img,`${cat}/${family}: image metadata missing`);
    assert.equal(Number(img.width),w);assert.equal(Number(img.height),h);
    const prefix=`${base}/${cat}/`;assert(String(img.url||'').startsWith(prefix),`${cat}/${family}: unexpected URL`);
    const name=path.basename(new URL(img.url).pathname);assert(name.endsWith(`-${family}.jpg`),`${cat}/${family}: filename mismatch`);
    const local=path.join(candidate,'assets',cat,name);assert(fs.existsSync(local),`${cat}/${family}: asset missing`);
    assert(fs.statSync(local).size>0,`${cat}/${family}: empty asset`);
  }
}

function walk(dir,rel=''){
  if(!fs.existsSync(dir))return;
  for(const ent of fs.readdirSync(dir,{withFileTypes:true})){
    const r=path.join(rel,ent.name),p=path.join(dir,ent.name);
    assert(!ent.isSymbolicLink?.(),`symlink not allowed: ${r}`);
    if(ent.isDirectory()){assert(r==='assets'||r.startsWith(`assets${path.sep}`),`unexpected directory: ${r}`);walk(p,r);continue;}
    const unix=r.split(path.sep).join('/');
    const ok=unix==='channel.json'||unix==='promotion-report.json'||/^assets\/[A-Z0-9]+\/[A-Za-z0-9._-]+\.jpg$/.test(unix);
    assert(ok,`unexpected publish file: ${unix}`);
  }
}
walk(candidate);

if(fs.existsSync(path.join(previous,'channel.json'))){
  const prev=readJSON(path.join(previous,'channel.json'));
  const promoted=new Set(report.promoted);
  for(const [cat,e] of Object.entries(prev.categories||{})){
    assert(channel.categories[cat],`${cat}: previous LKG entry was deleted`);
    if(!promoted.has(cat))assert.deepEqual(channel.categories[cat],e,`${cat}: unchanged LKG entry mutated`);
    else assert(sourceTime(channel.categories[cat])>sourceTime(e),`${cat}: promoted source is not newer than LKG`);
  }
}

console.log(`Motorsport Hub Hero channel publish validation: PASS (${Object.keys(channel.categories).length} live / ${report.promoted.length} promoted)`);
