// Club Pulse 40-club expansion iPhone QA loader.
// QA-only: fetches the expansion branch runtime without changing production main.

const RUNTIME='https://raw.githubusercontent.com/48wr9f4wgp-lab/motorsport-hub/club-pulse-expansion-40/scriptable/club-pulse.js';
const GROUPS=[
  ['プレミアリーグ',[
    ['チェルシー','chelsea'],['トッテナム','tottenham'],['ニューカッスル','newcastle'],['アストン・ヴィラ','astonvilla'],['エヴァートン','everton'],['ブライトン','brighton'],['ウェストハム','westham']
  ]],
  ['ラ・リーガ',[
    ['アトレティコ','atletico'],['アスレティック','athletic'],['レアル・ソシエダ','realsociedad'],['ビジャレアル','villarreal'],['セビージャ','sevilla'],['ベティス','betis']
  ]],
  ['ブンデスリーガ',[
    ['レヴァークーゼン','leverkusen'],['ライプツィヒ','leipzig'],['フランクフルト','frankfurt'],['シュトゥットガルト','stuttgart'],['ボルシアMG','gladbach']
  ]],
  ['セリエA',[
    ['ユベントス','juventus'],['ナポリ','napoli'],['ローマ','roma'],['ラツィオ','lazio'],['アタランタ','atalanta'],['フィオレンティーナ','fiorentina']
  ]],
  ['リーグ・アン',[
    ['マルセイユ','marseille'],['モナコ','monaco'],['リヨン','lyon'],['リール','lille'],['ニース','nice']
  ]]
];

async function pick(title,items){
  const a=new Alert();a.title=title;
  items.forEach(x=>a.addAction(x[0]));a.addCancelAction('キャンセル');
  const i=await a.presentSheet();return i<0?null:items[i]
}

let param=String(args.widgetParameter||'').trim();
if(config.runsInApp&&!param){
  const league=await pick('Club Pulse 40 QA',GROUPS.map((x,i)=>[x[0],i]));
  if(!league){Script.complete();return}
  const club=await pick(GROUPS[league[1]][0],GROUPS[league[1]][1]);
  if(!club){Script.complete();return}
  param=club[1]+':normal';
}
if(!param)param='chelsea';

const req=new Request(RUNTIME+'?qa='+Date.now());req.timeoutInterval=15;
const code=await req.loadString();
if(!code||code.length<3000)throw new Error('Invalid Club Pulse expansion runtime');
await new Function('args','return (async()=>{\n'+code+'\n})()')({widgetParameter:param});
