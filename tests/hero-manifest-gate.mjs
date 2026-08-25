import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const manifest=JSON.parse(read('hero-assets.json'));
assert.equal(manifest.schemaVersion,1,'hero manifest schema mismatch');
assert(Array.isArray(manifest.assets)&&manifest.assets.length>=18,'hero manifest unexpectedly incomplete');

const byUrl=new Map();
for(const a of manifest.assets){
  assert(a.assetId&&a.category&&a.filename&&a.sourcePage&&a.author&&a.license,`incomplete asset record: ${a.assetId||'unknown'}`);
  assert(Array.isArray(a.runtimeUrls)&&a.runtimeUrls.length,`asset has no runtime URL: ${a.assetId}`);
  for(const u of a.runtimeUrls){
    assert(!byUrl.has(u),`duplicate runtime URL in manifest: ${u}`);
    byUrl.set(u,a);
  }
}

const mustBeManifested=(src,file,label)=>{
  assert(src.includes(file),`${label}: runtime URL not present in source`);
  assert(byUrl.has(file),`${label}: runtime URL missing from hero-assets.json`);
};

const core=read('motorsport-core-v841.js');
for(const [label,url] of [
 ['F1 Antonelli','https://commons.wikimedia.org/wiki/Special:Redirect/file/Andrea_Kimi_Antonelli_2025_Italian_Grand_Prix_FP3.jpg?width=960'],
 ['F1 Mercedes fallback','https://upload.wikimedia.org/wikipedia/commons/thumb/d/d1/2025_Japan_GP_-_Mercedes_-_W16_-_Thursday.jpg/960px-2025_Japan_GP_-_Mercedes_-_W16_-_Thursday.jpg'],
 ['F1 Ferrari','https://upload.wikimedia.org/wikipedia/commons/thumb/2/26/2025_Japan_GP_-_Ferrari_-_SF-25_-_Thursday.jpg/960px-2025_Japan_GP_-_Ferrari_-_SF-25_-_Thursday.jpg'],
 ['F1 McLaren','https://upload.wikimedia.org/wikipedia/commons/thumb/5/55/2025_Japan_GP_-_McLaren_-_MCL39_-_Thursday.jpg/960px-2025_Japan_GP_-_McLaren_-_MCL39_-_Thursday.jpg'],
 ['WRC Katsuta','https://upload.wikimedia.org/wikipedia/commons/thumb/5/5d/2025_Toyota_GR_Yaris_Rally_1_Katsuta.jpg/960px-2025_Toyota_GR_Yaris_Rally_1_Katsuta.jpg'],
 ['WRC Ogier fallback','https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/2025_Toyota_GR_Yaris_Rally_1_Ogier_%28cropped%29.jpg/645px-2025_Toyota_GR_Yaris_Rally_1_Ogier_%28cropped%29.jpg'],
 ['MotoGP Aprilia','https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/MotoGP_2025_Malaysian_Grand_Prix_-_Aprilia_Racing_-_Marco_Bezzecchi.jpg/960px-MotoGP_2025_Malaysian_Grand_Prix_-_Aprilia_Racing_-_Marco_Bezzecchi.jpg'],
 ['MotoGP Ducati','https://upload.wikimedia.org/wikipedia/commons/thumb/d/dc/MotoGP_2025_Malaysian_Grand_Prix_-_Ducati_Lenovo_-_Francesco_Bagnaia.jpg/960px-MotoGP_2025_Malaysian_Grand_Prix_-_Ducati_Lenovo_-_Francesco_Bagnaia.jpg'],
]) mustBeManifested(core,url,label);

const hq=read('motorsport-hq-core.js');
for(const [label,url] of [
 ['WEC No.7','https://commons.wikimedia.org/wiki/Special:Redirect/file/2024%206%20Hours%20of%20Spa-Francorchamps%20Toyota%20Gazoo%20Racing%20Toyota%20GR010%20Hybrid%20No.7%20%28DSC04523%29.jpg?width=2048'],
 ['WEC No.8','https://commons.wikimedia.org/wiki/Special:Redirect/file/2024%206%20Hours%20of%20Spa-Francorchamps%20Toyota%20Gazoo%20Racing%20Toyota%20GR010%20Hybrid%20No.8%20%28DSC04184%29.jpg?width=2048'],
]) mustBeManifested(hq,url,label);

// Production v8.9.6 hardening rewrites every SUPER GT HQ hero before the HQ module is evaluated.
const reliability896=read('motorsport-reliability-v896.js');
const verified2048='https://commons.wikimedia.org/wiki/Special:Redirect/file/Osaka%20Auto%20Messe%202025%20%281%29%20-%20No.36%20au%20TOM%27S%20GR%20Supra%20in%202024%20SUPER%20GT.jpg?width=2048';
const verified1280='https://commons.wikimedia.org/wiki/Special:Redirect/file/Osaka%20Auto%20Messe%202025%20%281%29%20-%20No.36%20au%20TOM%27S%20GR%20Supra%20in%202024%20SUPER%20GT.jpg?width=1280';
assert(reliability896.includes("s.includes('dedicated HQ module for WEC / SUPER GT')"),'SUPER GT effective HQ asset policy missing');
for(const u of [verified2048,verified1280]){
  assert(reliability896.includes(u.replace(/'/g,"\\'"))||reliability896.includes(u),`SUPER GT verified hero missing from policy: ${u}`);
  assert(byUrl.has(u),`SUPER GT verified hero missing from manifest: ${u}`);
}
assert(![...byUrl.keys()].some(u=>u.includes('front%20three-quarter%20view')||u.includes('MOTUL%20AUTECH')),'unverified historical SUPER GT fallback leaked into active manifest');

const fdj=read('fdj-widget.js');
for(const width of ['1280','960']){
  const u=`https://commons.wikimedia.org/wiki/Special:Redirect/file/DRIFT-0ae1a2ba-2d7b-4d51-b082-b698f2fbb2f1.jpg?width=${width}`;
  mustBeManifested(fdj,u,`FDJ ${width}`);
}
// v8.7.1 visual wrapper promotes the same verified FDJ asset to 2048.
assert(byUrl.has('https://commons.wikimedia.org/wiki/Special:Redirect/file/DRIFT-0ae1a2ba-2d7b-4d51-b082-b698f2fbb2f1.jpg?width=2048'),'FDJ 2048 runtime variant missing');

const d1base=read('d1gp-widget.js'),d1wrap=read('d1gp-reliability-v890.js');
for(const width of ['2048','1280']){
  mustBeManifested(d1base,`https://commons.wikimedia.org/wiki/Special:Redirect/file/Nissan%20Silvia%20S14%20Drift.jpg?width=${width}`,`D1 base ${width}`);
  mustBeManifested(d1wrap,`https://commons.wikimedia.org/wiki/Special:Redirect/file/King%20of%20Europe%20Round%203%20Lydden%20Hill%202014%20%2814356011899%29.jpg?width=${width}`,`D1 action ${width}`);
}

for(const [file,urls] of [
 ['superformula-widget.js',[
  'https://commons.wikimedia.org/wiki/Special:Redirect/file/Igor%20Fraga%20Super%20Formula%20Round%205%20Suzuka%20Post-Race%202026.jpg?width=2048',
  'https://commons.wikimedia.org/wiki/Special:Redirect/file/Igor%20Fraga%20Super%20Formula%20Round%205%20Suzuka%20Post-Race%202026.jpg?width=1280']],
 ['indycar-widget.js',[
  'https://commons.wikimedia.org/wiki/Special:Redirect/file/Alex%20Palou%20%2854686833932%29.jpg?width=2048',
  'https://commons.wikimedia.org/wiki/Special:Redirect/file/Alex%20Palou%20%2854686833932%29.jpg?width=1280']],
 ['nascar-widget.js',[
  'https://commons.wikimedia.org/wiki/Special:Redirect/file/Denny%20Hamlin%2011%20Las%20Vegas%202025.jpg?width=2048',
  'https://commons.wikimedia.org/wiki/Special:Redirect/file/Denny%20Hamlin%2011%20Las%20Vegas%202025.jpg?width=1280']],
 ['gtwc-europe-widget.js',[
  'https://commons.wikimedia.org/wiki/Special:Redirect/file/GT%20World%20Challenge%20Europe%202024%20N%C3%BCrburg%20Nr.%2048%20Auer%2C%20Engel%2C%20Morad%20%281%29.jpg?width=2048',
  'https://commons.wikimedia.org/wiki/Special:Redirect/file/GT%20World%20Challenge%20Europe%202024%20N%C3%BCrburg%20Nr.%2048%20Auer%2C%20Engel%2C%20Morad%20%281%29.jpg?width=1280']],
]){
  const src=read(file);
  for(const u of urls)mustBeManifested(src,u,`${file} hero`);
}

console.log('Motorsport Hub hero manifest gate: PASS');
