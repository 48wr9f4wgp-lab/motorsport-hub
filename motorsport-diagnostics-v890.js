// Motorsport Hub v8.9.0 — QA diagnostics
// Manual diagnostics: checks the seven live data routes without changing any widget cache/state.
(async()=>{
const C={bg:'#080B10',text:'#F7F9FB',muted:'#AEB8C4',ok:'#58DA8A',bad:'#FF6B6B',warn:'#FFB84D'};
const tests=[
 {name:'F1',kind:'json',url:'https://api.jolpi.ca/ergast/f1/2026/driverstandings.json',check:x=>((x?.MRData?.StandingsTable?.StandingsLists?.[0]?.DriverStandings||[]).length>=3)},
 {name:'WEC',kind:'text',url:'https://www.fiawec.com/fr/page/classement-constructeurs',check:x=>/TOYOTA|FERRARI|BMW/i.test(x)},
 {name:'WRC',kind:'text',url:'https://www.fia.com/events/world-rally-championship/season-2026/standings',check:x=>/Elfyn Evans|Sami Pajari|Takamoto Katsuta/i.test(x)},
 {name:'MotoGP',kind:'text',url:'https://stats.motogp.com/en/world-standing',check:x=>/Aprilia|Ducati|Honda|Yamaha|KTM/i.test(x)},
 {name:'SUPER GT',kind:'text',url:'https://supergt.net/',check:x=>/GT.?500|SUPER.?GT/i.test(x)},
 {name:'FDJ',kind:'text',url:'https://formulad.jp/2026-fdj-standings/',check:x=>/CONNOR|RYUMA|KAZUMI|standings/i.test(x)},
 {name:'D1GP',kind:'text',url:'https://d1gp.co.jp/2026d1%E3%82%B0%E3%83%A9%E3%83%B3%E3%83%97%E3%83%AA%E3%82%B7%E3%83%AA%E3%83%BC%E3%82%BA%E3%83%A9%E3%83%B3%E3%82%AD%E3%83%B3%E3%82%B0/',check:x=>/横井|中村|蕎麦切|ランキング/.test(x)}
];
const run=async t=>{const s=Date.now();try{const r=new Request(t.url);r.timeoutInterval=10;r.headers={'User-Agent':'Mozilla/5.0 MotorsportHubQA/8.9','Cache-Control':'no-cache'};const data=t.kind==='json'?await r.loadJSON():await r.loadString();return{name:t.name,ok:!!t.check(data),ms:Date.now()-s,msg:t.check(data)?'LIVE':'PARSE'}}catch(e){return{name:t.name,ok:false,ms:Date.now()-s,msg:'NET'}}};
const results=await Promise.all(tests.map(run));
const all=results.every(x=>x.ok),w=new ListWidget();w.backgroundColor=new Color(C.bg);w.setPadding(12,14,11,14);
const title=w.addText('Motorsport Hub  QA');title.font=Font.heavySystemFont(17);title.textColor=new Color(C.text);
const sub=w.addText(all?'7/7 LIVE — RCデータ経路OK':`${results.filter(x=>x.ok).length}/7 LIVE — 要確認`);sub.font=Font.semiboldSystemFont(10);sub.textColor=new Color(all?C.ok:C.warn);w.addSpacer(7);
for(const x of results){const row=w.addStack();row.layoutHorizontally();row.centerAlignContent();const a=row.addText(x.ok?'●':'●');a.font=Font.boldSystemFont(10);a.textColor=new Color(x.ok?C.ok:C.bad);row.addSpacer(6);const n=row.addText(x.name);n.font=Font.semiboldSystemFont(11);n.textColor=new Color(C.text);row.addSpacer();const st=row.addText(`${x.msg}  ${x.ms}ms`);st.font=Font.systemFont(9);st.textColor=new Color(x.ok?C.muted:C.bad);w.addSpacer(3)}
w.addSpacer(4);const foot=w.addText('※ 通信/一次パース診断。最終判定はホーム画面のSmall/Medium実機QA。');foot.font=Font.systemFont(8);foot.textColor=new Color(C.muted);foot.lineLimit=2;w.refreshAfterDate=new Date(Date.now()+10*60000);
if(config.runsInWidget)Script.setWidget(w);else await w.presentMedium();Script.complete();
})();
