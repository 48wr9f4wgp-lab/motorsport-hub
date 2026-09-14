import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath,pathToFileURL} from 'node:url';

const dir=path.dirname(fileURLToPath(import.meta.url));
const target=path.join(dir,'apply-device-parser-fallback-v2.mjs');
let source=fs.readFileSync(target,'utf8');
const before='const next=src.replace(re,replacement);';
const after='const next=src.replace(re,()=>replacement);';
if(!source.includes(before))throw new Error('v2 replace helper target not found');
source=source.replace(before,after);
fs.writeFileSync(target,source);
await import(pathToFileURL(target).href+'?literal-replacement=1');
