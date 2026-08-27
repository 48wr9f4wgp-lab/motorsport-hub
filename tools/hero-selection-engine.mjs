import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const clamp=(n,min=0,max=1)=>Math.max(min,Math.min(max,Number(n)||0));
const round=n=>Math.round(n*1000)/1000;

export function loadJson(file){return JSON.parse(fs.readFileSync(file,'utf8'))}

function approvedAsset(asset,policy){
 const reasons=[];
 if(!asset)reasons.push('MISSING_APPROVED_ASSET');
 else{
  if(asset.category!==policy.category)reasons.push('CATEGORY_MISMATCH');
  if(!policy.allowedLicenses.includes(asset.license))reasons.push('LICENSE_NOT_ALLOWED');
  if(!String(asset.sourcePage||'').startsWith('https://commons.wikimedia.org/wiki/File:'))reasons.push('SOURCE_PAGE_UNVERIFIED');
  if(!String(asset.author||'').trim())reasons.push('AUTHOR_MISSING');
  if(!Array.isArray(asset.runtimeUrls)||asset.runtimeUrls.length<1)reasons.push('RUNTIME_URL_MISSING');
 }
 return reasons;
}

function candidateScore(obs,role,policy,maxYear){
 const reasons=[];
 const longEdge=Math.max(Number(obs.sourceWidth)||0,Number(obs.sourceHeight)||0);
 if(longEdge<policy.minSourceLongEdge)reasons.push('SOURCE_RESOLUTION_TOO_LOW');
 const small=clamp(obs.subjectFraction?.small),medium=clamp(obs.subjectFraction?.medium);
 if(small<role.minSmallSubjectFraction)reasons.push('SMALL_SUBJECT_TOO_SMALL');
 if(medium<role.minMediumSubjectFraction)reasons.push('MEDIUM_SUBJECT_TOO_SMALL');
 const textSafe=clamp(obs.textSafeScore);
 if(textSafe<role.minTextSafeScore)reasons.push('TEXT_SAFE_SCORE_TOO_LOW');
 const subjectScore=clamp(Math.min(
  role.minSmallSubjectFraction?small/role.minSmallSubjectFraction:1,
  role.minMediumSubjectFraction?medium/role.minMediumSubjectFraction:1
 ));
 const resolutionScore=clamp(longEdge/4096);
 const year=Number(obs.sourceYear)||0;
 const recencyScore=clamp(1-Math.max(0,maxYear-year)/10);
 const w=policy.weights;
 const score=round(
  clamp(obs.compositionScore)*w.composition+
  subjectScore*w.subject+
  textSafe*w.textSafe+
  resolutionScore*w.resolution+
  recencyScore*w.recency
 );
 if(score<role.minCompositeScore)reasons.push('COMPOSITE_SCORE_TOO_LOW');
 return{score,reasons,metrics:{longEdge,subjectSmall:small,subjectMedium:medium,textSafeScore:textSafe,compositionScore:clamp(obs.compositionScore),recencyScore:round(recencyScore)}};
}

export function buildReport(manifest,policy){
 if(policy.schemaVersion!==1)throw Error('Unsupported hero selection policy schema');
 const assets=new Map((manifest.assets||[]).map(a=>[a.assetId,a]));
 const observations=new Map((policy.observations||[]).map(o=>[o.assetId,o]));
 const maxYear=Number(policy.scoringYear)||Math.max(...[...observations.values()].map(o=>Number(o.sourceYear)||0));
 const used=new Set(),roles=[],rejected=[];
 for(const role of policy.roles){
  const evaluated=[];
  for(const obs of observations.values()){
   if(!(obs.roleTags||[]).includes(role.id))continue;
   const asset=assets.get(obs.assetId),approvalReasons=approvedAsset(asset,policy),scored=candidateScore(obs,role,policy,maxYear);
   const reasons=[...approvalReasons,...scored.reasons];
   const distinctBlocked=policy.requireDistinctVariants&&used.has(obs.assetId);
   if(distinctBlocked)reasons.push('DISTINCT_VARIANT_ALREADY_USED');
   evaluated.push({assetId:obs.assetId,eligible:reasons.length===0,score:scored.score,reasons,metrics:scored.metrics,sourceYear:obs.sourceYear});
  }
  evaluated.sort((a,b)=>Number(b.eligible)-Number(a.eligible)||b.score-a.score||(Number(b.sourceYear)||0)-(Number(a.sourceYear)||0)||a.assetId.localeCompare(b.assetId));
  const winner=evaluated.find(x=>x.eligible);
  if(winner){
   used.add(winner.assetId);
   roles.push({role:role.id,status:'SELECTED',assetId:winner.assetId,score:winner.score,reasons:[],metrics:winner.metrics});
  }else{
   const lkg=assets.get(role.lkgAssetId);
   if(!lkg)throw Error(`Missing LKG asset ${role.lkgAssetId} for ${role.id}`);
   if(policy.requireDistinctVariants)used.add(role.lkgAssetId);
   roles.push({role:role.id,status:'HOLD_LKG',assetId:role.lkgAssetId,score:null,reasons:['NO_ELIGIBLE_DISTINCT_CANDIDATE'],metrics:null});
  }
  for(const item of evaluated.filter(x=>!x.eligible))rejected.push({role:role.id,...item});
 }
 return{
  schemaVersion:1,
  generatedAt:new Date().toISOString(),
  category:policy.category,
  policyVersion:policy.policyVersion,
  mode:policy.mode,
  summary:{selected:roles.filter(r=>r.status==='SELECTED').length,heldLkg:roles.filter(r=>r.status==='HOLD_LKG').length,rejected:rejected.length},
  roles,
  rejected
 };
}

function parseArgs(argv){
 const out={write:false,manifest:path.join(root,'hero-assets.json'),policy:path.join(root,'hero-selection-policy.json'),output:path.join(root,'hero-selection-report.json')};
 for(const a of argv){
  if(a==='--write')out.write=true;
  else if(a.startsWith('--manifest='))out.manifest=path.resolve(a.slice(11));
  else if(a.startsWith('--policy='))out.policy=path.resolve(a.slice(9));
  else if(a.startsWith('--output='))out.output=path.resolve(a.slice(9));
 }
 return out;
}

if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){
 const args=parseArgs(process.argv.slice(2));
 const report=buildReport(loadJson(args.manifest),loadJson(args.policy));
 const json=JSON.stringify(report,null,2)+'\n';
 if(args.write){fs.writeFileSync(args.output,json);console.log(`Hero selection report written: ${path.relative(root,args.output)}`)}
 else process.stdout.write(json);
 if(report.roles.some(r=>!['SELECTED','HOLD_LKG'].includes(r.status)))process.exitCode=1;
}
