import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const loader=read('scriptable-loader-v8-private.js');
const router=read('motorsport-hub.js');
const setup=read('motorsport-private-setup.js');
const doc=read('PERSONAL_PRIVATE_RUNTIME.md');

new Function(loader);new Function(router);new Function(setup);

for(const token of [
  "TOKEN_KEY='motorsport-hub-github-token-v1'",
  'Keychain.contains(TOKEN_KEY)',
  'application/vnd.github.raw+json',
  'h.Authorization',
  'Bearer ',
  '__MH_REPO_IO',
  'repoContentURL',
  "repoJSON(CHANNEL_REF,'release-channel.json'",
  'repoText(d.sourceRef,d.router.path'
])assert(loader.includes(token),`Loader v8 private transport missing: ${token}`);

assert(!/github_pat_[A-Za-z0-9_]{8,}/.test(loader),'Loader must not contain a committed GitHub token');
assert(!/github_pat_[A-Za-z0-9_]{8,}/.test(setup),'Setup source must not contain a real GitHub token');

for(const token of ['__MH_REPO_IO','mhRepoText','mhRepoJSON','mhRepoImage','heroRepoPath'])assert(router.includes(token),`Router private transport missing: ${token}`);
assert(router.includes("mhRepoText(SOURCE_REF,VIEWING_FILE"),'viewing rights must use private-capable transport');
assert(router.includes("mhRepoText(SOURCE_REF,route.file"),'category modules must use private-capable transport');
assert(router.includes("mhRepoJSON(HERO_CHANNEL_BRANCH,'hero-channel/channel.json'"),'Hero manifest must use private-capable transport');
assert(router.includes('mhRepoImage(HERO_CHANNEL_BRANCH,hp'),'Hero images must use private-capable transport');

for(const token of ['addSecureTextField','Keychain.set(TOKEN_KEY,token)','Keychain.remove(TOKEN_KEY)','Contents: read + Actions: read'])assert(setup.includes(token),`private setup missing: ${token}`);
for(const token of ['owner-only','Contents: read','Actions: read','private-capable'])assert(doc.toLowerCase().includes(token.toLowerCase()),`private runtime doc missing: ${token}`);

console.log('Motorsport Hub private transport gate: PASS');
