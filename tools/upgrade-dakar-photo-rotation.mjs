import fs from 'node:fs';
import assert from 'node:assert/strict';

const widgetPath='dakar-widget.js';
const manifestPath='hero-assets.json';
const tapGatePath='tests/tap-action-gate.mjs';

let src=fs.readFileSync(widgetPath,'utf8');
const replaceOnce=(from,to,label)=>{
  const count=src.split(from).length-1;
  assert.equal(count,1,`${label}: expected one match, got ${count}`);
  src=src.replace(from,to);
};

replaceOnce('// Motorsport Hub v9.5.1-hardening — DAKAR dedicated rally-raid module','// Motorsport Hub v9.5.2-hardening — DAKAR dedicated rally-raid module','header version');
replaceOnce('// Tap Action v1: tap widget to cycle three persisted Hero framing presets; Medium DAKAR badge opens official site.','// Tap Action v2: tap widget to cycle three distinct persisted Hero photos; Medium DAKAR badge opens official site.','tap comment');
replaceOnce("const V='9.5.1-hardening'","const V='9.5.2-hardening'",'runtime version');

replaceOnce(`const HERO_FRAMES=[
 {label:'WIDE',focus:.58,zoom:1,smallShift:18,mediumShift:70},
 {label:'DETAIL',focus:.72,zoom:1.18,smallShift:-40,mediumShift:-100},
 {label:'OFFSET',focus:.42,zoom:1.10,smallShift:70,mediumShift:170}
];`,`const HERO_VARIANTS=[
 {label:'PHOTO 1',filename:'Dacia Sandrider GIMS 2024 1X7A2026.jpg',urls:[
  'https://commons.wikimedia.org/wiki/Special:Redirect/file/Dacia%20Sandrider%20GIMS%202024%201X7A2026.jpg?width=2048',
  'https://commons.wikimedia.org/wiki/Special:Redirect/file/Dacia%20Sandrider%20GIMS%202024%201X7A2026.jpg?width=1280'
 ],focus:.58,zoom:1,smallShift:18,mediumShift:70},
 {label:'PHOTO 2',filename:'Dacia Sandrider GIMS 2024 1X7A2028.jpg',urls:[
  'https://commons.wikimedia.org/wiki/Special:Redirect/file/Dacia%20Sandrider%20GIMS%202024%201X7A2028.jpg?width=2048',
  'https://commons.wikimedia.org/wiki/Special:Redirect/file/Dacia%20Sandrider%20GIMS%202024%201X7A2028.jpg?width=1280'
 ],focus:.56,zoom:1.03,smallShift:10,mediumShift:45},
 {label:'PHOTO 3',filename:'Dacia Sandrider GIMS 2024 1X7A2029.jpg',urls:[
  'https://commons.wikimedia.org/wiki/Special:Redirect/file/Dacia%20Sandrider%20GIMS%202024%201X7A2029.jpg?width=2048',
  'https://commons.wikimedia.org/wiki/Special:Redirect/file/Dacia%20Sandrider%20GIMS%202024%201X7A2029.jpg?width=1280'
 ],focus:.52,zoom:1.02,smallShift:20,mediumShift:70}
];`,'hero variants');

src=src.replaceAll('HERO_FRAMES.length','HERO_VARIANTS.length');

replaceOnce(`// Exact Commons file page verified: Alexander-93 / CC BY-SA 4.0 / original 5378×3588.
const HERO_URLS=[
 'https://commons.wikimedia.org/wiki/Special:Redirect/file/Dacia%20Sandrider%20GIMS%202024%201X7A2026.jpg?width=2048',
 'https://commons.wikimedia.org/wiki/Special:Redirect/file/Dacia%20Sandrider%20GIMS%202024%201X7A2026.jpg?width=1280'
];`,`// Hero photo set: Alexander-93 Dacia Sandrider GIMS 2024 series. Exact source pages are tracked in hero-assets.json.`,'old hero URL block');

replaceOnce("'User-Agent':'Mozilla/5.0 MotorsportHub/9.5.1'","'User-Agent':'Mozilla/5.0 MotorsportHub/9.5.2'",'data UA');

const oldHero="async function hero(){const small=(config.widgetFamily||'medium')==='small',frame=HERO_FRAMES[UI.heroVariant]||HERO_FRAMES[0],p=fm.joinPath(DOC,`motorsport-hero-v951-${small?'small':'medium'}-dakar-h${UI.heroVariant}.jpg`);if(fm.fileExists(p)){try{return fm.readImage(p)}catch(_){} }try{let img=null;for(const u of HERO_URLS){try{const r=new Request(`${u}&v=951`);r.timeoutInterval=10;r.headers={'User-Agent':'Mozilla/5.0','Cache-Control':'no-cache'};img=await r.loadImage();if(img)break}catch(_){}}if(!img)return null;const W=small?720:1380,H=small?720:640,ctx=new DrawContext();ctx.size=new Size(W,H);ctx.opaque=true;ctx.respectScreenScale=false;ctx.setFillColor(col(C.bg));ctx.fillRect(new Rect(0,0,W,H));ctx.drawImageInRect(img,cover(img,W,H,frame.focus,small?frame.smallShift:frame.mediumShift,frame.zoom));ctx.setFillColor(col('#060503',.12));ctx.fillRect(new Rect(0,0,W,H));for(let x=0;x<W;x+=3){const t=x/(W-1),a=.84*(1-smooth(t))+.055;ctx.setFillColor(col('#050403',a));ctx.fillRect(new Rect(x,0,4,H))}const rs=W*.74;for(let x=rs;x<W;x+=3){const t=(x-rs)/(W-rs),a=.07+.42*smooth(t);ctx.setFillColor(col('#050403',a));ctx.fillRect(new Rect(x,0,4,H))}const bs=H*.68,bh=H-bs;for(let i=0;i<56;i++){const y=bs+i*(bh/56),t=i/55,a=.02+.24*t*t;ctx.setFillColor(col('#040302',a));ctx.fillRect(new Rect(0,y,W,bh/56+1))}ctx.setFillColor(col(S.accent,.94));ctx.fillRect(new Rect(0,0,W,5));const out=ctx.getImage();try{fm.writeImage(p,out)}catch(_){}return out}catch(_){return null}}";
const newHero="async function hero(){const small=(config.widgetFamily||'medium')==='small',variant=HERO_VARIANTS[UI.heroVariant]||HERO_VARIANTS[0],p=fm.joinPath(DOC,`motorsport-hero-v952-${small?'small':'medium'}-dakar-h${UI.heroVariant}.jpg`);if(fm.fileExists(p)){try{return fm.readImage(p)}catch(_){} }try{let img=null;for(const u of variant.urls){try{const r=new Request(`${u}&v=952`);r.timeoutInterval=10;r.headers={'User-Agent':'Mozilla/5.0','Cache-Control':'no-cache'};img=await r.loadImage();if(img)break}catch(_){}}if(!img)return null;const W=small?720:1380,H=small?720:640,ctx=new DrawContext();ctx.size=new Size(W,H);ctx.opaque=true;ctx.respectScreenScale=false;ctx.setFillColor(col(C.bg));ctx.fillRect(new Rect(0,0,W,H));ctx.drawImageInRect(img,cover(img,W,H,variant.focus,small?variant.smallShift:variant.mediumShift,variant.zoom));ctx.setFillColor(col('#060503',.12));ctx.fillRect(new Rect(0,0,W,H));for(let x=0;x<W;x+=3){const t=x/(W-1),a=.84*(1-smooth(t))+.055;ctx.setFillColor(col('#050403',a));ctx.fillRect(new Rect(x,0,4,H))}const rs=W*.74;for(let x=rs;x<W;x+=3){const t=(x-rs)/(W-rs),a=.07+.42*smooth(t);ctx.setFillColor(col('#050403',a));ctx.fillRect(new Rect(x,0,4,H))}const bs=H*.68,bh=H-bs;for(let i=0;i<56;i++){const y=bs+i*(bh/56),t=i/55,a=.02+.24*t*t;ctx.setFillColor(col('#040302',a));ctx.fillRect(new Rect(0,y,W,bh/56+1))}ctx.setFillColor(col(S.accent,.94));ctx.fillRect(new Rect(0,0,W,5));const out=ctx.getImage();try{fm.writeImage(p,out)}catch(_){}return out}catch(_){return null}}";
replaceOnce(oldHero,newHero,'hero renderer');

assert(src.includes('1X7A2026.jpg?width=2048'));
assert(src.includes('1X7A2028.jpg?width=2048'));
assert(src.includes('1X7A2029.jpg?width=2048'));
assert(!src.includes('HERO_FRAMES'));
assert(!src.includes('HERO_URLS'));
fs.writeFileSync(widgetPath,src);

const manifest=JSON.parse(fs.readFileSync(manifestPath,'utf8'));
const exists=id=>manifest.assets.some(a=>a.assetId===id);
if(!exists('dakar-dacia-sandrider-gims-2024-photo2'))manifest.assets.push({
 assetId:'dakar-dacia-sandrider-gims-2024-photo2',category:'DAKAR',filename:'Dacia Sandrider GIMS 2024 1X7A2028.jpg',
 runtimeUrls:[
  'https://commons.wikimedia.org/wiki/Special:Redirect/file/Dacia%20Sandrider%20GIMS%202024%201X7A2028.jpg?width=2048',
  'https://commons.wikimedia.org/wiki/Special:Redirect/file/Dacia%20Sandrider%20GIMS%202024%201X7A2028.jpg?width=1280'
 ],
 sourcePage:'https://commons.wikimedia.org/wiki/File:Dacia_Sandrider_GIMS_2024_1X7A2028.jpg',author:'Alexander-93',license:'CC BY-SA 4.0',modificationNoticeRequired:true,
 reviewNote:'Same Alexander-93 GIMS Sandrider series; exact file-page license metadata must be rechecked before public release.'
});
if(!exists('dakar-dacia-sandrider-gims-2024-photo3'))manifest.assets.push({
 assetId:'dakar-dacia-sandrider-gims-2024-photo3',category:'DAKAR',filename:'Dacia Sandrider GIMS 2024 1X7A2029.jpg',
 runtimeUrls:[
  'https://commons.wikimedia.org/wiki/Special:Redirect/file/Dacia%20Sandrider%20GIMS%202024%201X7A2029.jpg?width=2048',
  'https://commons.wikimedia.org/wiki/Special:Redirect/file/Dacia%20Sandrider%20GIMS%202024%201X7A2029.jpg?width=1280'
 ],
 sourcePage:'https://commons.wikimedia.org/wiki/File:Dacia_Sandrider_GIMS_2024_1X7A2029.jpg',author:'Alexander-93',license:'CC BY-SA 4.0',modificationNoticeRequired:true,
 reviewNote:'Same Alexander-93 GIMS Sandrider series; exact file-page license metadata must be rechecked before public release.'
});
fs.writeFileSync(manifestPath,JSON.stringify(manifest,null,2)+'\n');

let tap=fs.readFileSync(tapGatePath,'utf8');
tap=tap.replace("for(const token of ['Tap Action v1','motorsport-ui-v1-dakar.json','HERO_FRAMES','mhAction=cycleHero','URLScheme.forRunningScript','heroVariant'])","for(const token of ['Tap Action v2','motorsport-ui-v1-dakar.json','HERO_VARIANTS','1X7A2026.jpg','1X7A2028.jpg','1X7A2029.jpg','mhAction=cycleHero','URLScheme.forRunningScript','heroVariant'])");
tap=tap.replace("p.includes('motorsport-hero-v951-')","p.includes('motorsport-hero-v952-')");
assert(tap.includes('HERO_VARIANTS'));
assert(tap.includes('motorsport-hero-v952-'));
fs.writeFileSync(tapGatePath,tap);

console.log('Dakar photo rotation migration applied.');
