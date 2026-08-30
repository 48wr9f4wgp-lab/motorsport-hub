import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {fileURLToPath} from 'node:url';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const digest=s=>crypto.createHash('sha256').update(s,'utf8').digest('hex');
const bytes=s=>Buffer.byteLength(s,'utf8');

export function buildDescriptor(sourceRef){
 if(!/^[0-9a-f]{40}$/i.test(String(sourceRef||'')))throw new Error('sourceRef must be an immutable 40-char commit SHA');
 sourceRef=String(sourceRef).toLowerCase();
 const registry=JSON.parse(read('category-registry.json'));
 const categoryManifest=[...registry.categories.map(c=>c.id),registry.qa.id].join(',');
 const paths=[...new Set([...registry.categories.map(c=>c.module),registry.qa.module])];
 const files={};
 for(const p of paths){const src=read(p);files[p]={sha256:digest(src),bytes:bytes(src)};}
 const router=read('motorsport-hub.js');
 return{schemaVersion:1,releaseId:`mh-${sourceRef.slice(0,12)}`,sourceRef,routerSchema:registry.routerSchema,categoryManifest,router:{path:'motorsport-hub.js',sha256:digest(router),bytes:bytes(router)},files};
}

const shaRuntime=`function utf8Bytes(s){const out=[];s=String(s||'');for(let i=0;i<s.length;i++){let c=s.charCodeAt(i);if(c<0x80)out.push(c);else if(c<0x800)out.push(0xC0|(c>>6),0x80|(c&63));else if(c>=0xD800&&c<=0xDBFF&&i+1<s.length){const d=s.charCodeAt(++i),cp=0x10000+((c-0xD800)<<10)+(d-0xDC00);out.push(0xF0|(cp>>18),0x80|((cp>>12)&63),0x80|((cp>>6)&63),0x80|(cp&63));}else out.push(0xE0|(c>>12),0x80|((c>>6)&63),0x80|(c&63));}return out;}function rotr(x,n){return(x>>>n)|(x<<(32-n))}function sha256Hex(text){const bytes=utf8Bytes(text),bitLen=bytes.length*8,K=[0x428a2f98,0x71374491,0xb5c0fbcf,0xe9b5dba5,0x3956c25b,0x59f111f1,0x923f82a4,0xab1c5ed5,0xd807aa98,0x12835b01,0x243185be,0x550c7dc3,0x72be5d74,0x80deb1fe,0x9bdc06a7,0xc19bf174,0xe49b69c1,0xefbe4786,0x0fc19dc6,0x240ca1cc,0x2de92c6f,0x4a7484aa,0x5cb0a9dc,0x76f988da,0x983e5152,0xa831c66d,0xb00327c8,0xbf597fc7,0xc6e00bf3,0xd5a79147,0x06ca6351,0x14292967,0x27b70a85,0x2e1b2138,0x4d2c6dfc,0x53380d13,0x650a7354,0x766a0abb,0x81c2c92e,0x92722c85,0xa2bfe8a1,0xa81a664b,0xc24b8b70,0xc76c51a3,0xd192e819,0xd6990624,0xf40e3585,0x106aa070,0x19a4c116,0x1e376c08,0x2748774c,0x34b0bcb5,0x391c0cb3,0x4ed8aa4a,0x5b9cca4f,0x682e6ff3,0x748f82ee,0x78a5636f,0x84c87814,0x8cc70208,0x90befffa,0xa4506ceb,0xbef9a3f7,0xc67178f2],H=[0x6a09e667,0xbb67ae85,0x3c6ef372,0xa54ff53a,0x510e527f,0x9b05688c,0x1f83d9ab,0x5be0cd19];bytes.push(0x80);while(bytes.length%64!==56)bytes.push(0);const hi=Math.floor(bitLen/0x100000000),lo=bitLen>>>0;for(let s=24;s>=0;s-=8)bytes.push((hi>>>s)&255);for(let s=24;s>=0;s-=8)bytes.push((lo>>>s)&255);const w=new Array(64);for(let off=0;off<bytes.length;off+=64){for(let i=0;i<16;i++)w[i]=((bytes[off+i*4]<<24)|(bytes[off+i*4+1]<<16)|(bytes[off+i*4+2]<<8)|bytes[off+i*4+3])>>>0;for(let i=16;i<64;i++){const x=w[i-15],y=w[i-2],s0=rotr(x,7)^rotr(x,18)^(x>>>3),s1=rotr(y,17)^rotr(y,19)^(y>>>10);w[i]=(w[i-16]+s0+w[i-7]+s1)>>>0;}let[a,b,c,d,e,f,g,h]=H;for(let i=0;i<64;i++){const S1=rotr(e,6)^rotr(e,11)^rotr(e,25),ch=(e&f)^(~e&g),t1=(h+S1+ch+K[i]+w[i])>>>0,S0=rotr(a,2)^rotr(a,13)^rotr(a,22),maj=(a&b)^(a&c)^(b&c),t2=(S0+maj)>>>0;h=g;g=f;f=e;e=(d+t1)>>>0;d=c;c=b;b=a;a=(t1+t2)>>>0;}H[0]=(H[0]+a)>>>0;H[1]=(H[1]+b)>>>0;H[2]=(H[2]+c)>>>0;H[3]=(H[3]+d)>>>0;H[4]=(H[4]+e)>>>0;H[5]=(H[5]+f)>>>0;H[6]=(H[6]+g)>>>0;H[7]=(H[7]+h)>>>0;}return H.map(x=>('00000000'+(x>>>0).toString(16)).slice(-8)).join('');}`;

export function buildLoader(descriptor){
 const d=JSON.stringify(descriptor);
 return`// Motorsport Hub loader v6 — immutable release + SHA-256 integrity.\n(async()=>{\nconst RELEASE=${d};\nconst SOURCE_REF=RELEASE.sourceRef,ROUTER_SCHEMA=RELEASE.routerSchema,CATEGORY_MANIFEST=RELEASE.categoryManifest;\nconst URL=\`https://raw.githubusercontent.com/48wr9f4wgp-lab/motorsport-hub/\${SOURCE_REF}/\${RELEASE.router.path}\`;\nconst fm=FileManager.local(),dir=fm.documentsDirectory(),base=\`motorsport-hub-router-v6-\${RELEASE.releaseId}\`,candidatePath=fm.joinPath(dir,base+'-candidate.js'),lkgPath=fm.joinPath(dir,base+'-lkg.js'),quarantinePath=fm.joinPath(dir,base+'-quarantine.js');\n${shaRuntime}\nconst syntaxOK=s=>{try{new Function(String(s||''));return true}catch(_){return false}};\nconst valid=s=>typeof s==='string'&&s.includes('Motorsport Hub')&&s.includes('module router')&&s.includes(\`MH_ROUTER_SCHEMA=\${ROUTER_SCHEMA}\`)&&s.includes(\`MH_CATEGORY_MANIFEST=\${CATEGORY_MANIFEST}\`)&&s.includes('Script.complete()')&&syntaxOK(s)&&utf8Bytes(s).length===Number(RELEASE.router.bytes)&&sha256Hex(s)===String(RELEASE.router.sha256).toLowerCase();\nconst remove=p=>{try{if(fm.fileExists(p))fm.remove(p)}catch(_){}};\nconst quarantine=code=>{try{if(typeof code==='string'&&code.length)fm.writeString(quarantinePath,code)}catch(_){}remove(candidatePath)};\nconst readValid=p=>{try{if(!fm.fileExists(p))return'';const s=fm.readString(p);if(valid(s))return s;quarantine(s);if(p!==candidatePath)remove(p)}catch(_){}return''};\nconst fail=async msg=>{const w=new ListWidget();w.backgroundColor=new Color('#080B10');w.setPadding(12,12,12,12);const a=w.addText('Motorsport Hub');a.font=Font.boldSystemFont(14);a.textColor=Color.white();w.addSpacer(6);const b=w.addText(msg);b.font=Font.systemFont(10);b.textColor=new Color('#FFB84D');b.lineLimit=5;w.refreshAfterDate=new Date(Date.now()+5*60000);if(config.runsInWidget)Script.setWidget(w);else await w.presentSmall();Script.complete()};\nconst execute=async(code,offline=false)=>{try{delete globalThis.__MH_ROUTER_SCHEMA;delete globalThis.__MH_ROUTER_MANIFEST;delete globalThis.__MH_ROUTER_BOOT_OK;if(offline)globalThis.__MH_REMOTE_OFFLINE=true;else try{delete globalThis.__MH_REMOTE_OFFLINE}catch(_){}globalThis.__MH_SOURCE_REF=SOURCE_REF;globalThis.__MH_RELEASE_INTEGRITY=RELEASE;await eval(code);return globalThis.__MH_ROUTER_BOOT_OK===true&&globalThis.__MH_ROUTER_SCHEMA===ROUTER_SCHEMA&&globalThis.__MH_ROUTER_MANIFEST===CATEGORY_MANIFEST}catch(_){return false}finally{try{delete globalThis.__MH_SOURCE_REF}catch(_){}try{delete globalThis.__MH_RELEASE_INTEGRITY}catch(_){}try{delete globalThis.__MH_REMOTE_OFFLINE}catch(_){}}};\nlet candidate='';try{const r=new Request(\`\${URL}?mhv6=\${Date.now()}-\${Math.random()}\`);r.timeoutInterval=8;r.headers={'Cache-Control':'no-cache, no-store, max-age=0, must-revalidate','Pragma':'no-cache','Expires':'0','User-Agent':'MotorsportHubLoader/6'};candidate=await r.loadString();if(!valid(candidate))throw Error('Invalid immutable Router candidate');fm.writeString(candidatePath,candidate)}catch(_){if(candidate&&!valid(candidate))quarantine(candidate);candidate=''}\nif(candidate){const ok=await execute(candidate,false);if(ok){try{fm.writeString(lkgPath,candidate)}catch(_){}remove(candidatePath);return}quarantine(candidate)}\nconst lkg=readValid(lkgPath);if(lkg){const ok=await execute(lkg,true);if(ok)return;quarantine(lkg);remove(lkgPath)}\nawait fail('検証済みの固定Releaseを取得できません。改変・旧版へは戻さず、通信回復後に再試行します。');\n})();\n`;
}

export function writePackage(sourceRef,{manifestPath='release-integrity.json',loaderPath='scriptable-loader-v6.js'}={}){
 const descriptor=buildDescriptor(sourceRef),loader=buildLoader(descriptor);
 fs.writeFileSync(path.join(root,manifestPath),JSON.stringify(descriptor,null,2)+'\n');
 fs.writeFileSync(path.join(root,loaderPath),loader);
 return descriptor;
}

if(process.argv[1]===fileURLToPath(import.meta.url)){
 const arg=process.argv.find(x=>x.startsWith('--source-ref='));
 const sourceRef=arg?arg.slice('--source-ref='.length):process.env.RELEASE_REF;
 if(!sourceRef)throw new Error('Usage: node tools/generate-release-package.mjs --source-ref=<40-char commit SHA> [--write]');
 if(process.argv.includes('--write')){const d=writePackage(sourceRef);console.log(`Wrote immutable package ${d.releaseId}`)}else console.log(JSON.stringify(buildDescriptor(sourceRef),null,2));
}
