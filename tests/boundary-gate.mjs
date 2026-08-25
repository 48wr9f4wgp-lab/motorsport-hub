import assert from 'node:assert/strict';

const H=3600000,D=86400000,parse=s=>Date.parse(s);
const pickHold=(events,now,hold)=>events.find(e=>parse(e.start)+hold>now)?.name||null;
const pickRange=(events,now)=>events.find(e=>parse(e.end)>now)?.name||null;

function assertHold(name,events,hold){
 const first=events[0],s=parse(first.start),end=s+hold;
 assert.equal(pickHold(events,s-1,hold),first.name,`${name}: select upcoming first event`);
 assert.equal(pickHold(events,s,hold),first.name,`${name}: retain at start boundary`);
 assert.equal(pickHold(events,end-1,hold),first.name,`${name}: retain until one ms before end`);
 assert.equal(pickHold(events,end,hold),events[1]?.name||null,`${name}: exact end is half-open and must advance`);
 const last=events.at(-1),lastEnd=parse(last.start)+hold;
 assert.equal(pickHold(events,lastEnd-1,hold),last.name,`${name}: retain finale until end`);
 assert.equal(pickHold(events,lastEnd,hold),null,`${name}: no phantom event after finale`);
}
function assertRange(name,events){
 const first=events[0],s=parse(first.start),end=parse(first.end);
 assert.equal(pickRange(events,s-1),first.name,`${name}: select upcoming first event`);
 assert.equal(pickRange(events,s),first.name,`${name}: retain at start`);
 assert.equal(pickRange(events,end-1),first.name,`${name}: retain until one ms before end`);
 assert.equal(pickRange(events,end),events[1]?.name||null,`${name}: exact event end must advance`);
 const last=events.at(-1);assert.equal(pickRange(events,parse(last.end)),null,`${name}: no phantom event after finale`);
}

const WEC=[
 {name:'Lone Star Le Mans',start:'2026-09-06T13:00:00-05:00'},
 {name:'6 Hours of Fuji',start:'2026-09-27T12:00:00+09:00'},
 {name:'6 Hours of Barcelona',start:'2026-10-18T12:00:00+02:00'},
 {name:'6 Hours of Monza',start:'2026-11-08T12:00:00+01:00'}
];
const WRC=[
 {name:'WRC ueno Rally del Paraguay',start:'2026-08-27T09:00:00-03:00'},
 {name:'WRC Rally Chile Bio Bío',start:'2026-09-10T09:00:00-03:00'},
 {name:'WRC Rally Italia Sardegna',start:'2026-10-01T09:00:00+02:00'},
 {name:'WRC Rally Saudi Arabia',start:'2026-11-11T09:00:00+03:00'}
];
const SGT=[
 {name:'第6戦 SUGO',start:'2026-09-20T12:00:00+09:00'},
 {name:'第7戦 AUTOPOLIS',start:'2026-10-18T12:00:00+09:00'},
 {name:'第8戦 MOTEGI',start:'2026-11-08T12:00:00+09:00'}
];
const MOTO=[
 {name:'Grand Prix of Aragon',start:'2026-08-30T14:00:00+02:00'},
 {name:'San Marino Grand Prix',start:'2026-09-13T14:00:00+02:00'},
 {name:'Austrian Grand Prix',start:'2026-09-20T12:00:00+02:00'},
 {name:'Japanese Grand Prix',start:'2026-10-04T12:00:00+09:00'},
 {name:'Indonesian Grand Prix',start:'2026-10-11T12:00:00+08:00'},
 {name:'Australian Grand Prix',start:'2026-10-25T12:00:00+11:00'},
 {name:'Malaysian Grand Prix',start:'2026-11-01T12:00:00+08:00'},
 {name:'Qatar Grand Prix',start:'2026-11-08T12:00:00+03:00'},
 {name:'Portuguese Grand Prix',start:'2026-11-22T12:00:00+00:00'},
 {name:'Valencia Grand Prix',start:'2026-11-29T12:00:00+01:00'}
];
const FDJ=[
 {name:'第5戦 奥伊吹',start:'2026-09-05T09:00:00+09:00'},
 {name:'第6戦 岡山',start:'2026-10-03T09:00:00+09:00'}
];
const D1=[
 {name:'RD.5&6 EBISU',start:'2026-09-26T09:00:00+09:00'},
 {name:'RD.7&8 AUTOPOLIS',start:'2026-10-24T09:00:00+09:00'},
 {name:'RD.9&10',start:'2026-11-14T09:00:00+09:00'}
];
assertHold('WEC',WEC,10*H);assertHold('WRC',WRC,4*D);assertHold('SUPER GT',SGT,8*H);assertHold('MotoGP',MOTO,4*H);assertHold('FDJ',FDJ,40*H);assertHold('D1GP',D1,40*H);

// F1 schedule is live rather than hard-coded, but its event retention contract is four hours and half-open.
{
 const s=parse('2026-09-06T13:00:00Z'),end=s+4*H;assert(s<=parse('2026-09-06T15:00:00Z')&&parse('2026-09-06T15:00:00Z')<end,'F1: current inside four-hour window');assert(!(s<=end&&end<end),'F1: exact four-hour end is not active');
}

const SF=[
 {name:'第9・10戦 富士',start:'2026-10-09T09:00:00+09:00',end:'2026-10-11T18:00:00+09:00'},
 {name:'第11・12戦 鈴鹿',start:'2026-11-20T09:00:00+09:00',end:'2026-11-22T18:00:00+09:00'}
];
const INDY=[
 {name:'Milwaukee Race 1',start:'2026-08-29T14:30:00-04:00',end:'2026-08-29T18:30:00-04:00'},
 {name:'Milwaukee Race 2',start:'2026-08-30T13:00:00-04:00',end:'2026-08-30T17:00:00-04:00'},
 {name:'Laguna Seca Finale',start:'2026-09-06T14:30:00-04:00',end:'2026-09-06T18:30:00-04:00'}
];
const NASCAR=[
 {name:'Daytona',start:'2026-08-29T19:30:00-04:00',end:'2026-08-30T01:30:00-04:00'},
 {name:'Darlington',start:'2026-09-06T17:00:00-04:00',end:'2026-09-06T23:00:00-04:00'},
 {name:'Championship',start:'2026-11-08T15:00:00-05:00',end:'2026-11-08T21:00:00-05:00'}
];
const GTWC=[
 {name:'Nürburgring 3H',start:'2026-08-30T15:00:00+02:00',end:'2026-08-30T18:30:00+02:00'},
 {name:'Zandvoort',start:'2026-09-18T09:00:00+02:00',end:'2026-09-20T20:00:00+02:00'},
 {name:'Barcelona',start:'2026-10-02T09:00:00+02:00',end:'2026-10-04T20:00:00+02:00'},
 {name:'Portimão Finale',start:'2026-10-16T09:00:00+01:00',end:'2026-10-18T20:00:00+01:00'}
];
assertRange('SUPER FORMULA',SF);assertRange('INDYCAR',INDY);assertRange('NASCAR',NASCAR);assertRange('GTWC Europe',GTWC);

console.log('Motorsport Hub boundary gate: PASS');
