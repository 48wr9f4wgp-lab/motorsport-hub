import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {fileURLToPath} from 'node:url';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const arg=(name,fallback)=>{const p=process.argv.find(x=>x.startsWith(`--${name}=`));return p?p.slice(name.length+3):fallback};
const artifactRoot=path.resolve(arg('artifacts',path.join(root,'refresh-artifacts')));
const outputDir=path.resolve(arg('output-dir',path.join(root,'hero-channel-candidate')));
const previousDir=path.resolve(arg('previous-dir',path.join(root,'hero-channel-previous')));
const currentYear=new Date().getUTCFullYear(),now=Date.now(),nowIso=new Date(now).toISOString();
const categories=['F1','WEC','WRC','SUPERGT','MOTOGP','FDJ','D1GP','SUPERFORMULA','INDYCAR','NASCAR','GTWCEU','DAKAR'];
const minScore=.72,minDetection=.55,minSmallSubject=.14,minMediumSubject=.10,minTextSafeFamily=.65,minAverageTextSafe=.68,minLkgQualityGain=.02;
const poolInitialMinScore=.88,poolMaxQualityDrop=.03,poolMaxSize=5,recentHistorySize=2,rotationMinAgeMs=48*3600000,rotationReuseCooldownMs=48*3600000;
const sha=v=>crypto.createHash('sha256').update(v).digest('hex');
const slug=v=>String(v||'').replace(/^File:/,'').replace(/[^A-Za-z0-9._-]+/g,'-').replace(/^-+|-+$/g,'').slice(0,52)||'hero';
const readJSON=p=>{try{return JSON.parse(fs.readFileSync(p,'utf8'))}catch(_){return null}};
const sourceRules=readJSON(path.join(root,'hero-refresh-sources.json'))||{};
const fold=v=>String(v||'').normalize('NFKD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[_-]+/g,' ').replace(/\s+/g,' ').trim();
const forbiddenTerms=category=>[...(Array.isArray(sourceRules.globalForbiddenContext)?sourceRules.globalForbiddenContext:[]),...(Array.isArray(sourceRules.relevance?.[category]?.forbiddenAny)?sourceRules.relevance[category].forbiddenAny:[])].map(fold).filter(Boolean);
const assetForbidden=(asset,category)=>{const text=fold(asset?.sourceTitle||'');return !!text&&forbiddenTerms(category).some(t=>text.includes(t));};
const parseDate=v=>{const t=Date.parse(String(v||''));return Number.isFinite(t)?t:0};
const clamp01=v=>Math.max(0,Math.min(1,Number(v)||0));
const coreAsset=e=>e?{category:e.category,assetId:e.assetId,version:e.version,sourcePage:e.sourcePage,sourceTitle:e.sourceTitle,author:e.author,license:e.license,sourceYear:e.sourceYear,sourceDate:e.sourceDate,role:e.role,qualityScore:Number(e.qualityScore),images:e.images,addedAt:e.addedAt||e.promotedAt||nowIso,lastShownAt:e.lastShownAt||e.lastRotatedAt||e.promotedAt||null}:null;
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
 if(row.status!=='VISUAL_REVIEW_CANDIDATE'||!row.derivatives||!role||!rr?.small||!rr?.medium)return false;
 if(Number(meta.sourceYear)<currentYear-1)return false;
 if(Number(row.selectedDetection?.score)<minDetection)return false;
 if(Number(rr.small.subjectFraction)<minSmallSubject||Number(rr.medium.subjectFraction)<minMediumSubject)return false;
 const s=Number(rr.small.effectiveTextSafeScore??rr.small.textSafeScore),m=Number(rr.medium.effectiveTextSafeScore??rr.medium.textSafeScore);
 if(s<minTextSafeFamily||m<minTextSafeFamily||(s+m)/2+1e-9<minAverageTextSafe)return false;
 return quality(row,role,meta)>=minScore;
}
function artifactDirs(){if(!fs.existsSync(artifactRoot))return[];return fs.readdirSync(artifactRoot,{withFileTypes:true}).filter(x=>x.isDirectory()&&x.name.startsWith('hero-refresh-')).map(x=>path.join(artifactRoot,x.name));}
function categoryFromDir(p){const n=path.basename(p);for(const c of categories)if(n===`hero-refresh-${c}`||n.startsWith(`hero-refresh-${c}-`))return c;return null}
function candidatesForDir(dir){
 const discovery=readJSON(path.join(dir,'hero-discovery-report.json')),subject=readJSON(path.join(dir,'hero-subject-report.json'));if(!discovery||!subject)return[];
 const metaByTitle=new Map((discovery.candidates||[]).filter(x=>x.eligibleForReview).map(x=>[x.title,x])),rows=[];
 for(const row of subject.results||[]){const meta=metaByTitle.get(row.title);if(!meta||!eligible(row,meta))continue;rows.push({row,meta,q:quality(row,row.recommendedRole,meta)})}
 return rows.sort((a,b)=>b.q-a.q||(parseDate(b.meta.dateRaw)-parseDate(a.meta.dateRaw))||a.row.title.localeCompare(b.row.title));
}
function copyTree(src,dst){if(!fs.existsSync(src))return;fs.mkdirSync(dst,{recursive:true});for(const e of fs.readdirSync(src,{withFileTypes:true})){const a=path.join(src,e.name),b=path.join(dst,e.name);if(e.isDirectory())copyTree(a,b);else fs.copyFileSync(a,b)}}
function assetFromCandidate(dir,category,item,existing=null){
 const {row,meta,q}=item,smallSrc=path.join(dir,row.derivatives.small.path),mediumSrc=path.join(dir,row.derivatives.medium.path);if(!fs.existsSync(smallSrc)||!fs.existsSync(mediumSrc))return null;
 const assetId=`auto-${sha(meta.sourcePage).slice(0,12)}-${slug(row.title)}`,catDir=path.join(outputDir,'assets',category);fs.mkdirSync(catDir,{recursive:true});
 const smallName=`${assetId}-small.jpg`,mediumName=`${assetId}-medium.jpg`,smallDst=path.join(catDir,smallName),mediumDst=path.join(catDir,mediumName);fs.copyFileSync(smallSrc,smallDst);fs.copyFileSync(mediumSrc,mediumDst);
 const version=sha(Buffer.concat([fs.readFileSync(smallDst),fs.readFileSync(mediumDst)])).slice(0,16),base=`https://raw.githubusercontent.com/48wr9f4wgp-lab/motorsport-hub/hero-live/hero-channel/assets/${category}`;
 return {category,assetId,version,sourcePage:meta.sourcePage,sourceTitle:meta.title,author:meta.author,license:meta.license,sourceYear:meta.sourceYear,sourceDate:meta.dateRaw,role:row.recommendedRole,qualityScore:Number(q.toFixed(4)),addedAt:existing?.addedAt||nowIso,lastShownAt:existing?.lastShownAt||null,images:{small:{url:`${base}/${smallName}`,width:720,height:720},medium:{url:`${base}/${mediumName}`,width:1380,height:640}}};
}
function dedupePool(items){const seenAssets=new Set(),seenPages=new Set(),out=[];for(const x of items){if(!x?.assetId||seenAssets.has(x.assetId)||seenPages.has(x.sourcePage))continue;seenAssets.add(x.assetId);seenPages.add(x.sourcePage);out.push(x)}return out}
function rankPool(pool,liveId){const live=pool.find(x=>x.assetId===liveId)||null,rest=pool.filter(x=>x.assetId!==liveId).sort((a,b)=>Number(b.qualityScore)-Number(a.qualityScore)||(parseDate(b.sourceDate)-parseDate(a.sourceDate)));return live?[live,...rest].slice(0,poolMaxSize):rest.slice(0,poolMaxSize)}
function pruneAssets(category,entry){const dir=path.join(outputDir,'assets',category);if(!fs.existsSync(dir))return;const refs=new Set();for(const a of [coreAsset(entry),...(entry.pool||[])])for(const f of ['small','medium']){const u=a?.images?.[f]?.url;if(u)refs.add(path.basename(new URL(u).pathname))}for(const n of fs.readdirSync(dir))if(/\.jpg$/i.test(n)&&!refs.has(n))fs.rmSync(path.join(dir,n),{force:true});}
function liveFromPool(prev,asset,pool,mode){return {...asset,promotedAt:nowIso,lastRotatedAt:nowIso,pool:pool.map(x=>({...x,lastShownAt:x.assetId===asset.assetId?nowIso:x.lastShownAt||null})),recentAssetIds:[prev?.assetId,...(prev?.recentAssetIds||[])].filter(Boolean).filter((x,i,a)=>x!==asset.assetId&&a.indexOf(x)===i).slice(0,recentHistorySize),rotationMode:mode};}

fs.rmSync(outputDir,{recursive:true,force:true});fs.mkdirSync(outputDir,{recursive:true});copyTree(previousDir,outputDir);
const previous=readJSON(path.join(previousDir,'channel.json'))||{schemaVersion:1,generatedAt:null,categories:{}};
const next={schemaVersion:1,generatedAt:previous.generatedAt||new Date(0).toISOString(),publicationPolicy:'CI_GATED_LIVE_HERO_CHANNEL',categories:{...(previous.categories||{})}};
const promoted=[],promotionModes={},poolUpdated=[],updatedCategories=[];
for(const dir of artifactDirs()){
 const category=categoryFromDir(dir);if(!category)continue;const rows=candidatesForDir(dir);
 const rawPrev=next.categories[category]||null,prevForbidden=!!(rawPrev&&assetForbidden(rawPrev,category));
 const prevQuality=Number(rawPrev?.qualityScore),liveId=rawPrev?.assetId||null;
 const rawPriorPool=Array.isArray(rawPrev?.pool)&&rawPrev.pool.length?rawPrev.pool.map(coreAsset):(rawPrev?[coreAsset(rawPrev)]:[]);
 const priorPool=rawPriorPool.filter(x=>!assetForbidden(x,category)),sanitizedPool=priorPool.length!==rawPriorPool.length;
 let pool=priorPool.filter(x=>!rawPrev||prevForbidden||x.assetId===liveId||Number(x.qualityScore)>=Math.max(minScore,prevQuality-poolMaxQualityDrop));
 const beforePool=JSON.stringify(pool.map(x=>[x.assetId,x.version,x.lastShownAt]));
 for(const item of rows){if(assetForbidden({sourceTitle:item.meta.title},category))continue;const threshold=rawPrev&&!prevForbidden?Math.max(minScore,prevQuality-poolMaxQualityDrop):poolInitialMinScore;if(item.q<threshold)continue;const existing=pool.find(x=>x.sourcePage===item.meta.sourcePage||x.assetId===`auto-${sha(item.meta.sourcePage).slice(0,12)}-${slug(item.row.title)}`);const asset=assetFromCandidate(dir,category,item,existing);if(asset)pool.push(asset)}
 pool=rankPool(dedupePool(pool),prevForbidden?null:liveId);
 if(rawPrev&&!prevForbidden&&liveId&&!pool.some(x=>x.assetId===liveId))pool=rankPool([coreAsset(rawPrev),...pool],liveId);
 const afterPool=JSON.stringify(pool.map(x=>[x.assetId,x.version,x.lastShownAt]));
 let mode=null,selected=null;
 if(prevForbidden){selected=pool.filter(x=>Number(x.qualityScore)>=poolInitialMinScore).sort((a,b)=>Number(b.qualityScore)-Number(a.qualityScore)||(parseDate(b.sourceDate)-parseDate(a.sourceDate)))[0]||null;if(selected)mode='POLICY_REPAIR'}
 else if(!rawPrev){selected=pool.find(x=>Number(x.qualityScore)>=poolInitialMinScore)||null;if(selected)mode='INITIAL'}
 else{
  selected=pool.filter(x=>x.assetId!==liveId&&Number(x.qualityScore)>=prevQuality+minLkgQualityGain).sort((a,b)=>Number(b.qualityScore)-Number(a.qualityScore))[0]||null;if(selected)mode='QUALITY_UPGRADE';
  if(!selected){const last=parseDate(rawPrev.lastRotatedAt)||parseDate(rawPrev.promotedAt)||parseDate(rawPrev.sourceDate);if(now-last>=rotationMinAgeMs){selected=pool.filter(x=>x.assetId!==liveId&&Number(x.qualityScore)>=Math.max(minScore,prevQuality-poolMaxQualityDrop)&&(!parseDate(x.lastShownAt)||now-parseDate(x.lastShownAt)>=rotationReuseCooldownMs)).sort((a,b)=>Number(b.qualityScore)-Number(a.qualityScore)||(parseDate(b.sourceDate)-parseDate(a.sourceDate)))[0]||null;if(selected)mode='POOL_ROTATION';}}
 }
 if(selected){const live=liveFromPool(rawPrev,selected,pool,mode);next.categories[category]=live;promoted.push(category);promotionModes[category]=mode;updatedCategories.push(category)}
 else if(rawPrev){
  if(prevForbidden){next.categories[category]=rawPrev;}
  else{const migrated={...rawPrev,pool,recentAssetIds:Array.isArray(rawPrev.recentAssetIds)?rawPrev.recentAssetIds.slice(0,recentHistorySize):[],lastRotatedAt:rawPrev.lastRotatedAt||rawPrev.promotedAt||rawPrev.sourceDate||null};next.categories[category]=migrated;if(sanitizedPool||beforePool!==afterPool||!Array.isArray(rawPrev.pool)){poolUpdated.push(category);updatedCategories.push(category)}}
 }
 if(next.categories[category])pruneAssets(category,next.categories[category]);
}
const uniqUpdated=[...new Set(updatedCategories)];if(uniqUpdated.length)next.generatedAt=nowIso;
fs.writeFileSync(path.join(outputDir,'channel.json'),JSON.stringify(next,null,2)+'\n');
fs.writeFileSync(path.join(outputDir,'promotion-report.json'),JSON.stringify({schemaVersion:1,generatedAt:nowIso,thresholds:{minScore,minDetection,minSmallSubject,minMediumSubject,minTextSafeFamily,minAverageTextSafe,minLkgQualityGain,poolInitialMinScore,poolMaxQualityDrop,poolMaxSize,recentHistorySize,rotationMinAgeHours:rotationMinAgeMs/3600000,rotationReuseCooldownHours:rotationReuseCooldownMs/3600000},promoted,promotionModes,poolUpdated:[...new Set(poolUpdated)],updatedCategories:uniqUpdated,categories:Object.fromEntries(Object.entries(next.categories).map(([k,v])=>[k,{assetId:v.assetId,qualityScore:v.qualityScore,poolSize:Array.isArray(v.pool)?v.pool.length:0,sourceTitle:v.sourceTitle,rotationMode:v.rotationMode||null}]))},null,2)+'\n');
console.log(JSON.stringify({promoted,promotionModes,poolUpdated:[...new Set(poolUpdated)],updatedCategories:uniqUpdated,totalLive:Object.keys(next.categories).length}));
