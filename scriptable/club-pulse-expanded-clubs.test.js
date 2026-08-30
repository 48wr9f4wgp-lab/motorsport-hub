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

check('Bayern registry uses football-data team 5',has(clubs,"id:'bayern',team:5,comp:'BL1'"));
check('PSG registry uses football-data team 524',has(clubs,"id:'psg',team:524,comp:'FL1'"));
check('Milan registry uses football-data team 98',has(clubs,"id:'milan',team:98,comp:'SA'"));
check('Man City registry uses football-data team 65',has(clubs,"id:'mancity',team:65,comp:'PL'"));
check('new club aliases exist',has(clubs,"psg:'psg'")&&has(clubs,"mci:'mancity'")&&has(clubs,"acmilan:'milan'")&&has(clubs,"fcbayern:'bayern'"));
check('new home venues exist',has(clubs,'アリアンツ・アレーナ')&&has(clubs,'パルク・デ・プランス')&&has(clubs,'サン・シーロ')&&has(clubs,'エティハド・スタジアム'));
check('expanded opponents normalize to Japanese',has(clubs,"'AS Monaco FC':'モナコ'")&&has(clubs,"'Coventry City FC':'コヴェントリー'")&&has(clubs,"'FC Schalke 04':'シャルケ'")&&has(clubs,"'Juventus FC':'ユベントス'"));

check('Bayern theme is deep crimson and white',has(themes,"5:{")&&has(themes,"cardSurface:'#5E0715'")&&has(themes,"cardGlow:'#C8102E'")&&has(themes,"sideBorder:'#FFFFFF'"));
check('PSG theme is navy and red',has(themes,"524:{")&&has(themes,"cardSurface:'#061634'")&&has(themes,"cardGlow:'#0B3E78'")&&has(themes,"accent:'#E33D45'"));
check('Milan theme is black-led with wine red',has(themes,"98:{")&&has(themes,"cardSurface:'#070708'")&&has(themes,"cardGlow:'#5A0A12'")&&has(themes,"accent:'#D11A2A'"));
check('Man City theme is controlled sky blue',has(themes,"65:{")&&has(themes,"cardSurface:'#123954'")&&has(themes,"cardGlow:'#3D8FB9'")&&has(themes,"accent:'#A9E3FF'"));
check('extra themes do not add decorative lines',!has(themes,'linePrimary')&&!has(themes,'lineSecondary')&&!has(themes,'streak'));

check('Bundesliga label support exists',has(leagues,"return small?'BL':'ブンデスリーガ'"));
check('Ligue 1 label support exists',has(leagues,"return small?'Ligue 1':'リーグ・アン'"));
check('Serie A label support exists',has(leagues,"return small?'Serie A':'セリエA'"));
check('competition logo keys exist for three new leagues',has(leagues,"BL1:{id:78}")&&has(leagues,"FL1:{id:61}")&&has(leagues,"SA:{id:135}"));

check('readability guard scopes to four expanded teams',has(readability,'new Set([5,524,98,65])'));
check('readability guard rescues only tagged dark crests',has(readability,"new Set(['JUV'])")&&has(readability,"backgroundColor=C('#D7DEE8',.20)")&&has(readability,"backgroundColor=C('#CBD5E1',.24)"));
check('readability guard compacts medium and small opponent labels',has(readability,'renderTeamBlock=function')&&has(readability,'smallTeamName=function')&&has(readability,"n.slice(0,max-1)+'…'"));
check('readability guard avoids global white circle plates',!has(readability,"backgroundColor=C('#FFFFFF',1)"));

check('launcher downloads extra club registry v2',has(launcher,'EXTRA_CLUBS_PATCH')&&has(launcher,'ClubPulseExtraClubsPatch_v2.js')&&has(launcher,"'extra-clubs2'"));
check('launcher injects extra clubs before parameter resolution',has(launcher,"c=c.slice(0,pk)+cr+'\\n'+ec+'\\n'+c.slice(pk)"));
check('launcher downloads league expansion',has(launcher,'LEAGUE_EXPANSION_PATCH')&&has(launcher,'ClubPulseLeagueExpansionPatch_v1.js'));
check('launcher downloads extra themes',has(launcher,'EXTRA_THEME_PATCH')&&has(launcher,'ClubPulseExtraThemePatch_v1.js'));
check('launcher downloads readability guard',has(launcher,'READABILITY_PATCH')&&has(launcher,'ClubPulseReadabilityGuardPatch_v1.js')&&has(launcher,"'readability1'"));
check('runtime patch order applies readability after identity',has(launcher,"patches=x+'\\n'+y+'\\n'+le+'\\n'+z+'\\n'+tr+'\\n'+et+'\\n'+u+'\\n'+i+'\\n'+rg+'\\n'+q+'\\n'+r"));
check('launcher documents four new parameters',has(launcher,'bayern, psg, milan, and mancity'));

if(failed){console.error(`\nExpanded club QA FAILED: ${failed}`);process.exit(1)}
console.log('\nExpanded club QA PASSED');
