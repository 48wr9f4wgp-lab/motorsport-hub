const fs=require('fs');
const path=require('path');
const patch=fs.readFileSync(path.join(__dirname,'club-pulse-small-ui-unification-patch.js'),'utf8');
const launcher=fs.readFileSync(path.join(__dirname,'club-pulse.js'),'utf8');
let failed=0;
function check(name,ok){if(ok)console.log(`✓ ${name}`);else{console.error(`✗ ${name}`);failed++}}

check('launcher pins Small UI Unification immutably',launcher.includes('f58d55eb210ada2c31ea02e561c847dc9bd82cc0/scriptable/club-pulse-small-ui-unification-patch.js'));
check('launcher uses dedicated unification v2 cache',launcher.includes('ClubPulseSmallUIUnificationPatch_v2.js')&&launcher.includes("'small-ui-unification2'"));
check('unification loads after canonical form system',launcher.includes("+plv+'\\n'+fs+'\\n'+sui"));
check('API-Football opponent uses provider full name before canonical display mapping',patch.includes("opp?.name||out.opponentName")&&patch.includes('out.opponentName=cpUiuCanonicalName'));
check('Paderborn provider aliases normalize to Japanese',patch.includes("'SC Paderborn':'パーダーボルン'")&&patch.includes("'SC Paderborn 07':'パーダーボルン'"));
check('Small labels prefer Japanese canonical names',patch.includes("'レヴァークーゼン':'レヴァークーゼン'")&&patch.includes("'フェイエノールト':'フェイエノールト'")&&!patch.includes("'レヴァークーゼン':'Leverkusen'")&&!patch.includes("'フェイエノールト':'Feyenoord'"));
check('legacy ASCII aliases are rejected when a Japanese label exists',patch.includes("if(alias&&/[^\\x20-\\x7E]/.test(alias))return alias"));
check('Eredivisie venue aliases are localized',patch.includes("'MAC³PARK Stadion':'MAC³PARKスタジアム'")&&patch.includes("'AFAS Stadion':'AFASスタジアム'")&&patch.includes("'Abe Lenstra Stadion':'アベ・レンストラ・スタジアム'"));
check('football-data and API-Football both normalize venues',patch.includes('out.venue=cpUiuCanonicalVenue(out.venue)')&&patch.includes('const CP_UIU_BASE_MAP_MATCH=mapMatch')&&patch.includes('const CP_UIU_BASE_MAP_API_FIXTURE=mapApiFixture'));
check('cached venue metadata is normalized without destructive cache deletion',patch.includes('const CP_UIU_BASE_META_LINE=metaLine')&&patch.includes('const oldVenue=m.venue')&&patch.includes('finally{m.venue=oldVenue}'));
check('footer renders atomic latest arrow label',patch.includes("text(f,'最新 →'"));
check('footer always normalizes to five form chips',patch.includes('form.slice(0,5)')&&patch.includes("while(values.length<5)values.push('-')"));
check('Small and Medium share final canonical footer renderer',patch.includes("buildFooterMedium=function(w,d){return cpUiuFormRow(w,d,'medium')}")&&patch.includes("buildFooterSmall=function(w,d){return cpUiuFormRow(w,d,'small')}"));

if(failed){console.error(`\nSmall UI unification contract FAILED: ${failed}`);process.exit(1)}
console.log('\nClub Pulse Small UI unification contract PASSED');
