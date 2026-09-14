import fs from 'node:fs';
import assert from 'node:assert/strict';
const modules=[
  'f1-widget-flat-v1000.js','wec-widget-flat-v1000.js','wrc-widget-flat-v1000.js','supergt-widget-flat-v1000.js',
  'motogp-widget-flat-v1000.js','fdj-widget-flat-v1000.js','d1gp-widget-flat-v1000.js','superformula-widget.js',
  'indycar-widget.js','nascar-widget.js','gtwc-europe-widget.js','dakar-widget.js'
];
function extractFunction(src,name){
  const start=src.indexOf(`function ${name}(`); assert(start>=0,`${name}: function missing`);
  const brace=src.indexOf('{',start); let depth=0;
  for(let i=brace;i<src.length;i++){
    if(src[i]==='{')depth++;
    else if(src[i]==='}'&&--depth===0)return src.slice(start,i+1);
  }
  throw new Error(`${name}: unbalanced braces`);
}
for(const file of modules){
  const src=fs.readFileSync(file,'utf8');
  const large=extractFunction(src,'large');
  assert.equal((large.match(/MH_LARGE_LOWER_ANCHOR_FLEX=1/g)||[]).length,1,`${file}: Large flex-anchor marker missing or duplicated`);
  assert(large.includes('w.addSpacer();/* MH_LARGE_LOWER_ANCHOR_FLEX=1 */'),`${file}: lower panel is not flex anchored`);
  const markerAt=large.indexOf('MH_LARGE_LOWER_ANCHOR_FLEX=1');
  const lowerAt=large.indexOf('MORE STANDINGS');
  assert(markerAt>=0&&lowerAt>markerAt&&lowerAt-markerAt<1000,`${file}: flex anchor is not directly upstream of lower information panel`);
  assert(src.includes('const LARGE_TYPO_SCALE=1.12;'),`${file}: Large typography contract regressed`);
}
console.log('Motorsport Hub Large vertical layout gate: PASS (12/12 bottom-anchored lower panels, adaptive flex space)');
