import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';

const arg=(name,fallback='')=>{const p=process.argv.find(x=>x.startsWith(`--${name}=`));return p?p.slice(name.length+3):fallback};
const channelPath=path.resolve(arg('channel','hero-channel/channel.json'));
const attributionPath=path.resolve(arg('attribution','hero-channel/ATTRIBUTION.md'));
const licenseUrls={
  'CC BY 2.0':'https://creativecommons.org/licenses/by/2.0/',
  'CC BY 4.0':'https://creativecommons.org/licenses/by/4.0/',
  'CC BY-SA 2.0':'https://creativecommons.org/licenses/by-sa/2.0/',
  'CC BY-SA 3.0':'https://creativecommons.org/licenses/by-sa/3.0/',
  'CC BY-SA 4.0':'https://creativecommons.org/licenses/by-sa/4.0/',
  'CC0 1.0':'https://creativecommons.org/publicdomain/zero/1.0/'
};
const clean=v=>String(v??'').replace(/[\r\n\t]+/g,' ').replace(/\s+/g,' ').trim();

assert(fs.existsSync(channelPath),'Hero channel missing');
assert(fs.existsSync(attributionPath),'public Hero attribution missing');
const channel=JSON.parse(fs.readFileSync(channelPath,'utf8'));
const text=fs.readFileSync(attributionPath,'utf8');
assert.equal(channel.schemaVersion,1,'Hero channel schema mismatch');
assert(channel.categories&&typeof channel.categories==='object','Hero categories missing');
assert(text.includes('# Motorsport Hub — Live Hero Attribution'),'attribution heading missing');
assert(text.includes('Changes made by Motorsport Hub'),'modification notice missing');
assert(text.includes('software license for Motorsport Hub is separate'),'software/image license separation missing');

let total=0;
for(const [category,entry] of Object.entries(channel.categories)){
  assert(text.includes(`## ${category}`),`${category}: attribution section missing`);
  const pool=Array.isArray(entry.pool)&&entry.pool.length?entry.pool:[entry];
  const seen=new Set();
  for(const asset of pool){
    const source=clean(asset.sourcePage),title=clean(asset.sourceTitle),author=clean(asset.author),license=clean(asset.license);
    const key=source||clean(asset.assetId);
    if(!key||seen.has(key))continue;
    seen.add(key);
    assert(title,`${category}: sourceTitle missing`);
    assert(author,`${category}: author missing`);
    assert(source.startsWith('https://commons.wikimedia.org/wiki/File:'),`${category}: Commons sourcePage missing`);
    assert(licenseUrls[license],`${category}: unsupported attribution license ${license}`);
    for(const token of [title,author,license,source,licenseUrls[license]])assert(text.includes(token),`${category}: public attribution missing ${token}`);
    total++;
  }
}
assert(total>0,'Hero attribution has no credited assets');
assert(text.includes(`Total credited Hero pool assets: **${total}**.`),'credited asset total mismatch');
console.log(`Motorsport Hub public Hero attribution validation: PASS (${total} assets)`);
