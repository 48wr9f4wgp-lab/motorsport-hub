import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {fileURLToPath} from 'node:url';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const arg=(name,fallback)=>{const p=process.argv.find(x=>x.startsWith(`--${name}=`));return p?p.slice(name.length+3):fallback};
const enabled=new Set(['F1','WEC']);
const base='https://raw.githubusercontent.com/48wr9f4wgp-lab/motorsport-hub/hero-live/hero-channel/assets';
const readJSON=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const sha=v=>crypto.createHash('sha256').update(v).digest('hex');
const categoryFromDir=p=>{const n=path.basename(p);for(const c of enabled)if(n===`hero-refresh-${c}`||n.startsWith(`hero-refresh-${c}-`))return c;return null};

function evidenceMap(artifactRoot){
 const out=new Map();if(!fs.existsSync(artifactRoot))return out;
 for(const ent of fs.readdirSync(artifactRoot,{withFileTypes:true})){
  if(!ent.isDirectory())continue;const dir=path.join(artifactRoot,ent.name),category=categoryFromDir(dir);if(!category)continue;
  const reportPath=path.join(dir,'hero-subject-report.json');if(!fs.existsSync(reportPath))continue;
  const report=readJSON(reportPath);
  for(const row of report.results||[]){
   const large=row?.derivatives?.large;if(!large?.path||!row.sourcePage)continue;
   const repoPath=path.resolve(root,large.path),artifactPath=path.join(dir,large.path),actual=fs.existsSync(artifactPath)?artifactPath:(fs.existsSync(repoPath)?repoPath:null);
   if(!actual)continue;
   out.set(`${category}|${row.sourcePage}`,{category,sourcePage:row.sourcePage,path:actual,width:Number(large.width)||1600,height:Number(large.height)||1600,layoutMode:large.layoutMode||'CONTAINED_SOURCE'});
  }
 }
 return out;
}
function recomputeVersion(candidateDir,category,asset){
 const chunks=[];for(const family of ['small','medium','large']){const u=asset.images?.[family]?.url;if(!u)continue;const p=path.join(candidateDir,'assets',category,path.basename(new URL(u).pathname));if(fs.existsSync(p))chunks.push(fs.readFileSync(p));}
 if(chunks.length<2)return asset.version;return sha(Buffer.concat(chunks)).slice(0,16);
}
function addUnique(arr,v){if(!arr.includes(v))arr.push(v)}

export function augmentLargeVariants({artifactRoot,candidateDir}){
 const evidence=evidenceMap(artifactRoot),channelPath=path.join(candidateDir,'channel.json'),reportPath=path.join(candidateDir,'promotion-report.json');
 if(!fs.existsSync(channelPath)||!fs.existsSync(reportPath))throw Error('HERO_CHANNEL_CANDIDATE_MISSING');
 const channel=readJSON(channelPath),report=readJSON(reportPath),promoted=new Set(report.promoted||[]);let added=0;
 report.poolUpdated=Array.isArray(report.poolUpdated)?report.poolUpdated:[];report.updatedCategories=Array.isArray(report.updatedCategories)?report.updatedCategories:[];
 for(const category of enabled){const live=channel.categories?.[category];if(!live)continue;let categoryChanged=false;
  for(const asset of live.pool||[]){const ev=evidence.get(`${category}|${asset.sourcePage}`);if(!ev)continue;const dir=path.join(candidateDir,'assets',category);fs.mkdirSync(dir,{recursive:true});const name=`${asset.assetId}-large.jpg`,dst=path.join(dir,name);fs.copyFileSync(ev.path,dst);asset.images={...(asset.images||{}),large:{url:`${base}/${category}/${name}`,width:ev.width,height:ev.height,layoutMode:ev.layoutMode}};asset.version=recomputeVersion(candidateDir,category,asset);categoryChanged=true;added++;
   if(promoted.has(category)&&asset.assetId===live.assetId){live.images=asset.images;live.version=asset.version;}
  }
  if(categoryChanged&&!promoted.has(category)){addUnique(report.poolUpdated,category);addUnique(report.updatedCategories,category);}
 }
 fs.writeFileSync(channelPath,JSON.stringify(channel,null,2)+'\n');fs.writeFileSync(reportPath,JSON.stringify(report,null,2)+'\n');return{added,categories:[...new Set(report.updatedCategories||[])]};
}

if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){
 const artifactRoot=path.resolve(arg('artifacts',path.join(root,'refresh-artifacts'))),candidateDir=path.resolve(arg('candidate',path.join(root,'hero-channel-candidate')));console.log(JSON.stringify(augmentLargeVariants({artifactRoot,candidateDir})));
}
