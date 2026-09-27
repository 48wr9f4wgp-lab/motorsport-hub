import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');

for(const p of ['README.md','INSTALL.md','SUPPORT.md','PRIVACY.md','GA_READINESS.md','GA_LAUNCH_CHECKLIST.md','LICENSE_DECISION.md','LICENSE_SCOPE.md','LICENSE','CLUB_PULSE_MIGRATION.md','CHANGELOG.md','ATTRIBUTION.md','.github/ISSUE_TEMPLATE/bug_report.yml']){
  assert(fs.existsSync(path.join(root,p)),`${p} missing`);
}

const license=read('LICENSE');
assert(license.includes('Mozilla Public License Version 2.0'),'root LICENSE must contain MPL-2.0');
assert(license.includes('Exhibit A - Source Code Form License Notice'),'MPL-2.0 standard text incomplete');

const scope=read('LICENSE_SCOPE.md');
assert(scope.includes('Mozilla Public License 2.0 (MPL-2.0)'),'license scope must identify MPL-2.0');
assert(scope.includes('not relicensed under MPL-2.0'),'license scope must exclude third-party Hero relicensing');
assert(scope.includes('ATTRIBUTION.md'),'license scope must point to third-party attribution');

const readme=read('README.md');
assert(readme.includes('v9.5.37'),'README must state current Stable v9.5.37');
for(const p of ['INSTALL.md','SUPPORT.md','PRIVACY.md','GA_READINESS.md','GA_LAUNCH_CHECKLIST.md','LICENSE_DECISION.md','LICENSE_SCOPE.md','ATTRIBUTION.md'])assert(readme.includes(p),`README must link ${p}`);
assert(readme.includes('Mozilla Public License 2.0 (MPL-2.0)'),'README must state approved software license');
assert(readme.includes('hero-live/hero-channel/ATTRIBUTION.md'),'README must identify dynamic Hero attribution surface');

const install=read('INSTALL.md');
assert(install.includes('scriptable-loader-v7.js'),'install guide must name canonical Loader v7');
for(const p of ['F1','WEC','WRC','SUPERGT','MOTOGP','FDJ','D1GP','SUPERFORMULA','INDYCAR','NASCAR','GTWCEU','DAKAR','QA'])assert(install.includes(`\`${p}\``),`install guide missing ${p} parameter`);
assert(install.includes('blank widget Parameter currently defaults to F1'),'install guide must document blank-parameter behavior');
assert(install.includes('Mozilla Public License 2.0 (MPL-2.0)'),'install guide must state software license');
assert(install.includes('hero-live/hero-channel/ATTRIBUTION.md'),'install guide must identify dynamic Hero attribution surface');

const support=read('SUPPORT.md');
assert(support.includes('/issues'),'support guide must point to GitHub Issues');
for(const token of ['LIVE','PARSE','NET','更新待ち'])assert(support.includes(token),`support guide missing ${token}`);

const privacy=read('PRIVACY.md');
assert(privacy.includes('no automatic external analytics'),'privacy guide must disclose no automatic external analytics');
assert(privacy.includes('latest 200 events'),'privacy guide must disclose local observability bound');
assert(privacy.includes('user-triggered'),'privacy guide must disclose explicit support export');

const attribution=read('ATTRIBUTION.md');
assert(attribution.includes('hero-live/hero-channel/channel.json'),'attribution must identify the live Hero metadata source of truth');
assert(attribution.includes('hero-live/hero-channel/ATTRIBUTION.md'),'attribution must identify the live human-readable credit surface');
for(const token of ['sourcePage','author','license','Modification notice'])assert(attribution.includes(token),`attribution missing ${token}`);

const licenseDecision=read('LICENSE_DECISION.md');
assert(licenseDecision.includes('APPROVED: Mozilla Public License 2.0 (MPL-2.0)'),'license decision must record owner approval');
assert(licenseDecision.includes('Club Pulse separation requirement'),'license decision must retain safe migration requirement');

const migration=read('CLUB_PULSE_MIGRATION.md');
assert(migration.includes('DO NOT MERGE REMOVAL UNTIL DESTINATION REPOSITORY IS VERIFIED'),'migration must fail closed before destructive cutover');
assert(migration.includes('9e869fdae85e9ee352234b925c733065eb7c24fd'),'migration must pin exact source snapshot');

const ga=read('GA_READINESS.md');
for(const token of ['PUBLIC_DISTRIBUTION_DECISION: NO','OWNER-ONLY / PERSONAL USE: LOCKED','Private-operation migration'])assert(ga.includes(token),`distribution readiness missing ${token}`);

const launch=read('GA_LAUNCH_CHECKLIST.md');
for(const token of ['Owner-only / personal-use direction selected','Public Broad GA intent withdrawn','Private transition gate'])assert(launch.includes(token),`distribution checklist missing ${token}`);

const changelog=read('CHANGELOG.md');
assert(changelog.includes('v9.5.37'),'changelog must include current Stable');

assert(!fs.existsSync(path.join(root,'scriptable')),'Club Pulse product tree must be absent from product-pure Motorsport Hub candidate');
assert(!fs.existsSync(path.join(root,'.github/workflows/club-pulse-contract.yml')),'Club Pulse workflow must be absent from product-pure Motorsport Hub candidate');

console.log('Motorsport Hub public GA documentation gate: PASS');
