import fs from 'node:fs';
import assert from 'node:assert/strict';
const modules=[
  'f1-widget-flat-v1000.js','wec-widget-flat-v1000.js','wrc-widget-flat-v1000.js','supergt-widget-flat-v1000.js',
  'motogp-widget-flat-v1000.js','fdj-widget-flat-v1000.js','d1gp-widget-flat-v1000.js','superformula-widget.js',
  'indycar-widget.js','nascar-widget.js','gtwc-europe-widget.js','dakar-widget.js'
];
for(const file of modules){
  const src=fs.readFileSync(file,'utf8');
  assert.equal((src.match(/const LARGE_TYPO_SCALE=1\.12;/g)||[]).length,1,`${file}: shared Large typography scale missing or duplicated`);
  assert(src.includes("const __mhZ=(config.widgetFamily||'medium')==='large'?z*LARGE_TYPO_SCALE:z;"),`${file}: Large-only scale guard missing`);
  for(const kind of ['heavy','bold','semibold'])assert(src.includes(`Font.${kind}SystemFont(__mhZ)`),`${file}: ${kind} font bypasses Large scale`);
  assert(src.includes('Font.systemFont(__mhZ)'),`${file}: regular font bypasses Large scale`);
  assert(src.includes('function large('),`${file}: Large renderer missing`);
}
console.log('Motorsport Hub Large typography gate: PASS (12/12 modules, Large-only 1.12x scale)');
