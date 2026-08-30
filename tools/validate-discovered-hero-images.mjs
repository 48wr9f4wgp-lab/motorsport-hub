import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {probeRemoteImage} from './image-probe.mjs';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');

export async function validateDiscoveryReport(report,{limit=12,minDerivedLongEdge=1280,fetchImpl=fetch}={}){
 const rows=[];
 for(const c of (report.candidates||[]).filter(x=>x.eligibleForReview).slice(0,limit)){
  const p=await probeRemoteImage(c.runtimeUrl,fetchImpl),reasons=[];
  if(!p.ok)reasons.push(p.reason||'IMAGE_PROBE_FAILED');
  if(p.ok&&Math.max(p.width,p.height)<minDerivedLongEdge)reasons.push('DERIVED_IMAGE_TOO_SMALL');
  if(p.contentType&&!p.contentType.toLowerCase().startsWith('image/'))reasons.push('CONTENT_TYPE_NOT_IMAGE');
  rows.push({title:c.title,sourcePage:c.sourcePage,runtimeUrl:c.runtimeUrl,probe:p,validForVisualReview:reasons.length===0,reasons});
 }
 return{
  schemaVersion:1,
  generatedAt:new Date().toISOString(),
  category:report.category,
  publicationPolicy:'VALIDATION_ONLY_NO_RUNTIME_MUTATION',
  summary:{probed:rows.length,validForVisualReview:rows.filter(x=>x.validForVisualReview).length,rejected:rows.filter(x=>!x.validForVisualReview).length},
  results:rows
 };
}

function arg(name,fallback){const p=process.argv.find(x=>x.startsWith(`--${name}=`));return p?path.resolve(p.slice(name.length+3)):fallback}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){
 const input=arg('input',path.join(root,'hero-discovery-report.json')),output=arg('output',path.join(root,'hero-image-validation-report.json'));
 const report=JSON.parse(fs.readFileSync(input,'utf8')),validated=await validateDiscoveryReport(report);
 fs.writeFileSync(output,JSON.stringify(validated,null,2)+'\n');
 console.log(`Hero image validation report written: ${path.relative(root,output)}`);
}
