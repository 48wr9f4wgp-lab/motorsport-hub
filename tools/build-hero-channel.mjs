import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {fileURLToPath} from 'node:url';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const arg=(name,fallback)=>{const p=process.argv.find(x=>x.startsWith(`--${name}=`));return p?p.slice(name.length+3):fallback};
const artifactRoot=path.resolve(arg('artifacts',path.join(root,'refresh-artifacts')));
const outputDir=path.resolve(arg('output-dir',path.join(root,'hero-channel-candidate')));
const previousDir=path.resolve(arg('previous-dir',path.join(root,'hero-channel-previous')));
const currentYear=new Date().getUTCFullYear();
const categories=['F1','WEC','WRC','SUPERGT','MOTOGP','FDJ','D1GP','SUPERFORMULA','INDYCAR','NASCAR','GTWCEU'];
const minScore=0.72,minDetection=.55,minSmallSubject=.14,minMediumSubject=.10,minTextSafe=.68,minLkgQualityGain=.02;
const sha=v=>crypto.createHash('sha256').update(v).digest('hex');
const slug=v=>String(v||'').replace(/^File:/,'').replace(/[^A-Za-z0-9._-]+/g,'-').replace(/^-+|-+$/g,'').slice(0,52)||'hero';
const readJSON=p=>{try{return JSON.parse(fs.readFileSync(p,'utf8'))}catch(_){return null}};
const parseDate=v=>{const t=Date.parse(String(v||''));return Number.isFinite(t)?t:0};
const clamp01=v=>Math.max(0,Math.min(1,Number(v)||0));
function quality(row,role,meta){
 const rr=row.roleResults?.[role];if(!rr?.small||!rr?.medium)return 0;
 const detection=Number(row.selectedDetection?.score)||0;
 const subject=(Number(rr.small.subjectFraction)+Number(rr.medium.subjectFraction))/2;
 const safe=(Number(rr.small.effectiveTextSafeScore??rr.small.textSafeScore)+Number(rr.medium.effectiveTextSafeScore??rr.medium.textSafeScore))/2;
 const sourceYear=Number(meta.sourceYear)||0;
 const recency=sourceYear>=currentYear?1:(sourceYear>=currentYear-1 ? .75 : 0);
 return clamp01(.35*detection+.35*Math.min(1,subject/.30)+.20*safe+.10*recency);
}
function eligible(row,meta){
 const role=row.recommendedRole,rr=row.roleResults?.[role];
 if(row.status!=='VISUAL_REVIEW_CANDIDATE'||!row.derivatives||!role||!rr?.pass)return false;
 if(Number(meta.sourceYear)<currentYear-1)return false;
 if(Number(row.selectedDetection?.score)<minDetection)return false;
 if(Number(rr.small.subjectFraction)<minSmallSubject||Number(rr.medium.subjectFraction)<minMediumSubject)return false;
 if(Number(rr.small.effectiveTextSafeScore??rr.small.textSafeScore)<minTextSafe||Number(rr.medium.effectiveTextSafeScore??rr.medium.textSafeScore)<minTextSafe)return false;
 return quality(row,role,meta)>=minScore;
}
function artifactDirs(){if(!fs.existsSync(artifactRoot))return[];return fs.readdirSync(artifactRoot,{withFileTypes:true}).filter(x=>x.isDirectory()&&x.name.startsWith('hero-refresh-')).map(x=>path.join(artifactRoot,x.name));}
function categoryFromDir(p){const n=path.basename(p);for(const c of categories)if(n===`hero-refresh-${c}`||n.startsWith(`hero-refresh-${c}-`))return c;return null}
function bestForDir(dir,category){
 const discovery=readJSON(path.join(dir,'hero-discovery-report.json')),subject=readJSON(path.join(dir,'hero-subject-report.json'));if(!discovery||!subject)return null;
 const metaByTitle=new Map((discovery.candidates||[]).filter(x=>x.eligibleForReview).map(x=>[x.title,x]));const rows=[];
 for(const row of subject.results||[]){const meta=metaByTitle.get(row.title);if(!meta||!eligible(row,meta))continue;const q=quality(row,row.recommendedRole,meta);rows.push({row,meta,q})}
 rows.sort((a,b)=>b.q-a.q||Number(b.meta.sourceYear||0)-Number(a.meta.sourceYear||0)||a.row.title.localeCompare(b.row.title));return rows[0]||null;
}
function copyTree(src,dst){if(!fs.existsSync(src))return;fs.mkdirSync(dst,{recursive:true});for(const e of fs.readdirSync(src,{withFileTypes:true})){const a=path.join(src,e.name),b=path.join(dst,e.name);if(e.isDirectory())copyTree(a,b);else fs.copyFileSync(a,b)}}
fs.rmSync(outputDir,{recursive:true,force:true});fs.mkdirSync(outputDir,{recursive:true});copyTree(previousDir,outputDir);
const previous=readJSON(path.join(previousDir,'channel.json'))||{schemaVersion:1,generatedAt:null,categories:{}};const next={schemaVersion:1,generatedAt:previous.generatedAt||new Date(0).toISOString(),publicationPolicy:'CI_GATED_LIVE_HERO_CHANNEL',categories:{...(previous.categories||{})}};const promoted=[];
for(const dir of artifactDirs()){
 const category=categoryFromDir(dir);if(!category)continue;const best=bestForDir(dir,category);if(!best)continue;
 const {row,meta,q}=best,prev=next.categories[category];const sourceTime=parseDate(meta.dateRaw)||Date.UTC(Number(meta.sourceYear)||0,0,1),prevTime=parseDate(prev?.sourceDate)||Date.UTC(Number(prev?.sourceYear)||0,0,1);
 if(prev&&sourceTime<=prevTime)continue;
 const prevQuality=Number(prev?.qualityScore);
 if(prev&&Number.isFinite(prevQuality)&&q<prevQuality+minLkgQualityGain)continue;
 const smallSrc=path.join(dir,row.derivatives.small.path),mediumSrc=path.join(dir,row.derivatives.medium.path);if(!fs.existsSync(smallSrc)||!fs.existsSync(mediumSrc))continue;
 const assetId=`auto-${sha(meta.sourcePage).slice(0,12)}-${slug(row.title)}`,catDir=path.join(outputDir,'assets',category);fs.rmSync(catDir,{recursive:true,force:true});fs.mkdirSync(catDir,{recursive:true});
 const smallName=`${assetId}-small.jpg`,mediumName=`${assetId}-medium.jpg`,smallDst=path.join(catDir,smallName),mediumDst=path.join(catDir,mediumName);fs.copyFileSync(smallSrc,smallDst);fs.copyFileSync(mediumSrc,mediumDst);
 const version=sha(Buffer.concat([fs.readFileSync(smallDst),fs.readFileSync(mediumDst)])).slice(0,16),base=`https://raw.githubusercontent.com/48wr9f4wgp-lab/motorsport-hub/hero-live/hero-channel/assets/${category}`;
 next.categories[category]={category,assetId,version,sourcePage:meta.sourcePage,sourceTitle:meta.title,author:meta.author,license:meta.license,sourceYear:meta.sourceYear,sourceDate:meta.dateRaw,role:row.recommendedRole,qualityScore:Number(q.toFixed(4)),promotedAt:new Date().toISOString(),images:{small:{url:`${base}/${smallName}`,width:720,height:720},medium:{url:`${base}/${mediumName}`,width:1380,height:640}}};promoted.push(category);
}
if(promoted.length)next.generatedAt=new Date().toISOString();
fs.writeFileSync(path.join(outputDir,'channel.json'),JSON.stringify(next,null,2)+'\n');
fs.writeFileSync(path.join(outputDir,'promotion-report.json'),JSON.stringify({schemaVersion:1,generatedAt:new Date().toISOString(),thresholds:{minScore,minDetection,minSmallSubject,minMediumSubject,minTextSafe,minLkgQualityGain},promoted,categories:Object.fromEntries(Object.entries(next.categories).map(([k,v])=>[k,{assetId:v.assetId,qualityScore:v.qualityScore,sourceYear:v.sourceYear,sourceTitle:v.sourceTitle}]))},null,2)+'\n');
console.log(JSON.stringify({promoted,totalLive:Object.keys(next.categories).length}));
