import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const arg=(name,fallback)=>{const p=process.argv.find(x=>x.startsWith(`--${name}=`));return p?p.slice(name.length+3):fallback};
const category=String(arg('category','')).trim().toUpperCase();
if(!category)throw new Error('Usage: node tools/build-hero-refresh-config.mjs --category=<ID> [--output=path]');
const sourcePath=path.resolve(arg('sources',path.join(root,'hero-refresh-sources.json')));
const inventoryPath=path.resolve(arg('inventory',path.join(root,'hero-assets.json')));
const outputPath=path.resolve(arg('output',path.join(root,`hero-refresh-${category.toLowerCase()}.json`)));
const src=JSON.parse(fs.readFileSync(sourcePath,'utf8'));
const inventory=JSON.parse(fs.readFileSync(inventoryPath,'utf8'));
if(src.schemaVersion!==1||!src.categories||typeof src.categories!=='object')throw new Error('hero-refresh-sources schema drift');
if(inventory.schemaVersion!==2||!Array.isArray(inventory.assets))throw new Error('hero-assets schema drift');
const queries=src.categories[category];
if(!Array.isArray(queries)||!queries.length)throw new Error(`Unknown refresh category: ${category}`);
const relevance=src.relevance?.[category];
if(!relevance||!Array.isArray(relevance.requiredAny)||!relevance.requiredAny.length)throw new Error(`${category}: relevance contract missing`);
const year=new Date().getUTCFullYear(),prevYear=year-1;
const searchQueries=queries.map(q=>String(q).replaceAll('{year}',String(year)).replaceAll('{prevYear}',String(prevYear)));
const verifiedSeeds=inventory.assets
  .filter(a=>String(a?.category||'').toUpperCase()===category&&a?.assetId&&a?.filename&&a?.sourcePage&&a?.author&&a?.license)
  .map(a=>({assetId:String(a.assetId),filename:String(a.filename),sourcePage:String(a.sourcePage),author:String(a.author),license:String(a.license)}));
if(!verifiedSeeds.length)throw new Error(`${category}: verified Hero seed inventory missing`);
const config={
  schemaVersion:1,
  source:src.source,
  category,
  apiUrl:src.apiUrl,
  searchQueries,
  verifiedSeeds,
  resultsPerQuery:Number(src.resultsPerQuery)||12,
  thumbWidth:Number(src.thumbWidth)||2048,
  minSourceLongEdge:Number(src.minSourceLongEdge)||2048,
  minSourceYear:Number(src.minSourceYear)||2020,
  allowedLicenses:Array.isArray(src.allowedLicenses)?src.allowedLicenses:[],
  maxCandidates:Number(src.maxCandidatesPerCategory)||4,
  cadence:src.cadence||'ACTIVE_6H',
  publicationPolicy:src.publicationPolicy||'DISCOVERY_AND_VALIDATION_ONLY_NO_RUNTIME_MUTATION',
  relevance:{
    requiredAny:relevance.requiredAny.map(String),
    forbiddenAny:[...(Array.isArray(src.globalForbiddenContext)?src.globalForbiddenContext:[]),...(Array.isArray(relevance.forbiddenAny)?relevance.forbiddenAny:[])].map(String)
  }
};
fs.writeFileSync(outputPath,JSON.stringify(config,null,2)+'\n');
console.log(`Hero refresh config written: ${path.relative(root,outputPath)} (${category}, ${searchQueries.length} queries, ${verifiedSeeds.length} verified seeds)`);
