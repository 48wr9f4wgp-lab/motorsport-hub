// Motorsport Hub v9.4.4-hardening — direct category module router
// H1: explicit parameter validation and full-name aliases.
// H3: lifecycle behavior is owned directly by every category module.
// H4: every current category routes directly to one completed/dedicated module. No legacy wrapper runtime or Router source rewriting remains.
// H5: release mode can enforce immutable sourceRef + byte length + SHA-256 for every category module.
// MH_ROUTER_SCHEMA=5
// MH_CATEGORY_MANIFEST=F1,WEC,WRC,SUPERGT,MOTOGP,FDJ,D1GP,SUPERFORMULA,INDYCAR,NASCAR,GTWCEU,QA
// Loader v4/v5 compatibility marker: module router v8.6.0 motorsport-core-v841.js motorsport-hq-core.js fdj-widget.js
(async()=>{
const ROUTER_SCHEMA=5;
const CATEGORY_MANIFEST='F1,WEC,WRC,SUPERGT,MOTOGP,FDJ,D1GP,SUPERFORMULA,INDYCAR,NASCAR,GTWCEU,QA';
const SOURCE_REF=String(globalThis.__MH_SOURCE_REF||'main');
const INTEGRITY=globalThis.__MH_RELEASE_INTEGRITY||null;
const labels=['F1','WEC','WRC','SUPER GT','MotoGP','FDJ','D1GP','SUPER FORMULA','INDYCAR','NASCAR Cup','GTWC Europe','QA診断'];
const params=['F1','WEC','WRC','SUPERGT','MOTOGP','FDJ','D1GP','SUPERFORMULA','INDYCAR','NASCAR','GTWCEU','QA'];
const norm=v=>String(v||'').trim().toUpperCase().replace(/[\s_-]+/g,'');
const aliases={FORMULA1:'F1',FORMULADRIFTJAPAN:'FDJ',D1:'D1GP',D1GRANDPRIX:'D1GP',SF:'SUPERFORMULA',SUPERF:'SUPERFORMULA',INDY:'INDYCAR',NASCARCUP:'NASCAR',NASCARCUPSERIES:'NASCAR',CUP:'NASCAR',GTWC:'GTWCEU',GTWCEUROPE:'GTWCEU',GTWCEU:'GTWCEU',GTWORLDCHALLENGEEUROPE:'GTWCEU'};
const ROUTES={
 F1:{file:'f1-widget-flat-v1000.js',key:'f1-flat-v1000',marker:'flattened F1 pilot module'},
 WEC:{file:'wec-widget-flat-v1000.js',key:'wec-flat-v1000',marker:'flattened WEC module'},
 WRC:{file:'wrc-widget-flat-v1000.js',key:'wrc-flat-v1000',marker:'flattened WRC module'},
 SUPERGT:{file:'supergt-widget-flat-v1000.js',key:'supergt-flat-v1000',marker:'flattened SUPER GT module'},
 MOTOGP:{file:'motogp-widget-flat-v1000.js',key:'motogp-flat-v1000',marker:'flattened MotoGP module'},
 FDJ:{file:'fdj-widget-flat-v1000.js',key:'fdj-flat-v1000',marker:'flattened Formula Drift Japan module'},
 D1GP:{file:'d1gp-widget-flat-v1000.js',key:'d1gp-flat-v1000',marker:'flattened D1GP module'},
 SUPERFORMULA:{file:'superformula-widget.js',key:'superformula-v900',marker:'SUPER FORMULA module'},
 INDYCAR:{file:'indycar-widget.js',key:'indycar-v910',marker:'INDYCAR module'},
 NASCAR:{file:'nascar-widget.js',key:'nascar-v920',marker:'NASCAR Cup Series module'},
 GTWCEU:{file:'gtwc-europe-widget.js',key:'gtwceu-v930',marker:'GT World Challenge Europe module'},
 QA:{file:'motorsport-diagnostics-v890.js',key:'diagnostics-v890',marker:'QA diagnostics'}
};

function utf8Bytes(s){
 const out=[];s=String(s||'');
 for(let i=0;i<s.length;i++){
  let c=s.charCodeAt(i);
  if(c<0x80)out.push(c);
  else if(c<0x800)out.push(0xC0|(c>>6),0x80|(c&63));
  else if(c>=0xD800&&c<=0xDBFF&&i+1<s.length){const d=s.charCodeAt(++i),cp=0x10000+((c-0xD800)<<10)+(d-0xDC00);out.push(0xF0|(cp>>18),0x80|((cp>>12)&63),0x80|((cp>>6)&63),0x80|(cp&63));}
  else out.push(0xE0|(c>>12),0x80|((c>>6)&63),0x80|(c&63));
 }
 return out;
}
function rotr(x,n){return(x>>>n)|(x<<(32-n))}
function sha256Hex(text){
 const bytes=utf8Bytes(text),bitLen=bytes.length*8,K=[
  0x428a2f98,0x71374491,0xb5c0fbcf,0xe9b5dba5,0x3956c25b,0x59f111f1,0x923f82a4,0xab1c5ed5,0xd807aa98,0x12835b01,0x243185be,0x550c7dc3,0x72be5d74,0x80deb1fe,0x9bdc06a7,0xc19bf174,
  0xe49b69c1,0xefbe4786,0x0fc19dc6,0x240ca1cc,0x2de92c6f,0x4a7484aa,0x5cb0a9dc,0x76f988da,0x983e5152,0xa831c66d,0xb00327c8,0xbf597fc7,0xc6e00bf3,0xd5a79147,0x06ca6351,0x14292967,
  0x27b70a85,0x2e1b2138,0x4d2c6dfc,0x53380d13,0x650a7354,0x766a0abb,0x81c2c92e,0x92722c85,0xa2bfe8a1,0xa81a664b,0xc24b8b70,0xc76c51a3,0xd192e819,0xd6990624,0xf40e3585,0x106aa070,
  0x19a4c116,0x1e376c08,0x2748774c,0x34b0bcb5,0x391c0cb3,0x4ed8aa4a,0x5b9cca4f,0x682e6ff3,0x748f82ee,0x78a5636f,0x84c87814,0x8cc70208,0x90befffa,0xa4506ceb,0xbef9a3f7,0xc67178f2];
 const H=[0x6a09e667,0xbb67ae85,0x3c6ef372,0xa54ff53a,0x510e527f,0x9b05688c,0x1f83d9ab,0x5be0cd19];
 bytes.push(0x80);while(bytes.length%64!==56)bytes.push(0);
 const hi=Math.floor(bitLen/0x100000000),lo=bitLen>>>0;
 for(let s=24;s>=0;s-=8)bytes.push((hi>>>s)&255);for(let s=24;s>=0;s-=8)bytes.push((lo>>>s)&255);
 const w=new Array(64);
 for(let off=0;off<bytes.length;off+=64){
  for(let i=0;i<16;i++)w[i]=((bytes[off+i*4]<<24)|(bytes[off+i*4+1]<<16)|(bytes[off+i*4+2]<<8)|bytes[off+i*4+3])>>>0;
  for(let i=16;i<64;i++){const x=w[i-15],y=w[i-2],s0=rotr(x,7)^rotr(x,18)^(x>>>3),s1=rotr(y,17)^rotr(y,19)^(y>>>10);w[i]=(w[i-16]+s0+w[i-7]+s1)>>>0;}
  let[a,b,c,d,e,f,g,h]=H;
  for(let i=0;i<64;i++){const S1=rotr(e,6)^rotr(e,11)^rotr(e,25),ch=(e&f)^(~e&g),t1=(h+S1+ch+K[i]+w[i])>>>0,S0=rotr(a,2)^rotr(a,13)^rotr(a,22),maj=(a&b)^(a&c)^(b&c),t2=(S0+maj)>>>0;h=g;g=f;f=e;e=(d+t1)>>>0;d=c;c=b;b=a;a=(t1+t2)>>>0;}
  H[0]=(H[0]+a)>>>0;H[1]=(H[1]+b)>>>0;H[2]=(H[2]+c)>>>0;H[3]=(H[3]+d)>>>0;H[4]=(H[4]+e)>>>0;H[5]=(H[5]+f)>>>0;H[6]=(H[6]+g)>>>0;H[7]=(H[7]+h)>>>0;
 }
 return H.map(x=>('00000000'+(x>>>0).toString(16)).slice(-8)).join('');
}
const syntaxOK=s=>{try{new Function(String(s||''));return true}catch(_){return false}};

const rawParameter=String(args.widgetParameter||'').trim();let selected=norm(rawParameter);selected=aliases[selected]||selected;
globalThis.__MH_ROUTER_SCHEMA=ROUTER_SCHEMA;globalThis.__MH_ROUTER_MANIFEST=CATEGORY_MANIFEST;

async function messageWidget(title,msg){const w=new ListWidget();w.backgroundColor=new Color('#080B10');w.setPadding(12,12,12,12);const a=w.addText(title);a.font=Font.boldSystemFont(14);a.textColor=Color.white();w.addSpacer(6);const b=w.addText(msg);b.font=Font.systemFont(10);b.textColor=new Color('#FFB84D');b.lineLimit=4;w.refreshAfterDate=new Date(Date.now()+5*60000);if(config.runsInWidget)Script.setWidget(w);else await w.presentSmall();Script.complete()}
if(!config.runsInWidget&&!params.includes(selected)){const a=new Alert();a.title='Motorsport Hub';a.message='プレビューするカテゴリ';labels.forEach(x=>a.addAction(x));a.addCancelAction('キャンセル');const i=await a.presentSheet();if(i<0){Script.complete();return}selected=params[i]}
if(!selected)selected='F1';
if(!params.includes(selected)||!ROUTES[selected]){globalThis.__MH_ROUTER_BOOT_OK=true;await messageWidget('Motorsport Hub','Widget Parameterが不正です。設定値を確認してください。'+(rawParameter?`\n入力: ${rawParameter}`:''));return}

const route=ROUTES[selected];
const integrityEntry=INTEGRITY&&INTEGRITY.files?INTEGRITY.files[route.file]:null;
const integrityMode=!!INTEGRITY;
const releaseId=integrityMode?String(INTEGRITY.releaseId||SOURCE_REF.slice(0,12)).replace(/[^A-Za-z0-9.-]/g,'').slice(0,32):'';
const URL=`https://raw.githubusercontent.com/48wr9f4wgp-lab/motorsport-hub/${SOURCE_REF}/${route.file}`;
const fm=FileManager.local();
const cacheName=integrityMode?`motorsport-hub-module-${route.key}-${releaseId}.js`:`motorsport-hub-module-${route.key}.js`;
const cache=fm.joinPath(fm.documentsDirectory(),cacheName);
const integrityConfigOK=!integrityMode||(INTEGRITY.schemaVersion===1&&String(INTEGRITY.sourceRef||'')===SOURCE_REF&&integrityEntry&&typeof integrityEntry.sha256==='string'&&Number(integrityEntry.bytes)>0);
const valid=s=>{
 if(typeof s!=='string'||!s.includes('Motorsport Hub')||!s.includes('Script.complete()')||!s.includes(route.marker)||!syntaxOK(s))return false;
 if(!integrityMode)return true;
 if(!integrityConfigOK)return false;
 const bytes=utf8Bytes(s);
 return bytes.length===Number(integrityEntry.bytes)&&sha256Hex(s)===String(integrityEntry.sha256).toLowerCase();
};
async function fail(){await messageWidget('Motorsport Hub','最新版モジュールを安全に実行できません。数分後に再試行します。')}
if(!integrityConfigOK){await fail();return}

let code='';
if(globalThis.__MH_REMOTE_OFFLINE!==true){try{const r=new Request(`${URL}?v=944&t=${Date.now()}-${Math.random()}`);r.timeoutInterval=15;r.headers={'Cache-Control':'no-cache, no-store, max-age=0, must-revalidate','Pragma':'no-cache','Expires':'0','User-Agent':'MotorsportHubRouter/9.4.4-hardening'};code=await r.loadString();if(!valid(code))throw Error('invalid module');fm.writeString(cache,code)}catch(e){globalThis.__MH_REMOTE_OFFLINE=true}}
if(!valid(code)){try{if(fm.fileExists(cache)){const c=fm.readString(cache);if(valid(c))code=c;else fm.remove(cache)}}catch(_){} }
if(!valid(code)){await fail();return}
globalThis.__MH_ROUTER_BOOT_OK=true;
try{await eval(code)}catch(e){await fail()}
finally{try{delete globalThis.__MH_REMOTE_OFFLINE}catch(_){} }
})();
