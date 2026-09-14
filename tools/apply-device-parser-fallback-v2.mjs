import fs from 'node:fs';

const read=p=>fs.readFileSync(p,'utf8');
const write=(p,s)=>fs.writeFileSync(p,s);
function replaceOnce(src,re,replacement,label){
  const next=src.replace(re,replacement);
  if(next===src)throw new Error(`patch target not found: ${label}`);
  return next;
}

let wec=read('wec-widget-flat-v1000.js').replaceAll('v10.0.4-hardening','v10.0.5-hardening');
const wecBlock=String.raw`function makerName(raw){return String(raw||'').replace(/\bImage\b/gi,' ').replace(/\s+/g,' ').trim().toUpperCase()}
const escRe=s=>String(s).replace(/[.*+?^$()|[\]\\]/g,'\\$&');
const WEC_MAKER_RE=Object.keys(META).sort((a,b)=>b.length-a.length).map(escRe).join('|');
function wecPlainRows(plain){
 let section=String(plain||''),start=section.search(/FIA Hypercar World Endurance Manufacturers/i);if(start<0)return[];section=section.slice(start);const end=section.search(/FIA Hypercar World Endurance Drivers/i);section=end>0?section.slice(0,end):section.slice(0,6000);
 const marks=[],re=new RegExp('(?:^|\\s)(\\d{1,2})\\s+(?:Image\\s+)?('+WEC_MAKER_RE+')(?=\\s)','gi');let m;while((m=re.exec(section)))marks.push({pos:Number(m[1]),maker:makerName(m[2]),start:m.index,end:re.lastIndex});
 const out=[];for(let i=0;i<marks.length;i++){const q=marks[i],chunk=section.slice(q.end,i+1<marks.length?marks[i+1].start:section.length),nums=(chunk.match(/-?\d+(?:\.\d+)?/g)||[]).map(Number).filter(Number.isFinite),pts=nums.length?nums[nums.length-1]:NaN;if(!(q.pos>=1&&q.pos<=30)||!META[q.maker]||!isFinite(pts))continue;const meta=META[q.maker];out.push({pos:q.pos,name:q.maker,points:String(pts)+' pts',maker:q.maker,machine:meta[0],team:meta[1]})}return out
}
async function update(d){
 const h=await txt(DATA_SOURCE),plain=clean(h);if(!/Manufacturers['’]?\s*standings/i.test(plain)||!/FIA Hypercar World Endurance Manufacturers/i.test(plain))throw Error('WEC table identity');let a=[];
 for(const c of rows(h)){if(c.length<3)continue;const p=num(c[0]),maker=makerName(c[1]),pts=num(c[c.length-1]);if(!(p>=1&&p<=30)||!META[maker]||!isFinite(pts))continue;const m=META[maker];a.push({pos:p,name:maker,points:String(pts)+' pts',maker,machine:m[0],team:m[1]})}
 if(a.length<3)a=wecPlainRows(plain);a.sort((x,y)=>x.pos-y.pos);const seen=new Set(),u=[];for(const r of a){if(seen.has(r.pos))continue;seen.add(r.pos);u.push(r);if(u.length>=5)break}if(u.length<3||u[0].pos!==1)throw Error('WEC standings');d.ranking=u;return nextEvent(d)
}
async function load()`;
wec=replaceOnce(wec,/function makerName\(raw\)\{[\s\S]*?\n\}\nasync function load\(\)/,wecBlock,'WEC parser block');
write('wec-widget-flat-v1000.js',wec);

let sgt=read('supergt-widget-flat-v1000.js').replaceAll('v10.0.4-hardening','v10.0.5-hardening');
const sgtBlock=String.raw`function fallbackName(raw){const s=String(raw||'').replace(/　/g,' ').replace(/\s+/g,' ').trim();return s||'GT500 DRIVER'}
const GT500_NOS=new Set(['8','12','14','16','17','19','23','24','36','37','38','39','64','100']);
function supergtPlainRows(plain){
 let section=String(plain||''),start=section.search(/(?:順位|Ranking)\s+No\.?\s+(?:ドライバー|Driver)/i);if(start<0)return[];section=section.slice(start);const end=section.search(/(?:決勝順位|Final Standings)/i);section=end>0?section.slice(0,end):section.slice(0,12000);const hasSW=/\bSW\b/i.test(section.slice(0,500));
 const marks=[],re=/(?:^|\s)(\d{1,2})\s+(\d{1,3})\s+/g;let m,last=0;while((m=re.exec(section))){const pos=Number(m[1]),no=String(m[2]);if(!GT500_NOS.has(no))continue;if(!marks.length){if(pos!==1)continue}else if(pos!==last+1)continue;marks.push({pos,no,start:m.index,end:re.lastIndex});last=pos;if(marks.length>=20)break}
 const out=[];for(let i=0;i<marks.length;i++){const q=marks[i],chunk=section.slice(q.end,i+1<marks.length?marks[i+1].start:section.length),scoreAt=chunk.search(/(?:^|\s)(?:－|—|-?\d+(?:\.\d+)?)\s/),nameRaw=fallbackName(scoreAt>0?chunk.slice(0,scoreAt):chunk),scorePart=scoreAt>=0?chunk.slice(scoreAt):'',nums=(scorePart.match(/-?\d+(?:\.\d+)?/g)||[]).map(Number).filter(Number.isFinite);let pts=NaN;if(hasSW){if(q.pos===1&&nums.length>=2)pts=nums[nums.length-2];else if(nums.length>=3&&nums[nums.length-2]<0)pts=nums[nums.length-3];else if(nums.length>=2)pts=nums[nums.length-2]}else{if(q.pos===1&&nums.length>=1)pts=nums[nums.length-1];else if(nums.length>=2&&nums[nums.length-1]<0)pts=nums[nums.length-2];else if(nums.length>=1)pts=nums[nums.length-1]}if(!isFinite(pts))continue;const meta=META[q.no]||{name:nameRaw,maker:'',machine:'GT500',team:'No.'+q.no};out.push({pos:q.pos,no:q.no,name:meta.name||nameRaw,points:String(pts)+' pts',maker:meta.maker||'',machine:meta.machine||'GT500',team:meta.team||('No.'+q.no)})}return out
}
async function update(d){
 const h=await txt(DATA_SOURCE),plain=clean(h),tableRows=rows(h);if(!/GT\s*500/i.test(plain)||!/(?:ドライバーランキング|Driver Ranking)/i.test(plain))throw Error('SUPER GT table identity');let totalIndex=-1;
 for(const c of tableRows){const i=c.findIndex(v=>/^(?:合計|Total(?:\s*points?)?)$/i.test(String(v||'').trim()));if(i>=0&&c.some(v=>/(?:ドライバー|Driver)/i.test(String(v||'')))){totalIndex=i;break}}
 let a=[];if(totalIndex>=3){for(const c of tableRows){if(c.length<=totalIndex)continue;const p=num(c[0]),no=String(c[1]||'').match(/\d+/)?.[0]||'',pts=num(c[totalIndex]);if(!(p>=1&&p<=30)||!GT500_NOS.has(no)||!isFinite(pts))continue;const meta=META[no]||{name:fallbackName(c[2]),maker:'',machine:'GT500',team:'No.'+no};a.push({pos:p,no,name:meta.name||fallbackName(c[2]),points:String(pts)+' pts',maker:meta.maker||'',machine:meta.machine||'GT500',team:meta.team||('No.'+no)})}}
 if(a.length<3)a=supergtPlainRows(plain);a.sort((x,y)=>x.pos-y.pos);const seen=new Set(),u=[];for(const r of a){if(seen.has(r.pos))continue;seen.add(r.pos);u.push(r);if(u.length>=5)break}if(u.length<3||u[0].pos!==1)throw Error('SUPER GT standings');d.ranking=u;return nextEvent(d)
}
async function load()`;
sgt=replaceOnce(sgt,/function fallbackName\(raw\)\{[\s\S]*?\n\}\nasync function load\(\)/,sgtBlock,'SUPER GT parser block');
write('supergt-widget-flat-v1000.js',sgt);

let wecTest=read('tests/wec-flat-gate.mjs');
if(!wecTest.includes('device-shaped no-table WEC')){
 const insert=String.raw`
// Regression: device-shaped no-table WEC response must parse from normalized text.
{
 const html="<html><body><div>Manufacturers' standings</div><div>FIA Hypercar World Endurance Manufacturers Championship Pos. Manufacturer Race pts Total points 1 TOYOTA 8 140 2 BMW 4 131 3 FERRARI 25 +1 114 4 CADILLAC 20 80 5 ALPINE 25 66 FIA Hypercar World Endurance Drivers Championship</div></body></html>";
 const r=await run({now:'2026-09-20T12:00:00+09:00',html}),p=JSON.parse(r.files.get(r.cachePath));assert.equal(p.ranking.length,5,'device-shaped no-table WEC must keep top five');assert.deepEqual(p.ranking.map(x=>x.points),['140 pts','131 pts','114 pts','80 pts','66 pts']);assert(!r.sink.includes('• 更新待ち'));
}
`;
 wecTest=wecTest.replace("\nconsole.log('Motorsport Hub flattened WEC gate: PASS');",insert+"\nconsole.log('Motorsport Hub flattened WEC gate: PASS');");
}
write('tests/wec-flat-gate.mjs',wecTest);

let sgtTest=read('tests/supergt-flat-gate.mjs');
if(!sgtTest.includes('device-shaped no-table SUPER GT')){
 const insert=String.raw`
// Regression: device-shaped no-table SUPER GT response must parse from normalized text.
{
 const html="<html><body><div>GT500 ドライバーランキング</div><div>順位 No. ドライバー Rd1 Rd2 Rd3 Rd4 Rd5 Rd6 Rd7 Rd8 合計 差 SW 1 36 坪井　翔 山下　健太 20 20 － 8 2 50 100 2 16 野尻　智紀 佐藤　蓮 5 6 － 2 20 33 -17 66 3 14 福住　仁嶺 大嶋　和也 8 16 － 4 3 31 -19 62 4 100 山本　尚貴 牧野　任祐 4 3 － 20 27 -23 54 5 8 太田　格之進 大津　弘樹 16 11 27 -23 54 決勝順位 1位 2位</div></body></html>";
 const r=await run({now:'2026-09-14T19:49:00+09:00',html}),p=JSON.parse(r.files.get(r.cachePath));assert.equal(p.ranking.length,5,'device-shaped no-table SUPER GT must keep top five');assert.deepEqual(p.ranking.map(x=>x.points),['50 pts','33 pts','31 pts','27 pts','27 pts']);assert.equal(p.ranking[3].no,'100');assert.equal(p.ranking[4].no,'8');assert(!r.sink.includes('• 更新待ち'));
}
`;
 sgtTest=sgtTest.replace("\nconsole.log('Motorsport Hub flattened SUPER GT gate: PASS');",insert+"\nconsole.log('Motorsport Hub flattened SUPER GT gate: PASS');");
}
write('tests/supergt-flat-gate.mjs',sgtTest);

console.log('Applied device parser fallback patch v2.');
