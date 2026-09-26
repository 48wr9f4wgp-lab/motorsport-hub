// Motorsport Hub v9.5.32-hardening — QA diagnostics
// Manual diagnostics: checks the twelve current category data dependencies without changing any widget cache/state.
// Dakar additionally runs the production-equivalent standings parser against the exact response used by QA.
(async()=>{
const C={bg:'#080B10',text:'#F7F9FB',muted:'#AEB8C4',ok:'#58DA8A',bad:'#FF6B6B',warn:'#FFB84D'};
let dakarRankingRaw='';
const tests=[
 {name:'F1',requests:[
  {kind:'json',url:'https://api.jolpi.ca/ergast/f1/2026.json?limit=100',check:x=>((x?.MRData?.RaceTable?.Races||[]).length>=10)},
  {kind:'json',url:'https://api.jolpi.ca/ergast/f1/2026/driverstandings.json',check:x=>((x?.MRData?.StandingsTable?.StandingsLists?.[0]?.DriverStandings||[]).length>=3)}
 ]},
 {name:'WEC',requests:[{kind:'text',url:'https://www.fiawec.com/en/page/manufacturers-classification/34',check:x=>/2026/i.test(x)&&/TOYOTA/i.test(x)&&/BMW/i.test(x)&&/FERRARI/i.test(x)&&/(Manufacturer|Manufacturers|Constructeur|Constructeurs|Hypercar)/i.test(x)}]},
 {name:'WRC',requests:[{kind:'text',url:'https://www.fia.com/events/world-rally-championship/season-2026/standings',check:x=>/2026 FIA World Rally Championship for Drivers/i.test(x)&&/Elfyn Evans|Sami Pajari|Takamoto Katsuta/i.test(x)}]},
 {name:'MotoGP',requests:[{kind:'text',url:'https://stats.motogp.com/en/world-standing',check:x=>/Riders'? Championship|RIDERS'? CHAMPIONSHIP/i.test(x)&&/MotoGP/i.test(x)&&/Aprilia|Ducati|Honda|Yamaha|KTM/i.test(x)}]},
 {name:'SUPER GT',requests:[{kind:'text',url:'https://supergt.net/driver_ranking?gt_class=gt500&series=2026',check:x=>/GT\s*500/i.test(x)&&/(?:ドライバーランキング|Driver Ranking)/i.test(x)&&/坪井|野尻|福住|Sho Tsuboi|Tomoki Nojiri/i.test(x)}]},
 {name:'FDJ',requests:[{kind:'text',url:'https://formulad.jp/2026-fdj-standings/',check:x=>/CONNOR|RYUMA|KAZUMI|standings/i.test(x)}]},
 {name:'D1GP',requests:[{kind:'text',url:'https://d1gp.co.jp/2026d1%E3%82%B0%E3%83%A9%E3%83%B3%E3%83%97%E3%83%AA%E3%82%B7%E3%83%AA%E3%83%BC%E3%82%BA%E3%83%A9%E3%83%B3%E3%82%AD%E3%83%B3%E3%82%B0/',check:x=>/2026年ドライバーズランキング|2026年D1グランプリシリーズランキング/.test(x)&&/横井|中村|蕎麦切/.test(x)}]},
 {name:'SUPER FORMULA',requests:[{kind:'text',url:'https://superformula.net/sf2/race2026/standings',check:x=>/太田\s*格之進|岩佐\s*歩夢|イゴール.*フラガ|Driver Standings/i.test(x)}]},
 {name:'INDYCAR',requests:[{kind:'text',url:'https://www.indycar.com/standings/',check:x=>/Alex Palou|Kyle Kirkwood|Christian Lundgaard|Championship Standings/i.test(x)}]},
 {name:'NASCAR',requests:[{kind:'json',url:'https://cf.nascar.com/cacher/2026/1/points-feed.json',check:x=>Array.isArray(x)&&x.length>=3&&x.slice(0,5).some(d=>d?.driver_name)&&x.slice(0,5).some(d=>Number.isFinite(Number(d?.points)))}]},
 {name:'GTWC EUROPE',requests:[{kind:'text',url:'https://www.gt-world-challenge-europe.com/standings?filter_standing_type=0_0_drivers',check:x=>/Lucas Auer|Maro Engel|Ricardo Feller|GT World Challenge Europe Powered by AWS Drivers/i.test(x)}]},
 {name:'DAKAR',requests:[
  {kind:'text',url:'https://www.dakar.com/en/overall-route?iframe=true',check:x=>/2027/i.test(x)&&/Stage 13/i.test(x)&&/King Abdullah Economic City/i.test(x)},
  {kind:'text',url:'https://www.dakar.com/fr/webview/rankings/stage-13/auto?year=2026',capture:'dakar-ranking',check:x=>/NASSER AL-ATTIYAH/i.test(x)&&/NANI ROMA/i.test(x)&&/MATTIAS EKSTR[ÖO]M/i.test(x)}
 ]}
];
async function request(q){const r=new Request(q.url);r.timeoutInterval=10;r.headers={'User-Agent':'Mozilla/5.0 MotorsportHubQA/9.5.32','Cache-Control':'no-cache'};const data=q.kind==='json'?await r.loadJSON():await r.loadString();if(q.capture==='dakar-ranking')dakarRankingRaw=String(data||'');return!!q.check(data)}
const run=async t=>{const s=Date.now();try{const checks=await Promise.all(t.requests.map(request)),ok=checks.every(Boolean);return{name:t.name,ok,ms:Date.now()-s,msg:ok?'LIVE':'PARSE'}}catch(e){return{name:t.name,ok:false,ms:Date.now()-s,msg:'NET'}}};
const clean=s=>String(s||'').replace(/<script[\s\S]*?<\/script>/gi,' ').replace(/<style[\s\S]*?<\/style>/gi,' ').replace(/<[^>]+>/g,' ').replace(/&nbsp;|&#160;/gi,' ').replace(/&amp;/gi,'&').replace(/&#(x[0-9a-f]+|[0-9]+);/gi,(entity,code)=>{const n=code[0].toLowerCase()==='x'?parseInt(code.slice(1),16):Number(code);return n>0&&n<=0x10ffff?String.fromCodePoint(n):entity}).replace(/&(?:apos|rsquo|lsquo|prime);/g,"'").replace(/&(?:quot|rdquo|ldquo|Prime);/g,"''").replace(/[‘’′ʼ]/g,"'").replace(/[“”″"]/g,"''").replace(/\s+/g,' ').trim();
function dakarRows(h){const out=[];for(const tr of String(h||'').match(/<tr\b[\s\S]*?<\/tr>/gi)||[]){const a=[];let m,re=/<t[dh]\b[^>]*>([\s\S]*?)<\/t[dh]>/gi;while((m=re.exec(tr)))a.push(clean(m[1]));if(a.length)out.push(a)}return out}
const dNum=v=>{const m=String(v||'').replace(/,/g,'').match(/-?\d+(?:\.\d+)?/);return m?Number(m[0]):NaN};
function dTimeSeconds(v){const m=String(v||'').match(/(?:(\d+)\s*h)?\s*(\d+)'\s*(\d+)''/);return m?Number(m[1]||0)*3600+Number(m[2])*60+Number(m[3]):NaN}
function dGapText(sec){const n=Math.max(0,Math.round(Number(sec)||0)),h=Math.floor(n/3600),m=Math.floor((n%3600)/60),ss=n%60,p=v=>String(v).padStart(2,'0');return h?'+'+h+':'+p(m)+':'+p(ss):'+'+m+':'+p(ss)}
function dValidGap(g,pos){const x=String(g||'').trim();return Number(pos)===1?x==='—'||x==='+0:00':/^\+\d{1,3}:\d{2}(?::\d{2})?$/.test(x)}
function dakarProductionDiag(h){
 const rr=dakarRows(h),out=[];let candidates=0,timeHits=0;
 for(const c of rr){
  const p=dNum(c[0]),no=String(c[1]||'').match(/\d+/)?.[0]||'';if(!(p>=1&&p<=80)||!no)continue;
  let di=-1;for(let i=2;i<c.length;i++){if((String(c[i]).match(/\([a-z]{3}\)/ig)||[]).length>=2){di=i;break}}if(di<0)continue;candidates++;
  const parts=String(c[di]).split(/\([a-z]{3}\)/ig).map(x=>x.trim()).filter(Boolean),name=String(parts[1]||'').trim();if(!name)continue;
  const time=c.find(x=>/^\d+h\s*\d+'\s*\d+''/.test(String(x)))||'';if(time)timeHits++;
  const gapCell=c.find(x=>/^\+\s*\d+h\s*\d+'\s*\d+''/.test(String(x)))||'',parsedGap=dTimeSeconds(gapCell),gap=p===1?'—':Number.isFinite(parsedGap)?dGapText(parsedGap):'';
  out.push({pos:p,no,name,time,gap});
 }
 out.sort((a,b)=>a.pos-b.pos);const seen=new Set(),u=[];for(const r of out){if(seen.has(r.pos))continue;seen.add(r.pos);u.push(r);if(u.length>=5)break}
 const lead=dTimeSeconds(u[0]?.time);if(Number.isFinite(lead)){for(const r of u){if(Number(r.pos)===1){r.gap='—';continue}if(dValidGap(r.gap,r.pos))continue;const t=dTimeSeconds(r.time);if(Number.isFinite(t)&&t>=lead)r.gap=dGapText(t-lead)}}
 const gapHits=u.filter(r=>dValidGap(r.gap,r.pos)).length,valid=u.length>=3&&u.slice(0,5).every(r=>Number(r.pos)>=1&&String(r.name||'').trim()&&dValidGap(r.gap,r.pos));
 return{rows:rr.length,candidates,parsed:u.length,timeHits,gapHits,valid,bytes:String(h||'').length};
}
const results=await Promise.all(tests.map(run));
const dakarProd=dakarProductionDiag(dakarRankingRaw);
const all=results.every(x=>x.ok),count=results.filter(x=>x.ok).length,w=new ListWidget();w.backgroundColor=new Color(C.bg);w.setPadding(8,14,7,14);
const title=w.addText('Motorsport Hub  QA');title.font=Font.heavySystemFont(15.5);title.textColor=new Color(C.text);
const sub=w.addText(all?'12/12 LIVE — データ経路OK':`${count}/12 LIVE — 要確認`);sub.font=Font.semiboldSystemFont(9.2);sub.textColor=new Color(all?C.ok:C.warn);w.addSpacer(3);
for(const x of results){const row=w.addStack();row.layoutHorizontally();row.centerAlignContent();const a=row.addText('●');a.font=Font.boldSystemFont(8.3);a.textColor=new Color(x.ok?C.ok:C.bad);row.addSpacer(5);const n=row.addText(x.name);n.font=Font.semiboldSystemFont(8.3);n.textColor=new Color(C.text);n.lineLimit=1;n.minimumScaleFactor=.60;row.addSpacer();const detail=x.name==='DAKAR'&&x.ok?`LIVE · R${dakarProd.rows} C${dakarProd.candidates} P${dakarProd.parsed} T${dakarProd.timeHits} G${dakarProd.gapHits} V${dakarProd.valid?1:0}`:`${x.msg}  ${x.ms}ms`;const st=row.addText(detail);st.font=Font.systemFont(x.name==='DAKAR'?6.3:7.3);st.minimumScaleFactor=.52;st.lineLimit=1;st.textColor=new Color(x.name==='DAKAR'&&x.ok&&!dakarProd.valid?C.warn:(x.ok?C.muted:C.bad));w.addSpacer(.5)}
const rel=globalThis.__MH_RELEASE_INTEGRITY,src=String(rel?.sourceRef||''),pinned=/^[0-9a-f]{40}$/i.test(src),hasRel=!!rel;
const path=pinned?(globalThis.__MH_REMOTE_OFFLINE===true?'LKG':'CANDIDATE'):'DEV';
const footText=pinned?`IMMUTABLE ✓ · ${path} · ${src.slice(0,12)}`:(hasRel?'INTEGRITY INVALID':'DEV ROUTER · integrity OFF');
const foot=w.addText(footText);foot.font=Font.semiboldSystemFont(7.0);foot.textColor=new Color(pinned?C.ok:(hasRel?C.bad:C.muted));foot.lineLimit=1;w.refreshAfterDate=new Date(Date.now()+10*60000);
if(config.runsInWidget)Script.setWidget(w);else await w.presentMedium();Script.complete();
})();