import assert from 'node:assert/strict';
import {evaluateDetectionAcrossRoles,evaluateCropForRole,makeCrop} from './hero-crop-core.mjs';

const role={id:'IDENTITY',minSmallSubjectFraction:.16,minMediumSubjectFraction:.12,minTextSafeScore:.60,veilCompensation:.07};
const marginal={class:'car',score:.30862894654273987,bbox:[515.2191162109375,572.2367477416992,1348.2534790039062,951.800537109375]};
const strong={class:'car',score:.9,bbox:[515,572,1348,952]};

const at30=evaluateDetectionAcrossRoles({predictions:[marginal],imageWidth:2560,imageHeight:1920,roles:[role],minScore:.30,textSafeLeft:.42,subjectX:.76});
assert.ok(at30.detection,'configured .30 must select .3086 car');
assert.equal(at30.roles.IDENTITY.pass,true,JSON.stringify(at30.roles.IDENTITY.reasons));
assert.equal(at30.roles.IDENTITY.smallEvaluation.minDetectionScore,.30);
assert.equal(at30.roles.IDENTITY.mediumEvaluation.minDetectionScore,.30);

const at32=evaluateDetectionAcrossRoles({predictions:[marginal],imageWidth:2560,imageHeight:1920,roles:[role],minScore:.32,textSafeLeft:.42,subjectX:.76});
assert.equal(at32.detection,null,'configured .32 must reject .3086 before crop evaluation');
assert.deepEqual(at32.roles.IDENTITY.reasons,['NO_VEHICLE_DETECTION']);

const crop=makeCrop(2560,1920,{...marginal,areaFraction:.261},'small',{role:'IDENTITY',textSafeLeft:.42,subjectX:.76});
const defaultEval=evaluateCropForRole(crop,role);
assert.equal(defaultEval.pass,false,'direct crop evaluation must preserve .32 default');
assert.ok(defaultEval.reasons.includes('DETECTION_CONFIDENCE_LOW'));
assert.equal(defaultEval.minDetectionScore,.32);

const strongAt30=evaluateDetectionAcrossRoles({predictions:[strong],imageWidth:2560,imageHeight:1920,roles:[role],minScore:.30,textSafeLeft:.42,subjectX:.76});
const strongAt32=evaluateDetectionAcrossRoles({predictions:[strong],imageWidth:2560,imageHeight:1920,roles:[role],minScore:.32,textSafeLeft:.42,subjectX:.76});
assert.equal(strongAt30.roles.IDENTITY.pass,strongAt32.roles.IDENTITY.pass,'strong detections must be unaffected by configured threshold change');
assert.equal(strongAt32.roles.IDENTITY.pass,true);

console.log('Hero configured min-confidence semantics PASS',{marginalScore:marginal.score,configured30:'PASS',configured32:'REJECT',defaultDirectCropThreshold:.32,strongDetectionStable:true});
