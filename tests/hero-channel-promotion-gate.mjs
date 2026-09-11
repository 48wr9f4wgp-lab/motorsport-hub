import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const tmp=fs.mkdtempSync(path.join(os.tmpdir(),'mh-channel-')),arts=path.join(tmp,'artifacts'),prev=path.join(tmp,'prev'),out=path.join(tmp,'out');
fs.mkdirSync(arts,{recursive:true});fs.mkdirSync(prev,{recursive:true});
const year=new Date().getUTCFullYear(),runtimeUrl='https://upload.wikimedia.org/example.jpg',now=Date.now();
const liveBase='https://raw.githubusercontent.com/48wr9f4wgp-lab/motorsport-hub/hero-live/hero-channel/assets';

function previousEntry(category,quality,hoursAgo,sourceDate=`${year}-06-01`){
 const assetId=`auto-old-${category.toLowerCase()}`,small=`${assetId}-small.jpg`,medium=`${assetId}-medium.jpg`,dir=path.join(prev,'assets',category);fs.mkdirSync(dir,{recursive:true});
 fs.writeFileSync(path.join(dir,small),Buffer.from(`${category}-old-small`));fs.writeFileSync(path.join(dir,medium),Buffer.from(`${category}-old-medium`));
 const shown=new Date(now-hoursAgo*3600000).toISOString();
 return {category,assetId,version:`old-${category.toLowerCase()}-version`,sourcePage:`https://commons.wikimedia.org/wiki/File:Old_${category}.jpg`,sourceTitle:`File:Old ${category}.jpg`,author:'Tester',license:'CC BY 4.0',sourceYear:year,sourceDate,role:'ACTION',qualityScore:quality,promotedAt:shown,lastRotatedAt:shown,recentAssetIds:[],images:{small:{url:`${liveBase}/${category}/${small}`,width:720,height:720},medium:{url:`${liveBase}/${category}/${medium}`,width:1380,height:640}}};
}
function poolAsset(category,name,quality,hoursSinceShown){
 const assetId=`auto-pool-${category.toLowerCase()}-${name}`,small=`${assetId}-small.jpg`,medium=`${assetId}-medium.jpg`,dir=path.join(prev,'assets',category);fs.mkdirSync(dir,{recursive:true});
 fs.writeFileSync(path.join(dir,small),Buffer.from(`${category}-${name}-small`));fs.writeFileSync(path.join(dir,medium),Buffer.from(`${category}-${name}-medium`));
 return {category,assetId,version:`pool-${name}-version`,sourcePage:`https://commons.wikimedia.org/wiki/File:${category}_${name}.jpg`,sourceTitle:`File:${category} ${name}.jpg`,author:'Tester',license:'CC BY 4.0',sourceYear:year,sourceDate:`${year}-05-15`,role:'ACTION',qualityScore:quality,addedAt:new Date(now-96*3600000).toISOString(),lastShownAt:new Date(now-hoursSinceShown*3600000).toISOString(),images:{small:{url:`${liveBase}/${category}/${small}`,width:720,height:720},medium:{url:`${liveBase}/${category}/${medium}`,width:1380,height:640}}};
}
const oldWrc=previousEntry('WRC',.95,72);
const oldF1=previousEntry('F1',.95,72);
const recentF1Alt=poolAsset('F1','recent-alt',.94,1);oldF1.pool=[{...oldF1,addedAt:oldF1.promotedAt,lastShownAt:oldF1.promotedAt,pool:undefined,recentAssetIds:undefined,lastRotatedAt:undefined,promotedAt:undefined},recentF1Alt];oldF1.recentAssetIds=[recentF1Alt.assetId];
const oldSuperGt=previousEntry('SUPERGT',.80,1);
fs.writeFileSync(path.join(prev,'channel.json'),JSON.stringify({schemaVersion:1,generatedAt:new Date(now-72*3600000).toISOString(),publicationPolicy:'CI_GATED_LIVE_HERO_CHANNEL',categories:{WRC:oldWrc,F1:oldF1,SUPERGT:oldSuperGt}},null,2));
fs.writeFileSync(path.join(prev,'promotion-report.json'),JSON.stringify({schemaVersion:1,promoted:[],poolUpdated:[],updatedCategories:[],promotionModes:{}}));

function writeArtifact(category,{detection=.95,subjectSmall=.32,subjectMedium=.32,safeSmall=.80,safeMedium=.80,date=`${year}-07-01`,title=`File:${category} ${year} pool action.jpg`,page=`https://commons.wikimedia.org/wiki/File:${category}_${year}_Pool.jpg`}={}){
 const dir=path.join(arts,`hero-refresh-${category}-test`),previews=path.join(dir,'hero-crop-previews');fs.mkdirSync(previews,{recursive:true});
 const small=`${category.toLowerCase()}-small.jpg`,medium=`${category.toLowerCase()}-medium.jpg`;fs.writeFileSync(path.join(previews,small),Buffer.from(`${category}-new-small`));fs.writeFileSync(path.join(previews,medium),Buffer.from(`${category}-new-medium`));
 fs.writeFileSync(path.join(dir,'hero-discovery-report.json'),JSON.stringify({candidates:[{title,eligibleForReview:true,sourcePage:page,runtimeUrl,author:'Tester',license:'CC BY 4.0',sourceYear:year,dateRaw:date}]}));
 const crop=(subject,safe)=>({subjectFraction:subject,textSafeScore:safe,effectiveTextSafeScore:safe,detectionScore:detection});
 fs.writeFileSync(path.join(dir,'hero-subject-report.json'),JSON.stringify({results:[{title,runtimeUrl,status:'VISUAL_REVIEW_CANDIDATE',recommendedRole:'ACTION',selectedDetection:{score:detection},roleResults:{ACTION:{pass:safeSmall>=.68&&safeMedium>=.68,small:crop(subjectSmall,safeSmall),medium:crop(subjectMedium,safeMedium)}},derivatives:{small:{path:`hero-crop-previews/${small}`},medium:{path:`hero-crop-previews/${medium}`}}}]}));
}

writeArtifact('WEC');
writeArtifact('DAKAR',{safeSmall:.65,safeMedium:.71,title:`File:DAKAR ${year} text-safe edge.jpg`,page:`https://commons.wikimedia.org/wiki/File:DAKAR_${year}_Text_Safe_Edge.jpg`});
writeArtifact('WRC',{subjectSmall:.30,subjectMedium:.30,safeSmall:.73,safeMedium:.73,date:`${year}-05-01`,title:`File:WRC ${year} older high quality alternate.jpg`,page:`https://commons.wikimedia.org/wiki/File:WRC_${year}_Older_Alternate.jpg`});
writeArtifact('F1',{safeSmall:.79,safeMedium:.79,title:recentF1Alt.sourceTitle,page:recentF1Alt.sourcePage,date:recentF1Alt.sourceDate});
writeArtifact('SUPERGT');
writeArtifact('MOTOGP',{detection:.40,subjectSmall:.20,subjectMedium:.20,title:'File:MotoGP weak.jpg',page:'https://commons.wikimedia.org/wiki/File:MotoGP_Weak.jpg'});

execFileSync(process.execPath,[path.join(root,'tools/build-hero-channel.mjs'),`--artifacts=${arts}`,`--previous-dir=${prev}`,`--output-dir=${out}`],{cwd:root,stdio:'pipe'});
execFileSync(process.execPath,[path.join(root,'tools/validate-hero-channel-publish.mjs'),`--candidate=${out}`,`--previous=${prev}`],{cwd:root,stdio:'pipe'});
const channel=JSON.parse(fs.readFileSync(path.join(out,'channel.json'),'utf8')),report=JSON.parse(fs.readFileSync(path.join(out,'promotion-report.json'),'utf8'));

assert.equal(report.thresholds.minLkgQualityGain,.02);
assert.equal(report.thresholds.minTextSafeFamily,.65,'each crop may reach 0.65 when pair average remains safe');
assert.equal(report.thresholds.minAverageTextSafe,.68,'Small/Medium average text-safe score must remain >= 0.68');
assert.equal(report.thresholds.poolInitialMinScore,.88);
assert.equal(report.thresholds.poolMaxQualityDrop,.03);
assert.equal(report.thresholds.poolMaxSize,5);
assert.equal(report.thresholds.rotationMinAgeHours,48);
assert.equal(report.thresholds.rotationReuseCooldownHours,48);
assert.deepEqual([...report.promoted].sort(),['DAKAR','SUPERGT','WEC','WRC'].sort());
assert.equal(report.promotionModes.WEC,'INITIAL');
assert.equal(report.promotionModes.DAKAR,'INITIAL','DAKAR must enter the shared Hero pool');
assert.equal(report.promotionModes.WRC,'POOL_ROTATION','old WRC live Hero must rotate to a distinct near-quality pool member');
assert.equal(report.promotionModes.SUPERGT,'QUALITY_UPGRADE','+0.02 quality gain must still promote immediately');
assert.equal(report.promotionModes.F1,undefined,'recently shown pool asset must respect 48h reuse cooldown');
assert(report.poolUpdated.includes('F1'),'F1 candidate should still refresh the pool even when display cannot rotate');
assert.equal(channel.categories.F1.assetId,oldF1.assetId,'pool-only update must preserve current F1 Hero');
assert(channel.categories.F1.pool.some(x=>x.sourcePage===recentF1Alt.sourcePage),'F1 alternate must remain in pool');
assert.equal(channel.categories.MOTOGP,undefined,'weak candidate must not enter pool or promote');
assert(channel.categories.DAKAR?.images?.medium?.url.includes('/assets/DAKAR/'),'DAKAR live pool asset missing');
assert(channel.categories.DAKAR.qualityScore>=.88,'DAKAR 0.65/0.71 text-safe pair should pass via average 0.68');
assert(channel.categories.WRC.sourceDate<oldWrc.sourceDate,'pool rotation must not require a newer sourceDate');
assert(channel.categories.WRC.qualityScore>=.92&&channel.categories.WRC.qualityScore<.95,'WRC rotation must prove controlled <=0.03 quality tradeoff');
assert(channel.categories.WRC.pool.some(x=>x.assetId===oldWrc.assetId),'previous live WRC must remain in rotation pool');
assert(channel.categories.WRC.recentAssetIds.includes(oldWrc.assetId),'previous live WRC must enter recent history');
for(const [cat,e] of Object.entries(channel.categories)){assert(e.pool.length>=1&&e.pool.length<=5,`${cat}: pool size out of bounds`);assert(e.pool.some(x=>x.assetId===e.assetId),`${cat}: live asset missing from pool`)}
for(const cat of report.promoted)for(const family of ['small','medium'])assert(fs.existsSync(path.join(out,'assets',cat,path.basename(channel.categories[cat].images[family].url))),`${cat}/${family} promoted asset missing`);

console.log('Motorsport Hub Hero pool rotation gate: PASS');
fs.rmSync(tmp,{recursive:true,force:true});
