// Motorsport Hub Hero Channel device diagnostics — temporary, no PII
(async()=>{
const BASE='https://raw.githubusercontent.com/48wr9f4wgp-lab/motorsport-hub/hero-live/hero-channel';
const cat='WRC',fam=(config.widgetFamily||'medium')==='small'?'small':'medium';
const rows=[];const push=(k,v,ok)=>rows.push({k,v:String(v),ok});
const fm=FileManager.local(),dir=fm.documentsDirectory();
let manifest=null,entry=null,img=null;
try{const r=new Request(`${BASE}/channel.json?t=${Date.now()}`);r.timeoutInterval=10;r.headers={'Cache-Control':'no-cache, no-store','Pragma':'no-cache','User-Agent':'MotorsportHub-HeroDiag/1'};manifest=await r.loadJSON();push('manifest','FETCH OK',true)}catch(e){push('manifest','FETCH FAIL',false)}
push('schema',manifest?.schemaVersion??'none',manifest?.schemaVersion===1);
entry=manifest?.categories?.[cat]||null;
push('WRC entry',entry?'FOUND':'MISSING',!!entry);
push('asset',entry?.assetId||'none',!!entry?.assetId);
push('license',entry?.license||'none',['CC BY 2.0','CC BY 4.0','CC BY-SA 2.0','CC BY-SA 3.0','CC BY-SA 4.0','CC0 1.0'].includes(String(entry?.license||'')));
const url=entry?.images?.[fam]?.url||'';
push('family',fam,true);
push('url',url.includes('/hero-live/hero-channel/assets/WRC/')?'VALID':'INVALID',url.includes('/hero-live/hero-channel/assets/WRC/'));
try{if(url){const r=new Request(`${url}?diag=${Date.now()}`);r.timeoutInterval=12;r.headers={'Cache-Control':'no-cache, no-store','Pragma':'no-cache','User-Agent':'MotorsportHub-HeroDiag/1'};img=await r.loadImage()}push('image',img?`${img.size.width}x${img.size.height}`:'FETCH FAIL',!!img)}catch(e){push('image','FETCH FAIL',false)}
const cacheManifest=fm.joinPath(dir,'motorsport-hero-channel-v1.json');
push('manifest cache',fm.fileExists(cacheManifest)?'EXISTS':'NONE',true);
const w=new ListWidget();w.backgroundColor=new Color('#080B10');w.setPadding(10,12,10,12);
const t=w.addText('Hero Channel Diagnostics');t.font=Font.boldSystemFont(14);t.textColor=Color.white();w.addSpacer(5);
for(const x of rows){const s=w.addStack();s.layoutHorizontally();const a=s.addText(x.ok?'●':'●');a.font=Font.boldSystemFont(8);a.textColor=new Color(x.ok?'#58DA8A':'#FF6B6B');s.addSpacer(5);const k=s.addText(x.k);k.font=Font.semiboldSystemFont(8);k.textColor=Color.white();s.addSpacer();const v=s.addText(x.v);v.font=Font.systemFont(7.5);v.textColor=new Color(x.ok?'#AEB8C4':'#FF6B6B');v.lineLimit=1;w.addSpacer(1)}
if(img){w.addSpacer(4);const im=w.addImage(img);im.imageSize=new Size(120,56);im.cornerRadius=5}
if(config.runsInWidget)Script.setWidget(w);else await w.presentMedium();Script.complete();
})();
