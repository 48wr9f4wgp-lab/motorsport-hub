import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const arg=(name,fallback)=>{const p=process.argv.find(x=>x.startsWith(`--${name}=`));return p?p.slice(name.length+3):fallback};
export const LARGE_HERO_CATEGORIES=new Set(["F1","WEC","WRC","SUPERGT","MOTOGP","FDJ","D1GP","SUPERFORMULA","INDYCAR","NASCAR","GTWCEU","DAKAR"]);
export const LARGE_HERO_SIZE=1600;
export const LARGE_MIN_LONG_EDGE=1800;
export const LARGE_MIN_SHORT_EDGE=900;
export const LARGE_MAX_SUBJECT_AREA=.38;
export const LARGE_MIN_TEXT_SAFE=.68;

const safe=v=>String(v||'hero').replace(/[^A-Za-z0-9._-]+/g,'-').replace(/^-+|-+$/g,'').slice(0,96)||'hero';
const effectiveSafe=r=>Number(r?.medium?.effectiveTextSafeScore??r?.medium?.textSafeScore??0);

export function largeEligibility(row,category){
 const reasons=[];
 if(!LARGE_HERO_CATEGORIES.has(String(category||'')))reasons.push('CATEGORY_NOT_ENABLED');
 if(row?.status!=='VISUAL_REVIEW_CANDIDATE')reasons.push('NOT_VISUAL_REVIEW_CANDIDATE');
 if(!row?.derivatives?.small||!row?.derivatives?.medium)reasons.push('BASE_DERIVATIVES_MISSING');
 const w=Number(row?.image?.width)||0,h=Number(row?.image?.height)||0,long=Math.max(w,h),short=Math.min(w,h);
 if(long<LARGE_MIN_LONG_EDGE||short<LARGE_MIN_SHORT_EDGE)reasons.push('SOURCE_RESOLUTION_TOO_LOW_FOR_LARGE');
 const area=Number(row?.selectedDetection?.areaFraction);
 if(!Number.isFinite(area))reasons.push('SUBJECT_AREA_UNKNOWN');
 else if(area>LARGE_MAX_SUBJECT_AREA)reasons.push('SUBJECT_TOO_CLOSE_FOR_LARGE');
 const role=row?.recommendedRole,rr=role?row?.roleResults?.[role]:null;
 if(!rr||effectiveSafe(rr)<LARGE_MIN_TEXT_SAFE)reasons.push('LARGE_TEXT_SAFE_TOO_LOW');
 if(!String(row?.runtimeUrl||'').startsWith('http'))reasons.push('RUNTIME_URL_MISSING');
 return{eligible:reasons.length===0,reasons,sourceWidth:w,sourceHeight:h,subjectAreaFraction:Number.isFinite(area)?area:null,textSafeScore:rr?effectiveSafe(rr):null};
}

async function fetchImage(url){
 let last;
 for(let i=0;i<3;i++){
  try{const r=await fetch(url,{headers:{'User-Agent':'MotorsportHub-LargeHero/1.0','Accept':'image/*'}});if(r.ok)return Buffer.from(await r.arrayBuffer());last=Error(`HTTP_${r.status}`);if(r.status<500&&r.status!==429)break;}catch(e){last=e}
  await new Promise(r=>setTimeout(r,1500*(i+1)));
 }
 throw last||Error('LARGE_HERO_FETCH_FAILED');
}

async function encodeContainedLarge(tf,tensor,size){
 const [h,w]=tensor.shape;
 const scale=Math.min(size/w,size/h,1);
 const dw=Math.max(1,Math.round(w*scale)),dh=Math.max(1,Math.round(h*scale));
 const resized=tf.image.resizeBilinear(tensor,[dh,dw],false).clipByValue(0,255).cast('int32');
 const top=Math.floor((size-dh)/2),bottom=size-dh-top,left=Math.floor((size-dw)/2),right=size-dw-left;
 const padded=tf.pad(resized,[[top,bottom],[left,right],[0,0]],5).clipByValue(0,255).cast('int32');
 const jpg=await tf.node.encodeJpeg(padded,'rgb',92);
 tf.dispose([resized,padded]);
 return{jpg,drawnWidth:dw,drawnHeight:dh,padding:{top,bottom,left,right}};
}

export async function buildLargeDerivatives({reportPath,outputDir,size=LARGE_HERO_SIZE,tfModule=null}){
 const report=JSON.parse(fs.readFileSync(reportPath,'utf8')),category=String(report.category||'');
 if(!LARGE_HERO_CATEGORIES.has(category))return{category,generated:0,skipped:true};
 const tfm=tfModule||await import('@tensorflow/tfjs-node'),tf=tfm.default||tfm;
 fs.mkdirSync(outputDir,{recursive:true});
 let generated=0;
 for(const row of report.results||[]){
  const verdict=largeEligibility(row,category);row.largeHeroEligibility=verdict;if(!verdict.eligible)continue;
  let tensor;
  try{
   const buf=await fetchImage(row.runtimeUrl);tensor=tf.node.decodeImage(buf,3);const [h,w]=tensor.shape;
   if(Math.max(w,h)<LARGE_MIN_LONG_EDGE||Math.min(w,h)<LARGE_MIN_SHORT_EDGE){row.largeHeroEligibility={...verdict,eligible:false,reasons:[...verdict.reasons,'DECODED_SOURCE_RESOLUTION_TOO_LOW']};continue;}
   const made=await encodeContainedLarge(tf,tensor,size),base=safe(row.assetId||row.title),name=`${base}-large.jpg`,out=path.join(outputDir,name);fs.writeFileSync(out,made.jpg);
   row.derivatives.large={path:path.relative(root,out),width:size,height:size,bytes:made.jpg.length,layoutMode:'CONTAINED_SOURCE',sourceWidth:w,sourceHeight:h,drawnWidth:made.drawnWidth,drawnHeight:made.drawnHeight,padding:made.padding,subjectAreaFraction:verdict.subjectAreaFraction,textSafeScore:verdict.textSafeScore};generated++;
  }catch(e){row.largeHeroEligibility={...verdict,eligible:false,reasons:[...verdict.reasons,`BUILD_FAILED:${String(e?.message||e)}`]};}
  finally{tensor?.dispose?.();}
 }
 report.largeHeroPolicy={enabledCategories:[...LARGE_HERO_CATEGORIES],size,minSourceLongEdge:LARGE_MIN_LONG_EDGE,minSourceShortEdge:LARGE_MIN_SHORT_EDGE,maxSubjectAreaFraction:LARGE_MAX_SUBJECT_AREA,minTextSafeScore:LARGE_MIN_TEXT_SAFE,layoutMode:'CONTAINED_SOURCE'};
 report.summary={...(report.summary||{}),largeDerivatives:generated};
 fs.writeFileSync(reportPath,JSON.stringify(report,null,2)+'\n');
 return{category,generated,skipped:false};
}

if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){
 const reportPath=path.resolve(arg('report',path.join(root,'hero-subject-report.json'))),outputDir=path.resolve(arg('output-dir',path.join(root,'hero-crop-previews'))),size=Number(arg('size',String(LARGE_HERO_SIZE)))||LARGE_HERO_SIZE;
 const result=await buildLargeDerivatives({reportPath,outputDir,size});console.log(JSON.stringify(result));
}
