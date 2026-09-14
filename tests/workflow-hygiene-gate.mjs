import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');

const hardening=read('.github/workflows/hardening-ci.yml');
assert(/permissions:\s*\n\s*contents:\s*read/.test(hardening),'Hardening CI must be read-only');
assert(!hardening.includes("hardening/v9.3-codex-handoff"),'Hardening CI must not retain v9.3 branch-specific mutation logic');
assert(!hardening.includes('git push origin HEAD:hardening-live'),'Hardening CI must not mutate hardening-live');
assert(!hardening.includes('Apply accepted Hero runtime crops once'),'legacy one-shot Hero applicator must not run from current Hardening CI');
assert(!hardening.includes('tests/hardening-live-source-gate.mjs'),'historical hardening-live source gate must not be part of current validation');

const rc=read('.github/workflows/release-candidate-ci.yml');
assert(/permissions:\s*\n\s*contents:\s*read/.test(rc),'Release Candidate CI must remain read-only');
assert(!rc.includes('git push origin'),'Release Candidate CI must not push repository refs');

const heroAttr=read('.github/workflows/hero-public-attribution.yml');
assert(/permissions:\s*\n\s*contents:\s*read/.test(heroAttr),'Hero attribution workflow default permission must be read-only');
assert(/publish-attribution:[\s\S]*?permissions:\s*\n\s*contents:\s*write/.test(heroAttr),'Hero attribution publisher job must scope its write permission explicitly');
assert(heroAttr.includes('git -C hero-live-worktree add hero-channel/ATTRIBUTION.md'),'Hero attribution publisher may stage only the generated attribution file');
assert(heroAttr.includes('git -C hero-live-worktree push origin HEAD:hero-live'),'Hero attribution publisher must target hero-live only');
assert(!heroAttr.includes('git add -A'),'Hero attribution publisher must not stage arbitrary repository changes');
assert(!heroAttr.includes('release-channel.json'),'Hero attribution publisher must not touch Stable descriptor state');

assert(!fs.existsSync(path.join(root,'.github/workflows/wrc-ogier-source-fix.yml')),'obsolete WRC one-shot write workflow must stay removed');

console.log('Motorsport Hub workflow hygiene gate: PASS');
