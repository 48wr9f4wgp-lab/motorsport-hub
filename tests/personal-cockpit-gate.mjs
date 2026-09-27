import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const config=read('motorsport-personal-config.js');
const cockpit=read('motorsport-personal-cockpit.js');
const doc=read('PERSONAL_COCKPIT.md');

new Function(config);
new Function(cockpit);

const categories=['F1','WEC','WRC','SUPERGT','MOTOGP','FDJ','D1GP','SUPERFORMULA','INDYCAR','NASCAR','GTWCEU','DAKAR'];
for(const k of categories){
  assert(config.includes(`'${k}'`),`personal config missing ${k}`);
  assert(cockpit.includes(`${k}:`),`cockpit metadata missing ${k}`);
}
for(const f of [
  'motorsport-data-v1000-f1.json','motorsport-data-v1000-wec.json','motorsport-data-v1000-wrc.json',
  'motorsport-data-v1000-supergt.json','motorsport-data-v1000-motogp.json','motorsport-data-v1000-fdj.json',
  'motorsport-data-v1000-d1gp.json','motorsport-data-v900-superformula.json','motorsport-data-v910-indycar.json',
  'motorsport-data-v920-nascar.json','motorsport-data-v930-gtwceu.json','motorsport-data-v950-dakar.json'
])assert(cockpit.includes(f),`cockpit cache map missing ${f}`);

for(const token of [
  'motorsport-personal-config-v1.json','showViewing','showLeader','showCacheAge','horizonDays'
])assert(config.includes(token)&&cockpit.includes(token),`personal config contract missing ${token}`);

assert(cockpit.includes('motorsport-viewing-jp-'),'cockpit must consume existing viewing-rights cache');
assert(cockpit.includes('No external network requests')||doc.includes('no external network requests'),'cockpit must document local-cache-only behavior');
assert(!/new Request\s*\(/.test(cockpit),'personal cockpit must not add live network requests');
for(const token of ['renderSmall','renderMedium','renderLarge','MY RACE DAY'])assert(cockpit.includes(token),`cockpit rendering missing ${token}`);
for(const token of ['owner-only sidecar','existing category caches','Small / Medium / Large'])assert(doc.includes(token),`personal cockpit doc missing ${token}`);

console.log('Motorsport Hub personal cockpit gate: PASS');
