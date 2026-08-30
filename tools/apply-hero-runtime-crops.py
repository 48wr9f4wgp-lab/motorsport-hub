from pathlib import Path


def replace_block(text, start_marker, end_marker, replacement, label):
    start=text.find(start_marker)
    if start < 0:
        raise SystemExit(f'{label}: start marker missing')
    end=text.find(end_marker,start)
    if end < 0:
        raise SystemExit(f'{label}: end marker missing')
    return text[:start]+replacement+text[end:]


def replace_line(text, prefix, replacement, label):
    lines=text.splitlines()
    hits=[i for i,l in enumerate(lines) if l.startswith(prefix)]
    if len(hits)!=1:
        raise SystemExit(f'{label}: expected one {prefix!r}, got {len(hits)}')
    lines[hits[0]]=replacement
    return '\n'.join(lines)+'\n'


wrc_path=Path('wrc-widget-flat-v1000.js')
wrc=wrc_path.read_text()
if 'motorsport-hero-v1000-crop1-' not in wrc:
    wrc=wrc.replace('// Motorsport Hub v10.0.0-hardening — flattened WRC module','// Motorsport Hub v10.0.1-hardening — flattened WRC module',1)
    wrc=wrc.replace("const V='10.0.0-hardening'","const V='10.0.1-hardening'",1)
    wrc_hero="""const HERO={sources:[
 {assetId:'wrc-katsuta-yaris-2025',url:'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5d/2025_Toyota_GR_Yaris_Rally_1_Katsuta.jpg/960px-2025_Toyota_GR_Yaris_Rally_1_Katsuta.jpg',crop:{small:{x:.18171806255976364,y:0,w:.6666666666666666,h:1},medium:{x:0,y:.30434782608695654,w:1,h:.6956521739130435}}},
 {assetId:'wrc-ogier-yaris-2025',url:'https://commons.wikimedia.org/wiki/Special:Redirect/file/2025%20Toyota%20GR%20Yaris%20Rally%201%20Ogier.jpg?width=2048',crop:{small:{x:.2921072355906169,y:0,w:.6666666666666666,h:1},medium:{x:0,y:.28471313476562504,w:1,h:.6956521739130435}}},
 {assetId:'wrc-ogier-yaris-2025',url:'https://commons.wikimedia.org/wiki/Special:Redirect/file/2025%20Toyota%20GR%20Yaris%20Rally%201%20Ogier.jpg?width=1280',crop:{small:{x:.2921072355906169,y:0,w:.6666666666666666,h:1},medium:{x:0,y:.28471313476562504,w:1,h:.6956521739130435}}}
]};

"""
    wrc=replace_block(wrc,'const HERO=', 'const col=', wrc_hero, 'WRC HERO')
    wrc_hero_fn="""function heroCropRect(img,W,H,c){const iw=img.size.width||1,ih=img.size.height||1,cw=Math.max(1,iw*c.w),ch=Math.max(1,ih*c.h),s=Math.max(W/cw,H/ch),vw=cw*s,vh=ch*s,ox=(vw-W)/2,oy=(vh-H)/2;return new Rect(-iw*c.x*s-ox,-ih*c.y*s-oy,iw*s,ih*s)}
async function hero(){const small=(config.widgetFamily||'medium')==='small',p=fm.joinPath(DOC,`motorsport-hero-v1000-crop1-${small?'small':'medium'}-wrc.jpg`);if(fm.fileExists(p)){try{return fm.readImage(p)}catch(_){} }try{let img=null,source=null;for(const src of HERO.sources){try{const r=new Request(src.url);r.timeoutInterval=10;r.headers={'User-Agent':'Mozilla/5.0','Cache-Control':'no-cache'};img=await r.loadImage();if(img){source=src;break}}catch(_){}}if(!img||!source)return null;const W=small?360:690,H=small?360:320,crop=small?source.crop.small:source.crop.medium,ctx=new DrawContext();ctx.size=new Size(W,H);ctx.opaque=true;ctx.respectScreenScale=false;ctx.setFillColor(col(C.bg));ctx.fillRect(new Rect(0,0,W,H));ctx.drawImageInRect(img,heroCropRect(img,W,H,crop));ctx.setFillColor(col('#030609',.18));ctx.fillRect(new Rect(0,0,W,H));for(let x=0;x<W;x+=2){const t=x/(W-1),a=.86*(1-smooth(t))+.07;ctx.setFillColor(col('#030609',a));ctx.fillRect(new Rect(x,0,3,H))}const bs=H*.68,bh=H-bs;for(let i=0;i<56;i++){const y=bs+i*(bh/56),t=i/55,a=.015+.25*t*t;ctx.setFillColor(col('#020407',a));ctx.fillRect(new Rect(0,y,W,bh/56+1))}const rs=W*.76;for(let x=rs;x<W;x+=2){const t=(x-rs)/(W-rs),a=.08+.40*smooth(t);ctx.setFillColor(col('#020407',a));ctx.fillRect(new Rect(x,0,3,H))}ctx.setFillColor(col(S.accent,.88));ctx.fillRect(new Rect(0,0,W,3));const out=ctx.getImage();try{fm.writeImage(p,out)}catch(_){}return out}catch(_){return null}}
"""
    wrc=replace_line(wrc,'async function hero(){',wrc_hero_fn.rstrip('\n'),'WRC hero runtime')
    wrc_path.write_text(wrc)

moto_path=Path('motogp-widget-flat-v1000.js')
moto=moto_path.read_text()
if 'motorsport-hero-v1000-crop1-' not in moto:
    moto=moto.replace('// Motorsport Hub v10.0.0-hardening — flattened MotoGP module','// Motorsport Hub v10.0.1-hardening — flattened MotoGP module',1)
    moto=moto.replace("const V='10.0.0-hardening'","const V='10.0.1-hardening'",1)
    moto_hero="""const HERO={
 APRILIA:{urls:['https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/MotoGP_2025_Malaysian_Grand_Prix_-_Aprilia_Racing_-_Marco_Bezzecchi.jpg/960px-MotoGP_2025_Malaysian_Grand_Prix_-_Aprilia_Racing_-_Marco_Bezzecchi.jpg'],crop:{small:{x:.19653893629709884,y:0,w:.6666666666666666,h:1},medium:{x:0,y:.2841728782653809,w:1,h:.6956521739130435}}},
 DUCATI:{urls:['https://upload.wikimedia.org/wikipedia/commons/thumb/d/dc/MotoGP_2025_Malaysian_Grand_Prix_-_Ducati_Lenovo_-_Francesco_Bagnaia.jpg/960px-MotoGP_2025_Malaysian_Grand_Prix_-_Ducati_Lenovo_-_Francesco_Bagnaia.jpg'],crop:{small:{x:.26584787438313173,y:0,w:.6666666666666666,h:1},medium:{x:0,y:.30434782608695654,w:1,h:.6956521739130435}}}
};

"""
    moto=replace_block(moto,'const HERO={', 'const col=', moto_hero, 'MotoGP HERO')
    moto_hero_fn="""function heroCropRect(img,W,H,c){const iw=img.size.width||1,ih=img.size.height||1,cw=Math.max(1,iw*c.w),ch=Math.max(1,ih*c.h),s=Math.max(W/cw,H/ch),vw=cw*s,vh=ch*s,ox=(vw-W)/2,oy=(vh-H)/2;return new Rect(-iw*c.x*s-ox,-ih*c.y*s-oy,iw*s,ih*s)}
async function hero(d){const small=(config.widgetFamily||'medium')==='small',maker=String(d?.ranking?.[0]?.maker||'APRILIA').toUpperCase(),preset=HERO[maker]||HERO.APRILIA,p=fm.joinPath(DOC,`motorsport-hero-v1000-crop1-${small?'small':'medium'}-motogp-${maker.toLowerCase()}.jpg`);if(fm.fileExists(p)){try{return fm.readImage(p)}catch(_){} }try{let img=null;for(const u of preset.urls){try{const r=new Request(u);r.timeoutInterval=10;r.headers={'User-Agent':'Mozilla/5.0','Cache-Control':'no-cache'};img=await r.loadImage();if(img)break}catch(_){}}if(!img)return null;const W=small?360:690,H=small?360:320,crop=small?preset.crop.small:preset.crop.medium,ctx=new DrawContext();ctx.size=new Size(W,H);ctx.opaque=true;ctx.respectScreenScale=false;ctx.setFillColor(col(C.bg));ctx.fillRect(new Rect(0,0,W,H));ctx.drawImageInRect(img,heroCropRect(img,W,H,crop));ctx.setFillColor(col('#030609',.18));ctx.fillRect(new Rect(0,0,W,H));for(let x=0;x<W;x+=2){const t=x/(W-1),a=.86*(1-smooth(t))+.07;ctx.setFillColor(col('#030609',a));ctx.fillRect(new Rect(x,0,3,H))}const bs=H*.68,bh=H-bs;for(let i=0;i<56;i++){const y=bs+i*(bh/56),t=i/55,a=.015+.25*t*t;ctx.setFillColor(col('#020407',a));ctx.fillRect(new Rect(0,y,W,bh/56+1))}const rs=W*.76;for(let x=rs;x<W;x+=2){const t=(x-rs)/(W-rs),a=.08+.40*smooth(t);ctx.setFillColor(col('#020407',a));ctx.fillRect(new Rect(x,0,3,H))}ctx.setFillColor(col(S.accent,.88));ctx.fillRect(new Rect(0,0,W,3));const out=ctx.getImage();try{fm.writeImage(p,out)}catch(_){}return out}catch(_){return null}}
"""
    moto=replace_line(moto,'async function hero(d){',moto_hero_fn.rstrip('\n'),'MotoGP hero runtime')
    moto_path.write_text(moto)

print('Hero runtime crop applicator: OK')
