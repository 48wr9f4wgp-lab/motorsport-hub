import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const readJson=p=>JSON.parse(fs.readFileSync(path.join(root,p),'utf8'));
const normalize=s=>String(s||'').toLowerCase().replace(/%20/g,' ').replace(/_/g,' ');
const assetNeedles=a=>{
  const xs=[a.filename,...(a.runtimeUrls||[]),a.sourcePage];
  try{xs.push(decodeURIComponent(a.filename||''),encodeURIComponent(a.filename||''));}catch(_){}
  return xs.filter(Boolean).map(normalize);
};
const sourceMentionsAsset=(source,a)=>{const n=normalize(source);return assetNeedles(a).some(x=>x.length>12&&n.includes(x));};
const rendererInfo=source=>({
  drawContext:source.includes('new DrawContext'),
  heroFunction:/\b(?:async\s+)?function\s+hero\s*\(/.test(source),
  legacyCover:/\bfunction\s+cover\s*\(/.test(source),
  generatedCropBaseline:source.includes('HERO_CROP_BASELINE')&&source.includes('HERO_CROPS'),
  tapHeroCycle:source.includes('mhAction=cycleHero')||source.includes("ACTION==='cycleHero'")
});

export function buildHeroRolloutInventory(){
  const registry=readJson('category-registry.json');
  const manifest=readJson('hero-assets.json');
  const rollout=readJson('hero-rollout-policy.json');
  const policyById=new Map((rollout.categories||[]).map(x=>[x.id,x]));
  const categories=(registry.categories||[]).map(cat=>{
    const source=fs.readFileSync(path.join(root,cat.module),'utf8');
    const assets=(manifest.assets||[]).filter(a=>a.category===cat.id);
    const referenced=assets.filter(a=>sourceMentionsAsset(source,a));
    const policy=policyById.get(cat.id)||null;
    return{
      id:cat.id,
      displayName:cat.displayName,
      module:cat.module,
      releaseStatus:cat.releaseStatus,
      rolloutState:policy?.state||'MISSING_POLICY',
      runtimeMutation:policy?.runtimeMutation===true,
      visualLockProtected:policy?.visualLockProtected===true,
      manifestAssetCount:assets.length,
      referencedManifestAssetCount:referenced.length,
      manifestAssetIds:assets.map(a=>a.assetId),
      referencedAssetIds:referenced.map(a=>a.assetId),
      renderer:rendererInfo(source),
      analysisReady:assets.length>0&&!!policy
    };
  });
  return{
    schemaVersion:1,
    generatedAt:new Date().toISOString(),
    policyVersion:rollout.policyVersion,
    mode:rollout.mode,
    summary:{
      categoryCount:categories.length,
      manifestAssetCount:categories.reduce((n,c)=>n+c.manifestAssetCount,0),
      referencedManifestAssetCount:categories.reduce((n,c)=>n+c.referencedManifestAssetCount,0),
      analysisReadyCount:categories.filter(c=>c.analysisReady).length,
      runtimeMutationEnabledCount:categories.filter(c=>c.runtimeMutation).length,
      visualLockProtectedCount:categories.filter(c=>c.visualLockProtected).length
    },
    pilotOrder:rollout.pilotOrder,
    categories
  };
}

if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){
  const report=buildHeroRolloutInventory();
  const write=process.argv.includes('--write');
  if(write)fs.writeFileSync(path.join(root,'hero-rollout-inventory.json'),JSON.stringify(report,null,2)+'\n');
  console.log(JSON.stringify(report.summary));
  for(const c of report.categories)console.log(`${c.id}: assets=${c.manifestAssetCount} referenced=${c.referencedManifestAssetCount} state=${c.rolloutState} renderer=${c.renderer.generatedCropBaseline?'BASELINED':c.renderer.drawContext?'DRAW_CONTEXT':'OTHER'}`);
}
