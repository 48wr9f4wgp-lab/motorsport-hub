#!/usr/bin/env python3
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
VERSION = "10.0.3-hardening"

SUPERGT_HERO = """const HERO={sources:[
 {assetId:'supergt-motul-autech-z-fuji-2024',url:'https://commons.wikimedia.org/wiki/Special:Redirect/file/MOTUL%20AUTECH%20Z%202024%20rd.2%20FUJI.jpg?width=2048',crop:{small:{x:.15955494097645323,y:0,w:.6665637542451374,h:1},medium:{x:0,y:.18996898193473516,w:1,h:.6957595773674071}}},
 {assetId:'supergt-motul-autech-z-fuji-2024',url:'https://commons.wikimedia.org/wiki/Special:Redirect/file/MOTUL%20AUTECH%20Z%202024%20rd.2%20FUJI.jpg?width=1280',crop:{small:{x:.15955494097645323,y:0,w:.6665637542451374,h:1},medium:{x:0,y:.18996898193473516,w:1,h:.6957595773674071}}}
]};"""

FDJ_HERO = """const HERO={sources:[
 {assetId:'fdj-drift-cc0',url:'https://commons.wikimedia.org/wiki/Special:Redirect/file/DRIFT-0ae1a2ba-2d7b-4d51-b082-b698f2fbb2f1.jpg?width=2048',crop:{small:{x:.14733669779300687,y:.11229100644588468,w:.6106062036752701,h:.8141416049003601},medium:{x:.09269440517425534,y:.31221205044195843,w:.67,h:.4142995169082126}}},
 {assetId:'fdj-drift-cc0',url:'https://commons.wikimedia.org/wiki/Special:Redirect/file/DRIFT-0ae1a2ba-2d7b-4d51-b082-b698f2fbb2f1.jpg?width=1280',crop:{small:{x:.14733669779300687,y:.11229100644588468,w:.6106062036752701,h:.8141416049003601},medium:{x:.09269440517425534,y:.31221205044195843,w:.67,h:.4142995169082126}}}
]};"""

D1GP_HERO = """const HERO={sources:[
 {assetId:'d1gp-rick-flores-2011',url:'https://commons.wikimedia.org/wiki/Special:Redirect/file/D1GP%20%285679098995%29.jpg?width=2048',crop:{small:{x:.268100764952304,y:0,w:.665390138822403,h:1},medium:{x:.08660469293751288,y:.23443056344985963,w:.8626684779689151,h:.6012685060501098}}},
 {assetId:'d1gp-rick-flores-2011',url:'https://commons.wikimedia.org/wiki/Special:Redirect/file/D1GP%20%285679098995%29.jpg?width=1280',crop:{small:{x:.268100764952304,y:0,w:.665390138822403,h:1},medium:{x:.08660469293751288,y:.23443056344985963,w:.8626684779689151,h:.6012685060501098}}}
]};"""

SUPERGT_RENDERER = """function heroCropRect(img,W,H,c){const iw=img.size.width||1,ih=img.size.height||1,cw=Math.max(1,iw*c.w),ch=Math.max(1,ih*c.h),s=Math.max(W/cw,H/ch),vw=cw*s,vh=ch*s,ox=(vw-W)/2,oy=(vh-H)/2;return new Rect(-iw*c.x*s-ox,-ih*c.y*s-oy,iw*s,ih*s)}
async function hero(){const small=(config.widgetFamily||'medium')==='small',p=fm.joinPath(DOC,`motorsport-hero-v1000-crop3-${small?'small':'medium'}-supergt.jpg`);if(fm.fileExists(p)){try{return fm.readImage(p)}catch(_){} }try{let img=null,source=null;for(const src of HERO.sources){try{const r=new Request(src.url);r.timeoutInterval=12;r.headers={'User-Agent':'Mozilla/5.0','Cache-Control':'no-cache'};img=await r.loadImage();if(img){source=src;break}}catch(_){}}if(!img||!source)return null;const W=small?720:1380,H=small?720:640,crop=small?source.crop.small:source.crop.medium,ctx=new DrawContext();ctx.size=new Size(W,H);ctx.opaque=true;ctx.respectScreenScale=false;ctx.setFillColor(col(C.bg));ctx.fillRect(new Rect(0,0,W,H));ctx.drawImageInRect(img,heroCropRect(img,W,H,crop));ctx.setFillColor(col('#030609',.08));ctx.fillRect(new Rect(0,0,W,H));for(let x=0;x<W;x+=3){const t=x/(W-1),a=.80*(1-smooth(t))+.05;ctx.setFillColor(col('#030609',a));ctx.fillRect(new Rect(x,0,4,H))}const rs=W*.76;for(let x=rs;x<W;x+=3){const t=(x-rs)/(W-rs),a=.08+.40*smooth(t);ctx.setFillColor(col('#020407',a));ctx.fillRect(new Rect(x,0,4,H))}const bs=H*.68,bh=H-bs;for(let i=0;i<56;i++){const y=bs+i*(bh/56),t=i/55,a=.008+.16*t*t;ctx.setFillColor(col('#020407',a));ctx.fillRect(new Rect(0,y,W,bh/56+1))}ctx.setFillColor(col(S.accent,.9));ctx.fillRect(new Rect(0,0,W,5));const out=ctx.getImage();try{fm.writeImage(p,out)}catch(_){}return out}catch(_){return null}}
"""

FDJ_RENDERER = """function heroCropRect(img,W,H,c){const iw=img.size.width||1,ih=img.size.height||1,cw=Math.max(1,iw*c.w),ch=Math.max(1,ih*c.h),s=Math.max(W/cw,H/ch),vw=cw*s,vh=ch*s,ox=(vw-W)/2,oy=(vh-H)/2;return new Rect(-iw*c.x*s-ox,-ih*c.y*s-oy,iw*s,ih*s)}
async function hero(){const small=(config.widgetFamily||'medium')==='small',p=fm.joinPath(DOC,`motorsport-hero-v1000-crop3-${small?'small':'medium'}-fdj.jpg`);if(fm.fileExists(p)){try{return fm.readImage(p)}catch(_){} }try{let img=null,source=null;for(const src of HERO.sources){try{const r=new Request(src.url);r.timeoutInterval=10;r.headers={'User-Agent':'Mozilla/5.0','Cache-Control':'no-cache'};img=await r.loadImage();if(img){source=src;break}}catch(_){}}if(!img||!source)return null;const W=small?360:690,H=small?360:320,crop=small?source.crop.small:source.crop.medium,ctx=new DrawContext();ctx.size=new Size(W,H);ctx.opaque=true;ctx.respectScreenScale=false;ctx.setFillColor(col(C.bg));ctx.fillRect(new Rect(0,0,W,H));ctx.drawImageInRect(img,heroCropRect(img,W,H,crop));ctx.setFillColor(col('#030609',.15));ctx.fillRect(new Rect(0,0,W,H));for(let x=0;x<W;x+=2){const t=x/(W-1),a=.86*(1-smooth(t))+.07;ctx.setFillColor(col('#030609',a));ctx.fillRect(new Rect(x,0,3,H))}const rs=W*.76;for(let x=rs;x<W;x+=2){const t=(x-rs)/(W-rs),a=.08+.40*smooth(t);ctx.setFillColor(col('#020407',a));ctx.fillRect(new Rect(x,0,3,H))}const bs=H*.67,bh=H-bs;for(let i=0;i<48;i++){const y=bs+i*(bh/48),t=i/47,a=.015+.22*t*t;ctx.setFillColor(col('#020407',a));ctx.fillRect(new Rect(0,y,W,bh/48+1))}ctx.setFillColor(col(S.accent,.9));ctx.fillRect(new Rect(0,0,W,3));const out=ctx.getImage();try{fm.writeImage(p,out)}catch(_){}return out}catch(_){return null}}
"""

D1GP_RENDERER = """function heroCropRect(img,W,H,c){const iw=img.size.width||1,ih=img.size.height||1,cw=Math.max(1,iw*c.w),ch=Math.max(1,ih*c.h),s=Math.max(W/cw,H/ch),vw=cw*s,vh=ch*s,ox=(vw-W)/2,oy=(vh-H)/2;return new Rect(-iw*c.x*s-ox,-ih*c.y*s-oy,iw*s,ih*s)}
async function hero(){const small=(config.widgetFamily||'medium')==='small',p=fm.joinPath(DOC,`motorsport-hero-v1000-crop3-${small?'small':'medium'}-d1gp.jpg`);if(fm.fileExists(p)){try{return fm.readImage(p)}catch(_){} }try{let img=null,source=null;for(const src of HERO.sources){try{const r=new Request(src.url);r.timeoutInterval=12;r.headers={'User-Agent':'Mozilla/5.0','Cache-Control':'no-cache'};img=await r.loadImage();if(img){source=src;break}}catch(_){}}if(!img||!source)return null;const W=small?720:1380,H=small?720:640,crop=small?source.crop.small:source.crop.medium,ctx=new DrawContext();ctx.size=new Size(W,H);ctx.opaque=true;ctx.respectScreenScale=false;ctx.setFillColor(col(C.bg));ctx.fillRect(new Rect(0,0,W,H));ctx.drawImageInRect(img,heroCropRect(img,W,H,crop));ctx.setFillColor(col('#030609',.08));ctx.fillRect(new Rect(0,0,W,H));for(let x=0;x<W;x+=3){const t=x/(W-1),a=.84*(1-smooth(t))+.06;ctx.setFillColor(col('#030609',a));ctx.fillRect(new Rect(x,0,4,H))}const rs=W*.76;for(let x=rs;x<W;x+=3){const t=(x-rs)/(W-rs),a=.10+.42*smooth(t);ctx.setFillColor(col('#020407',a));ctx.fillRect(new Rect(x,0,4,H))}const bs=H*.67,bh=H-bs;for(let i=0;i<56;i++){const y=bs+i*(bh/56),t=i/55,a=.01+.18*t*t;ctx.setFillColor(col('#020407',a));ctx.fillRect(new Rect(0,y,W,bh/56+1))}ctx.setFillColor(col(S.accent,.92));ctx.fillRect(new Rect(0,0,W,5));const out=ctx.getImage();try{fm.writeImage(p,out)}catch(_){}return out}catch(_){return null}}
"""

def replace_between(text, start_marker, end_marker, replacement):
    start = text.find(start_marker)
    if start < 0:
        raise RuntimeError(f"missing start marker: {start_marker}")
    end = text.find(end_marker, start)
    if end < 0:
        raise RuntimeError(f"missing end marker: {end_marker}")
    return text[:start] + replacement + "\n" + text[end:]

def patch_module(path, label, hero_start, renderer_start, hero_block, renderer_block, accepted_asset):
    p = ROOT / path
    s = p.read_text()
    if accepted_asset in s and "motorsport-hero-v1000-crop3-" in s and f"const V='{VERSION}'" in s:
        return
    s = re.sub(rf"// Motorsport Hub v[^\n]+ — {re.escape(label)}", f"// Motorsport Hub v{VERSION} — {label}", s, count=1)
    s = re.sub(r"const V='[^']+'", f"const V='{VERSION}'", s, count=1)
    s = replace_between(s, hero_start, "const col=", hero_block)
    s = replace_between(s, renderer_start, "function T(", renderer_block)
    if accepted_asset not in s or "motorsport-hero-v1000-crop3-" not in s:
        raise RuntimeError(f"{path}: accepted Hero patch incomplete")
    p.write_text(s)

def patch_manifest():
    p = ROOT / "hero-assets.json"
    data = json.loads(p.read_text())
    data["auditedAt"] = "2026-08-28"
    replacements = {
        "SUPERGT": {"assetId":"supergt-motul-autech-z-fuji-2024","category":"SUPERGT","filename":"MOTUL AUTECH Z 2024 rd.2 FUJI.jpg","runtimeUrls":["https://commons.wikimedia.org/wiki/Special:Redirect/file/MOTUL%20AUTECH%20Z%202024%20rd.2%20FUJI.jpg?width=2048","https://commons.wikimedia.org/wiki/Special:Redirect/file/MOTUL%20AUTECH%20Z%202024%20rd.2%20FUJI.jpg?width=1280"],"sourcePage":"https://commons.wikimedia.org/wiki/File:MOTUL_AUTECH_Z_2024_rd.2_FUJI.jpg","author":"Abarabone1206","license":"CC BY 4.0","modificationNoticeRequired":True,"reviewNote":"2024 SUPER GT race-action Hero accepted after subject-aware Small/Medium visual pilot on 2026-08-28."},
        "D1GP": {"assetId":"d1gp-rick-flores-2011","category":"D1GP","filename":"D1GP (5679098995).jpg","runtimeUrls":["https://commons.wikimedia.org/wiki/Special:Redirect/file/D1GP%20%285679098995%29.jpg?width=2048","https://commons.wikimedia.org/wiki/Special:Redirect/file/D1GP%20%285679098995%29.jpg?width=1280"],"sourcePage":"https://commons.wikimedia.org/wiki/File:D1GP_(5679098995).jpg","author":"Rick Flores (Flickr: Ricky Flores)","license":"CC BY 2.0","modificationNoticeRequired":True,"reviewNote":"Actual D1 Grand Prix action Hero accepted over the unrelated King of Europe asset after Small/Medium visual pilot on 2026-08-28."}
    }
    out=[];seen=set()
    for a in data.get("assets",[]):
        cat=a.get("category")
        if cat in replacements:
            if cat not in seen: out.append(replacements[cat]);seen.add(cat)
        elif cat=="FDJ":
            b=dict(a);b["reviewNote"]="Current drift action Hero retained with subject-aware Small/Medium crop accepted on 2026-08-28.";out.append(b)
        else: out.append(a)
    missing=set(replacements)-seen
    if missing: raise RuntimeError(f"hero-assets.json missing categories to replace: {sorted(missing)}")
    data["assets"]=out
    p.write_text(json.dumps(data,ensure_ascii=False,indent=2)+"\n")

def replace_section(text, heading, next_heading, replacement):
    start=text.find(heading)
    if start<0: raise RuntimeError(f"ATTRIBUTION missing heading: {heading}")
    end=text.find(next_heading,start)
    if end<0: raise RuntimeError(f"ATTRIBUTION missing next heading: {next_heading}")
    return text[:start]+replacement.rstrip()+"\n\n"+text[end:]

def patch_attribution():
    p=ROOT/"ATTRIBUTION.md";s=p.read_text()
    s=re.sub(r"Last audited: [^\n]+","Last audited: 2026-08-28 JST",s,count=1)
    s=re.sub(r"Scope: current v[^\n]+","Scope: current v10.0.3 hardening build / 12 category hero assets used by the Scriptable widget.",s,count=1)
    fdj="""## Formula Drift Japan (FDJ)\n- **DRIFT-0ae1a2ba-2d7b-4d51-b082-b698f2fbb2f1.jpg**.\n- Source: Wikimedia Commons / Pixabay.\n- License: **CC0 1.0 Universal**.\n- Runtime treatment: accepted subject-aware Small/Medium crop, resize, and darkening.\n- File page: https://commons.wikimedia.org/wiki/File:DRIFT-0ae1a2ba-2d7b-4d51-b082-b698f2fbb2f1.jpg"""
    d1="""## D1 GRAND PRIX (D1GP)\n- **D1GP (5679098995).jpg** — actual D1 Grand Prix action photograph from 2011.\n- Author: **Rick Flores** (Flickr metadata: Ricky Flores).\n- License: **CC BY 2.0 Generic**.\n- Runtime treatment: subject-aware crop, resize, and darkening; attribution and modification notice obligations remain applicable.\n- File page: https://commons.wikimedia.org/wiki/File:D1GP_(5679098995).jpg"""
    sgt="""## SUPER GT\n- **MOTUL AUTECH Z 2024 rd.2 FUJI.jpg** — 2024 SUPER GT race-action photograph.\n- Author: **Abarabone1206**.\n- License: **CC BY 4.0 International**.\n- Runtime treatment: subject-aware crop, resize, and darkening; attribution and modification notice obligations remain applicable.\n- File page: https://commons.wikimedia.org/wiki/File:MOTUL_AUTECH_Z_2024_rd.2_FUJI.jpg\n- The superseded Osaka Auto Messe showroom Hero is no longer reachable from runtime."""
    s=replace_section(s,"## Formula Drift Japan (FDJ)","## D1 GRAND PRIX (D1GP)",fdj)
    s=replace_section(s,"## D1 GRAND PRIX (D1GP)","## SUPER GT",d1)
    s=replace_section(s,"## SUPER GT","## SUPER FORMULA",sgt)
    p.write_text(s)

def patch_release_gate():
    p=ROOT/"tests/release-gate.mjs";s=p.read_text()
    old_sgt="assert(sourceById.SUPERGT.includes('Osaka%20Auto%20Messe%202025'));";new_sgt="assert(sourceById.SUPERGT.includes('MOTUL%20AUTECH%20Z%202024%20rd.2%20FUJI.jpg'));assert(!sourceById.SUPERGT.includes('Osaka%20Auto%20Messe%202025'));"
    old_d1="assert(sourceById.D1GP.includes('d1gp.co.jp/2026d1')&&sourceById.D1GP.includes('King%20of%20Europe')&&sourceById.D1GP.includes('hold=40*3600000'));";new_d1="assert(sourceById.D1GP.includes('d1gp.co.jp/2026d1')&&sourceById.D1GP.includes('D1GP%20%285679098995%29.jpg')&&sourceById.D1GP.includes('hold=40*3600000'));assert(!sourceById.D1GP.includes('King%20of%20Europe'));"
    if old_sgt in s:s=s.replace(old_sgt,new_sgt,1)
    elif new_sgt not in s:raise RuntimeError("release-gate SUPER GT Hero assertion drift")
    if old_d1 in s:s=s.replace(old_d1,new_d1,1)
    elif new_d1 not in s:raise RuntimeError("release-gate D1GP Hero assertion drift")
    s=s.replace("'TTTNIS','Liauzh','MarcelX42','Rowan Harrison','Tokumeigakarinoaoshima','BWard 1997'","'TTTNIS','Liauzh','MarcelX42','Rick Flores','Abarabone1206','BWard 1997'",1)
    s=s.replace("'CC0 1.0 Universal','CC BY 4.0','CC BY-SA 4.0','CC BY-SA 2.0'","'CC0 1.0 Universal','CC BY 4.0','CC BY-SA 4.0','CC BY 2.0'",1)
    p.write_text(s)

def patch_supergt_gate():
    p=ROOT/"tests/supergt-flat-gate.mjs";s=p.read_text()
    old="assert.match(sgt,/Osaka%20Auto%20Messe%202025/,'verified CC0 hero missing');assert.doesNotMatch(sgt,/Fujimaki|MOTUL%20AUTECH|front%20three-quarter/,'unverified historical hero must not return');"
    new="assert.match(sgt,/MOTUL%20AUTECH%20Z%202024%20rd\\.2%20FUJI/,'verified SUPER GT action hero missing');assert.doesNotMatch(sgt,/Osaka%20Auto%20Messe%202025|Fujimaki|front%20three-quarter/,'superseded or unverified SUPER GT hero must not return');"
    if old in s:s=s.replace(old,new,1)
    elif new not in s:raise RuntimeError("supergt-flat-gate Hero assertion drift")
    p.write_text(s)

patch_module("supergt-widget-flat-v1000.js","flattened SUPER GT module","const HERO_URLS=[","function cover(img,W,H,focus=.54,shift=0)",SUPERGT_HERO,SUPERGT_RENDERER,"supergt-motul-autech-z-fuji-2024")
patch_module("fdj-widget-flat-v1000.js","flattened Formula Drift Japan module","const HERO_URLS=[","function cover(img,W,H,focus=.54,shift=0)",FDJ_HERO,FDJ_RENDERER,"fdj-drift-cc0")
patch_module("d1gp-widget-flat-v1000.js","flattened D1GP module","const HERO_URLS=[","function cover(img,W,H,focus=.52,shift=0)",D1GP_HERO,D1GP_RENDERER,"d1gp-rick-flores-2011")
patch_manifest();patch_attribution();patch_release_gate();patch_supergt_gate()
print("Domestic Hero runtime patch: applied or already current")
