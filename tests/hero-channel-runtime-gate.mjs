import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const router=fs.readFileSync(path.join(root,'motorsport-hub.js'),'utf8');
const modules=['f1-widget-flat-v1000.js','wec-widget-flat-v1000.js','wrc-widget-flat-v1000.js','supergt-widget-flat-v1000.js','motogp-widget-flat-v1000.js','fdj-widget-flat-v1000.js','d1gp-widget-flat-v1000.js','superformula-widget.js','indycar-widget.js','nascar-widget.js','gtwc-europe-widget.js'];
assert(router.includes("HERO_CHANNEL_BRANCH='hero-live'"));
assert(router.includes('HERO_CHANNEL_TTL=6*3600000'));
assert(router.includes('hero-channel/channel.json')||router.includes("${HERO_CHANNEL_BASE}/channel.json"));
assert(router.includes('loadHeroChannelImage(selected)'));
assert(router.includes('__MH_HERO_OVERRIDE_IMAGE=hi'));
assert(router.includes("cat==='DAKAR'||cat==='QA'"),'Dakar/QA must remain on their dedicated runtime paths');
assert(router.includes("startsWith(`${HERO_CHANNEL_BASE}/assets/${cat}/`)"),'Hero channel URLs must be repo/branch allowlisted');
assert(router.includes("startsWith('https://commons.wikimedia.org/wiki/File:')"),'Hero channel source provenance must be Commons file page');
assert(router.includes('HERO_CHANNEL_LICENSES'));
assert(router.includes('motorsport-hero-channel-v1-${cat}-${fam}-lkg.jpg'));
assert(!router.includes('Request.prototype.loadString='));
for(const name of modules){
 const src=fs.readFileSync(path.join(root,name),'utf8');
 assert.equal((src.match(/__MH_HERO_OVERRIDE_IMAGE/g)||[]).length,1,`${name}: dynamic Hero hook missing/drifted`);
 assert(src.indexOf('__MH_HERO_OVERRIDE_IMAGE')>src.indexOf('async function hero('),`${name}: hook must live inside hero()`);
}
const dakar=fs.readFileSync(path.join(root,'dakar-widget.js'),'utf8');
assert.equal((dakar.match(/__MH_HERO_OVERRIDE_IMAGE/g)||[]).length,0,'Dakar dedicated multi-Hero runtime must not be overridden by generic channel');
console.log('Motorsport Hub Hero channel runtime gate: PASS');
