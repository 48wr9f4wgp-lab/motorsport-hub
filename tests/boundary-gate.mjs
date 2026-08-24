import assert from 'node:assert/strict';

const ms={h:3600000,d:86400000};
const parse=s=>Date.parse(s);
const pick=(events,now,holdMs)=>events.find(e=>parse(e[1])+holdMs>now)?.[0]||null;

const WEC=[
 ['Lone Star Le Mans','2026-09-06T13:00:00-05:00'],
 ['6 Hours of Fuji','2026-09-27T12:00:00+09:00'],
 ['6 Hours of Barcelona','2026-10-18T12:00:00+02:00'],
 ['6 Hours of Monza','2026-11-08T12:00:00+01:00'],
];
const SGT=[
 ['第6戦 SUGO','2026-09-20T12:00:00+09:00'],
 ['第7戦 AUTOPOLIS','2026-10-18T12:00:00+09:00'],
 ['第8戦 MOTEGI','2026-11-08T12:00:00+09:00'],
];
const MOTO=[
 ['Grand Prix of Aragon','2026-08-30T14:00:00+02:00'],
 ['San Marino Grand Prix','2026-09-13T14:00:00+02:00'],
];

for(const [name,events,hold] of [['WEC',WEC,10*ms.h],['SUPER GT',SGT,8*ms.h],['MotoGP',MOTO,4*ms.h]]){
 const t=parse(events[0][1]);
 assert.equal(pick(events,t-ms.h,hold),events[0][0],`${name}: pre-start current event`);
 assert.equal(pick(events,t+ms.h,hold),events[0][0],`${name}: do not advance while active`);
 assert.equal(pick(events,t+hold-ms.h/60,hold),events[0][0],`${name}: hold through event window`);
 assert.equal(pick(events,t+hold+ms.h/60,hold),events[1][0],`${name}: advance after hold window`);
}

const active=(start,now,hold)=>now>=parse(start)&&now<parse(start)+hold;
assert(active('2026-08-27T09:00:00-03:00',parse('2026-08-28T09:00:00-03:00'),4*ms.d),'WRC: four-day rally hold');
assert(!active('2026-08-27T09:00:00-03:00',parse('2026-08-31T10:00:00-03:00'),4*ms.d),'WRC: advance after rally window');
assert(active('2026-09-05T09:00:00+09:00',parse('2026-09-06T05:00:00+09:00'),40*ms.h),'FDJ: weekend hold');
assert(active('2026-09-26T09:00:00+09:00',parse('2026-09-27T05:00:00+09:00'),40*ms.h),'D1GP: weekend hold');

const f1StillCurrent=(raceStart,now)=>parse(raceStart)>now-4*ms.h;
assert(f1StillCurrent('2026-09-06T13:00:00Z',parse('2026-09-06T15:00:00Z')),'F1: retain race shortly after start');
assert(!f1StillCurrent('2026-09-06T13:00:00Z',parse('2026-09-06T18:00:00Z')),'F1: release race after four-hour window');

console.log('Motorsport Hub boundary gate: PASS');
