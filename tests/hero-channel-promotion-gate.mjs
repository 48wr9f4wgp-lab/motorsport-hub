import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const tmp=fs.mkdtempSync(path.join(os.tmpdir(),'mh-channel-')),arts=path.join(tmp,'artifacts'),prev=path.join(tmp,'prev'),out=path.join(tmp,'out');
fs.mkdirSync(arts,{recursive:true});fs.mkdirSync(prev,{recursive:true});
const year=new Date().getUTCFullYear(),runtimeUrl='https://upload.wikimedia.org/example.jpg';
const liveBase='https://raw.githubusercontent.com/48wr9f4wgp-lab/motorsport-hub/hero-live/hero-channel/assets';

function previousEntry(category,quality,promotedAt,sourceDate=`${year}-05-01`){
 const assetId=`auto-old-${category.toLowerCase()}`,small=`${assetId}-small.jpg`,medium=`${assetId}-medium.jpg`,dir=path.join(prev,'assets',category);fs.mkdirSync(dir,{recursive:true});
 fs.writeFileSync(path.join(dir,small),Buffer.from(`${category}-old-small`));fs.writeFileSync(path.join(dir,medium),Buffer.from(`${category}-old-medium`));
 return {category,assetId,version:`old-${category.toLowerCase()}-version`,sourcePage:`https://commons.wikimedia.org/wiki/File:Old_${category}.jpg`,sourceTitle:`File:Old ${category}.jpg`,author:'Tester',license:'CC BY 4.0',sourceYear:year,sourceDate,role:'ACTION',qualityScore:quality,promotedAt,images:{small:{url:`${liveBase}/${category}/${small}`,width:720,height:720},medium:{url:`${liveBase}/${category}/${medium}`,width:1380,height:640}}};
}
const oldWrc=previousEntry('WRC',.95,new Date(Date.now()-72*3600000).toISOString());
const oldF1=previousEntry('F1',.95,new Date(Date.now()-24*3600000).toISOString());
const oldSuperGt=previousEntry('SUPERGT',.80,new Date(Date.now()-3600000).toISOString());
fs.writeFileSync(path.join(prev,'channel.json'),JSON.stringify({schemaVersion:1,generatedAt:new Date(Date.now()-72*3600000).toISOString(),publicationPolicy:'CI_GATED_LIVE_HERO_CHANNEL',categories:{WRC:oldWrc,F1:oldF1,SUPERGT:oldSuperGt}},null,2));
fs.writeFileSync(path.join(prev,'promotion-report.json'),JSON.stringify({schemaVersion:1,promoted:[],promotionModes:{}}));

function writeArtifact(category,{detection=.90,subject=.30,safe=.80,date=`${year}-07-01`,title=`File:${category} ${year} fresh action.jpg`,page=`https://commons.wikimedia.org/wiki/File:${category}_${year}_Fresh.jpg`}={}){
 const dir=path.join(arts,`hero-refresh-${category}-test`),previews=path.join(dir,'hero-crop-previews');fs.mkdirSync(previews,{recursive:true});
 const small=`${category.toLowerCase()}-small.jpg`,medium=`${category.toLowerCase()}-medium.jpg`;fs.writeFileSync(path.join(previews,small),Buffer.from(`${category}-new-small`));fs.writeFileSync(path.join(previews,medium),Buffer.from(`${category}-new-medium`));
 fs.writeFileSync(path.join(dir,'hero-discovery-report.json'),JSON.stringify({candidates:[{title,eligibleForReview:true,sourcePage:page,runtimeUrl,author:'Tester',license:'CC BY 4.0',sourceYear:year,dateRaw:date}]}));
 const crop={subjectFraction:subject,textSafeScore:safe,effectiveTextSafeScore:safe,detectionScore:detection};
 fs.writeFileSync(path.join(dir,'hero-subject-report.json'),JSON.stringify({results:[{title,runtimeUrl,status:'VISUAL_REVIEW_CANDIDATE',recommendedRole:'ACTION',selectedDetection:{score:detection},roleResults:{ACTION:{pass:true,small:crop,medium:crop}},derivatives:{small:{path:`hero-crop-previews/${small}`},medium:{path:`hero-crop-previews/${medium}`}}}]}));
}

writeArtifact('WEC');
writeArtifact('DAKAR');
writeArtifact('WRC');
writeArtifact('F1');
writeArtifact('SUPERGT');
writeArtifact('MOTOGP',{detection:.40,subject:.20,safe:.80,title:'File:MotoGP weak.jpg',page:'https://commons.wikimedia.org/wiki/File:MotoGP_Weak.jpg'});

execFileSync(process.execPath,[path.join(root,'tools/build-hero-channel.mjs'),`--artifacts=${arts}`,`--previous-dir=${prev}`,`--output-dir=${out}`],{cwd:root,stdio:'pipe'});
execFileSync(process.execPath,[path.join(root,'tools/validate-hero-channel-publish.mjs'),`--candidate=${out}`,`--previous=${prev}`],{cwd:root,stdio:'pipe'});
const channel=JSON.parse(fs.readFileSync(path.join(out,'channel.json'),'utf8')),report=JSON.parse(fs.readFileSync(path.join(out,'promotion-report.json'),'utf8'));

assert.equal(report.thresholds.minLkgQualityGain,.02,'quality upgrade margin must stay +0.02');
assert.equal(report.thresholds.freshnessMinScore,.90,'freshness rotation must keep a high absolute quality floor');
assert.equal(report.thresholds.freshnessMaxQualityDrop,.03,'freshness rotation may lose at most 0.03 quality');
assert.equal(report.thresholds.freshnessMinAgeHours,48,'freshness rotation must wait 48 hours');
assert.deepEqual([...report.promoted].sort(),['DAKAR','SUPERGT','WEC','WRC'].sort());
assert.equal(report.promotionModes.WEC,'INITIAL');
assert.equal(report.promotionModes.DAKAR,'INITIAL','DAKAR must be eligible for the shared Hero channel');
assert.equal(report.promotionModes.WRC,'FRESHNESS_ROTATION','72h-old WRC LKG may rotate to a distinct near-quality image');
assert.equal(report.promotionModes.SUPERGT,'QUALITY_UPGRADE','+0.02 quality gain must promote immediately without waiting 48h');
assert.equal(report.promotionModes.F1,undefined,'24h-old LKG must not freshness-rotate');
assert.deepEqual(channel.categories.F1,oldF1,'recent F1 LKG must remain unchanged');
assert.equal(channel.categories.MOTOGP,undefined,'weak candidate must not promote');
assert(channel.categories.DAKAR?.images?.medium?.url.includes('/assets/DAKAR/'),'DAKAR shared Hero asset missing');
assert(channel.categories.WRC.qualityScore>=.92&&channel.categories.WRC.qualityScore<.95,'freshness rotation fixture should prove controlled quality tradeoff');
for(const cat of report.promoted){for(const family of ['small','medium'])assert(fs.existsSync(path.join(out,'assets',cat,path.basename(channel.categories[cat].images[family].url))),`${cat}/${family} promoted asset missing`)}

console.log('Motorsport Hub Hero channel promotion gate: PASS');
fs.rmSync(tmp,{recursive:true,force:true});
