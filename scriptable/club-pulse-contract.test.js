const fs=require('fs');
const path=require('path');
const root=__dirname;
const read=n=>fs.readFileSync(path.join(root,n),'utf8');
const files={
  launcher:read('club-pulse.js'),core:read('club-pulse-core.js'),clubs:read('club-pulse-club-registry-patch.js'),extraClubs:read('club-pulse-extra-clubs-patch.js'),
  ui:read('club-pulse-ui-patch.js'),comp:read('club-pulse-competition-logo-patch.js'),manutd:read('club-pulse-manutd-theme-patch.js'),
  themes:read('club-pulse-theme-registry-patch.js'),extraThemes:read('club-pulse-extra-theme-patch.js'),identity:read('club-pulse-identity-color-patch.js'),
  design:read('club-pulse-design-system-patch.js'),premium:read('club-pulse-premium-visual-patch.js'),
  top:read('club-pulse-top-layout-patch.js'),readability:read('club-pulse-readability-guard-patch.js'),finalPolish:read('club-pulse-final-polish-patch.js'),
  live:read('club-pulse-live-context-patch.js'),resilience:read('club-pulse-resilience-patch.js')
};
let failed=0;
function check(name,ok){if(ok)console.log(`✓ ${name}`);else{console.error(`✗ ${name}`);failed++}}
function has(src,x){return src.includes(x)}
function syntax(name,src){try{new Function(`return (async()=>{\n${src}\n})`);check(`${name}: syntax`,true)}catch(e){console.error(`${name}: ${e.message}`);check(`${name}: syntax`,false)}}
for(const [name,src] of Object.entries(files))syntax(name,src);

check('launcher injects both registries before parameter resolution',has(files.launcher,"c=c.slice(0,pk)+cr+'\\n'+ec+'\\n'+c.slice(pk)"));
check('launcher loads extra-clubs v3',has(files.launcher,'ClubPulseExtraClubsPatch_v3.js')&&has(files.launcher,"'extra-clubs3'"));
check('launcher pins extra-clubs v3 commit',has(files.launcher,'1b734c803dc4ccc39c978decc3f2a4c733ab7605'));
check('launcher loads canonical design system v5',has(files.launcher,'ClubPulseDesignSystemPatch_v5.js')&&has(files.launcher,"'design-system5'"));
check('launcher pins canonical design-system v5 commit',has(files.launcher,'64431aec299fd388e6a651f4eed7da01cdeee726'));
check('launcher uses premium visual v2',has(files.launcher,'ClubPulsePremiumVisualPatch_v2.js')&&has(files.launcher,"'premium2'"));
check('launcher uses readability v6',has(files.launcher,'ClubPulseReadabilityGuardPatch_v6.js')&&has(files.launcher,"'readability6'"));
check('launcher pins readability v6 commit',has(files.launcher,'8f569ad248f3777ca4a7f935bdacf2c5343484bc'));
check('launcher keeps final polish v3',has(files.launcher,'ClubPulseFinalPolishPatch_v3.js')&&has(files.launcher,"'final-polish3'"));
check('canonical load order remains stable',has(files.launcher,"+u+'\\n'+i+'\\n'+ds+'\\n'+pv+'\\n'+rg+'\\n'+fp+'\\n'+q+'\\n'+r"));
check('launcher retains remote-to-local fallback',has(files.launcher,'if(F.fileExists(file))return F.readString(file)'));
check('launcher retains QA persistence',has(files.launcher,'ClubPulseQAOverride_v1.json')&&has(files.launcher,'15*60*1000'));
check('launcher documents eleven parameters',has(files.launcher,'arsenal, liverpool, inter, and dortmund'));

check('Barcelona team 81 remains registered',has(files.clubs,'CLUBS.barcelona')&&has(files.clubs,'team:81'));
check('Real Madrid team 86 remains registered',has(files.clubs,'CLUBS.realmadrid')&&has(files.clubs,'team:86'));
check('new club IDs are registered',has(files.extraClubs,"id:'arsenal',team:57,comp:'PL'")&&has(files.extraClubs,"id:'liverpool',team:64,comp:'PL'")&&has(files.extraClubs,"id:'inter',team:108,comp:'SA'")&&has(files.extraClubs,"id:'dortmund',team:4,comp:'BL1'"));
check('new club venues are registered',has(files.extraClubs,'エミレーツ・スタジアム')&&has(files.extraClubs,'アンフィールド')&&has(files.extraClubs,'ジグナル・イドゥナ・パルク')&&has(files.extraClubs,'サン・シーロ'));
check('new aliases are registered',has(files.extraClubs,"ars:'arsenal'")&&has(files.extraClubs,"lfc:'liverpool'")&&has(files.extraClubs,"internazionale:'inter'")&&has(files.extraClubs,"bvb:'dortmund'"));

check('design system declares shared shell/card/pill tokens',has(files.design,'const CP_DESIGN_TOKENS')&&has(files.design,'shell:{')&&has(files.design,'card:{')&&has(files.design,'pill:{'));
check('design system contains all eleven theme definitions',["66:{","81:{","86:{","5:{","524:{","98:{","65:{","57:{","64:{","108:{","4:{"].every(x=>has(files.design,x)));
check('shared shell remains frozen neutral metallic',has(files.design,"surface:'#080C14'")&&has(files.design,"edge:'#9AA6B8'"));
check('frozen seven identities remain present',has(files.design,"key:'manutd',tone:'vivid-red'")&&has(files.design,"key:'barcelona',tone:'royal-purple'")&&has(files.design,"key:'realmadrid',tone:'pearl-white'")&&has(files.design,"key:'bayern',tone:'crest-red-blue-white'")&&has(files.design,"key:'psg',tone:'paris-royal-blue'")&&has(files.design,"key:'milan',tone:'rossoneri-gunmetal'")&&has(files.design,"key:'mancity',tone:'sky-blue'"));
check('Arsenal identity is red ivory navy',has(files.design,"key:'arsenal',tone:'arsenal-red-ivory-navy'")&&has(files.design,"cardGlow:'#E31B3D'")&&has(files.design,"cardBorder:'#E6D8C3'"));
check('Liverpool identity is deep scarlet teal',has(files.design,"key:'liverpool',tone:'deep-scarlet-teal'")&&has(files.design,"cardSurface:'#500614'")&&has(files.design,"cardBorder:'#71B8AE'"));
check('Inter identity is black electric blue',has(files.design,"key:'inter',tone:'nerazzurri-electric-blue'")&&has(files.design,"cardSurface:'#03060B'")&&has(files.design,"cardGlow:'#0057B8'"));
check('Dortmund identity is signal yellow black with dark text',has(files.design,"key:'dortmund',tone:'signal-yellow-black'")&&has(files.design,"cardGlow:'#FDE100'")&&has(files.design,"cardText:'#111111'"));
check('design system stays line-free',!has(files.design,'linePrimary')&&!has(files.design,'lineSecondary'));

check('premium renderer derives generic targets from canonical definitions',has(files.premium,'Object.values(CP_THEME_DEFINITIONS||{})')&&has(files.premium,'CP_PREMIUM_GENERIC_KEYS'));
check('premium card geometry reads canonical tokens',has(files.premium,'CP_DESIGN_TOKENS?.card')&&has(files.premium,'radiusMedium')&&has(files.premium,'borderMedium'));
check('Real premium gradient remains frozen',has(files.premium,'function cpPremiumRealGradient')&&has(files.premium,'g.locations=[0,.40,.76,1]'));
check('Barcelona dedicated renderer remains',has(files.identity,'function cpBarcelonaMatchMedium')&&has(files.identity,'function cpBarcelonaMatchSmall'));

check('readability applies to exactly eleven clubs',has(files.readability,'new Set([66,81,86,5,524,98,65,57,64,108,4])'));
check('readability includes new club display aliases',has(files.readability,"'Arsenal FC':'アーセナル'")&&has(files.readability,"'Liverpool FC':'リヴァプール'")&&has(files.readability,"'FC Internazionale Milano':'インテル'")&&has(files.readability,"'Borussia Dortmund':'ドルトムント'"));
check('ellipsis remains fallback only',has(files.readability,'n=CP_TEAM_DISPLAY_NAMES[n]||n')&&has(files.readability,"n.length>max?n.slice(0,max-1)+'…':n"));
check('pill geometry reads canonical tokens',has(files.readability,"typeof CP_DESIGN_TOKENS==='object'")&&has(files.readability,'CP_DESIGN_TOKENS.pill'));
check('competition crest treatment remains unified',has(files.readability,'function cpUnifiedCompetitionPill')&&has(files.readability,'plate.addImage(logo)'));
check('readability contains no opponent-specific crest rescue',!has(files.readability,'CP_LOW_CONTRAST_CRESTS')&&!has(files.readability,'CP_RG_BASE_BADGE'));

check('final polish remains Bayern-only',!has(files.finalPolish,'badge=function')&&!has(files.finalPolish,'JUV')&&has(files.finalPolish,"club?.team!==5"));
check('Bayern side pill keeps stronger canonical blue',has(files.finalPolish,"t?.sideBorder||'#2D86D3'")&&has(files.finalPolish,'p.borderWidth=.9'));

check('Man U state renderer stays scoped',has(files.manutd,'club?.team===66'));
check('top layout stays Man U scoped',has(files.top,'if(!CP_MU_IS())return CP_TOP_LAYOUT_BASE_MATCH_MEDIUM'));
check('competition registry includes PL LaLiga CL',has(files.comp,'PL:{id:39}')&&has(files.comp,'PD:{id:140}')&&has(files.comp,'CL:{id:2}'));
check('core retains stale cache fallback',has(files.core,'if(c)return{...c,stale:true}'));
check('core retains daily quota guard',has(files.core,'API_DAILY_BUDGET'));
check('core keeps live token in Keychain',has(files.core,'clubpulse_api_football_token_v1'));
check('resilience keeps offline and no-cache QA',has(files.resilience,"qa==='offline'")&&has(files.resilience,"qa==='nocache'"));

if(failed){console.error(`\nClub Pulse contract QA FAILED: ${failed} check(s)`);process.exit(1)}
console.log('\nClub Pulse eleven-club visual contract QA PASSED');
