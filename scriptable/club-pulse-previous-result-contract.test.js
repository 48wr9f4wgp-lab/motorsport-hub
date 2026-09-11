const fs=require('fs');
const path=require('path');
const patch=fs.readFileSync(path.join(__dirname,'club-pulse-previous-result-patch.js'),'utf8');
const launcher=fs.readFileSync(path.join(__dirname,'club-pulse.js'),'utf8');
let failed=0;
const check=(name,ok)=>{if(ok)console.log(`✓ ${name}`);else{console.error(`✗ ${name}`);failed++}};

check('launcher pins Previous Result v1 immutably',launcher.includes('b3acf9a5152856caf43990b6dd5068b48eb0bef2/scriptable/club-pulse-previous-result-patch.js'));
check('launcher uses dedicated previous-result v1 cache',launcher.includes('ClubPulsePreviousResultPatch_v1.js')&&launcher.includes("'previous-result1'"));
check('previous-result patch loads after UI unification',launcher.includes("+fs+'\\n'+sui+'\\n'+pr"));
check('latest FINISHED match persists as previousResult',patch.includes("finished=rows.filter(m=>m?.status==='FINISHED')")&&patch.includes('previousResult:'));
check('legacy cache is backfilled without deletion',patch.includes('network-previous-result')&&patch.includes('writeJSON(cachePath(),fresh)')&&!patch.includes('remove(cachePath'));
check('recent POST result can seed previousResult without another fetch',patch.includes('if(d.recentResult)return{...d,previousResult:d.recentResult}'));
check('Medium footer exposes previous result',patch.includes("text(prev,'前節'")&&patch.includes('cpPrScore(m)')&&patch.includes('cpPrOpponent(m)'));
check('POST hides duplicate previous-result summary',patch.includes("d?.mode==='POST'"));
check('atomic latest arrow and five form chips remain',patch.includes("text(f,'最新 →'")&&patch.includes('form.slice(0,5)')&&patch.includes("while(values.length<5)values.push('-')"));
check('Small renderer/footer is untouched',!patch.includes('buildFooterSmall=')&&!patch.includes('buildSmall='));
check('no club-specific renderer branches',!/(club\?\.team\s*===|club\.id\s*===|team\s*===\s*\d+)/.test(patch));

if(failed){console.error(`\nPrevious result contract FAILED: ${failed}`);process.exit(1)}
console.log('\nClub Pulse previous result contract PASSED');
