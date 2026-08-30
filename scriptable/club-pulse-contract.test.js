const fs=require('fs');
const path=require('path');
const root=__dirname;
const read=n=>fs.readFileSync(path.join(root,n),'utf8');
const files={
  launcher:read('club-pulse.js'),core:read('club-pulse-core.js'),clubs:read('club-pulse-club-registry-patch.js'),
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
check('launcher loads canonical design system v2',has(files.launcher,'ClubPulseDesignSystemPatch_v2.js')&&has(files.launcher,"'design-system2'"));
check('launcher pins canonical design-system v2 commit',has(files.launcher,'d6a60170b621b284d22b7135e2fbf2b41d5330e1'));
check('launcher uses premium visual v2',has(files.launcher,'ClubPulsePremiumVisualPatch_v2.js')&&has(files.launcher,"'premium2'"));
check('launcher uses readability v4 cache and tag',has(files.launcher,'ClubPulseReadabilityGuardPatch_v4.js')&&has(files.launcher,"'readability4'"));
check('launcher loads final polish v1',has(files.launcher,'ClubPulseFinalPolishPatch_v1.js')&&has(files.launcher,"'final-polish1'"));
check('launcher pins final polish v1 commit',has(files.launcher,'613e57e3a4941df85f654c833fd4914e4d2445d6'));
check('canonical load order includes final polish after readability',has(files.launcher,"+u+'\\n'+i+'\\n'+ds+'\\n'+pv+'\\n'+rg+'\\n'+fp+'\\n'+q+'\\n'+r"));
check('launcher retains remote-to-local fallback',has(files.launcher,'if(F.fileExists(file))return F.readString(file)'));
check('launcher retains QA persistence',has(files.launcher,'ClubPulseQAOverride_v1.json')&&has(files.launcher,'15*60*1000'));
check('no obsolete decorative edge patch returns',!has(files.launcher,'EDGE_SAFE_PATCH')&&!has(files.launcher,'ClubPulseEdgeSafeIdentityPatch'));

check('Barcelona team 81 remains registered',has(files.clubs,'CLUBS.barcelona')&&has(files.clubs,'team:81'));
check('Real Madrid team 86 remains registered',has(files.clubs,'CLUBS.realmadrid')&&has(files.clubs,'team:86'));
check('Real and Barca aliases remain',has(files.clubs,"barca:'barcelona'")&&has(files.clubs,"rma:'realmadrid'"));

check('design system declares shared shell/card/pill tokens',has(files.design,'const CP_DESIGN_TOKENS')&&has(files.design,'shell:{')&&has(files.design,'card:{')&&has(files.design,'pill:{'));
check('design system contains all seven theme definitions',["66:{","81:{","86:{","5:{","524:{","98:{","65:{"].every(x=>has(files.design,x)));
check('design system overrides compatibility registries',has(files.design,'Object.assign(CP_COMMON_SHELL,CP_DESIGN_TOKENS.shell)')&&has(files.design,'Object.assign(target,definition)'));
check('shared shell remains neutral and metallic',has(files.design,"surface:'#080C14'")&&has(files.design,"edge:'#9AA6B8'"));
check('Man U canonical vivid-red identity',has(files.design,"key:'manutd',tone:'vivid-red'")&&has(files.design,"cardGlow:'#DA291C'")&&has(files.design,"cardBorder:'#D0AE55'"));
check('Barcelona canonical purple identity',has(files.design,"key:'barcelona',tone:'royal-purple'")&&has(files.design,"cardPanel:'#32145F'")&&has(files.design,"cardGlow:'#452078'"));
check('Real canonical pearl identity',has(files.design,"key:'realmadrid',tone:'pearl-white'")&&has(files.design,"cardSurface:'#FFFDF8'")&&has(files.design,"cardPearl:'#E9E3D6'"));
check('Bayern canonical crest-color identity with stronger blue edge',has(files.design,"key:'bayern',tone:'crest-red-blue-white'")&&has(files.design,"cardPanel:'#C8102E'")&&has(files.design,"border:'#0073C9'")&&has(files.design,"cardBorder:'#2D86D3'")&&has(files.design,"sideBorder:'#2D86D3'"));
check('PSG and Man City have distinct blue families',has(files.design,"key:'psg',tone:'paris-royal-blue'")&&has(files.design,"cardSurface:'#04172F'")&&has(files.design,"key:'mancity',tone:'sky-blue'")&&has(files.design,"cardGlow:'#56A8C9'"));
check('Milan is lifted Rossoneri-to-charcoal',has(files.design,"key:'milan',tone:'rossoneri-charcoal'")&&has(files.design,"cardSurface:'#7A0B16'")&&has(files.design,"cardGlow:'#34363C'"));
check('design system has no decorative line tokens',!has(files.design,'linePrimary')&&!has(files.design,'lineSecondary'));

check('premium renderer derives club targets from canonical definitions',has(files.premium,'Object.values(CP_THEME_DEFINITIONS||{})')&&has(files.premium,'CP_PREMIUM_GENERIC_KEYS'));
check('premium card geometry reads canonical card tokens',has(files.premium,'CP_DESIGN_TOKENS?.card')&&has(files.premium,'radiusMedium')&&has(files.premium,'borderMedium'));
check('Real premium gradient remains restrained and diagonal',has(files.premium,'function cpPremiumRealGradient')&&has(files.premium,'g.locations=[0,.40,.76,1]'));
check('Barcelona dedicated renderer remains',has(files.identity,'function cpBarcelonaMatchMedium')&&has(files.identity,'function cpBarcelonaMatchSmall'));

check('readability applies to exactly the seven current clubs',has(files.readability,'new Set([66,81,86,5,524,98,65])'));
check('display-name registry covers English and Japanese aliases',has(files.readability,"'Monaco':'モナコ'")&&has(files.readability,"'Coventry City':'コヴェントリー'")&&has(files.readability,"'Schalke':'シャルケ'")&&has(files.readability,"'Juventus':'ユベントス'")&&has(files.readability,"'ラージョ・バジェカーノ':'ラージョ'"));
check('ellipsis is fallback only after display-name lookup',has(files.readability,'n=CP_TEAM_DISPLAY_NAMES[n]||n')&&has(files.readability,"n.length>max?n.slice(0,max-1)+'…':n"));
check('generic opponent renderer is normalized',has(files.readability,'renderTeamBlock=function')&&has(files.readability,'cpNormalizeOpponentOpt'));
check('Real dedicated renderer is normalized',has(files.readability,'CP_RG_BASE_REAL_TEAM')&&has(files.readability,'cpRealTeamBlock=function'));
check('Barcelona dedicated renderer is normalized',has(files.readability,'CP_RG_BASE_BARCA_TEAM')&&has(files.readability,'cpBarcelonaTeamBlock=function'));
check('pill geometry reads canonical design tokens',has(files.readability,"typeof CP_DESIGN_TOKENS==='object'")&&has(files.readability,'CP_DESIGN_TOKENS.pill'));
check('unified competition pill restores competition crest',has(files.readability,'function cpUnifiedCompetitionPill')&&has(files.readability,"typeof cpCompetitionLogoImage==='function'")&&has(files.readability,'plate.addImage(logo)'));
check('competition crest keeps white identity plate only inside league pill',has(files.readability,"plate.backgroundColor=C('#FFFFFF',1)")&&has(files.readability,'plate.cornerRadius=q.logoBox/2'));
check('Barcelona competition pill uses same crest treatment',has(files.readability,'cpBarcelonaCompetitionPill=function')&&has(files.readability,'cpUnifiedCompetitionPill(parent,m,small,true)'));

check('final polish only scopes Juventus crest and Bayern side pill',has(files.finalPolish,"toUpperCase()!=='JUV'")&&has(files.finalPolish,"club?.team!==5"));
check('Juventus halo is near invisible',has(files.finalPolish,"backgroundColor=C('#F3F5F8',.045)")&&has(files.finalPolish,"backgroundColor=C('#F6F7F9',.025)")&&has(files.finalPolish,"borderColor=C('#FFFFFF',.055)"));
check('Bayern side pill uses stronger canonical blue',has(files.finalPolish,"t?.sideBorder||'#2D86D3'")&&has(files.finalPolish,'p.borderWidth=.9')&&has(files.finalPolish,".86)"));

check('Man U state renderer stays scoped',has(files.manutd,'club?.team===66'));
check('top layout stays Man U scoped',has(files.top,'if(!CP_MU_IS())return CP_TOP_LAYOUT_BASE_MATCH_MEDIUM'));
check('competition registry includes PL LaLiga CL',has(files.comp,'PL:{id:39}')&&has(files.comp,'PD:{id:140}')&&has(files.comp,'CL:{id:2}'));
check('core retains stale cache fallback',has(files.core,'if(c)return{...c,stale:true}'));
check('core retains daily quota guard',has(files.core,'API_DAILY_BUDGET'));
check('core keeps live token in Keychain',has(files.core,'clubpulse_api_football_token_v1'));
check('resilience uses active theme',has(files.resilience,"typeof CP_ACTIVE_THEME==='function'")&&has(files.resilience,'CP_ACTIVE_THEME()'));
check('resilience keeps offline and no-cache QA',has(files.resilience,"qa==='offline'")&&has(files.resilience,"qa==='nocache'"));
check('obsolete edge-safe files remain deleted',!fs.existsSync(path.join(root,'club-pulse-edge-safe-identity-patch.js'))&&!fs.existsSync(path.join(root,'club-pulse-edge-safe.test.js')));

if(failed){console.error(`\nClub Pulse contract QA FAILED: ${failed} check(s)`);process.exit(1)}
console.log('\nClub Pulse frozen seven-club visual contract QA PASSED');
