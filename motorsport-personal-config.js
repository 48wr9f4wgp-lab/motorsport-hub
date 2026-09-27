// Motorsport Hub Personal Config v1
// Owner-only local configuration for Race Day Cockpit.
(async()=>{
const fm=FileManager.local(),DOC=fm.documentsDirectory(),PATH=fm.joinPath(DOC,'motorsport-personal-config-v1.json');
const ALL=['F1','WEC','WRC','SUPERGT','MOTOGP','FDJ','D1GP','SUPERFORMULA','INDYCAR','NASCAR','GTWCEU','DAKAR'];
const DEFAULT={
  schemaVersion:1,
  categories:[...ALL],
  horizonDays:14,
  showViewing:true,
  showLeader:true,
  showCacheAge:true
};
const norm=v=>String(v||'').trim().toUpperCase().replace(/[\s_-]+/g,'');
function sanitize(x){
  const c={...DEFAULT,...(x&&typeof x==='object'?x:{})};
  const seen=new Set(),cats=[];
  for(const raw of Array.isArray(c.categories)?c.categories:[]){
    const k=norm(raw);
    if(ALL.includes(k)&&!seen.has(k)){seen.add(k);cats.push(k)}
  }
  c.categories=cats.length?cats:[...ALL];
  c.horizonDays=Math.max(1,Math.min(365,Number(c.horizonDays)||14));
  c.showViewing=c.showViewing!==false;
  c.showLeader=c.showLeader!==false;
  c.showCacheAge=c.showCacheAge!==false;
  c.schemaVersion=1;
  return c;
}
function read(){
  try{if(fm.fileExists(PATH))return sanitize(JSON.parse(fm.readString(PATH)))}catch(_){}
  return sanitize(DEFAULT);
}
function write(c){fm.writeString(PATH,JSON.stringify(sanitize(c),null,2))}
function on(v){return v?'ON':'OFF'}
async function editCategories(c){
  const a=new Alert();
  a.title='表示カテゴリ・優先順';
  a.message='左から優先。不要カテゴリは削除。カンマ区切り。';
  a.addTextField('F1,WEC,...',c.categories.join(','));
  a.addAction('保存');
  a.addCancelAction('キャンセル');
  if(await a.presentAlert()!==0)return c;
  const raw=String(a.textFieldValue(0)||'');
  const cats=raw.split(',').map(norm).filter(Boolean);
  const next=sanitize({...c,categories:cats});
  write(next);
  return next;
}
async function editHorizon(c){
  const vals=[3,7,14,30,60];
  const a=new Alert();
  a.title='Race Day表示期間';
  a.message=`現在: ${c.horizonDays}日`;
  vals.forEach(v=>a.addAction(`${v}日`));
  a.addCancelAction('戻る');
  const i=await a.presentSheet();
  if(i<0)return c;
  const next=sanitize({...c,horizonDays:vals[i]});
  write(next);
  return next;
}
async function editToggles(c){
  while(true){
    const a=new Alert();
    a.title='表示項目';
    a.message='タップで切替';
    a.addAction(`視聴先  ${on(c.showViewing)}`);
    a.addAction(`ランキング首位  ${on(c.showLeader)}`);
    a.addAction(`cache更新時刻  ${on(c.showCacheAge)}`);
    a.addCancelAction('戻る');
    const i=await a.presentSheet();
    if(i<0)return c;
    if(i===0)c.showViewing=!c.showViewing;
    if(i===1)c.showLeader=!c.showLeader;
    if(i===2)c.showCacheAge=!c.showCacheAge;
    c=sanitize(c);write(c);
  }
}
async function showSummary(c){
  const a=new Alert();
  a.title='Personal Config v1';
  a.message=[
    `カテゴリ: ${c.categories.join(' > ')}`,
    `期間: ${c.horizonDays}日`,
    `視聴先: ${on(c.showViewing)}`,
    `首位: ${on(c.showLeader)}`,
    `更新時刻: ${on(c.showCacheAge)}`
  ].join('\n');
  a.addAction('OK');
  await a.presentAlert();
}
let c=read();write(c);
while(true){
  const a=new Alert();
  a.title='Motorsport Personal Config';
  a.message=`${c.categories.length}カテゴリ / ${c.horizonDays}日`;
  a.addAction('表示カテゴリ・優先順');
  a.addAction('表示期間');
  a.addAction('表示項目');
  a.addAction('現在設定を見る');
  a.addDestructiveAction('初期設定へ戻す');
  a.addCancelAction('完了');
  const i=await a.presentSheet();
  if(i<0)break;
  if(i===0)c=await editCategories(c);
  if(i===1)c=await editHorizon(c);
  if(i===2)c=await editToggles(c);
  if(i===3)await showSummary(c);
  if(i===4){c=sanitize(DEFAULT);write(c)}
}
Script.complete();
})();