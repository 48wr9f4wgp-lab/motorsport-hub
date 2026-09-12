const fs=require('fs');
const path=require('path');
const patch=fs.readFileSync(path.join(__dirname,'club-pulse-medium-scale-unification-patch.js'),'utf8');
const launcher=fs.readFileSync(path.join(__dirname,'club-pulse.js'),'utf8');
let failed=0;
const check=(name,ok)=>{if(ok)console.log(`✓ ${name}`);else{console.error(`✗ ${name}`);failed++}};

try{new Function(patch);check('Medium scale unification syntax',true)}catch(e){console.error(e);check('Medium scale unification syntax',false)}
check('launcher pins Medium Scale Unification v2 immutably',launcher.includes('431f29ed5437a97ec14e945a719eba37af907191/scriptable/club-pulse-medium-scale-unification-patch.js'));
check('launcher uses dedicated Medium Scale Unification v2 cache',launcher.includes('ClubPulseMediumScaleUnificationPatch_v2.js')&&launcher.includes("'medium-scale-unification2'"));
check('Medium scale patch loads after Previous Result v2',launcher.includes("+sui+'\\n'+pr+'\\n'+msu"));
check('all Medium team crests share one geometry shell',patch.includes('CP_MSU_TEAM_CREST_SIZE=52')&&patch.includes('CP_MSU_TEAM_WIDTH=96')&&patch.includes('CP_MSU_LOGO_SLOT_HEIGHT=58'));
check('optical scaling measures alpha-visible bounds',patch.includes("getImageData(0,0,w,h).data")&&patch.includes('if(a>12)')&&patch.includes('Math.sqrt(wx*hy)'));
check('optical scale is bounded to safe limits',patch.includes('CP_MSU_OPTICAL_MIN=.88')&&patch.includes('CP_MSU_OPTICAL_MAX=1.14')&&patch.includes('cpMsuClamp(CP_MSU_OPTICAL_TARGET/occupancy'));
check('optical result is cached locally by provider and team key',patch.includes("medium_crest_optical_scale_v2.json")&&patch.includes('cpMsuOpticalCacheKey(url,key)')&&patch.includes('CP_MSU_OPTICAL_CACHE_VERSION=2'));
check('image loader only measures Medium and preserves the base provider-aware loader',patch.includes('const CP_MSU_BASE_IMAGE=image')&&patch.includes("if(family!=='medium'||!img)return img")&&patch.includes('await CP_MSU_BASE_IMAGE(url,key)'));
check('Medium crest renderer does not consult club-specific CREST_SCALE',!patch.includes('CREST_SCALE['));
check('team logo and name slots have fixed shared geometry',patch.includes('CP_MSU_LOGO_SLOT_HEIGHT=58')&&patch.includes('CP_MSU_NAME_SLOT_HEIGHT=16'));
check('header club name has a bounded width and shrink guard',patch.includes('l.size=new Size(205,0)')&&patch.includes('cpMsuHeaderNameSize')&&patch.includes('minimumScaleFactor'));
check('header preserves previous-season context when available',patch.includes("typeof cpPrLastSeasonLabel==='function'")&&patch.includes("last||`勝点 ${d.points??'–'}`"));
check('NEXT LIVE POST share one final Medium match renderer',patch.includes("d.mode==='LIVE'?d.liveMatch:d.mode==='POST'?d.recentResult:d.nextMatch"));
check('Small renderers remain untouched',!patch.includes('buildMatchSmall=')&&!patch.includes('buildHeaderSmall=')&&!patch.includes('buildFooterSmall='));
check('no club-specific renderer branches',!/(club\?\.team\s*===|club\.id\s*===|team\s*===\s*\d+)/.test(patch));

if(failed){console.error(`\nMedium scale unification contract FAILED: ${failed}`);process.exit(1)}
console.log('\nClub Pulse Medium optical scale unification contract PASSED');
