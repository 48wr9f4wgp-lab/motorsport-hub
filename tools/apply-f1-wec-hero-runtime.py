#!/usr/bin/env python3
import json
import re
from pathlib import Path

ROOT=Path(__file__).resolve().parent.parent

F1_HERO="""const HERO={
 MERCEDES:{sources:[
  {assetId:'f1-mercedes-russell-japan-fp3-2025',url:'https://commons.wikimedia.org/wiki/Special:Redirect/file/2025%20Japan%20GP%20-%20Mercedes%20-%20George%20Russell%20-%20FP3.jpg?width=2048',crop:{small:{x:.24071915447711945,y:0,w:.5625,h:1},medium:{x:.02548413233757015,y:.10416263483860641,w:.9173575437068939,h:.7563398750047178}}},
  {assetId:'f1-mercedes-russell-japan-fp3-2025',url:'https://commons.wikimedia.org/wiki/Special:Redirect/file/2025%20Japan%20GP%20-%20Mercedes%20-%20George%20Russell%20-%20FP3.jpg?width=1280',crop:{small:{x:.24071915447711945,y:0,w:.5625,h:1},medium:{x:.02548413233757015,y:.10416263483860641,w:.9173575437068939,h:.7563398750047178}}}
 ]},
 FERRARI:{sources:[
  {assetId:'f1-ferrari-hamilton-japan-fp1-2025',url:'https://commons.wikimedia.org/wiki/Special:Redirect/file/2025%20Japan%20GP%20-%20Ferrari%20-%20Lewis%20Hamilton%20-%20FP1.jpg?width=2048',crop:{small:{x:.2208995819091797,y:0,w:.5625,h:1},medium:{x:0,y:.07923786778860815,w:1,h:.8244766505636071}}},
  {assetId:'f1-ferrari-hamilton-japan-fp1-2025',url:'https://commons.wikimedia.org/wiki/Special:Redirect/file/2025%20Japan%20GP%20-%20Ferrari%20-%20Lewis%20Hamilton%20-%20FP1.jpg?width=1280',crop:{small:{x:.2208995819091797,y:0,w:.5625,h:1},medium:{x:0,y:.07923786778860815,w:1,h:.8244766505636071}}}
 ]},
 MCLAREN:{sources:[
  {assetId:'f1-mclaren-piastri-japan-fp1-2025',url:'https://commons.wikimedia.org/wiki/Special:Redirect/file/2025%20Japan%20GP%20-%20McLaren%20-%20Oscar%20Piastri%20-%20FP1.jpg?width=2048',crop:{small:{x:.26781560480594635,y:0,w:.5625,h:1},medium:{x:0,y:.10067674954348334,w:1,h:.8244766505636071}}},
  {assetId:'f1-mclaren-piastri-japan-fp1-2025',url:'https://commons.wikimedia.org/wiki/Special:Redirect/file/2025%20Japan%20GP%20-%20McLaren%20-%20Oscar%20Piastri%20-%20FP1.jpg?width=1280',crop:{small:{x:.26781560480594635,y:0,w:.5625,h:1},medium:{x:0,y:.10067674954348334,w:1,h:.8244766505636071}}}
 ]}
};"""

F1_RENDERER="""function heroCropRect(img,W,H,c){const iw=img.size.width||1,ih=img.size.height||1,cw=Math.max(1,iw*c.w),ch=Math.max(1,ih*c.h),s=Math.max(W/cw,H/ch),vw=cw*s,vh=ch*s,ox=(vw-W)/2,oy=(vh-H)/2;return new Rect(-iw*c.x*s-ox,-ih*c.y*s-oy,iw*s,ih*s)}
async function hero(d){
 const small=(config.widgetFamily||'medium')==='small',maker=String(d?.ranking?.[0]?.maker||'MERCEDES').toUpperCase(),h=HERO[maker]||HERO.MERCEDES;
 const p=fm.joinPath(DOC,`motorsport-hero-v1000-crop2-${small?'small':'medium'}-f1-${maker.toLowerCase()}.jpg`);if(fm.fileExists(p)){try{return fm.readImage(p)}catch(_){} }
 try{let img=null,source=null;for(const src of h.sources){try{const r=new Request(src.url);r.timeoutInterval=10;r.headers={'User-Agent':'Mozilla/5.0','Cache-Control':'no-cache'};img=await r.loadImage();if(img){source=src;break}}catch(_){}}if(!img||!source)return null;
  const W=small?720:1380,H=small?720:640,crop=small?source.crop.small:source.crop.medium,ctx=new DrawContext();ctx.size=new Size(W,H);ctx.opaque=true;ctx.respectScreenScale=false;ctx.setFillColor(col(C.bg));ctx.fillRect(new Rect(0,0,W,H));ctx.drawImageInRect(img,heroCropRect(img,W,H,crop));ctx.setFillColor(col('#030609',.10));ctx.fillRect(new Rect(0,0,W,H));
  for(let x=0;x<W;x+=3){const t=x/(W-1),a=.86*(1-smooth(t))+.07;ctx.setFillColor(col('#030609',a));ctx.fillRect(new Rect(x,0,4,H))}
  const rs=W*.76;for(let x=rs;x<W;x+=3){const t=(x-rs)/(W-rs),a=.08+.40*smooth(t);ctx.setFillColor(col('#020407',a));ctx.fillRect(new Rect(x,0,4,H))}
  const bs=H*.67,bh=H-bs;for(let i=0;i<56;i++){const y=bs+i*(bh/56),t=i/55,a=.015+.22*t*t;ctx.setFillColor(col('#020407',a));ctx.fillRect(new Rect(0,y,W,bh/56+1))}
  ctx.setFillColor(col(S.accent,.92));ctx.fillRect(new Rect(0,0,W,5));const out=ctx.getImage();try{fm.writeImage(p,out)}catch(_){}return out
 }catch(_){return null}
}
"""

WEC_HERO="""const HERO={sources:[
 {assetId:'wec-toyota-no7-spa-2024',url:'https://commons.wikimedia.org/wiki/Special:Redirect/file/2024%206%20Hours%20of%20Spa-Francorchamps%20Toyota%20Gazoo%20Racing%20Toyota%20GR010%20Hybrid%20No.7%20%28DSC04523%29.jpg?width=2048',crop:{small:{x:.2403848002354304,y:0,w:.5627604166666667,h:1},medium:{x:0,y:.08589858062895263,w:1,h:.824095125042754}}},
 {assetId:'wec-toyota-no8-spa-2024',url:'https://commons.wikimedia.org/wiki/Special:Redirect/file/2024%206%20Hours%20of%20Spa-Francorchamps%20Toyota%20Gazoo%20Racing%20Toyota%20GR010%20Hybrid%20No.8%20%28DSC04184%29.jpg?width=2048',crop:{small:{x:.2236272970835368,y:0,w:.5627604166666667,h:1},medium:{x:0,y:.07238866634996856,w:1,h:.824095125042754}}}
]};"""

WEC_RENDERER="""function heroCropRect(img,W,H,c){const iw=img.size.width||1,ih=img.size.height||1,cw=Math.max(1,iw*c.w),ch=Math.max(1,ih*c.h),s=Math.max(W/cw,H/ch),vw=cw*s,vh=ch*s,ox=(vw-W)/2,oy=(vh-H)/2;return new Rect(-iw*c.x*s-ox,-ih*c.y*s-oy,iw*s,ih*s)}
async function hero(){const small=(config.widgetFamily||'medium')==='small',p=fm.joinPath(DOC,`motorsport-hero-v1000-crop2-${small?'small':'medium'}-wec.jpg`);if(fm.fileExists(p)){try{return fm.readImage(p)}catch(_){} }try{let img=null,source=null;for(const src of HERO.sources){try{const r=new Request(src.url);r.timeoutInterval=12;r.headers={'User-Agent':'Mozilla/5.0','Cache-Control':'no-cache'};img=await r.loadImage();if(img){source=src;break}}catch(_){}}if(!img||!source)return null;const W=small?720:1380,H=small?720:640,crop=small?source.crop.small:source.crop.medium,ctx=new DrawContext();ctx.size=new Size(W,H);ctx.opaque=true;ctx.respectScreenScale=false;ctx.setFillColor(col(C.bg));ctx.fillRect(new Rect(0,0,W,H));ctx.drawImageInRect(img,heroCropRect(img,W,H,crop));ctx.setFillColor(col('#030609',.08));ctx.fillRect(new Rect(0,0,W,H));for(let x=0;x<W;x+=3){const t=x/(W-1),a=.80*(1-smooth(t))+.05;ctx.setFillColor(col('#030609',a));ctx.fillRect(new Rect(x,0,4,H))}const rs=W*.76;for(let x=rs;x<W;x+=3){const t=(x-rs)/(W-rs),a=.08+.40*smooth(t);ctx.setFillColor(col('#020407',a));ctx.fillRect(new Rect(x,0,4,H))}const bs=H*.68,bh=H-bs;for(let i=0;i<56;i++){const y=bs+i*(bh/56),t=i/55,a=.008+.16*t*t;ctx.setFillColor(col('#020407',a));ctx.fillRect(new Rect(0,y,W,bh/56+1))}ctx.setFillColor(col(S.accent,.9));ctx.fillRect(new Rect(0,0,W,5));const out=ctx.getImage();try{fm.writeImage(p,out)}catch(_){}return out}catch(_){return null}}
"""

def replace_between(text,start_marker,end_marker,replacement):
    start=text.find(start_marker)
    if start<0: raise RuntimeError(f'missing start marker: {start_marker}')
    end=text.find(end_marker,start)
    if end<0: raise RuntimeError(f'missing end marker: {end_marker}')
    return text[:start]+replacement+"\n"+text[end:]

def patch_f1():
    p=ROOT/'f1-widget-flat-v1000.js'; s=p.read_text()
    if 'f1-ferrari-hamilton-japan-fp1-2025' in s and 'motorsport-hero-v1000-crop2-' in s: return
    s=re.sub(r'// Motorsport Hub v[^\n]+ — flattened F1 pilot module','// Motorsport Hub v10.0.2-hardening — flattened F1 pilot module',s,count=1)
    s=s.replace("const V='10.0.0-hardening'","const V='10.0.2-hardening'")
    s=replace_between(s,'const HERO={','const col=',F1_HERO)
    s=replace_between(s,'function cover(img,W,H,focus=.5,shift=0)','function T(',F1_RENDERER)
    p.write_text(s)

def patch_wec():
    p=ROOT/'wec-widget-flat-v1000.js'; s=p.read_text()
    if 'motorsport-hero-v1000-crop2-' in s: return
    s=re.sub(r'// Motorsport Hub v[^\n]+ — flattened WEC module','// Motorsport Hub v10.0.2-hardening — flattened WEC module',s,count=1)
    s=s.replace("const V='10.0.0-hardening'","const V='10.0.2-hardening'")
    s=replace_between(s,'const HERO_URLS=[','const col=',WEC_HERO)
    s=replace_between(s,'function cover(img,W,H,focus=.52,shift=0)','function T(',WEC_RENDERER)
    p.write_text(s)

def patch_manifest():
    p=ROOT/'hero-assets.json'; data=json.loads(p.read_text())
    data['auditedAt']='2026-08-28'
    f1=[
      {'assetId':'f1-mercedes-russell-japan-fp3-2025','category':'F1','filename':'2025 Japan GP - Mercedes - George Russell - FP3.jpg','runtimeUrls':['https://commons.wikimedia.org/wiki/Special:Redirect/file/2025%20Japan%20GP%20-%20Mercedes%20-%20George%20Russell%20-%20FP3.jpg?width=2048','https://commons.wikimedia.org/wiki/Special:Redirect/file/2025%20Japan%20GP%20-%20Mercedes%20-%20George%20Russell%20-%20FP3.jpg?width=1280'],'sourcePage':'https://commons.wikimedia.org/wiki/File:2025_Japan_GP_-_Mercedes_-_George_Russell_-_FP3.jpg','author':'Liauzh','license':'CC BY-SA 4.0','modificationNoticeRequired':True,'reviewNote':'Action Hero accepted after subject-aware Small/Medium visual pilot on 2026-08-28.'},
      {'assetId':'f1-ferrari-hamilton-japan-fp1-2025','category':'F1','filename':'2025 Japan GP - Ferrari - Lewis Hamilton - FP1.jpg','runtimeUrls':['https://commons.wikimedia.org/wiki/Special:Redirect/file/2025%20Japan%20GP%20-%20Ferrari%20-%20Lewis%20Hamilton%20-%20FP1.jpg?width=2048','https://commons.wikimedia.org/wiki/Special:Redirect/file/2025%20Japan%20GP%20-%20Ferrari%20-%20Lewis%20Hamilton%20-%20FP1.jpg?width=1280'],'sourcePage':'https://commons.wikimedia.org/wiki/File:2025_Japan_GP_-_Ferrari_-_Lewis_Hamilton_-_FP1.jpg','author':'Liauzh','license':'CC BY-SA 4.0','modificationNoticeRequired':True,'reviewNote':'Action Hero accepted after subject-aware Small/Medium visual pilot on 2026-08-28.'},
      {'assetId':'f1-mclaren-piastri-japan-fp1-2025','category':'F1','filename':'2025 Japan GP - McLaren - Oscar Piastri - FP1.jpg','runtimeUrls':['https://commons.wikimedia.org/wiki/Special:Redirect/file/2025%20Japan%20GP%20-%20McLaren%20-%20Oscar%20Piastri%20-%20FP1.jpg?width=2048','https://commons.wikimedia.org/wiki/Special:Redirect/file/2025%20Japan%20GP%20-%20McLaren%20-%20Oscar%20Piastri%20-%20FP1.jpg?width=1280'],'sourcePage':'https://commons.wikimedia.org/wiki/File:2025_Japan_GP_-_McLaren_-_Oscar_Piastri_-_FP1.jpg','author':'Liauzh','license':'CC BY-SA 4.0','modificationNoticeRequired':True,'reviewNote':'Action Hero accepted after subject-aware Small/Medium visual pilot on 2026-08-28.'}
    ]
    rest=[a for a in data.get('assets',[]) if a.get('category')!='F1']
    data['assets']=f1+rest
    p.write_text(json.dumps(data,ensure_ascii=False,indent=2)+'\n')

def patch_attribution():
    p=ROOT/'ATTRIBUTION.md'; s=p.read_text()
    s=s.replace('Scope: current v9.5.3 hardening build / 12 category hero assets used by the Scriptable widget.','Scope: current v10.0.2 hardening build / 12 category hero assets used by the Scriptable widget.')
    section="""## Formula 1 (F1)
- Current Action Hero set: **Lewis Hamilton / Ferrari SF-25 FP1**, **Oscar Piastri / McLaren MCL39 FP1**, and **George Russell / Mercedes W16 FP3** from the 2025 Japanese Grand Prix.
- Author: **Liauzh**.
- License: **CC BY-SA 4.0 International** for all three current runtime assets.
- Runtime treatment: subject-aware crop, resize, and darkening; modification notice and ShareAlike obligations remain applicable.
- File pages:
  - https://commons.wikimedia.org/wiki/File:2025_Japan_GP_-_Ferrari_-_Lewis_Hamilton_-_FP1.jpg
  - https://commons.wikimedia.org/wiki/File:2025_Japan_GP_-_McLaren_-_Oscar_Piastri_-_FP1.jpg
  - https://commons.wikimedia.org/wiki/File:2025_Japan_GP_-_Mercedes_-_George_Russell_-_FP3.jpg
"""
    s=re.sub(r'## Formula 1 \(F1\)\n.*?(?=\n## FIA World Rally Championship)',section.rstrip()+'\n',s,flags=re.S,count=1)
    p.write_text(s)

patch_f1();patch_wec();patch_manifest();patch_attribution()
print('Accepted F1/WEC Hero runtime patch applied or already present.')
