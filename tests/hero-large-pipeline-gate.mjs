import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import {largeEligibility,LARGE_HERO_CATEGORIES,LARGE_HERO_SIZE,LARGE_MIN_LONG_EDGE,LARGE_MIN_SHORT_EDGE,LARGE_MAX_SUBJECT_AREA} from '../tools/build-large-hero-derivatives.mjs';
import {augmentLargeVariants} from '../tools/augment-hero-channel-large.mjs';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const allCategories=['F1','WEC','WRC','SUPERGT','MOTOGP','FDJ','D1GP','SUPERFORMULA','INDYCAR','NASCAR','GTWCEU','DAKAR'];
const largeModules=['f1-widget-flat-v1000.js','wec-widget-flat-v1000.js','wrc-widget-flat-v1000.js','supergt-widget-flat-v1000.js','motogp-widget-flat-v1000.js','fdj-widget-flat-v1000.js','d1gp-widget-flat-v1000.js','superformula-widget.js','indycar-widget.js','nascar-widget.js','gtwc-europe-widget.js','dakar-widget.js'];
const good={status:'VISUAL_REVIEW_CANDIDATE',runtimeUrl:'https://upload.wikimedia.org/a.jpg',image:{width:2400,height:1350},selectedDetection:{areaFraction:.24},recommendedRole:'ACTION',roleResults:{ACTION:{medium:{effectiveTextSafeScore:.79}}},derivatives:{small:{path:'s.jpg'},medium:{path:'m.jpg'}}};
assert.equal(largeEligibility(good,'F1').eligible,true);
assert.equal(LARGE_HERO_SIZE,1600);assert.equal(LARGE_MIN_LONG_EDGE,1800);assert.equal(LARGE_MIN_SHORT_EDGE,900);assert.equal(LARGE_MAX_SUBJECT_AREA,.38);
assert(largeEligibility({...good,image:{width:1380,height:640}},'F1').reasons.includes('SOURCE_RESOLUTION_TOO_LOW_FOR_LARGE'));
assert(largeEligibility({...good,selectedDetection:{areaFraction:.55}},'WEC').reasons.includes('SUBJECT_TOO_CLOSE_FOR_LARGE'));
assert.equal(LARGE_HERO_CATEGORIES.size,12);
for(const category of allCategories)assert.equal(largeEligibility(good,category).eligible,true,`${category} must support Large Hero`);

// Large is a first-class widget family across every product category. The existing
// Small/Medium renderers remain present so this rollout cannot silently collapse
// the previously validated families into a Large-only implementation.
for(const file of largeModules){
 const source=fs.readFileSync(path.join(root,file),'utf8');
 assert(source.includes('function small(d,cached,bg)'),`${file}: Small renderer missing`);
 assert(source.includes('function medium(d,cached,bg)'),`${file}: Medium renderer missing`);
 assert(source.includes('function large(d,cached,bg)'),`${file}: Large renderer missing`);
 assert(source.includes('MORE STANDINGS'),`${file}: Large standings expansion missing`);
 assert(/presentLarge\(\)/.test(source),`${file}: presentLarge routing missing`);
 assert(/===['"]large['"]\?large/.test(source),`${file}: widgetFamily Large routing missing`);
}

const tmp=fs.mkdtempSync(path.join(os.tmpdir(),'mh-large-')),artifacts=path.join(tmp,'artifacts'),candidate=path.join(tmp,'candidate'),previous=path.join(tmp,'previous'),art=path.join(artifacts,'hero-refresh-F1-test'),preview=path.join(art,'hero-crop-previews');
fs.mkdirSync(preview,{recursive:true});fs.mkdirSync(path.join(candidate,'assets','F1'),{recursive:true});fs.mkdirSync(previous,{recursive:true});
const year=new Date().getUTCFullYear(),base='https://raw.githubusercontent.com/48wr9f4wgp-lab/motorsport-hub/hero-live/hero-channel/assets/F1';
const current={assetId:'current-f1',sourcePage:'https://commons.wikimedia.org/wiki/File:Current_F1.jpg',sourceTitle:'File:Current F1.jpg'};
const alternate={assetId:'alternate-f1',sourcePage:'https://commons.wikimedia.org/wiki/File:Alternate_F1.jpg',sourceTitle:'File:Alternate F1.jpg'};
for(const a of [current,alternate]){
 fs.writeFileSync(path.join(preview,`${a.assetId}-large.jpg`),Buffer.from(`${a.assetId}-large-image-bytes`));
 for(const [family,data] of [['small',`${a.assetId}-small-bytes`],['medium',`${a.assetId}-medium-bytes`]])fs.writeFileSync(path.join(candidate,'assets','F1',`${a.assetId}-${family}.jpg`),Buffer.from(data));
}
fs.writeFileSync(path.join(art,'hero-subject-report.json'),JSON.stringify({category:'F1',results:[current,alternate].map(a=>({sourcePage:a.sourcePage,derivatives:{large:{path:`hero-crop-previews/${a.assetId}-large.jpg`,width:1600,height:1600,layoutMode:'CONTAINED_SOURCE'}}}))}));
const asset=a=>({category:'F1',assetId:a.assetId,version:`old-${a.assetId}-version`,sourcePage:a.sourcePage,sourceTitle:a.sourceTitle,author:'Tester',license:'CC BY 4.0',sourceYear:year,sourceDate:`${year}-09-01`,role:'ACTION',qualityScore:.9,addedAt:`${year}-09-01T00:00:00Z`,lastShownAt:null,images:{small:{url:`${base}/${a.assetId}-small.jpg`,width:720,height:720},medium:{url:`${base}/${a.assetId}-medium.jpg`,width:1380,height:640}}});
const currentPool=asset(current),alternatePool=asset(alternate),live={...currentPool,promotedAt:`${year}-09-01T00:00:00Z`,lastRotatedAt:`${year}-09-01T00:00:00Z`,pool:[currentPool,alternatePool],recentAssetIds:[]};
const channelBefore={schemaVersion:1,generatedAt:new Date().toISOString(),publicationPolicy:'CI_GATED_LIVE_HERO_CHANNEL',categories:{F1:live}};
fs.writeFileSync(path.join(candidate,'channel.json'),JSON.stringify(channelBefore,null,2));
fs.writeFileSync(path.join(previous,'channel.json'),JSON.stringify(channelBefore,null,2));
fs.writeFileSync(path.join(candidate,'promotion-report.json'),JSON.stringify({schemaVersion:1,promoted:[],poolUpdated:[],updatedCategories:[],promotionModes:{},thresholds:{poolMaxSize:5,recentHistorySize:2}},null,2));

const before=structuredClone(channelBefore.categories.F1),result=augmentLargeVariants({artifactRoot:artifacts,candidateDir:candidate});assert.equal(result.added,2);
const channel=JSON.parse(fs.readFileSync(path.join(candidate,'channel.json'),'utf8')),report=JSON.parse(fs.readFileSync(path.join(candidate,'promotion-report.json'),'utf8')),after=channel.categories.F1,currentAfter=after.pool.find(x=>x.assetId===current.assetId),alternateAfter=after.pool.find(x=>x.assetId===alternate.assetId);
assert.equal(after.assetId,current.assetId,'Large family augmentation must not change current live Hero identity');
assert.equal(after.sourcePage,before.sourcePage);assert.equal(after.qualityScore,before.qualityScore);assert.equal(after.lastRotatedAt,before.lastRotatedAt);
assert.deepEqual(after.images.small,before.images.small);assert.deepEqual(after.images.medium,before.images.medium);
assert.equal(after.images.large.width,1600);assert.equal(after.images.large.height,1600);assert(after.images.large.url.endsWith(`/${current.assetId}-large.jpg`));assert.equal(after.images.large.layoutMode,'CONTAINED_SOURCE');
assert.notEqual(after.version,before.version,'same-Hero Large family addition must advance live version');assert.equal(after.version,currentAfter.version,'live metadata must match its pool asset');
assert.equal(alternateAfter.images.large.width,1600);assert(alternateAfter.images.large.url.endsWith(`/${alternate.assetId}-large.jpg`));
assert(report.poolUpdated.includes('F1'));assert(report.updatedCategories.includes('F1'));assert.equal(report.promoted.length,0,'Large family sync is not a Hero promotion');
for(const a of [current,alternate])assert(fs.existsSync(path.join(candidate,'assets','F1',`${a.assetId}-large.jpg`)));

// Re-discovering the same asset must be idempotent. Even if a fresh encoder would
// produce different bytes, an already-published Large URL/version is immutable and
// cannot be silently overwritten under the same asset identity.
const channelAfterFirst=fs.readFileSync(path.join(candidate,'channel.json'),'utf8'),reportAfterFirst=fs.readFileSync(path.join(candidate,'promotion-report.json'),'utf8');
const publishedLarge=new Map([current,alternate].map(a=>[a.assetId,fs.readFileSync(path.join(candidate,'assets','F1',`${a.assetId}-large.jpg`))]));
for(const a of [current,alternate])fs.writeFileSync(path.join(preview,`${a.assetId}-large.jpg`),Buffer.from(`${a.assetId}-regenerated-different-large-bytes`));
const repeat=augmentLargeVariants({artifactRoot:artifacts,candidateDir:candidate});assert.equal(repeat.added,0,'repeat refresh must not reattach an existing Large family');
assert.equal(fs.readFileSync(path.join(candidate,'channel.json'),'utf8'),channelAfterFirst,'repeat refresh mutated channel metadata');
assert.equal(fs.readFileSync(path.join(candidate,'promotion-report.json'),'utf8'),reportAfterFirst,'repeat refresh mutated promotion evidence');
for(const a of [current,alternate])assert.deepEqual(fs.readFileSync(path.join(candidate,'assets','F1',`${a.assetId}-large.jpg`)),publishedLarge.get(a.assetId),`${a.assetId}: repeat refresh overwrote immutable Large bytes`);

execFileSync(process.execPath,[path.join(root,'tools/validate-hero-channel-publish.mjs'),`--candidate=${candidate}`,`--previous=${previous}`],{cwd:root,stdio:'pipe'});
fs.rmSync(tmp,{recursive:true,force:true});
console.log('Motorsport Hub Large Hero + all-category layout gate: PASS');
