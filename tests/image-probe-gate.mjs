import assert from 'node:assert/strict';
import {probeImageBuffer,probeRemoteImage} from '../tools/image-probe.mjs';
import {validateDiscoveryReport} from '../tools/validate-discovered-hero-images.mjs';

const png=Buffer.alloc(24);Buffer.from([0x89,0x50,0x4e,0x47,0x0d,0x0a,0x1a,0x0a]).copy(png,0);png.write('IHDR',12,'ascii');png.writeUInt32BE(2048,16);png.writeUInt32BE(1365,20);
const pp=probeImageBuffer(png);assert.deepEqual(pp,{ok:true,format:'PNG',width:2048,height:1365,reason:null});

const jpg=Buffer.from([0xff,0xd8,0xff,0xc0,0x00,0x11,0x08,0x05,0x55,0x08,0x00,0x03,0x01,0x11,0x00,0x02,0x11,0x00,0x03,0x11,0x00,0xff,0xd9]);
const jp=probeImageBuffer(jpg);assert.equal(jp.ok,true);assert.equal(jp.format,'JPEG');assert.equal(jp.width,2048);assert.equal(jp.height,1365);
assert.equal(probeImageBuffer(Buffer.alloc(30)).reason,'UNSUPPORTED_IMAGE_SIGNATURE');

const fakeFetch=async()=>({ok:true,status:200,headers:{get:k=>k==='content-type'?'image/jpeg':null},arrayBuffer:async()=>jpg});
const remote=await probeRemoteImage('https://example.test/a.jpg',fakeFetch);assert(remote.ok);assert.equal(remote.width,2048);assert.equal(remote.contentType,'image/jpeg');
const report={category:'DAKAR',candidates:[{eligibleForReview:true,title:'File:ok.jpg',sourcePage:'https://commons.wikimedia.org/wiki/File:ok.jpg',runtimeUrl:'https://example.test/a.jpg'}]};
const validated=await validateDiscoveryReport(report,{fetchImpl:fakeFetch});assert.equal(validated.summary.validForVisualReview,1);assert.equal(validated.results[0].validForVisualReview,true);assert.equal(validated.publicationPolicy,'VALIDATION_ONLY_NO_RUNTIME_MUTATION');
console.log('Motorsport Hub image probe gate: PASS');
