import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');

for(const p of ['README.md','INSTALL.md','SUPPORT.md','PRIVACY.md','GA_READINESS.md','CHANGELOG.md','ATTRIBUTION.md','.github/ISSUE_TEMPLATE/bug_report.yml']){
  assert(fs.existsSync(path.join(root,p)),`${p} missing`);
}

const readme=read('README.md');
assert(readme.includes('v9.5.29'),'README must state current Stable v9.5.29');
assert(!readme.includes('Current stable channel: **v9.5.24'),'README still advertises obsolete Stable v9.5.24');
for(const p of ['INSTALL.md','SUPPORT.md','PRIVACY.md','GA_READINESS.md','ATTRIBUTION.md'])assert(readme.includes(p),`README must link ${p}`);

const install=read('INSTALL.md');
assert(install.includes('scriptable-loader-v7.js'),'install guide must name canonical Loader v7');
for(const p of ['F1','WEC','WRC','SUPERGT','MOTOGP','FDJ','D1GP','SUPERFORMULA','INDYCAR','NASCAR','GTWCEU','DAKAR','QA'])assert(install.includes(`\`${p}\``),`install guide missing ${p} parameter`);
assert(install.includes('blank widget Parameter currently defaults to F1'),'install guide must document blank-parameter behavior');

const support=read('SUPPORT.md');
assert(support.includes('/issues'),'support guide must point to GitHub Issues');
for(const token of ['LIVE','PARSE','NET','更新待ち'])assert(support.includes(token),`support guide missing ${token}`);

const privacy=read('PRIVACY.md');
assert(privacy.includes('no automatic external analytics'),'privacy guide must disclose no automatic external analytics');
assert(privacy.includes('latest 200 events'),'privacy guide must disclose local observability bound');
assert(privacy.includes('user-triggered'),'privacy guide must disclose explicit support export');

const attribution=read('ATTRIBUTION.md');
assert(attribution.includes('hero-live/hero-channel/channel.json'),'attribution must identify the live Hero metadata source of truth');
for(const token of ['sourcePage','author','license','Modification notice'])assert(attribution.includes(token),`attribution missing ${token}`);
assert(attribution.includes('broad GA distribution'),'attribution must retain final GA compliance review gate');

const ga=read('GA_READINESS.md');
assert(ga.includes('license: null'),'GA readiness must record missing software license');
assert(ga.includes('Broad GA authorization: NOT YET'),'GA readiness must not imply public launch approval');
assert(ga.includes('Stable v9.5.29'),'GA readiness must anchor current Stable');
assert(ga.includes('Hero attribution/compliance'),'GA readiness must retain Hero attribution review');

const changelog=read('CHANGELOG.md');
assert(changelog.includes('v9.5.29'),'changelog must include current Stable');

console.log('Motorsport Hub public GA documentation gate: PASS');
