import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath,pathToFileURL} from 'node:url';

const dir=path.dirname(fileURLToPath(import.meta.url));
await import(pathToFileURL(path.join(dir,'apply-device-parser-fallback-v3.mjs')).href+'?overlap-fix=1');

const target='supergt-widget-flat-v1000.js';
let source=fs.readFileSync(target,'utf8');
const before="const marks=[],re=/(?:^|\\s)(\\d{1,2})\\s+(\\d{1,3})\\s+/g;let m,last=0;while((m=re.exec(section))){const pos=Number(m[1]),no=String(m[2]);if(!GT500_NOS.has(no))continue;if(!marks.length){if(pos!==1)continue}else if(pos!==last+1)continue;marks.push({pos,no,start:m.index,end:re.lastIndex});last=pos;if(marks.length>=20)break}";
const after="const marks=[],re=/(?:^|\\s)(?=(\\d{1,2})\\s+(\\d{1,3})(?:\\s|$))/g;let m,last=0;while((m=re.exec(section))){const pos=Number(m[1]),no=String(m[2]);if(!GT500_NOS.has(no))continue;if(!marks.length){if(pos!==1)continue}else if(pos!==last+1)continue;const end=m.index+m[0].length+m[1].length+1+m[2].length;marks.push({pos,no,start:m.index,end});last=pos;if(marks.length>=20)break}";
if(!source.includes(before))throw new Error('SUPER GT overlapping marker target not found');
source=source.replace(before,after);
fs.writeFileSync(target,source);
console.log('Applied SUPER GT overlapping rank-marker fix.');
