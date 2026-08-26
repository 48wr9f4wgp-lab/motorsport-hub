// Motorsport Hub v9.4.2-hardening — QA diagnostics
// Manual diagnostics: checks the eleven current category data dependencies without changing any widget cache/state.
(async()=>{
const C={bg:'#080B10',text:'#F7F9FB',muted:'#AEB8C4',ok:'#58DA8A',bad:'#FF6B6B',warn:'#FFB84D'};
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
 {name:'GTWC EUROPE',requests:[{kind:'text',url:'https://www.gt-world-challenge-europe.com/standings?filter_standing_type=0_0_drivers',check:x=>/Lucas Auer|Maro Engel|Ricardo Feller|GT World Challenge Europe Powered by AWS Drivers/i.test(x)}]}
];
async function request(q){const r=new Request(q.url);r.timeoutInterval=10;r.headers={'User-Agent':'Mozilla/5.0 MotorsportHubQA/9.4.2','Cache-Control':'no-cache'};const data=q.kind==='json'?await r.loadJSON():await r.loadString();return!!q.check(data)}
const run=async t=>{const s=Date.now();try{const checks=await Promise.all(t.requests.map(request)),ok=checks.every(Boolean);return{name:t.name,ok,ms:Date.now()-s,msg:ok?'LIVE':'PARSE'}}catch(e){return{name:t.name,ok:false,ms:Date.now()-s,msg:'NET'}}};
const results=await Promise.all(tests.map(run));
const all=results.every(x=>x.ok),count=results.filter(x=>x.ok).length,w=new ListWidget();w.backgroundColor=new Color(C.bg);w.setPadding(8,14,7,14);
const title=w.addText('Motorsport Hub  QA');title.font=Font.heavySystemFont(15.5);title.textColor=new Color(C.text);
const sub=w.addText(all?'11/11 LIVE — データ経路OK':`${count}/11 LIVE — 要確認`);sub.font=Font.semiboldSystemFont(9.2);sub.textColor=new Color(all?C.ok:C.warn);w.addSpacer(3);
for(const x of results){const row=w.addStack();row.layoutHorizontally();row.centerAlignContent();const a=row.addText('●');a.font=Font.boldSystemFont(8.8);a.textColor=new Color(x.ok?C.ok:C.bad);row.addSpacer(5);const n=row.addText(x.name);n.font=Font.semiboldSystemFont(8.9);n.textColor=new Color(C.text);n.lineLimit=1;n.minimumScaleFactor=.64;row.addSpacer();const st=row.addText(`${x.msg}  ${x.ms}ms`);st.font=Font.systemFont(7.7);st.textColor=new Color(x.ok?C.muted:C.bad);w.addSpacer(1)}
const rel=globalThis.__MH_RELEASE_INTEGRITY,src=String(rel?.sourceRef||''),pinned=/^[0-9a-f]{40}$/i.test(src),hasRel=!!rel;
const path=pinned?(globalThis.__MH_REMOTE_OFFLINE===true?'LKG':'CANDIDATE'):'DEV';
const footText=pinned?`IMMUTABLE ✓ · ${path} · ${src.slice(0,12)}`:(hasRel?'INTEGRITY INVALID':'DEV ROUTER · integrity OFF');
const foot=w.addText(footText);foot.font=Font.semiboldSystemFont(7.2);foot.textColor=new Color(pinned?C.ok:(hasRel?C.bad:C.muted));foot.lineLimit=1;w.refreshAfterDate=new Date(Date.now()+10*60000);
if(config.runsInWidget)Script.setWidget(w);else await w.presentMedium();Script.complete();
})();