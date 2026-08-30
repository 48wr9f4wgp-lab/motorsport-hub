const fs=require('fs');
const path=require('path');
const root=__dirname;
const read=n=>fs.readFileSync(path.join(root,n),'utf8');
const launcher=read('club-pulse.js');
const clubs=read('club-pulse-extra-clubs-patch.js');
const themes=read('club-pulse-extra-theme-patch.js');
const leagues=read('club-pulse-league-expansion-patch.js');
const readability=read('club-pulse-readability-guard-patch.js');
let failed=0;
function check(name,ok){if(ok)console.log(`✓ ${name}`);else{console.error(`✗ ${name}`);failed++}}
function has(src,x){return src.includes(x)}
function syntax(name,src){try{new Function(`return (async()=>{\n${src}\n})`);check(`${name}: syntax`,true)}catch(e){console.error(e.message);check(`${name}: syntax`,false)}}
syntax('extra clubs',clubs);syntax('extra themes',themes);syntax('league expansion',leagues);syntax('readability guard',readability);

check('Bayern team id',has(clubs,"id:'bayern',team:5,comp:'BL1'"));
check('PSG team id',has(clubs,"id:'psg',team:524,comp:'FL1'"));
check('Milan team id',has(clubs,"id:'milan',team:98,comp:'SA'"));
check('Man City team id',has(clubs,"id:'mancity',team:65,comp:'PL'"));
check('extra club aliases',has(clubs,"fcbayern:'bayern'")&&has(clubs,"psg:'psg'")&&has(clubs,"acmilan:'milan'")&&has(clubs,"mci:'mancity'"));
check('home venues',has(clubs,'アリアンツ・アレーナ')&&has(clubs,'パルク・デ・プランス')&&has(clubs,'サン・シーロ')&&has(clubs,'エティハド・スタジアム'));
check('provider names normalize in registry',has(clubs,"'AS Monaco FC':'モナコ'")&&has(clubs,"'Coventry City FC':'コヴェントリー'")&&has(clubs,"'FC Schalke 04':'シャルケ'")&&has(clubs,"'Juventus FC':'ユベントス'"));

check('Bayern visual identity',has(themes,"5:{")&&has(themes,"cardSurface:'#5E0715'")&&has(themes,"cardGlow:'#C8102E'"));
check('PSG visual identity',has(themes,"524:{")&&has(themes,"cardSurface:'#061634'")&&has(themes,"accent:'#E33D45'"));
check('Milan visual identity',has(themes,"98:{")&&has(themes,"cardSurface:'#070708'")&&has(themes,"cardGlow:'#5A0A12'"));
check('Man City visual identity',has(themes,"65:{")&&has(themes,"cardSurface:'#123954'")&&has(themes,"accent:'#A9E3FF'"));
check('extra themes stay line-free',!has(themes,'linePrimary')&&!has(themes,'lineSecondary')&&!has(themes,'streak'));

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
check('no opaque global crest plate outside competition identity',!has(readability,"backgroundColor=C('#D7DEE8',.20)"));

check('launcher downloads readability v3',has(launcher,'ClubPulseReadabilityGuardPatch_v3.js')&&has(launcher,"'readability3'"));
check('launcher pins current readability commit',has(launcher,'494a717a797dd000dd3c45b7ed4e7971dd0075a6'));
check('readability remains after identity in patch order',has(launcher,"+u+'\\n'+i+'\\n'+rg+'\\n'+q+'\\n'+r"));
check('launcher documents all seven parameters',has(launcher,'manutd, realmadrid, barcelona, bayern, psg, milan, and mancity'));

if(failed){console.error(`\nExpanded club QA FAILED: ${failed}`);process.exit(1)}
console.log('\nExpanded seven-club QA PASSED');
