import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const tmp=fs.mkdtempSync(path.join(os.tmpdir(),'mh-hero-attr-'));
const channelPath=path.join(tmp,'channel.json'),attributionPath=path.join(tmp,'ATTRIBUTION.md');
const asset=(category,id,title,author,license)=>({category,assetId:id,version:`${id}-v1`,sourcePage:`https://commons.wikimedia.org/wiki/File:${id}.jpg`,sourceTitle:title,author,license,sourceYear:2026,sourceDate:'2026-06-01 12:00:00',role:'IDENTITY',qualityScore:.9,images:{small:{url:`https://raw.githubusercontent.com/48wr9f4wgp-lab/motorsport-hub/hero-live/hero-channel/assets/${category}/${id}-small.jpg`,width:720,height:720},medium:{url:`https://raw.githubusercontent.com/48wr9f4wgp-lab/motorsport-hub/hero-live/hero-channel/assets/${category}/${id}-medium.jpg`,width:1380,height:640}}});
const f1a=asset('F1','f1-a','File:F1 A.jpg','Creator A','CC BY-SA 4.0');
const f1b=asset('F1','f1-b','File:F1 B.jpg','Creator B','CC BY-SA 4.0');
const wrc=asset('WRC','wrc-a','File:WRC A.jpg','Creator C','CC BY 4.0');
const channel={schemaVersion:1,generatedAt:'2026-09-14T02:23:06.396Z',publicationPolicy:'CI_GATED_LIVE_HERO_CHANNEL',categories:{F1:{...f1a,pool:[f1a,f1b],recentAssetIds:[],rotationMode:'POOL_ROTATION'},WRC:{...wrc,pool:[wrc],recentAssetIds:[],rotationMode:'INITIAL'}}};
fs.writeFileSync(channelPath,JSON.stringify(channel,null,2));
execFileSync(process.execPath,[path.join(root,'tools/build-hero-public-attribution.mjs'),`--channel=${channelPath}`,`--output=${attributionPath}`],{cwd:root,stdio:'pipe'});
execFileSync(process.execPath,[path.join(root,'tools/validate-hero-public-attribution.mjs'),`--channel=${channelPath}`,`--attribution=${attributionPath}`],{cwd:root,stdio:'pipe'});
const text=fs.readFileSync(attributionPath,'utf8');
for(const token of ['Creator A','Creator B','Creator C','CC BY-SA 4.0','CC BY 4.0','creativecommons.org/licenses/by-sa/4.0/','creativecommons.org/licenses/by/4.0/','Changes made by Motorsport Hub','Total credited Hero pool assets: **3**.'])assert(text.includes(token),`missing attribution token: ${token}`);
assert.equal((text.match(/https:\/\/commons\.wikimedia\.org\/wiki\/File:/g)||[]).length,3,'each unique pool asset must appear exactly once');

const workflow=fs.readFileSync(path.join(root,'.github/workflows/hero-public-attribution.yml'),'utf8');
for(const token of ["workflows:\n      - 'Motorsport Hub Hero Active Refresh'",'github.event.workflow_run.conclusion == \'success\'','ref: hero-live','build-hero-public-attribution.mjs','validate-hero-public-attribution.mjs','git -C hero-live-worktree add hero-channel/ATTRIBUTION.md','git -C hero-live-worktree push origin HEAD:hero-live'])assert(workflow.includes(token),`Hero attribution workflow contract missing: ${token}`);
assert(!workflow.includes('git add -A'),'attribution publisher must not stage the full Hero channel');
assert(!workflow.includes('release-channel.json'),'attribution publisher must not mutate Stable');

fs.rmSync(tmp,{recursive:true,force:true});
console.log('Motorsport Hub public Hero attribution gate: PASS');
