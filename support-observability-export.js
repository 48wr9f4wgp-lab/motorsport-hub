// Motorsport Hub RC support utility — local observability export only.
// Reads Loader v7 device-local diagnostics, allowlists known-safe fields, and opens
// the iOS share sheet only after an explicit user action. No network request is made.
(async()=>{
const OBS_FILE='motorsport-hub-observability-v1.json';
const MAX_EVENTS=200;
const fm=FileManager.local();
const obsPath=fm.joinPath(fm.documentsDirectory(),OBS_FILE);

const clean=(value,pattern,max,fallback='')=>{
  const s=String(value??'').replace(pattern,'').slice(0,max);
  return s||fallback;
};
function sanitizeEvent(input){
  if(!input||typeof input!=='object'||Array.isArray(input))return null;
  const out={};
  if(typeof input.ts==='string')out.ts=String(input.ts).slice(0,40);
  if(typeof input.releaseId==='string')out.releaseId=clean(input.releaseId,/[^A-Za-z0-9._-]/g,32);
  if(typeof input.version==='string')out.version=clean(input.version,/[^A-Za-z0-9.+_-]/g,24);
  if(typeof input.sourceRef==='string')out.sourceRef=clean(input.sourceRef,/[^0-9a-f]/gi,12).toLowerCase();
  if(Number.isInteger(input.sequence))out.sequence=input.sequence;
  if(typeof input.category==='string')out.category=clean(input.category,/[^A-Z0-9]/gi,24,'DEFAULT').toUpperCase();
  if(typeof input.family==='string')out.family=clean(input.family,/[^a-z]/gi,12,'unknown').toLowerCase();
  if(typeof input.path==='string')out.path=clean(input.path,/[^A-Z0-9_]/gi,32,'UNKNOWN').toUpperCase();
  if(typeof input.ok==='boolean')out.ok=input.ok;
  if(Number.isFinite(input.ms))out.ms=Math.max(0,Math.min(3600000,Math.round(input.ms)));
  if(typeof input.errorCode==='string'&&input.errorCode)out.errorCode=clean(input.errorCode,/[^A-Z0-9_]/gi,32).toUpperCase();
  return out;
}
function buildExport(raw){
  const parsed=typeof raw==='string'?JSON.parse(raw):raw;
  if(!parsed||parsed.schemaVersion!==1||!Array.isArray(parsed.events))throw new Error('INVALID_OBSERVABILITY_SCHEMA');
  const events=parsed.events.slice(-MAX_EVENTS).map(sanitizeEvent).filter(Boolean);
  return {
    schemaVersion:1,
    supportExportVersion:1,
    generatedAt:new Date().toISOString(),
    source:'motorsport-hub-loader-v7-local-observability',
    eventCount:events.length,
    events
  };
}
async function showMessage(title,message){
  const a=new Alert();
  a.title=title;
  a.message=message;
  a.addAction('OK');
  await a.presentAlert();
}

if(!fm.fileExists(obsPath)){
  await showMessage('Motorsport Hub Support','No local observability file was found yet. Run the installed Loader v7 at least once, then retry.');
  Script.complete();
  return;
}

let payload;
try{
  payload=buildExport(fm.readString(obsPath));
}catch(_){
  await showMessage('Motorsport Hub Support','The local observability file is unreadable or has an unsupported schema. Nothing was shared.');
  Script.complete();
  return;
}

const confirm=new Alert();
confirm.title='Motorsport Hub Support';
confirm.message=`${payload.eventCount} sanitized local diagnostic event(s) are ready. The export excludes arbitrary fields and does not send anything until you choose Share.`;
confirm.addAction('Share sanitized JSON');
confirm.addCancelAction('Cancel');
const choice=await confirm.presentAlert();
if(choice===0)await ShareSheet.present([JSON.stringify(payload,null,2)]);
Script.complete();
})();
