import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const apply=process.argv.includes('--apply');
const files=['superformula-widget.js','indycar-widget.js','nascar-widget.js','gtwc-europe-widget.js'];

const oldNext="function nextEvent(d){const now=Date.now();for(const e of CAL){if(Date.parse(e.end)>now)return{...d,...e,seasonEnded:false}}const last=CAL[CAL.length-1];return{...d,...last,seasonEnded:true}}";
const newNext="function nextEvent(d){const now=Date.now();for(const e of CAL){const s=Date.parse(e.start),end=Date.parse(e.end);if(now<end)return{...d,...e,seasonEnded:false,lifecycle:now>=s?'ACTIVE':'UPCOMING'}}const last=CAL[CAL.length-1];return{...d,...last,seasonEnded:true,lifecycle:'SEASON_ENDED'}}";
const oldCountdown="function countdown(d){if(d.seasonEnded)return{label:'SEASON END',live:false};const now=Date.now(),s=Date.parse(d.start),e=Date.parse(d.end);if(now>=s&&now<=e)return{label:'開催中',live:true};const q=s-now;if(q<=0)return{label:'終了',live:false};const h=q/3600000;if(h<24)return{label:`あと${Math.ceil(h)}時間`,live:false};return{label:`あと${Math.ceil(h/24)}日`,live:false}}";
const newCountdown="function countdown(d){if(d.lifecycle==='SEASON_ENDED'||d.seasonEnded)return{label:'SEASON END',live:false};const now=Date.now(),s=Date.parse(d.start),e=Date.parse(d.end);if(now>=s&&now<e)return{label:'開催中',live:true};const q=s-now;if(q<=0)return{label:'終了',live:false};const h=q/3600000;if(h<24)return{label:`あと${Math.ceil(h)}時間`,live:false};return{label:`あと${Math.ceil(h/24)}日`,live:false}}";

function replaceExact(src,needle,replacement,expected,label,file){
  const parts=String(src).split(needle),hits=parts.length-1;
  if(hits!==expected)throw new Error(`${file}: ${label} hit mismatch ${hits}/${expected}`);
  return parts.join(replacement);
}

function bake(file){
  const p=path.join(root,file);
  let src=fs.readFileSync(p,'utf8');
  if(src.includes('MH_LIFECYCLE_BAKED=1')){
    if(!src.includes("lifecycle:'SEASON_ENDED'")||!src.includes('now>=s&&now<e')||!src.includes("?'シーズン終了':'次戦'"))throw new Error(`${file}: baked marker exists but postconditions fail`);
    console.log(`${file}: already baked`);
    return false;
  }
  src=replaceExact(src,oldNext,newNext,1,'nextEvent',file);
  src=replaceExact(src,oldCountdown,newCountdown,1,'countdown',file);
  src=replaceExact(src,"T(top,'次戦',","T(top,d.lifecycle==='SEASON_ENDED'?'シーズン終了':'次戦',",2,'header',file);
  const firstNewline=src.indexOf('\n');
  if(firstNewline<0)throw new Error(`${file}: no header newline`);
  src=src.slice(0,firstNewline+1)+'// MH_LIFECYCLE_BAKED=1\n'+src.slice(firstNewline+1);
  if(!src.includes("lifecycle:'SEASON_ENDED'")||!src.includes('now>=s&&now<e')||!src.includes("?'シーズン終了':'次戦'"))throw new Error(`${file}: bake postcondition failed`);
  if(apply)fs.writeFileSync(p,src);
  console.log(`${file}: ${apply?'baked':'would bake'}`);
  return true;
}

let changed=0;
for(const file of files)if(bake(file))changed++;
console.log(`Expansion lifecycle bake: ${apply?'applied':'check'} ${changed}/${files.length}`);
