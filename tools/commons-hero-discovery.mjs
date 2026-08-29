import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const htmlText=v=>String(v||'').replace(/<[^>]*>/g,' ').replace(/&nbsp;/g,' ').replace(/&amp;/g,'&').replace(/&#39;/g,"'").replace(/&quot;/g,'"').replace(/\s+/g,' ').trim();
const meta=(ii,key)=>htmlText(ii?.extmetadata?.[key]?.value);
const wikiFilePage=title=>`https://commons.wikimedia.org/wiki/${encodeURIComponent(String(title).replace(/ /g,'_')).replace(/%3A/i,':')}`;
const norm=v=>String(v||'').normalize('NFKC').toLowerCase().replace(/[_-]+/g,' ').replace(/\s+/g,' ').trim();
const hasAny=(text,terms)=>(terms||[]).some(t=>text.includes(norm(t)));

export function normalizePage(page,query,config){
 const ii=page?.imageinfo?.[0];
 if(!ii)return null;
 const width=Number(ii.width)||0,height=Number(ii.height)||0,longEdge=Math.max(width,height);
 const license=meta(ii,'LicenseShortName');
 const author=meta(ii,'Artist');
 const dateRaw=meta(ii,'DateTimeOriginal')||String(ii.timestamp||'');
 const year=Number(String(dateRaw).match(/(?:19|20)\d{2}/)?.[0])||null;
 return{
  status:'DISCOVERED_UNAPPROVED',
  category:config.category,
  query,
  title:String(page.title||''),
  sourcePage:wikiFilePage(page.title||''),
  runtimeUrl:ii.thumburl||ii.url||'',
  originalUrl:ii.url||'',
  width,height,longEdge,
  mime:String(ii.mime||''),
  license,
  author,
  credit:meta(ii,'Credit'),
  description:meta(ii,'ImageDescription'),
  dateRaw,
  sourceYear:year
 };
}

export function evaluateCandidate(c,config){
 const reasons=[];
 if(!c)reasons.push('MISSING_IMAGEINFO');
 else{
  if(!c.title.startsWith('File:'))reasons.push('NOT_FILE_NAMESPACE');
  if(!c.mime.startsWith('image/'))reasons.push('NOT_IMAGE_MIME');
  if(c.longEdge<config.minSourceLongEdge)reasons.push('SOURCE_RESOLUTION_TOO_LOW');
  if(!config.allowedLicenses.includes(c.license))reasons.push('LICENSE_NOT_ALLOWED');
  if(!c.author)reasons.push('AUTHOR_MISSING');
  if(!c.sourcePage)reasons.push('SOURCE_PAGE_MISSING');
  if(!c.runtimeUrl)reasons.push('RUNTIME_URL_MISSING');
  const required=config.relevance?.requiredAny||[],forbidden=config.relevance?.forbiddenAny||[];
  if(required.length||forbidden.length){
   const text=norm([c.title,c.description,c.credit].filter(Boolean).join(' '));
   if(required.length&&!hasAny(text,required))reasons.push('CATEGORY_RELEVANCE_MISMATCH');
   if(forbidden.length&&hasAny(text,forbidden))reasons.push('CATEGORY_FORBIDDEN_CONTEXT');
  }
 }
 return{eligibleForReview:reasons.length===0,reasons};
}

export function reportFromApiResponses(responses,config){
 const dedup=new Map();
 for(const {query,payload} of responses){
  for(const page of Object.values(payload?.query?.pages||{})){
   const c=normalizePage(page,query,config);if(!c)continue;
   const verdict=evaluateCandidate(c,config),row={...c,...verdict};
   const old=dedup.get(row.title);
   if(!old||Number(row.sourceYear||0)>Number(old.sourceYear||0))dedup.set(row.title,row);
  }
 }
 const all=[...dedup.values()];
 all.sort((a,b)=>Number(b.eligibleForReview)-Number(a.eligibleForReview)||(Number(b.sourceYear)||0)-(Number(a.sourceYear)||0)||b.longEdge-a.longEdge||a.title.localeCompare(b.title));
 return{
  schemaVersion:1,
  generatedAt:new Date().toISOString(),
  category:config.category,
  source:config.source,
  publicationPolicy:'DISCOVERY_ONLY_NO_RUNTIME_MUTATION',
  summary:{discovered:all.length,eligibleForReview:all.filter(x=>x.eligibleForReview).length,rejected:all.filter(x=>!x.eligibleForReview).length},
  candidates:all
 };
}

export async function discover(config,fetchImpl=fetch){
 const responses=[];
 for(const query of config.searchQueries){
  const u=new URL(config.apiUrl);
  const params={action:'query',format:'json',formatversion:'2',generator:'search',gsrsearch:query,gsrnamespace:'6',gsrlimit:String(config.resultsPerQuery),gsrsort:'create_timestamp_desc',prop:'imageinfo',iiprop:'url|size|mime|timestamp|extmetadata',iiurlwidth:String(config.thumbWidth),iiextmetadatafilter:'LicenseShortName|Artist|Credit|ImageDescription|DateTimeOriginal',origin:'*'};
  for(const [k,v] of Object.entries(params))u.searchParams.set(k,v);
  const r=await fetchImpl(u,{headers:{'User-Agent':'MotorsportHub-HeroDiscovery/1.1 (non-publishing QA tool)'}});
  if(!r.ok)throw Error(`Commons API ${r.status} for ${query}`);
  responses.push({query,payload:await r.json()});
 }
 return reportFromApiResponses(responses,config);
}

function parseArgs(argv){
 const out={write:false,config:path.join(root,'hero-source-discovery.json'),output:path.join(root,'hero-discovery-report.json'),fixture:null};
 for(const a of argv){
  if(a==='--write')out.write=true;
  else if(a.startsWith('--config='))out.config=path.resolve(a.slice(9));
  else if(a.startsWith('--output='))out.output=path.resolve(a.slice(9));
  else if(a.startsWith('--fixture='))out.fixture=path.resolve(a.slice(10));
 }
 return out;
}

if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){
 const args=parseArgs(process.argv.slice(2)),config=JSON.parse(fs.readFileSync(args.config,'utf8'));
 const report=args.fixture?reportFromApiResponses(JSON.parse(fs.readFileSync(args.fixture,'utf8')),config):await discover(config);
 const json=JSON.stringify(report,null,2)+'\n';
 if(args.write){fs.writeFileSync(args.output,json);console.log(`Hero discovery report written: ${path.relative(root,args.output)}`)}else process.stdout.write(json);
}
