import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const manifest=JSON.parse(read('hero-assets.json'));
const registry=JSON.parse(read('category-registry.json'));
assert.equal(manifest.schemaVersion,2,'hero manifest schema mismatch');
assert(Array.isArray(manifest.assets)&&manifest.assets.length>=17,'hero manifest unexpectedly incomplete');

const manifestByUrl=new Map(),manifestIds=new Set();
for(const a of manifest.assets){
  assert(a.assetId&&a.category&&a.filename&&a.sourcePage&&a.author&&a.license,`incomplete asset record: ${a.assetId||'unknown'}`);
  assert(!manifestIds.has(a.assetId),`duplicate assetId: ${a.assetId}`);manifestIds.add(a.assetId);
  assert(Array.isArray(a.runtimeUrls)&&a.runtimeUrls.length,`asset has no runtime URL: ${a.assetId}`);
  assert(/^https:\/\/commons\.wikimedia\.org\/wiki\/File:/.test(a.sourcePage),`asset sourcePage must be an exact Commons file page: ${a.assetId}`);
  for(const u of a.runtimeUrls){assert(!manifestByUrl.has(u),`duplicate runtime URL in manifest: ${u}`);manifestByUrl.set(u,a)}
}

const imageRx=/https:\/\/(?:commons\.wikimedia\.org\/wiki\/Special:Redirect\/file\/|upload\.wikimedia\.org\/wikipedia\/commons\/)[^'"\s]+/g;
const runtimeByUrl=new Map();
for(const c of registry.categories){
  const src=read(c.module),urls=[...new Set(src.match(imageRx)||[])];
  assert(urls.length>0,`${c.id}: no runtime hero URL found in ${c.module}`);
  for(const u of urls){
    const prior=runtimeByUrl.get(u);if(prior&&prior!==c.id)throw new Error(`runtime hero URL shared across categories without explicit review: ${u} (${prior}/${c.id})`);
    runtimeByUrl.set(u,c.id);
    const asset=manifestByUrl.get(u);assert(asset,`${c.id}: runtime hero URL missing from hero-assets.json: ${u}`);assert.equal(asset.category,c.id,`${c.id}: hero manifest category mismatch for ${u}`);
  }
}
assert.equal(runtimeByUrl.size,manifestByUrl.size,'runtime/manifest hero URL counts differ');
for(const[u,a]of manifestByUrl){assert(runtimeByUrl.has(u),`stale manifest URL is no longer reachable from current registry modules: ${a.assetId} ${u}`)}

const directSources=registry.categories.map(c=>read(c.module)).join('\n');
for(const forbidden of ['Fujimaki%20Group%20Suzuka','front%20three-quarter%20view','Nissan%20Silvia%20S14%20Drift.jpg','Osaka%20Auto%20Messe%202025','King%20of%20Europe'])assert(!directSources.includes(forbidden),`historical/unreviewed hero leaked back into direct runtime: ${forbidden}`);

const sgt=read('supergt-widget-flat-v1000.js');
assert(sgt.includes('Abarabone1206 / CC BY 4.0'),'SUPER GT verified action-Hero provenance marker missing');
assert.equal((sgt.match(/MOTUL%20AUTECH%20Z%202024%20rd\.2%20FUJI/g)||[]).length,2,'SUPER GT should expose exactly two size variants of the reviewed 2024 Fuji Hero');
const d1=read('d1gp-widget-flat-v1000.js');
assert.equal((d1.match(/D1GP%20%285679098995%29/g)||[]).length,2,'D1GP should expose exactly two size variants of the reviewed D1 Grand Prix Hero');

console.log('Motorsport Hub hero manifest gate: PASS');
