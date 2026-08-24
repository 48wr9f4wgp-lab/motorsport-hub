// Motorsport Hub v9.3.0 — QA diagnostics
// Manual diagnostics: checks the eleven live data routes without changing any widget cache/state.
(async()=>{
const C={bg:'#080B10',text:'#F7F9FB',muted:'#AEB8C4',ok:'#58DA8A',bad:'#FF6B6B',warn:'#FFB84D'};
const tests=[
 {name:'F1',kind:'json',url:'https://api.jolpi.ca/ergast/f1/2026/driverstandings.json',check:x=>((x?.MRData?.StandingsTable?.StandingsLists?.[0]?.DriverStandings||[]).length>=3)},
 {name:'WEC',kind:'text',url:'https://www.fiawec.com/fr/page/classement-constructeurs',check:x=>/TOYOTA|FERRARI|BMW/i.test(x)},
 {name:'WRC',kind:'text',url:'https://www.fia.com/events/world-rally-championship/season-2026/standings',check:x=>/Elfyn Evans|Sami Pajari|Takamoto Katsuta/i.test(x)},
 {name:'MotoGP',kind:'text',url:'https://stats.motogp.com/en/world-standing',check:x=>/Aprilia|Ducati|Honda|Yamaha|KTM/i.test(x)},
 {name:'SUPER GT',kind:'text',url:'https://supergt.net/',check:x=>/GT.?500|SUPER.?GT/i.test(x)},
 {name:'FDJ',kind:'text',url:'https://formulad.jp/2026-fdj-standings/',check:x=>/CONNOR|RYUMA|KAZUMI|standings/i.test(x)},
 {name:'D1GP',kind:'text',url:'https://d1gp.co.jp/2026d1%E3%82%B0%E3%83%A9%E3%83%B3%E3%83%97%E3%83%AA%E3%82%B7%E3%83%AA%E3%83%BC%E3%82%BA%E3%83%A9%E3%83%B3%E3%82%AD%E3%83%B3%E3%82%B0/',check:x=>/横井|中村|蕎麦切|ランキング/.test(x)},
 {name:'SUPER FORMULA',kind:'text',url:'https://superformula.net/sf2/race2026/standings',check:x=>/太田\s*格之進|岩佐\s*歩夢|イゴール.*フラガ|Driver Standings/i.test(x)},
 {name:'INDYCAR',kind:'text',url:'https://www.indycar.com/standings/',check:x=>/Alex Palou|Kyle Kirkwood|Christian Lundgaard|Championship Standings/i.test(x)},
 {name:'NASCAR',kind:'json',url:'https://cf.nascar.com/cacher/2026/1/points-feed.json',check:x=>Array.isArray(x)&&x.length>=3&&x.slice(0,5).some(d=>d?.driver_name)&&x.slice(0,5).some(d=>Number.isFinite(Number(d?.points)))},
 {name:'GTWC EUROPE',kind:'text',url:'https://www.gt-world-challenge-europe.com/standings?filter_standing_type=0_0_drivers',check:x=>/Lucas Auer|Maro Engel|Ricardo Feller|GT World Challenge Europe Powered by AWS Drivers/i.test(x)}
];
const run=async t=>{const s=Date.now();try{const r=new Request(t.url);r.timeoutInterval=10;r.headers={'User-Agent':'Mozilla/5.0 MotorsportHubQA/9.3','Cache-Control':'no-cache'};const data=t.kind==='json'?await r.loadJSON():await r.loadString();const ok=!!t.check(data);return{name:t.name,ok,ms:Date.now()-s,msg:ok?'LIVE':'PARSE'}}catch(e){return{name:t.name,ok:false,ms:Date.now()-s,msg:'NET'}}};
const results=await Promise.all(tests.map(run));
const all=results.every(x=>x.ok),count=results.filter(x=>x.ok).length,w=new ListWidget();w.backgroundColor=new Color(C.bg);w.setPadding(8,14,7,14);
const title=w.addText('Motorsport Hub  QA');title.font=Font.heavySystemFont(15.5);title.textColor=new Color(C.text);
const sub=w.addText(all?'11/11 LIVE — データ経路OK':`${count}/11 LIVE — 要確認`);sub.font=Font.semiboldSystemFont(9.2);sub.textColor=new Color(all?C.ok:C.warn);w.addSpacer(3);
for(const x of results){const row=w.addStack();row.layoutHorizontally();row.centerAlignContent();const a=row.addText('●');a.font=Font.boldSystemFont(8.8);a.textColor=new Color(x.ok?C.ok:C.bad);row.addSpacer(5);const n=row.addText(x.name);n.font=Font.semiboldSystemFont(8.9);n.textColor=new Color(C.text);n.lineLimit=1;n.minimumScaleFactor=.64;row.addSpacer();const st=row.addText(`${x.msg}  ${x.ms}ms`);st.font=Font.systemFont(7.7);st.textColor=new Color(x.ok?C.muted:C.bad);w.addSpacer(1)}
const foot=w.addText('※ 通信/一次パース診断。新規カテゴリはSmall/Medium実機QAで最終確認。');foot.font=Font.systemFont(7.1);foot.textColor=new Color(C.muted);foot.lineLimit=1;w.refreshAfterDate=new Date(Date.now()+10*60000);
if(config.runsInWidget)Script.setWidget(w);else await w.presentMedium();Script.complete();
})();