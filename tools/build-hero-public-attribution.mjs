import fs from 'node:fs';
import path from 'node:path';

const arg=(name,fallback='')=>{const p=process.argv.find(x=>x.startsWith(`--${name}=`));return p?p.slice(name.length+3):fallback};
const channelPath=path.resolve(arg('channel','hero-channel/channel.json'));
const outputPath=path.resolve(arg('output','hero-channel/ATTRIBUTION.md'));

const licenseUrls={
  'CC BY 2.0':'https://creativecommons.org/licenses/by/2.0/',
  'CC BY 4.0':'https://creativecommons.org/licenses/by/4.0/',
  'CC BY-SA 2.0':'https://creativecommons.org/licenses/by-sa/2.0/',
  'CC BY-SA 3.0':'https://creativecommons.org/licenses/by-sa/3.0/',
  'CC BY-SA 4.0':'https://creativecommons.org/licenses/by-sa/4.0/',
  'CC0 1.0':'https://creativecommons.org/publicdomain/zero/1.0/'
};
const clean=v=>String(v??'').replace(/[\r\n\t]+/g,' ').replace(/\s+/g,' ').trim();
const channel=JSON.parse(fs.readFileSync(channelPath,'utf8'));
if(channel?.schemaVersion!==1||!channel.categories||typeof channel.categories!=='object')throw Error('invalid Hero channel');

const lines=[
  '# Motorsport Hub — Live Hero Attribution',
  '',
  `Generated from \`hero-live/hero-channel/channel.json\` at ${clean(channel.generatedAt)||'unknown time'}.`,
  '',
  'This file is generated from the currently publishable Hero pool. It is the human-readable attribution surface for dynamic Hero imagery and should travel with public distribution links.',
  '',
  '**Changes made by Motorsport Hub:** source photographs may be cropped, resized/downscaled, recomposed into contained derivatives for Large widgets, and displayed with runtime dark overlays/gradients for text readability. Rotation between approved pool assets does not imply endorsement by the original creator.',
  '',
  'The software license for Motorsport Hub is separate from the image licenses listed below.',
  ''
];
let total=0;
for(const [category,entry] of Object.entries(channel.categories).sort(([a],[b])=>a.localeCompare(b))){
  const pool=Array.isArray(entry.pool)&&entry.pool.length?entry.pool:[entry];
  const seen=new Set(),assets=[];
  for(const asset of pool){
    const key=clean(asset.sourcePage)||clean(asset.assetId);
    if(!key||seen.has(key))continue;
    seen.add(key);assets.push(asset);
  }
  lines.push(`## ${category}`,'');
  for(const asset of assets){
    const current=asset.assetId===entry.assetId;
    const title=clean(asset.sourceTitle),author=clean(asset.author),license=clean(asset.license),source=clean(asset.sourcePage),licenseUrl=licenseUrls[license]||'';
    lines.push(`### ${current?'Current live':'Approved pool'} — ${title||clean(asset.assetId)}`,'');
    lines.push(`- Author: ${author||'UNKNOWN'}`);
    lines.push(`- License: ${licenseUrl?`[${license}](${licenseUrl})`:license||'UNKNOWN'}`);
    lines.push(`- Source: ${source?`<${source}>`:'UNKNOWN'}`);
    lines.push('- Modifications: crop/resize and presentation treatment as described above.','');
    total++;
  }
}
lines.push('---','',`Total credited Hero pool assets: **${total}**.`,'');
fs.mkdirSync(path.dirname(outputPath),{recursive:true});
fs.writeFileSync(outputPath,lines.join('\n'),'utf8');
console.log(`Motorsport Hub live Hero attribution generated: ${total} assets -> ${outputPath}`);
