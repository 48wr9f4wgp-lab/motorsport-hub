const fs=require('fs');
const path=require('path');
const root=__dirname;
const read=n=>fs.readFileSync(path.join(root,n),'utf8');
const files={
  launcher:read('club-pulse.js'),core:read('club-pulse-core.js'),clubs:read('club-pulse-club-registry-patch.js'),
  ui:read('club-pulse-ui-patch.js'),comp:read('club-pulse-competition-logo-patch.js'),manutd:read('club-pulse-manutd-theme-patch.js'),
  themes:read('club-pulse-theme-registry-patch.js'),identity:read('club-pulse-identity-color-patch.js'),
  top:read('club-pulse-top-layout-patch.js'),readability:read('club-pulse-readability-guard-patch.js'),
  live:read('club-pulse-live-context-patch.js'),resilience:read('club-pulse-resilience-patch.js')
};
let failed=0;
function check(name,ok){if(ok)console.log(`✓ ${name}`);else{console.error(`✗ ${name}`);failed++}}
function has(src,x){return src.includes(x)}
function syntax(name,src){try{new Function(`return (async()=>{\n${src}\n})`);check(`${name}: syntax`,true)}catch(e){console.error(`${name}: ${e.message}`);check(`${name}: syntax`,false)}}
for(const [name,src] of Object.entries(files))syntax(name,src);

// Launcher composition and cache versioning.
check('launcher injects both registries before parameter resolution',has(files.launcher,"c=c.slice(0,pk)+cr+'\\n'+ec+'\\n'+c.slice(pk)"));
check('launcher uses readability v3 cache and tag',has(files.launcher,'ClubPulseReadabilityGuardPatch_v3.js')&&has(files.launcher,"'readability3'"));
check('launcher pins readability v3 commit',has(files.launcher,'494a717a797dd000dd3c45b7ed4e7971dd0075a6'));
check('readability loads after identity',has(files.launcher,"+u+'\\n'+i+'\\n'+rg+'\\n'+q+'\\n'+r"));
check('launcher retains remote-to-local fallback',has(files.launcher,'if(F.fileExists(file))return F.readString(file)'));
check('launcher retains QA persistence',has(files.launcher,'ClubPulseQAOverride_v1.json')&&has(files.launcher,'15*60*1000'));
check('no decorative edge patch returns',!has(files.launcher,'EDGE_SAFE_PATCH')&&!has(files.launcher,'ClubPulseEdgeSafeIdentityPatch'));

// Canonical existing club registry.
check('Barcelona team 81 remains registered',has(files.clubs,'CLUBS.barcelona')&&has(files.clubs,'team:81'));
check('Real Madrid team 86 remains registered',has(files.clubs,'CLUBS.realmadrid')&&has(files.clubs,'team:86'));
check('Real and Barca aliases remain',has(files.clubs,"barca:'barcelona'")&&has(files.clubs,"rma:'realmadrid'"));

// Shared visual architecture.
check('shared theme registry contains Man U',has(files.themes,'66:{')&&has(files.themes,"key:'manutd'"));
check('shared theme registry contains Barca',has(files.themes,'81:{')&&has(files.themes,"key:'barcelona'"));
check('shared theme registry contains Real',has(files.themes,'86:{')&&has(files.themes,"key:'realmadrid'"));
check('outer shell remains common neutral',has(files.themes,'CP_COMMON_SHELL')&&has(files.themes,'return cpCommonShellGradient()'));
check('inner card remains simple horizontal gradient',has(files.themes,'function cpSimpleCardGradient')&&has(files.themes,'g.startPoint=new Point(0,.5)')&&has(files.themes,'g.endPoint=new Point(1,.5)'));
check('decorative line tokens remain removed',!has(files.themes,'linePrimary')&&!has(files.themes,'lineSecondary')&&!has(files.identity,'linePrimary')&&!has(files.identity,'lineSecondary'));
check('Man U vivid red identity remains',has(files.themes,"cardGlow:'#DA291C'")&&has(files.themes,"accent:'#D6B45A'"));
check('Real pearl-white identity remains',has(files.identity,"real.cardSurface='#FAFAF8'")&&has(files.identity,"real.cardText='#142443'"));
check('Barcelona purple identity remains',has(files.identity,"barca.cardSurface='#160B34'")&&has(files.identity,"barca.cardPanel='#32145F'"));
check('Barcelona dedicated renderer remains',has(files.identity,'function cpBarcelonaMatchMedium')&&has(files.identity,'function cpBarcelonaMatchSmall'));

// Seven-club readability contract.
check('readability applies to exactly the seven current clubs',has(files.readability,'new Set([66,81,86,5,524,98,65])'));
check('display-name registry covers English and Japanese aliases',has(files.readability,"'Monaco':'モナコ'")&&has(files.readability,"'Coventry City':'コヴェントリー'")&&has(files.readability,"'Schalke':'シャルケ'")&&has(files.readability,"'Juventus':'ユベントス'")&&has(files.readability,"'ラージョ・バジェカーノ':'ラージョ'"));
check('ellipsis is fallback only after display-name lookup',has(files.readability,'n=CP_TEAM_DISPLAY_NAMES[n]||n')&&has(files.readability,"n.length>max?n.slice(0,max-1)+'…':n"));
check('generic opponent renderer is normalized',has(files.readability,'renderTeamBlock=function')&&has(files.readability,'cpNormalizeOpponentOpt'));
check('Real dedicated renderer is normalized',has(files.readability,'CP_RG_BASE_REAL_TEAM')&&has(files.readability,'cpRealTeamBlock=function'));
check('Barcelona dedicated renderer is normalized',has(files.readability,'CP_RG_BASE_BARCA_TEAM')&&has(files.readability,'cpBarcelonaTeamBlock=function'));
check('small labels use same display registry',has(files.readability,'smallTeamName=function')&&has(files.readability,'cpDisplayTeamName(name,true)'));
check('pill geometry is centralized',has(files.readability,'CP_PILL_METRICS')&&has(files.readability,'logoBox:24')&&has(files.readability,'logoBox:19'));
check('unified competition pill restores competition crest',has(files.readability,'function cpUnifiedCompetitionPill')&&has(files.readability,"typeof cpCompetitionLogoImage==='function'")&&has(files.readability,'plate.addImage(logo)'));
check('competition crest keeps white identity plate only inside league pill',has(files.readability,"plate.backgroundColor=C('#FFFFFF',1)")&&has(files.readability,'plate.cornerRadius=q.logoBox/2'));
check('generic competition and side pills use shared metrics',has(files.readability,'competitionPill=function')&&has(files.readability,'sidePill=function'));
check('Barcelona competition pill uses same crest treatment',has(files.readability,'cpBarcelonaCompetitionPill=function')&&has(files.readability,'cpUnifiedCompetitionPill(parent,m,small,true)'));
check('home-away chips use the shared height family',has(files.readability,'sideV:6.2')&&has(files.readability,'sideV:4.8')&&has(files.readability,'cpBarcelonaSidePill=function'));
check('crest rescue remains selective to Juventus',has(files.readability,"new Set(['JUV'])"));
check('crest rescue remains faint outside league pill',has(files.readability,"backgroundColor=C('#F3F5F8',.10)")&&has(files.readability,"backgroundColor=C('#F6F7F9',.08)"));

// State and resilience contracts.
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
console.log('\nClub Pulse seven-club presentation contract QA PASSED');
