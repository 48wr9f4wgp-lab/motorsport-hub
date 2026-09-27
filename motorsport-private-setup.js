// Motorsport Hub private GitHub setup — stores a fine-grained read token in Scriptable Keychain.
(async()=>{
const OWNER='48wr9f4wgp-lab',REPO='motorsport-hub',TOKEN_KEY='motorsport-hub-github-token-v1';
async function testToken(token){
  const r=new Request(`https://api.github.com/repos/${OWNER}/${REPO}/contents/release-channel.json?ref=main`);
  r.timeoutInterval=10;
  r.headers={'Accept':'application/vnd.github.raw+json','Authorization':`Bearer ${token}`,'X-GitHub-Api-Version':'2026-03-10','User-Agent':'MotorsportHubPrivateSetup/1'};
  const d=JSON.parse(await r.loadString());
  if(!d||d.channel!=='stable'||!d.version||!d.sourceRef)throw Error('Invalid Stable descriptor');
  return d;
}
const a=new Alert();
a.title='Motorsport Hub Private';
a.message='Fine-grained GitHub tokenをKeychainへ保存します。Contents: read + Actions: read の、このrepoだけに限定したtokenを使用してください。';
a.addSecureTextField('github_pat_…','');
a.addAction('保存して接続テスト');
a.addDestructiveAction('保存済みtokenを削除');
a.addCancelAction('キャンセル');
const n=await a.presentAlert();
if(n===0){
  const token=String(a.textFieldValue(0)||'').trim();
  if(!token){const e=new Alert();e.title='未入力';e.message='tokenが空です。';e.addAction('OK');await e.presentAlert();Script.complete();return}
  try{
    const d=await testToken(token);
    Keychain.set(TOKEN_KEY,token);
    const ok=new Alert();ok.title='接続OK';ok.message=`Keychainへ保存しました。Stable ${d.version} / ${String(d.sourceRef).slice(0,12)} を読めます。`;ok.addAction('OK');await ok.presentAlert();
  }catch(e){
    const ng=new Alert();ng.title='接続失敗';ng.message='token権限・対象repo・通信を確認してください。tokenは保存していません。';ng.addAction('OK');await ng.presentAlert();
  }
}else if(n===1){
  try{if(Keychain.contains(TOKEN_KEY))Keychain.remove(TOKEN_KEY)}catch(_){}
  const ok=new Alert();ok.title='削除済み';ok.message='Motorsport Hub用GitHub tokenをKeychainから削除しました。';ok.addAction('OK');await ok.presentAlert();
}
Script.complete();
})();