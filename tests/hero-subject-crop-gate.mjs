import assert from 'node:assert/strict';
import {choosePrimaryDetection,makeCrop,makeSceneFallbackCrop,evaluateDetectionAcrossRoles} from '../tools/hero-crop-core.mjs';
import {evaluateVisualRegression} from '../tools/detect-hero-subjects.mjs';
const roles=[
 {id:'IDENTITY',minSmallSubjectFraction:.18,minMediumSubjectFraction:.14,minTextSafeScore:.6},
 {id:'ACTION',minSmallSubjectFraction:.18,minMediumSubjectFraction:.14,minTextSafeScore:.6},
 {id:'ENVIRONMENT',minSmallSubjectFraction:.10,minMediumSubjectFraction:.07,minTextSafeScore:.6}
];
const predictions=[{class:'person',score:.99,bbox:[10,10,500,500]},{class:'car',score:.91,bbox:[1200,650,620,360]}];
const detection=choosePrimaryDetection(predictions,2048,1365);assert.equal(detection.class,'car');
for(const family of ['small','medium']){
 const crop=makeCrop(2048,1365,detection,family,{role:'ACTION'});
 assert(crop.normalized.x>=0&&crop.normalized.y>=0);
 assert(crop.normalized.x+crop.normalized.w<=1.000001&&crop.normalized.y+crop.normalized.h<=1.000001);
 assert(crop.subjectFraction>=0&&crop.subjectFraction<=1);
 assert(crop.textSafeScore>.6);
 const custom=makeCrop(2048,1365,detection,family,{role:'ACTION',subjectX:.76});
 assert(custom.normalized.x>=0&&custom.normalized.y>=0);
 assert(custom.normalized.x+custom.normalized.w<=1.000001&&custom.normalized.y+custom.normalized.h<=1.000001);
 assert(custom.normalized.x<=crop.normalized.x+1e-9,'higher subjectX should place the detected subject farther right in the crop');
 assert(custom.textSafeScore>=crop.textSafeScore-1e-9,'higher subjectX must not reduce left text-safe score in this fixture');
 const scene=makeSceneFallbackCrop(3840,2560,family,{focusX:.58,focusY:.7});
 assert.equal(scene.role,'ENVIRONMENT');
 assert.equal(scene.fallbackMode,'SCENE_FOCUS');
 assert(scene.normalized.x>=0&&scene.normalized.y>=0);
 assert(scene.normalized.x+scene.normalized.w<=1.000001&&scene.normalized.y+scene.normalized.h<=1.000001);
 const aspect=scene.crop.w/scene.crop.h,target=family==='small'?1:1380/640;
 assert(Math.abs(aspect-target)<1e-6);
}
const clipped=makeCrop(3840,2562,{class:'truck',score:.97,bbox:[150,374,3422,1966],areaFraction:.68},'small',{role:'IDENTITY'});
assert(clipped.subjectFraction>=0&&clipped.subjectFraction<=1);
const good=evaluateDetectionAcrossRoles({predictions,imageWidth:2048,imageHeight:1365,roles});
assert.equal(good.roles.ACTION.pass,true);
const shifted=evaluateDetectionAcrossRoles({predictions,imageWidth:2048,imageHeight:1365,roles,subjectX:.76});
assert.equal(shifted.roles.ACTION.pass,true);
assert(shifted.roles.ACTION.small.textSafeScore>=good.roles.ACTION.small.textSafeScore-1e-9);
const tiny=evaluateDetectionAcrossRoles({predictions:[{class:'car',score:.72,bbox:[1820,1180,55,30]}],imageWidth:2048,imageHeight:1365,roles});
assert.equal(tiny.roles.ENVIRONMENT.pass,false);assert(tiny.roles.ENVIRONMENT.reasons.includes('SUBJECT_TOO_SMALL'));
const none=evaluateDetectionAcrossRoles({predictions:[{class:'person',score:.99,bbox:[1,1,100,100]}],imageWidth:2048,imageHeight:1365,roles});
assert.equal(none.roles.ACTION.pass,false);assert(none.roles.ACTION.reasons.includes('NO_VEHICLE_DETECTION'));
const baseCrop={x:.2,y:.1,w:.7,h:.7};
const vrPolicy={visualRegression:{maxCropDelta:.015,assets:{asset:{role:'ACTION',mode:'SUBJECT_AWARE',smallCrop:baseCrop,mediumCrop:baseCrop}}}};
const vrRows=[{assetId:'asset',derivatives:{role:'ACTION',mode:'SUBJECT_AWARE',small:{crop:{...baseCrop,x:.205}},medium:{crop:{...baseCrop,y:.11}}},environmentFallback:null}];
const vrPass=evaluateVisualRegression(vrRows,vrPolicy);assert.equal(vrPass.status,'PASS');assert.equal(vrPass.reviewRequired,0);
const driftRows=[{assetId:'asset',derivatives:{role:'ACTION',mode:'SUBJECT_AWARE',small:{crop:{...baseCrop,x:.24}},medium:{crop:baseCrop}},environmentFallback:null}];
const vrDrift=evaluateVisualRegression(driftRows,vrPolicy);assert.equal(vrDrift.status,'REVIEW_REQUIRED');assert(vrDrift.assets[0].reasons.includes('CROP_DRIFT'));
const roleRows=[{assetId:'asset',derivatives:{role:'IDENTITY',mode:'SUBJECT_AWARE',small:{crop:baseCrop},medium:{crop:baseCrop}},environmentFallback:null}];
const vrRole=evaluateVisualRegression(roleRows,vrPolicy);assert(vrRole.assets[0].reasons.includes('ROLE_CHANGED'));
console.log('Hero subject crop gate PASS');
