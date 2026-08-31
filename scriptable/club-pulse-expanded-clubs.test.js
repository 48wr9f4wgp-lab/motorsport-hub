const fs=require('fs');
const path=require('path');
const root=__dirname;
const read=n=>fs.readFileSync(path.join(root,n),'utf8');
const launcher=read('club-pulse.js');
const clubs=read('club-pulse-extra-clubs-patch.js');
const design=read('club-pulse-design-system-patch.js');
const premium=read('club-pulse-premium-visual-patch.js');
const leagues=read('club-pulse-league-expansion-patch.js');
const readability=read('club-pulse-readability-guard-patch.js');
const finalPolish=read('club-pulse-final-polish-patch.js');
let failed=0;
function check(name,ok){if(ok)console.log(`✓ ${name}`);else{console.error(`✗ ${name}`);failed++}}
function has(src,x){return src.includes(x)}
function syntax(name,src){try{new Function(`return (async()=>{\n${src}\n})`);check(`${name}: syntax`,true)}catch(e){console.error(e.message);check(`${name}: syntax`,false)}}
syntax('extra clubs',clubs);syntax('design system',design);syntax('premium visual',premium);syntax('league expansion',leagues);syntax('readability guard',readability);syntax('final polish',finalPolish);

const expectedClubs=[
  ["id:'bayern',team:5,comp:'BL1'",'Bayern'],["id:'psg',team:524,comp:'FL1'",'PSG'],["id:'milan',team:98,comp:'SA'",'Milan'],["id:'mancity',team:65,comp:'PL'",'Man City'],
  ["id:'arsenal',team:57,comp:'PL'",'Arsenal'],["id:'liverpool',team:64,comp:'PL'",'Liverpool'],["id:'inter',team:108,comp:'SA'",'Inter'],["id:'dortmund',team:4,comp:'BL1'",'Dortmund']
];
for(const [needle,label] of expectedClubs)check(`${label} team id`,has(clubs,needle));
check('second batch aliases',has(clubs,"ars:'arsenal'")&&has(clubs,"lfc:'liverpool'")&&has(clubs,"internazionale:'inter'")&&has(clubs,"bvb:'dortmund'"));
check('second batch venues',has(clubs,'エミレーツ・スタジアム')&&has(clubs,'アンフィールド')&&has(clubs,'サン・シーロ')&&has(clubs,'ジグナル・イドゥナ・パルク'));
check('second batch provider normalization',has(clubs,"'Arsenal FC':'アーセナル'")&&has(clubs,"'Liverpool FC':'リヴァプール'")&&has(clubs,"'FC Internazionale Milano':'インテル'")&&has(clubs,"'Borussia Dortmund':'ドルトムント'"));

check('canonical design owns all eleven themes',["66:{","81:{","86:{","5:{","524:{","98:{","65:{","57:{","64:{","108:{","4:{"].every(x=>has(design,x)));
check('Arsenal is differentiated from Man U and Bayern',has(design,"key:'arsenal',tone:'arsenal-red-ivory-navy'")&&has(design,"cardBorder:'#E6D8C3'")&&has(design,"border:'#263F66'"));
check('Liverpool uses deeper scarlet plus teal trim',has(design,"key:'liverpool',tone:'deep-scarlet-teal'")&&has(design,"cardSurface:'#500614'")&&has(design,"sideBorder:'#A7E5DC'"));
check('Inter uses black-to-electric-blue field',has(design,"key:'inter',tone:'nerazzurri-electric-blue'")&&has(design,"cardSurface:'#03060B'")&&has(design,"cardGlow:'#0057B8'"));
check('Dortmund uses signal yellow with dark text',has(design,"key:'dortmund',tone:'signal-yellow-black'")&&has(design,"cardGlow:'#FDE100'")&&has(design,"cardText:'#111111'"));
check('existing Milan generic gunmetal remains frozen',has(design,"key:'milan',tone:'rossoneri-gunmetal'")&&has(design,"cardGlow:'#62666D'"));
check('canonical themes stay line-free',!has(design,'linePrimary')&&!has(design,'lineSecondary'));

check('premium renderer automatically includes canonical additions',has(premium,'Object.values(CP_THEME_DEFINITIONS||{})')&&has(premium,'CP_PREMIUM_GENERIC_KEYS'));
check('readability contract spans eleven teams',has(readability,'new Set([66,81,86,5,524,98,65,57,64,108,4])'));
check('new display names are normalized',has(readability,"'Arsenal FC':'アーセナル'")&&has(readability,"'Liverpool FC':'リヴァプール'")&&has(readability,"'FC Internazionale Milano':'インテル'")&&has(readability,"'Borussia Dortmund':'ドルトムント'"));
check('long labels still use ellipsis only as fallback',has(readability,'CP_TEAM_DISPLAY_NAMES[n]||n')&&has(readability,"n.slice(0,max-1)+'…'"));
check('competition pill remains shared',has(readability,'function cpUnifiedCompetitionPill')&&has(readability,'plate.size=new Size(q.logoBox,q.logoBox)'));
check('no crest-specific rescue registry',!has(readability,'CP_LOW_CONTRAST_CRESTS')&&!has(readability,'CP_RG_BASE_BADGE'));
check('final polish remains Bayern-only',has(finalPolish,"club?.team!==5")&&!has(finalPolish,'badge=function'));

check('existing league support covers second batch',has(leagues,"return small?'BL':'ブンデスリーガ'")&&has(leagues,"return small?'Serie A':'セリエA'"));
check('launcher downloads extra-clubs v3',has(launcher,'ClubPulseExtraClubsPatch_v3.js')&&has(launcher,"'extra-clubs3'"));
check('launcher downloads design v5',has(launcher,'ClubPulseDesignSystemPatch_v5.js')&&has(launcher,"'design-system5'"));
check('launcher downloads readability v6',has(launcher,'ClubPulseReadabilityGuardPatch_v6.js')&&has(launcher,"'readability6'"));
check('launcher documents second batch',has(launcher,'arsenal, liverpool, inter, and dortmund'));

if(failed){console.error(`\nExpanded club QA FAILED: ${failed}`);process.exit(1)}
console.log('\nEleven-club expansion QA PASSED');
