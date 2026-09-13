import fs from 'node:fs';

const ALL=['F1','WEC','WRC','SUPERGT','MOTOGP','FDJ','D1GP','SUPERFORMULA','INDYCAR','NASCAR','GTWCEU','DAKAR'];
const configs={
 'wrc-widget-flat-v1000.js':{tag:'WRC',rank:'S.rank',title:"rn(d.race||'次戦取得中')",venue:'d.circuit',sub:'sub(r)',event:'rn(s)',value:"String(r.points).replace(' pts','')",valueLabel:'PTS',metaLabel:'SEASON',metaValue:'String(SEASON)',refresh:'15*60000',nameSize:'14'},
 'supergt-widget-flat-v1000.js':{tag:'SUPER GT',rank:"'GT500'",title:'d.race',venue:'d.circuit',sub:'sub(r)',event:'s',value:"String(r.points).replace(' pts','')",valueLabel:'PTS',metaLabel:'SEASON',metaValue:'String(SEASON)',refresh:'15*60000',nameSize:'13.4'},
 'motogp-widget-flat-v1000.js':{tag:'MotoGP',rank:'S.rank',title:"rn(d.race||'次戦取得中')",venue:'cn(d.circuit)',sub:'sub(r)',event:'rn(s)',value:"String(r.points).replace(' pts','')",valueLabel:'PTS',metaLabel:'SEASON',metaValue:'String(SEASON)',refresh:'15*60000',nameSize:'13.8'},
 'fdj-widget-flat-v1000.js':{tag:'FDJ',rank:"'シリーズ順位'",title:'d.race',venue:'d.circuit',sub:"String(r.car||'')",event:'s',value:"String(r.points).replace(' pts','')",valueLabel:'PTS',metaLabel:'SEASON',metaValue:'String(SEASON)',refresh:'15*60000',nameSize:'13.6'},
 'd1gp-widget-flat-v1000.js':{tag:'D1GP',rank:"'ドライバー'",title:'d.race',venue:'d.circuit',sub:"[r.car||'',r.team||''].filter(Boolean).join('  ｜  ')",event:'s',value:"String(r.points).replace(' pts','')",valueLabel:'PTS',metaLabel:'SEASON',metaValue:'String(SEASON)',refresh:'15*60000',nameSize:'13.5'},
 'superformula-widget.js':{tag:'SUPER FORMULA',rank:"'ドライバー'",title:'d.race',venue:'d.circuit',sub:'sub(r)',event:'s',value:"String(r.points).replace(' pts','')",valueLabel:'PTS',metaLabel:'SEASON',metaValue:'String(SEASON)',refresh:'15*60000',nameSize:'13.5'},
 'indycar-widget.js':{tag:'INDYCAR',rank:"'ドライバー'",title:'raceName(d.race)',venue:'venue(d.circuit)',sub:'sub(r)',event:'raceName(s)',value:"String(r.points).replace(' pts','')",valueLabel:'PTS',metaLabel:'SEASON',metaValue:'String(SEASON)',refresh:'15*60000',nameSize:'13.5'},
 'nascar-widget.js':{tag:'NASCAR CUP',rank:"'ドライバー'",title:'raceName(d.race)',venue:'venue(d.circuit)',sub:'sub(r)',event:'raceName(s)',value:"String(r.points).replace(' pts','')",valueLabel:'PTS',metaLabel:'SEASON',metaValue:'String(SEASON)',refresh:'15*60000',nameSize:'13.5'},
 'gtwc-europe-widget.js':{tag:'GTWC EUROPE',rank:"'ドライバー'",title:'raceName(d.race)',venue:'d.circuit',sub:'sub(r)',event:'raceName(s)',value:"String(r.points).replace(' pts','')",valueLabel:'PTS',metaLabel:'SEASON',metaValue:'String(SEASON)',refresh:'15*60000',nameSize:'11.8'},
 'dakar-widget.js':{tag:'DAKAR',rank:"`総合 CAR · ${d.rankingLabel||'OVERALL'}`",title:'stageLabel(d)',venue:'routeLabel(d)',sub:'sub(r)',event:'s',value:"r.gap||'—'",valueLabel:'GAP',metaLabel:'STAGE',metaValue:"d.stageId==='P'?'PROLOGUE':`${d.stageId} / 13`",refresh:'20*60000',nameSize:'13.2',info:"`${d.dateLabel} · SS ${d.special}km`"}
};

function largeBlock(c){
 const info=c.info||'dateText(d)';
 return `function largeCalendarName(e){return Array.isArray(e)?String(e[0]||''):String(e?.race||e?.stage||'')}\nfunction largeCalendarStart(e){return Array.isArray(e)?String(e[1]||''):String(e?.start||e?.date||'')}\nfunction largeCalendar(d){const key=String(d.race||d.stage||''),t=Date.parse(d.start||d.date||'');let idx=CAL.findIndex(e=>largeCalendarName(e)===key);if(idx<0&&Number.isFinite(t)){let delta=Infinity;for(let i=0;i<CAL.length;i++){const q=Date.parse(largeCalendarStart(CAL[i]));if(!Number.isFinite(q))continue;const z=Math.abs(q-t);if(z<delta){delta=z;idx=i}}}return{previous:idx>0?largeCalendarName(CAL[idx-1]):'—',following:idx>=0&&idx<CAL.length-1?largeCalendarName(CAL[idx+1]):'—'}}\nfunction largeDisplayEvent(s){return ${c.event}}\nfunction largeStanding(st,r){const row=st.addStack();row.layoutHorizontally();row.centerAlignContent();const ps=row.addStack();ps.size=new Size(18,0);T(ps,r.pos,10.5,col(S.accent),'heavy');row.addSpacer(4);T(row,r.name,11.2,col(C.text),'semibold');row.addSpacer();T(row,${c.value},10,col(C.text),'heavy')}\nfunction large(d,cached,bg){const w=base(bg),ci=countdown(d),meta=largeCalendar(d);w.setPadding(12,14,12,14);const top=w.addStack();top.layoutHorizontally();top.centerAlignContent();pill(top,'${c.tag}',true);top.addSpacer(7);T(top,d.lifecycle==='SEASON_ENDED'||d.seasonEnded?'シーズン終了':'次戦',8.5,col(C.dim),'bold');top.addSpacer();if(cached)T(top,'• 更新待ち',7.2,col(C.warn,.82),'semibold');w.addSpacer(5);T(w,${c.title},26,col(C.text),'heavy',1);w.addSpacer(2);const info=w.addStack();info.layoutHorizontally();info.centerAlignContent();T(info,${info},11.5,col(C.muted),'semibold');info.addSpacer(6);T(info,\`｜ \${${c.venue}}\`,10.2,col(C.dim),'semibold',1);info.addSpacer();const cp=info.addStack();cp.backgroundColor=ci.live?col(C.good,.28):col('#000000',.50);cp.cornerRadius=10;cp.setPadding(4,8,4,8);T(cp,ci.label,17.2,ci.live?col(C.good):col(C.text),'heavy');w.addSpacer(8);const hh=w.addStack();T(hh,${c.rank},8.7,col(C.muted),'bold');hh.addSpacer();T(hh,'${c.valueLabel}',7.8,col(C.text,.96),'bold');w.addSpacer(3);for(const r of(d.ranking||[]).slice(0,3)){const row=w.addStack();row.layoutHorizontally();row.centerAlignContent();const ps=row.addStack();ps.size=new Size(20,0);T(ps,r.pos,12,col(S.accent),'heavy');row.addSpacer(4);T(row,r.name,${c.nameSize},col(C.text),'semibold');row.addSpacer();const pts=row.addStack();pts.backgroundColor=col('#000000',.46);pts.cornerRadius=7;pts.setPadding(1,6,1,6);T(pts,${c.value},11.2,col(C.text),'heavy');const sr=w.addStack();sr.addSpacer(24);T(sr,${c.sub},8.8,col(C.dim),'semibold');w.addSpacer(2)}w.addSpacer(7);const lower=w.addStack();lower.layoutHorizontally();const more=lower.addStack();more.layoutVertically();more.backgroundColor=col('#000000',.42);more.cornerRadius=12;more.setPadding(8,10,8,10);T(more,'MORE STANDINGS',7.8,col(C.muted),'bold');more.addSpacer(4);const extras=(d.ranking||[]).slice(3,5);if(extras.length)for(const r of extras){largeStanding(more,r);more.addSpacer(3)}else T(more,'—',12,col(C.dim),'semibold');lower.addSpacer(8);const season=lower.addStack();season.layoutVertically();season.backgroundColor=col('#000000',.42);season.cornerRadius=12;season.setPadding(8,10,8,10);T(season,'${c.metaLabel}',7.8,col(C.muted),'bold');season.addSpacer(3);T(season,${c.metaValue},12.2,col(C.text),'heavy');season.addSpacer(5);T(season,'PREVIOUS',7.2,col(C.dim),'bold');T(season,largeDisplayEvent(meta.previous),9.6,col(C.muted),'semibold',1);season.addSpacer(4);T(season,'NEXT',7.2,col(C.dim),'bold');T(season,largeDisplayEvent(meta.following),9.6,col(C.muted),'semibold',1);w.refreshAfterDate=new Date(Date.now()+${c.refresh});return w}\n`;
}

function patchModule(file,c){
 let s=fs.readFileSync(file,'utf8');
 if(s.includes('function large(d,cached,bg)'))throw new Error(`${file}: Large already exists`);
 const anchor='function small(d,cached,bg)';
 if(!s.includes(anchor))throw new Error(`${file}: small anchor missing`);
 s=s.replace(anchor,largeBlock(c)+anchor);
 const old="w=(config.widgetFamily||'medium')==='small'?small(x.d,x.cached,bg):medium(x.d,x.cached,bg)";
 if(!s.includes(old))throw new Error(`${file}: routing anchor missing`);
 s=s.replace(old,"const __mhFam=config.widgetFamily||'medium';w=__mhFam==='small'?small(x.d,x.cached,bg):__mhFam==='large'?large(x.d,x.cached,bg):medium(x.d,x.cached,bg)");
 const present="if(config.runsInWidget)Script.setWidget(w);else if((config.widgetFamily||'medium')==='small')await w.presentSmall();else await w.presentMedium();Script.complete();";
 if(!s.includes(present))throw new Error(`${file}: presentation anchor missing`);
 s=s.replace(present,"if(config.runsInWidget)Script.setWidget(w);else{const fam=config.widgetFamily||'medium';if(fam==='small')await w.presentSmall();else if(fam==='large')await w.presentLarge();else await w.presentMedium()}Script.complete();");
 fs.writeFileSync(file,s);
}

for(const [file,c] of Object.entries(configs))patchModule(file,c);

for(const file of ['tools/build-large-hero-derivatives.mjs','tools/augment-hero-channel-large.mjs']){
 let s=fs.readFileSync(file,'utf8');
 const old="new Set(['F1','WEC'])";
 if(!s.includes(old))throw new Error(`${file}: F1/WEC pilot set missing`);
 s=s.replace(old,`new Set(${JSON.stringify(ALL)})`);
 fs.writeFileSync(file,s);
}

{
 const file='tests/hero-large-pipeline-gate.mjs';let s=fs.readFileSync(file,'utf8');
 s=s.replace("import {largeEligibility,LARGE_HERO_SIZE,LARGE_MIN_LONG_EDGE,LARGE_MIN_SHORT_EDGE,LARGE_MAX_SUBJECT_AREA} from '../tools/build-large-hero-derivatives.mjs';","import {largeEligibility,LARGE_HERO_CATEGORIES,LARGE_HERO_SIZE,LARGE_MIN_LONG_EDGE,LARGE_MIN_SHORT_EDGE,LARGE_MAX_SUBJECT_AREA} from '../tools/build-large-hero-derivatives.mjs';");
 const old="assert.equal(largeEligibility(good,'WRC').eligible,false,'Large pilot must remain F1/WEC only');";
 if(!s.includes(old))throw new Error('hero-large-pipeline-gate: pilot assertion missing');
 s=s.replace(old,`assert.equal(LARGE_HERO_CATEGORIES.size,12);\nfor(const category of ${JSON.stringify(ALL)})assert.equal(largeEligibility(good,category).eligible,true,\`${'${category}'} must support Large Hero\`);`);
 fs.writeFileSync(file,s);
}

{
 const file='.github/workflows/hero-discovery.yml';let s=fs.readFileSync(file,'utf8');
 s=s.replace('Generate F1/WEC Large Hero candidates from original sources','Generate Large Hero candidates from original sources');
 fs.writeFileSync(file,s);
}

const gate=`import fs from 'node:fs';\nimport assert from 'node:assert/strict';\nconst modules=${JSON.stringify(Object.keys(configs))};\nfor(const file of modules){const s=fs.readFileSync(file,'utf8');assert(s.includes('function large(d,cached,bg)'),\`${'${file}'}: Large renderer missing\`);assert(s.includes('MORE STANDINGS'),\`${'${file}'}: standings expansion missing\`);assert(s.includes("__mhFam==='large'?large"),\`${'${file}'}: Large routing missing\`);assert(s.includes("fam==='large')await w.presentLarge()"),\`${'${file}'}: presentLarge missing\`);assert(s.includes('function small(d,cached,bg)'),\`${'${file}'}: Small renderer lost\`);assert(s.includes('function medium(d,cached,bg)'),\`${'${file}'}: Medium renderer lost\`);}\nfor(const file of ['f1-widget-flat-v1000.js','wec-widget-flat-v1000.js']){const s=fs.readFileSync(file,'utf8');assert(s.includes('function large(d,cached,bg)'),\`${'${file}'}: existing Large renderer lost\`);}\nconst largeTool=fs.readFileSync('tools/build-large-hero-derivatives.mjs','utf8');for(const c of ${JSON.stringify(ALL)})assert(largeTool.includes(\`'\${c}'\`)||largeTool.includes(\`"\${c}"\`),\`${'${c}'}: Large Hero category missing\`);\nconsole.log('Motorsport Hub all-category Large layout gate: PASS');\n`;
fs.writeFileSync('tests/large-layout-all-categories-gate.mjs',gate);

for(const file of ['.github/workflows/hardening-ci.yml','.github/workflows/release-candidate-ci.yml']){
 let s=fs.readFileSync(file,'utf8');const anchor='            tests/hero-large-pipeline-gate.mjs\n';if(!s.includes(anchor))throw new Error(`${file}: gate anchor missing`);if(!s.includes('tests/large-layout-all-categories-gate.mjs'))s=s.replace(anchor,anchor+'            tests/large-layout-all-categories-gate.mjs\n');fs.writeFileSync(file,s);
}

console.log(`Large layout rollout applied to ${Object.keys(configs).length} categories; Hero Large enabled for ${ALL.length}/12.`);
