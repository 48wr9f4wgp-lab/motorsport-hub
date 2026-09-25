import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {runCategory,normalizeErrorCode} from '../tools/live-parser-monitor.mjs';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const registry=JSON.parse(fs.readFileSync(path.join(root,'category-registry.json'),'utf8'));
assert.equal(registry.categories.length,12,'monitor must cover all 12 production categories through registry iteration');
assert(registry.categories.every(x=>x.releaseStatus==='RELEASED'),'all monitored categories must be RELEASED');

const schedule={MRData:{RaceTable:{Races:[
  {round:'1',raceName:'Monitor GP',date:'2026-09-20',time:'12:00:00Z',Circuit:{circuitName:'Monitor Circuit'}},
  {round:'2',raceName:'Monitor Finale',date:'2026-12-01',time:'12:00:00Z',Circuit:{circuitName:'Final Circuit'}},
]}}};
const standings={MRData:{StandingsTable:{StandingsLists:[{DriverStandings:[
  {position:'1',points:'100',Driver:{givenName:'A',familyName:'Driver'},Constructors:[{name:'Mercedes'}]},
  {position:'2',points:'90',Driver:{givenName:'B',familyName:'Driver'},Constructors:[{name:'Ferrari'}]},
  {position:'3',points:'80',Driver:{givenName:'C',familyName:'Driver'},Constructors:[{name:'McLaren'}]},
]}]}}};

function jsonResponse(payload,status=200){return new Response(JSON.stringify(payload),{status,headers:{'content-type':'application/json'}})}
const goodFetch=async url=>String(url).includes('driverstandings')?jsonResponse(standings):jsonResponse(schedule);
const good=await runCategory('F1',{fetchImpl:goodFetch,attempts:1,nowMs:Date.parse('2026-09-14T08:00:00Z'),rootDir:root});
assert.equal(good.ok,true,'valid live-shaped F1 payloads should produce a fresh accepted cache');
const goodLast=good.attempts.at(-1);
assert.equal(goodLast.cacheWrites.length,1,'successful parser path must write exactly one fresh data cache');
assert.equal(goodLast.requests.filter(x=>x.kind!=='module').length,2,'F1 monitor must exercise both live schedule and standings sources');
assert(!/更新待ち/.test(goodLast.widget.textPreview),'successful monitor run must not render fallback/update-wait UI');

const driftFetch=async url=>String(url).includes('driverstandings')?jsonResponse({MRData:{StandingsTable:{StandingsLists:[]}}}):jsonResponse(schedule);
const drift=await runCategory('F1',{fetchImpl:driftFetch,attempts:1,nowMs:Date.parse('2026-09-14T08:00:00Z'),rootDir:root});
assert.equal(drift.ok,false,'parser-shape drift must fail the monitor even when HTTP succeeds');
assert.equal(drift.errorCode,'NO_FRESH_DATA_CACHE');
assert.equal(drift.attempts.at(-1).cacheWrites.length,0,'rejected live payload must not be mistaken for fresh data');

const network=await runCategory('F1',{fetchImpl:async()=>{throw Object.assign(new Error('sensitive upstream body must never be logged'),{code:'ECONNRESET'})},attempts:1,nowMs:Date.parse('2026-09-14T08:00:00Z'),rootDir:root});
assert.equal(network.ok,false);
assert.equal(network.errorCode,'ECONNRESET','transport failure must not masquerade as parser drift');
const forbidden=await runCategory('F1',{fetchImpl:async()=>jsonResponse({},403),attempts:1,rootDir:root});
assert.equal(forbidden.errorCode,'HTTP_403');
const invalidJson=await runCategory('F1',{fetchImpl:async()=>new Response('<html>not JSON</html>'),attempts:1,rootDir:root});
assert.equal(invalidJson.errorCode,'INVALID_JSON');
const serialized=JSON.stringify(network);
assert(!serialized.includes('sensitive upstream body'),'monitor report must not retain raw exception messages or response bodies');
assert(serialized.includes('ECONNRESET'),'normalized transport code should remain diagnosable');
assert.equal(normalizeErrorCode(Object.assign(new Error('x'),{status:503})),'HTTP_503');

const tool=fs.readFileSync(path.join(root,'tools/live-parser-monitor.mjs'),'utf8');
assert(!/responseBody|bodyPreview|rawBody/.test(tool),'monitor must not add response-body capture fields');
assert(/registry\.categories\.map/.test(tool),'default live monitoring must derive category coverage from registry, not a stale hard-coded subset');

console.log('Live parser monitor deterministic gate: PASS');
