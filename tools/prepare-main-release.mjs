import fs from 'node:fs';
import path from 'node:path';
import {execFileSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const args=new Set(process.argv.slice(2));
const write=args.has('--write');
const statusArg=process.argv.find(x=>x.startsWith('--status='));
const targetStatus=(statusArg?statusArg.slice('--status='.length):'RELEASE_CANDIDATE').trim();
const allowedStatuses=new Set(['RELEASE_CANDIDATE','RELEASED']);
if(!allowedStatuses.has(targetStatus)) throw new Error(`Unsupported --status: ${targetStatus}`);

const currentBranch=()=>String(process.env.GITHUB_REF_NAME||execFileSync('git',['rev-parse','--abbrev-ref','HEAD'],{cwd:root,encoding:'utf8'})).trim();
if(write){
  if(targetStatus!=='RELEASED') throw new Error('--write requires --status=RELEASED; RC dry-run must remain non-mutating');
  const branch=currentBranch();
  if(!branch.startsWith('release/')) throw new Error(`--write is restricted to a dedicated release/* branch; current branch: ${branch}`);
}

const routerPath=path.join(root,'motorsport-hub.js');
const registryPath=path.join(root,'category-registry.json');
const routerBefore=fs.readFileSync(routerPath,'utf8');
const registryBefore=JSON.parse(fs.readFileSync(registryPath,'utf8'));

const hardeningDefault="const SOURCE_REF=String(globalThis.__MH_SOURCE_REF||'hardening-live');";
const mainDefault="const SOURCE_REF=String(globalThis.__MH_SOURCE_REF||'main');";
if(!routerBefore.includes(hardeningDefault)&&!routerBefore.includes(mainDefault)) throw new Error('Router source default contract not recognized');
const routerAfter=routerBefore.includes(hardeningDefault)?routerBefore.replace(hardeningDefault,mainDefault):routerBefore;
if(!routerAfter.includes(mainDefault)) throw new Error('Main Router default not produced');
if((routerAfter.match(/const SOURCE_REF=/g)||[]).length!==1) throw new Error('Router SOURCE_REF declaration drift');

if(registryBefore.schemaVersion!==1||registryBefore.routerSchema!==5) throw new Error('Registry schema drift');
if(!Array.isArray(registryBefore.categories)||registryBefore.categories.length!==12) throw new Error('Registry must contain 12 categories');
const ids=registryBefore.categories.map(x=>x.id);
const expected=['F1','WEC','WRC','SUPERGT','MOTOGP','FDJ','D1GP','SUPERFORMULA','INDYCAR','NASCAR','GTWCEU','DAKAR'];
if(JSON.stringify(ids)!==JSON.stringify(expected)) throw new Error('Registry category order/set drift');
const supergt=registryBefore.categories.find(x=>x.id==='SUPERGT');
if(supergt?.moduleCacheKey!=='supergt-flat-v1003') throw new Error('SUPER GT cache-key release contract drift');
const registryAfter=structuredClone(registryBefore);
for(const c of registryAfter.categories)c.releaseStatus=targetStatus;
registryAfter.qa={...registryAfter.qa,releaseStatus:targetStatus};

const manifest=(routerAfter.match(/MH_CATEGORY_MANIFEST=([^\n]+)/)||[])[1]||'';
if(manifest!=='F1,WEC,WRC,SUPERGT,MOTOGP,FDJ,D1GP,SUPERFORMULA,INDYCAR,NASCAR,GTWCEU,DAKAR,QA') throw new Error('Router manifest drift');
for(const c of registryAfter.categories){
  if(!routerAfter.includes(c.module)) throw new Error(`Router missing ${c.module}`);
  if(c.dataCacheSchema!==1) throw new Error(`${c.id}: data cache schema drift`);
  if(c.releaseStatus!==targetStatus) throw new Error(`${c.id}: release status transform failed`);
}
if(registryAfter.qa.releaseStatus!==targetStatus) throw new Error('QA release status transform failed');

const changed=[];
if(routerAfter!==routerBefore)changed.push('motorsport-hub.js');
if(JSON.stringify(registryAfter)!==JSON.stringify(registryBefore))changed.push('category-registry.json');

if(write){
  fs.writeFileSync(routerPath,routerAfter);
  fs.writeFileSync(registryPath,JSON.stringify(registryAfter)+'\n');
  console.log(`Main release finalizer wrote on ${currentBranch()}: ${changed.join(', ')||'no changes'}`);
}else{
  console.log(JSON.stringify({mode:'DRY_RUN',targetStatus,changed,routerDefault:'main',categories:registryAfter.categories.length,qa:true,supergtCacheKey:supergt.moduleCacheKey}));
}
