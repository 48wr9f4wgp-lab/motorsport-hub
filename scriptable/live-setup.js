const KEY='clubpulse_api_football_token_v1';
const API='https://v3.football.api-sports.io';
const SIGNUP='https://dashboard.api-football.com/register';

async function testToken(token){
  const r=new Request(API+'/teams?search=Manchester%20United');
  r.headers={'x-apisports-key':token};
  r.timeoutInterval=12;
  const j=await r.loadJSON();
  const s=r.response?.statusCode||200;
  if(s>=400)throw new Error(`HTTP ${s}`);
  if(j?.errors&&Object.keys(j.errors).length)throw new Error(JSON.stringify(j.errors));
  if(!(j?.response||[]).length)throw new Error('Manchester United を取得できませんでした');
  return true;
}

async function showResult(title,message){
  const a=new Alert();a.title=title;a.message=message;a.addAction('OK');await a.present();
}

let current='';
try{if(Keychain.contains(KEY))current=Keychain.get(KEY)}catch{}

const a=new Alert();
a.title='Club Pulse LIVE設定';
a.message=current?'LIVE用APIキーは設定済みです。再設定・接続確認できます。':'API-Football無料キーを設定します。キーを持っていない場合は「無料登録を開く」を選んでください。';
a.addTextField('API key',current);
a.addAction('保存して接続確認');
a.addAction('無料登録を開く');
a.addCancelAction('キャンセル');
const i=await a.present();
if(i===1){Safari.open(SIGNUP);Script.complete();return}
if(i===-1){Script.complete();return}
const token=a.textFieldValue(0).trim();
if(!token){await showResult('未設定','API key が空です。');Script.complete();return}
try{
  await testToken(token);
  Keychain.set(KEY,token);
  await showResult('LIVE接続OK','API-Footballへの接続を確認し、キーを端末Keychainへ保存しました。Club Pulse本体は試合時間帯だけLIVE APIを確認します。');
}catch(e){
  await showResult('接続失敗',String(e));
}
Script.complete();