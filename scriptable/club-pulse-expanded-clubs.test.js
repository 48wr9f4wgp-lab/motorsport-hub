const fs=require('fs');
const path=require('path');
const root=__dirname;
const read=n=>fs.readFileSync(path.join(root,n),'utf8');
const launcher=read('club-pulse.js');
const clubs=read('club-pulse-extra-clubs-patch.js');
const themes=read('club-pulse-extra-theme-patch.js');
const premium=read('club-pulse-premium-visual-patch.js');
const leagues=read('club-pulse-league-expansion-patch.js');
const readability=read('club-pulse-readability-guard-patch.js');
let failed=0;
function check(name,ok){if(ok)console.log(`✓ ${name}`);else{console.error(`✗ ${name}`);failed++}}
function has(src,x){return src.includes(x)}
function syntax(name,src){try{new Function(`return (async()=>{\n${src}\n})`);check(`${name}: syntax`,true)}catch(e){console.error(e.message);check(`${name}: syntax`,false)}}
syntax('extra clubs',clubs);syntax('extra themes',themes);syntax('premium visual',premium);syntax('league expansion',leagues);syntax('readability guard',readability);

check('Bayern team id',has(clubs,"id:'bayern',team:5,comp:'BL1'"));
check('PSG team id',has(clubs,"id:'psg',team:524,comp:'FL1'"));
check('Milan team id',has(clubs,"id:'milan',team:98,comp:'SA'"));
check('Man City team id',has(clubs,"id:'mancity',team:65,comp:'PL'"));
check('extra club aliases',has(clubs,"fcbayern:'bayern'")&&has(clubs,"psg:'psg'")&&has(clubs,"acmilan:'milan'")&&has(clubs,"mci:'mancity'"));
check('home venues',has(clubs,'アリアンツ・アレーナ')&&has(clubs,'パルク・デ・プランス')&&has(clubs,'サン・シーロ')&&has(clubs,'エティハド・スタジアム'));
check('provider names normalize in registry',has(clubs,"'AS Monaco FC':'モナコ'")&&has(clubs,"'Coventry City FC':'コヴェントリー'")&&has(clubs,"'FC Schalke 04':'シャルケ'")&&has(clubs,"'Juventus FC':'ユベントス'"));

check('Bayern uses crest red-blue-white identity',has(themes,"5:{")&&has(themes,"cardSurface:'#920019'")&&has(themes,"cardPanel:'#C8102E'")&&has(themes,"border:'#0066B2'")&&has(themes,"sideBorder:'#F7F9FC'"));
check('PSG visual identity',has(themes,"524:{")&&has(themes,"cardSurface:'#061634'")&&has(themes,"accent:'#E33D45'")&&has(themes,"cardBorder:'#446B96'"));
check('Milan Rossoneri left-red right-charcoal identity',has(themes,"98:{")&&has(themes,"cardSurface:'#760B16'")&&has(themes,"cardPanel:'#2D191D'")&&has(themes,"cardGlow:'#292B30'"));
check('Milan opponent side is not red',!has(themes,"cardGlow:'#5A0A12'"));
check('Man City visual identity',has(themes,"65:{")&&has(themes,"cardSurface:'#123954'")&&has(themes,"accent:'#A9E3FF'")&&has(themes,"cardBorder:'#8FCDE8'"));
check('extra themes stay line-free',!has(themes,'linePrimary')&&!has(themes,'lineSecondary')&&!has(themes,'streak'));
check('premium frame applies to all four expanded clubs',has(premium,"new Set(['bayern','psg','milan','mancity'])")&&has(premium,'c.borderWidth=.85')&&has(premium,'c.borderWidth=.75'));

check('Bundesliga label',has(leagues,"return small?'BL':'ブンデスリーガ'"));
check('Ligue 1 label',has(leagues,"return small?'Ligue 1':'リーグ・アン'"));
check('Serie A label',has(leagues,"return small?'Serie A':'セリエA'"));
check('new league logo ids',has(leagues,"BL1:{id:78}")&&has(leagues,"FL1:{id:61}")&&has(leagues,"SA:{id:135}"));

check('readability contract spans all seven teams',has(readability,'new Set([66,81,86,5,524,98,65])'));
check('Japanese display registry fixes live stale English labels',has(readability,"'Monaco':'モナコ'")&&has(readability,"'Coventry City':'コヴェントリー'")&&has(readability,"'Schalke':'シャルケ'")&&has(readability,"'Juventus':'ユベントス'"));
check('Rayo gets explicit short display name',has(readability,"'ラージョ・バジェカーノ':'ラージョ'"));
check('long labels use ellipsis only as fallback',has(readability,'CP_TEAM_DISPLAY_NAMES[n]||n')&&has(readability,"n.slice(0,max-1)+'…'"));
check('pill metrics are common',has(readability,'CP_PILL_METRICS')&&has(readability,'competitionPill=function')&&has(readability,'sidePill=function'));
check('unified competition pill restores league logo',has(readability,'function cpUnifiedCompetitionPill')&&has(readability,"typeof cpCompetitionLogoImage==='function'")&&has(readability,'plate.size=new Size(q.logoBox,q.logoBox)'));
check('competition logo dimensions match readable baseline',has(readability,'logoBox:24')&&has(readability,'logoSize:19')&&has(readability,'logoBox:19')&&has(readability,'logoSize:15'));
check('Barcelona competition pill uses same crest renderer',has(readability,'cpBarcelonaCompetitionPill=function')&&has(readability,'cpUnifiedCompetitionPill(parent,m,small,true)'));
check('home-away chips share height family',has(readability,'sideV:6.2')&&has(readability,'sideV:4.8')&&has(readability,'cpBarcelonaSidePill=function'));
check('Real and Barcelona opponent blocks normalize display names',has(readability,'cpRealTeamBlock=function')&&has(readability,'cpBarcelonaTeamBlock=function'));
check('Juventus rescue is selective and subtle',has(readability,"new Set(['JUV'])")&&has(readability,"backgroundColor=C('#F3F5F8',.10)")&&has(readability,"backgroundColor=C('#F6F7F9',.08)"));

check('launcher downloads premium visual v1',has(launcher,'ClubPulsePremiumVisualPatch_v1.js')&&has(launcher,"'premium1'"));
check('launcher pins premium visual commit',has(launcher,'8c79947b6624f7640ee4dfc0d12abfc80db0ed20'));
check('launcher downloads readability v3',has(launcher,'ClubPulseReadabilityGuardPatch_v3.js')&&has(launcher,"'readability3'"));
check('premium stays between identity and readability in patch order',has(launcher,"+u+'\\n'+i+'\\n'+pv+'\\n'+rg+'\\n'+q+'\\n'+r"));
check('launcher documents all seven parameters',has(launcher,'manutd, realmadrid, barcelona, bayern, psg, milan, and mancity'));

if(failed){console.error(`\nExpanded club QA FAILED: ${failed}`);process.exit(1)}
console.log('\nExpanded premium seven-club QA PASSED');
