const fs=require('fs');
const path=require('path');
const patch=fs.readFileSync(path.join(__dirname,'club-pulse-medium-scale-unification-patch.js'),'utf8');
const launcher=fs.readFileSync(path.join(__dirname,'club-pulse.js'),'utf8');
let failed=0;
const check=(name,ok)=>{if(ok)console.log(`✓ ${name}`);else{console.error(`✗ ${name}`);failed++}};

try{new Function(patch);check('Medium scale unification syntax',true)}catch(e){console.error(e);check('Medium scale unification syntax',false)}
check('launcher pins Medium Scale Unification v1 immutably',launcher.includes('747c61104e122fd369627e43a2ebc3dd24d4f707/scriptable/club-pulse-medium-scale-unification-patch.js'));
check('launcher uses dedicated Medium Scale Unification v1 cache',launcher.includes('ClubPulseMediumScaleUnificationPatch_v1.js')&&launcher.includes("'medium-scale-unification1'"));
check('Medium scale patch loads after Previous Result v2',launcher.includes("+sui+'\\n'+pr+'\\n'+msu"));
check('all Medium team crests use one common geometry',patch.includes('CP_MSU_TEAM_CREST_SIZE=52')&&patch.includes('CP_MSU_TEAM_CREST_SCALE=.90')&&patch.includes('CP_MSU_TEAM_WIDTH=96'));
check('Medium crest renderer does not consult club-specific CREST_SCALE',!patch.includes('CREST_SCALE['));
check('team logo and name slots have fixed shared geometry',patch.includes('CP_MSU_LOGO_SLOT_HEIGHT=58')&&patch.includes('CP_MSU_NAME_SLOT_HEIGHT=16'));
check('header club name has a bounded width and shrink guard',patch.includes('l.size=new Size(205,0)')&&patch.includes('cpMsuHeaderNameSize')&&patch.includes('minimumScaleFactor'));
check('header preserves previous-season context when available',patch.includes("typeof cpPrLastSeasonLabel==='function'")&&patch.includes("last||`勝点 ${d.points??'–'}`"));
check('NEXT LIVE POST share one final Medium match renderer',patch.includes("d.mode==='LIVE'?d.liveMatch:d.mode==='POST'?d.recentResult:d.nextMatch"));
check('Small renderers remain untouched',!patch.includes('buildMatchSmall=')&&!patch.includes('buildHeaderSmall=')&&!patch.includes('buildFooterSmall='));
check('no club-specific renderer branches',!/(club\?\.team\s*===|club\.id\s*===|team\s*===\s*\d+)/.test(patch));

if(failed){console.error(`\nMedium scale unification contract FAILED: ${failed}`);process.exit(1)}
console.log('\nClub Pulse Medium scale unification contract PASSED');
