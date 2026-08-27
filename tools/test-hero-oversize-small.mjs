import assert from 'node:assert/strict';
import {makeCrop} from './hero-crop-core.mjs';

const wide={class:'car',score:.9,bbox:[61,631,3734,862],areaFraction:.388};
const baseOpts={role:'IDENTITY',textSafeLeft:.42,subjectX:.76};
const legacySmall=makeCrop(3840,2160,wide,'small',baseOpts);
const balancedSmall=makeCrop(3840,2160,wide,'small',{...baseOpts,oversizeSmall:{enabled:true,balance:.5}});
assert.equal(legacySmall.cropMode,'CONTAINED');
assert.ok(legacySmall.normalized.x>.43,`legacy x=${legacySmall.normalized.x}`);
assert.equal(balancedSmall.cropMode,'BALANCED_OVERSIZE');
assert.equal(balancedSmall.oversizeSmallBalance,.5);
assert.ok(balancedSmall.normalized.x>.20&&balancedSmall.normalized.x<.24,`balanced x=${balancedSmall.normalized.x}`);
assert.ok(balancedSmall.normalized.x<legacySmall.normalized.x-.15,'balanced crop must materially restore front context');

const legacyMedium=makeCrop(3840,2160,wide,'medium',baseOpts);
const balancedMedium=makeCrop(3840,2160,wide,'medium',{...baseOpts,oversizeSmall:{enabled:true,balance:.5}});
assert.deepEqual(balancedMedium.normalized,legacyMedium.normalized,'oversizeSmall must not alter Medium crop');
assert.equal(balancedMedium.cropMode,'CONTAINED');

const normal={class:'car',score:.9,bbox:[1700,700,1100,650],areaFraction:.086};
const normalLegacy=makeCrop(3840,2160,normal,'small',baseOpts);
const normalOptIn=makeCrop(3840,2160,normal,'small',{...baseOpts,oversizeSmall:{enabled:true,balance:.5}});
assert.deepEqual(normalOptIn.normalized,normalLegacy.normalized,'normal-width subjects must remain unchanged');
assert.equal(normalOptIn.cropMode,'CONTAINED');

console.log('Hero oversize Small isolation PASS',{
  legacyX:Number(legacySmall.normalized.x.toFixed(4)),
  balancedX:Number(balancedSmall.normalized.x.toFixed(4)),
  mediumUnchanged:true,
  normalWidthUnchanged:true
});
