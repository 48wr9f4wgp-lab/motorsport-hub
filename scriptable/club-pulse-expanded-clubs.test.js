const fs=require('fs');
const path=require('path');
const root=__dirname;
const read=n=>fs.readFileSync(path.join(root,n),'utf8');
const launcher=read('club-pulse.js');
const clubs=read('club-pulse-extra-clubs-patch.js');
const themes=read('club-pulse-extra-theme-patch.js');
const design=read('club-pulse-design-system-patch.js');
const premium=read('club-pulse-premium-visual-patch.js');
const leagues=read('club-pulse-league-expansion-patch.js');
const readability=read('club-pulse-readability-guard-patch.js');
const finalPolish=read('club-pulse-final-polish-patch.js');
let failed=0;
function check(name,ok){if(ok)console.log(`✓ ${name}`);else{console.error(`✗ ${name}`);failed++}}
function has(src,x){return src.includes(x)}
function syntax(name,src){try{new Function(`return (async()=>{\n${src}\n})`);check(`${name}: syntax`,true)}catch(e){console.error(e.message);check(`${name}: syntax`,false)}}
syntax('extra clubs',clubs);syntax('extra themes fallback',themes);syntax('design system',design);syntax('premium visual',premium);syntax('league expansion',leagues);syntax('readability guard',readability);syntax('final polish',finalPolish);

check('Bayern team id',has(clubs,"id:'bayern',team:5,comp:'BL1'"));
check('PSG team id',has(clubs,"id:'psg',team:524,comp:'FL1'"));
check('Milan team id',has(clubs,"id:'milan',team:98,comp:'SA'"));
check('Man City team id',has(clubs,"id:'mancity',team:65,comp:'PL'"));
check('extra club aliases',has(clubs,"fcbayern:'bayern'")&&has(clubs,"psg:'psg'")&&has(clubs,"acmilan:'milan'")&&has(clubs,"mci:'mancity'"));
check('home venues',has(clubs,'アリアンツ・アレーナ')&&has(clubs,'パルク・デ・プランス')&&has(clubs,'サン・シーロ')&&has(clubs,'エティハド・スタジアム'));
check('provider names normalize in registry',has(clubs,"'AS Monaco FC':'モナコ'")&&has(clubs,"'Coventry City FC':'コヴェントリー'")&&has(clubs,"'FC Schalke 04':'シャルケ'")&&has(clubs,"'Juventus FC':'ユベントス'"));

check('canonical design system owns four expanded themes',has(design,"5:{")&&has(design,"524:{")&&has(design,"98:{")&&has(design,"65:{"));
check('Bayern uses red field with stronger crest-blue details',has(design,"key:'bayern',tone:'crest-red-blue-white'")&&has(design,"cardPanel:'#C8102E'")&&has(design,"border:'#0073C9'")&&has(design,"cardBorder:'#2D86D3'")&&has(design,"sideBorder:'#2D86D3'"));
check('PSG uses dark Paris royal-blue family',has(design,"key:'psg',tone:'paris-royal-blue'")&&has(design,"cardSurface:'#04172F'")&&has(design,"cardGlow:'#0A3C73'")&&has(design,"accent:'#E33D45'"));
check('Milan Rossoneri resolves into generic gunmetal on opponent side',has(design,"key:'milan',tone:'rossoneri-gunmetal'")&&has(design,"cardSurface:'#7A0B16'")&&has(design,"cardPanel:'#342124'")&&has(design,"cardGlow:'#62666D'"));
check('Milan opponent side is not opponent-specific red',!has(design,"cardGlow:'#5A0A12'")&&!has(design,"cardGlow:'#650B14'"));
check('Man City uses distinct lighter sky-blue family',has(design,"key:'mancity',tone:'sky-blue'")&&has(design,"cardSurface:'#18516F'")&&has(design,"cardGlow:'#56A8C9'")&&has(design,"cardBorder:'#A7DDF0'"));
check('PSG and Man City no longer share similar blue endpoints',has(design,"cardGlow:'#0A3C73'")&&has(design,"cardGlow:'#56A8C9'"));
check('canonical themes stay line-free',!has(design,'linePrimary')&&!has(design,'lineSecondary'));
check('premium renderer derives expanded targets from canonical schema',has(premium,'Object.values(CP_THEME_DEFINITIONS||{})')&&has(premium,'CP_PREMIUM_GENERIC_KEYS'));
check('premium renderer consumes canonical card metrics',has(premium,'CP_DESIGN_TOKENS?.card')&&has(premium,'cpPremiumCardMetrics'));

check('Bundesliga label',has(leagues,"return small?'BL':'ブンデスリーガ'"));
check('Ligue 1 label',has(leagues,"return small?'Ligue 1':'リーグ・アン'"));
check('Serie A label',has(leagues,"return small?'Serie A':'セリエA'"));
check('new league logo ids',has(leagues,"BL1:{id:78}")&&has(leagues,"FL1:{id:61}")&&has(leagues,"SA:{id:135}"));

check('readability contract spans all seven teams',has(readability,'new Set([66,81,86,5,524,98,65])'));
check('Japanese display registry fixes live stale English labels',has(readability,"'Monaco':'モナコ'")&&has(readability,"'Coventry City':'コヴェントリー'")&&has(readability,"'Schalke':'シャルケ'")&&has(readability,"'Juventus':'ユベントス'"));
check('Rayo gets explicit short display name',has(readability,"'ラージョ・バジェカーノ':'ラージョ'"));
check('long labels use ellipsis only as fallback',has(readability,'CP_TEAM_DISPLAY_NAMES[n]||n')&&has(readability,"n.slice(0,max-1)+'…'"));
check('pill metrics come from canonical tokens',has(readability,"typeof CP_DESIGN_TOKENS==='object'")&&has(readability,'CP_DESIGN_TOKENS.pill'));
check('unified competition pill restores league logo',has(readability,'function cpUnifiedCompetitionPill')&&has(readability,"typeof cpCompetitionLogoImage==='function'")&&has(readability,'plate.size=new Size(q.logoBox,q.logoBox)'));
check('Barcelona competition pill uses same crest renderer',has(readability,'cpBarcelonaCompetitionPill=function')&&has(readability,'cpUnifiedCompetitionPill(parent,m,small,true)'));
check('Real and Barcelona opponent blocks normalize display names',has(readability,'cpRealTeamBlock=function')&&has(readability,'cpBarcelonaTeamBlock=function'));
check('readability has no crest-specific rescue registry',!has(readability,'CP_LOW_CONTRAST_CRESTS')&&!has(readability,"new Set(['JUV'])")&&!has(readability,'CP_RG_BASE_BADGE'));

check('final polish is Bayern-only and does not override badges',has(finalPolish,"club?.team!==5")&&!has(finalPolish,'badge=function')&&!has(finalPolish,'JUV'));
check('Bayern side chip reinforces blue without changing red field',has(finalPolish,"t?.sideBorder||'#2D86D3'")&&has(finalPolish,"p.borderWidth=.9"));

check('launcher downloads canonical design system v4',has(launcher,'ClubPulseDesignSystemPatch_v4.js')&&has(launcher,"'design-system4'"));
check('launcher downloads premium visual v2',has(launcher,'ClubPulsePremiumVisualPatch_v2.js')&&has(launcher,"'premium2'"));
check('launcher downloads readability v5',has(launcher,'ClubPulseReadabilityGuardPatch_v5.js')&&has(launcher,"'readability5'"));
check('launcher downloads final polish v3',has(launcher,'ClubPulseFinalPolishPatch_v3.js')&&has(launcher,"'final-polish3'"));
check('design/premium/readability/final-polish order is canonical',has(launcher,"+u+'\\n'+i+'\\n'+ds+'\\n'+pv+'\\n'+rg+'\\n'+fp+'\\n'+q+'\\n'+r"));
check('launcher documents all seven parameters',has(launcher,'manutd, realmadrid, barcelona, bayern, psg, milan, and mancity'));

if(failed){console.error(`\nExpanded club QA FAILED: ${failed}`);process.exit(1)}
console.log('\nExpanded generic opponent-contrast QA PASSED');
