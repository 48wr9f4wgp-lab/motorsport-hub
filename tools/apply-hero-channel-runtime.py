from pathlib import Path
import re

ROOT=Path(__file__).resolve().parents[1]
ROUTER=ROOT/'motorsport-hub.js'
MODULES=[
 'f1-widget-flat-v1000.js','wec-widget-flat-v1000.js','wrc-widget-flat-v1000.js',
 'supergt-widget-flat-v1000.js','motogp-widget-flat-v1000.js','fdj-widget-flat-v1000.js',
 'd1gp-widget-flat-v1000.js','superformula-widget.js','indycar-widget.js','nascar-widget.js',
 'gtwc-europe-widget.js'
]
HOOK=" const __mhDynamicHero=globalThis.__MH_HERO_OVERRIDE_IMAGE;if(__mhDynamicHero)return __mhDynamicHero;"

HELPER=r"""
const HERO_CHANNEL_SCHEMA=1,HERO_CHANNEL_BRANCH='hero-live',HERO_CHANNEL_TTL=15*60000,HERO_LARGE_CANVAS=1200,HERO_LARGE_FALLBACK_INSET=.96;
const HERO_CHANNEL_BASE=`https://raw.githubusercontent.com/48wr9f4wgp-lab/motorsport-hub/${HERO_CHANNEL_BRANCH}/hero-channel`;
const HERO_CHANNEL_LICENSES=new Set(['CC BY 2.0','CC BY 4.0','CC BY-SA 2.0','CC BY-SA 3.0','CC BY-SA 4.0','CC0 1.0']);
const heroSafe=v=>String(v||'').replace(/[^A-Za-z0-9._-]/g,'-').slice(0,100);
const heroUrlOK=(u,cat)=>typeof u==='string'&&u.startsWith(`${HERO_CHANNEL_BASE}/assets/${cat}/`)&&/\.(?:jpg|jpeg|png)(?:\?|$)/i.test(u);
function validHeroChannel(m){
 if(!m||m.schemaVersion!==HERO_CHANNEL_SCHEMA||!m.categories||typeof m.categories!=='object')return false;
 const t=Date.parse(m.generatedAt||'');if(!Number.isFinite(t)||t>Date.now()+86400000)return false;
 return true;
}
function validHeroEntry(e,cat){
 if(!e||e.category!==cat||!heroSafe(e.assetId)||!heroSafe(e.version)||!HERO_CHANNEL_LICENSES.has(String(e.license||'')))return false;
 if(!String(e.sourcePage||'').startsWith('https://commons.wikimedia.org/wiki/File:'))return false;
 if(!heroUrlOK(e.images?.small?.url,cat)||!heroUrlOK(e.images?.medium?.url,cat))return false;
 if(e.images?.large?.url&&!heroUrlOK(e.images.large.url,cat))return false;
 return true;
}
async function heroChannelManifest(){
 const hfm=FileManager.local(),p=hfm.joinPath(hfm.documentsDirectory(),'motorsport-hero-channel-v1.json');let cached=null;
 try{if(hfm.fileExists(p)){const q=JSON.parse(hfm.readString(p));if(validHeroChannel(q?.manifest))cached=q}}catch(_){cached=null}
 if(cached&&Date.now()-Number(cached.fetchedAt||0)<HERO_CHANNEL_TTL)return cached.manifest;
 if(globalThis.__MH_REMOTE_OFFLINE!==true){
  try{const r=new Request(`${HERO_CHANNEL_BASE}/channel.json?t=${Math.floor(Date.now()/HERO_CHANNEL_TTL)}`);r.timeoutInterval=8;r.headers={'Cache-Control':'no-cache','User-Agent':'MotorsportHub-HeroChannel/1'};const m=await r.loadJSON();if(validHeroChannel(m)){try{hfm.writeString(p,JSON.stringify({fetchedAt:Date.now(),manifest:m}))}catch(_){}return m}}catch(_){}
 }
 return cached?.manifest||null;
}
function heroDrawAspect(ctx,img,W,H,mode='fill',scale=.96,yBias=.5){
 const iw=Math.max(1,Number(img?.size?.width)||W),ih=Math.max(1,Number(img?.size?.height)||H),fit=mode==='fit'?Math.min(W/iw,H/ih):Math.max(W/iw,H/ih),s=fit*scale,dw=iw*s,dh=ih*s,x=(W-dw)/2,y=(H-dh)*yBias;ctx.drawImageInRect(img,new Rect(x,y,dw,dh));
}
function finishHeroChannelImage(img,sourceFamily='medium'){
 if(!img)return null;const family=config.widgetFamily||'medium',large=family==='large',small=family==='small',W=large?HERO_LARGE_CANVAS:(small?720:1380),H=large?HERO_LARGE_CANVAS:(small?720:640),ctx=new DrawContext();ctx.size=new Size(W,H);ctx.opaque=true;ctx.respectScreenScale=false;ctx.setFillColor(new Color('#06080B'));ctx.fillRect(new Rect(0,0,W,H));
 if(large&&sourceFamily!=='large'){
  // LARGE_CONTAINED_FALLBACK: preserve the 1380x640 Hero pixels instead of upscaling/cropping them to a square.
  heroDrawAspect(ctx,img,W,H,'fill',1,.5);ctx.setFillColor(new Color('#030609',.58));ctx.fillRect(new Rect(0,0,W,H));
  heroDrawAspect(ctx,img,W,H,'fit',HERO_LARGE_FALLBACK_INSET,.44);ctx.setFillColor(new Color('#030609',.10));ctx.fillRect(new Rect(0,0,W,H));
 }else ctx.drawImageInRect(img,new Rect(0,0,W,H));
 ctx.setFillColor(new Color('#030609',large?.12:.08));ctx.fillRect(new Rect(0,0,W,H));
 for(let x=0;x<W;x+=3){const t=x/(W-1),s=t*t*(3-2*t),a=(large?.72:.80)*(1-s)+(large?.07:.05);ctx.setFillColor(new Color('#030609',a));ctx.fillRect(new Rect(x,0,4,H))}
 const rs=W*.76;for(let x=rs;x<W;x+=3){const t=(x-rs)/(W-rs),s=t*t*(3-2*t),a=(large?.09:.07)+(large?.31:.36)*s;ctx.setFillColor(new Color('#020407',a));ctx.fillRect(new Rect(x,0,4,H))}
 const bs=H*(large?.64:.68),bh=H-bs;for(let i=0;i<48;i++){const y=bs+i*(bh/48),t=i/47,a=(large?.03:.01)+(large?.26:.18)*t*t;ctx.setFillColor(new Color('#020407',a));ctx.fillRect(new Rect(0,y,W,bh/48+1))}
 return ctx.getImage();
}
async function loadHeroChannelImage(cat){
 if(cat==='QA')return null;const m=await heroChannelManifest(),e=m?.categories?.[cat];if(!validHeroEntry(e,cat))return null;
 const requested=config.widgetFamily==='small'?'small':config.widgetFamily==='large'?'large':'medium',fam=requested==='large'&&heroUrlOK(e.images?.large?.url,cat)?'large':requested==='large'?'medium':requested,u=e.images[fam].url,hfm=FileManager.local(),dir=hfm.documentsDirectory(),asset=heroSafe(e.assetId),p=hfm.joinPath(dir,`motorsport-hero-channel-v1-${cat}-${fam}-${asset}.jpg`),lkg=hfm.joinPath(dir,`motorsport-hero-channel-v1-${cat}-${fam}-lkg.jpg`);
 try{if(hfm.fileExists(p))return finishHeroChannelImage(hfm.readImage(p),fam)}catch(_){}
 if(globalThis.__MH_REMOTE_OFFLINE!==true){try{const r=new Request(`${u}?v=${encodeURIComponent(String(e.version))}`);r.timeoutInterval=10;r.headers={'Cache-Control':'no-cache','User-Agent':'MotorsportHub-HeroChannel/1'};const img=await r.loadImage();if(img){try{hfm.writeImage(p,img);hfm.writeImage(lkg,img)}catch(_){}return finishHeroChannelImage(img,fam)}}catch(_){} }
 try{if(hfm.fileExists(lkg))return finishHeroChannelImage(hfm.readImage(lkg),fam)}catch(_){}
 return null;
}
""".strip()


def patch_router():
    src=ROUTER.read_text()
    if 'HERO_CHANNEL_BRANCH=' not in src:
        marker='};\n\nfunction utf8Bytes(s){'
        if marker not in src: raise SystemExit('Router insertion marker missing')
        src=src.replace(marker,'};\n\n'+HELPER+'\n\nfunction utf8Bytes(s){',1)
    else:
        pattern=r"const HERO_CHANNEL_SCHEMA=1,HERO_CHANNEL_BRANCH='hero-live'.*?(?=\nfunction utf8Bytes\(s\)\{)"
        src,n=re.subn(pattern,HELPER+'\n',src,count=1,flags=re.S)
        if n!=1: raise SystemExit(f'Router Hero helper replacement failed: {n}')
    old="globalThis.__MH_ROUTER_BOOT_OK=true;\ntry{await eval(code)}catch(e){await fail()}\nfinally{try{delete globalThis.__MH_REMOTE_OFFLINE}catch(_){} }"
    new="try{const hi=await loadHeroChannelImage(selected);if(hi)globalThis.__MH_HERO_OVERRIDE_IMAGE=hi}catch(_){}\nglobalThis.__MH_ROUTER_BOOT_OK=true;\ntry{await eval(code)}catch(e){await fail()}\nfinally{try{delete globalThis.__MH_HERO_OVERRIDE_IMAGE}catch(_){}try{delete globalThis.__MH_REMOTE_OFFLINE}catch(_){} }"
    if '__MH_HERO_OVERRIDE_IMAGE=hi' not in src:
        if old not in src: raise SystemExit('Router execution marker missing')
        src=src.replace(old,new,1)
    src=src.replace('Motorsport Hub v9.5.2-hardening — direct category module router','Motorsport Hub v9.5.3-hardening — direct category module router',1)
    src=src.replace("?v=952&t=${Date.now()}-${Math.random()}","?v=953&t=${Date.now()}-${Math.random()}",1)
    src=src.replace('MotorsportHubRouter/9.5.2-hardening','MotorsportHubRouter/9.5.3-hardening',1)
    ROUTER.write_text(src)


def patch_module(name):
    p=ROOT/name;src=p.read_text()
    if '__MH_HERO_OVERRIDE_IMAGE' in src:return
    pattern=r'(async function hero\([^)]*\)\{)'
    src2,n=re.subn(pattern,r'\1\n'+HOOK,src,count=1)
    if n!=1:raise SystemExit(f'{name}: expected one async function hero(), got {n}')
    p.write_text(src2)

patch_router()
for m in MODULES:patch_module(m)
print('Hero channel runtime patch applied')