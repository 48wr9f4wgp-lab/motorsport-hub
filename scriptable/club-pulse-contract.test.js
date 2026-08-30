const fs=require('fs');
const path=require('path');
const root=__dirname;
const read=n=>fs.readFileSync(path.join(root,n),'utf8');

const files={
  launcher:read('club-pulse.js'),
  loader:read('loader.js'),
  core:read('club-pulse-core.js'),
  clubs:read('club-pulse-club-registry-patch.js'),
  ui:read('club-pulse-ui-patch.js'),
  comp:read('club-pulse-competition-logo-patch.js'),
  manutd:read('club-pulse-manutd-theme-patch.js'),
  themes:read('club-pulse-theme-registry-patch.js'),
  identity:read('club-pulse-identity-color-patch.js'),
  top:read('club-pulse-top-layout-patch.js'),
  readability:read('club-pulse-readability-guard-patch.js'),
  live:read('club-pulse-live-context-patch.js'),
  resilience:read('club-pulse-resilience-patch.js')
};

let failed=0;
function check(name,ok){if(ok)console.log(`✓ ${name}`);else{console.error(`✗ ${name}`);failed++}}
function has(src,x){return src.includes(x)}
function syntax(name,src){try{new Function(`return (async()=>{\n${src}\n})`);check(`${name}: syntax`,true)}catch(e){console.error(`${name}: ${e.message}`);check(`${name}: syntax`,false)}}
for(const [name,src] of Object.entries(files))syntax(name,src);

// Launcher composition / ordering.
check('launcher loads club registry',has(files.launcher,'CLUB_REGISTRY_PATCH'));
check('launcher injects registries before parameter resolution',has(files.launcher,"PM='const param=String(args.widgetParameter'")&&has(files.launcher,"c=c.slice(0,pk)+cr+'\\n'+ec+'\\n'+c.slice(pk)"));
check('launcher loads club registry v2 cache',has(files.launcher,'ClubPulseClubRegistryPatch_v2.js')&&has(files.launcher,"'clubs2'"));
check('launcher loads stable UI',has(files.launcher,'club-pulse-ui-patch.js'));
check('launcher loads competition registry',has(files.launcher,'club-pulse-competition-logo-patch.js'));
check('launcher keeps legacy Man U state renderer',has(files.launcher,'club-pulse-manutd-theme-patch.js'));
check('launcher loads shared theme registry',has(files.launcher,'THEME_REGISTRY_PATCH')&&has(files.launcher,'club-pulse-theme-registry-patch.js'));
check('launcher loads theme registry v11 cache',has(files.launcher,'ClubPulseThemeRegistryPatch_v11.js')&&has(files.launcher,"'themes11'"));
check('launcher loads identity v6 cache',has(files.launcher,'ClubPulseIdentityColorPatch_v6.js')&&has(files.launcher,"'identity6'"));
check('launcher loads readability guard v1 cache',has(files.launcher,'ClubPulseReadabilityGuardPatch_v1.js')&&has(files.launcher,"'readability1'"));
check('launcher has no decorative edge patch',!has(files.launcher,'EDGE_SAFE_PATCH')&&!has(files.launcher,'ClubPulseEdgeSafeIdentityPatch'));
check('launcher theme order remains stable with readability guard',has(files.launcher,"patches=x+'\\n'+y+'\\n'+le+'\\n'+z+'\\n'+tr+'\\n'+et+'\\n'+u+'\\n'+i+'\\n'+rg+'\\n'+q+'\\n'+r"));
check('launcher loads resilience v2',has(files.launcher,'ClubPulseResiliencePatch_v2.js')&&has(files.launcher,"'resilience2'"));
check('launcher keeps remote-to-local fallback',has(files.launcher,'if(F.fileExists(file))return F.readString(file)'));
check('launcher keeps QA override persistence',has(files.launcher,'ClubPulseQAOverride_v1.json')&&has(files.launcher,'15*60*1000'));

// Club registry.
check('registry defines Barcelona team 81',has(files.clubs,'CLUBS.barcelona')&&has(files.clubs,'team:81')&&has(files.clubs,"comp:'PD'"));
check('registry defines Real Madrid team 86',has(files.clubs,'CLUBS.realmadrid')&&has(files.clubs,'team:86')&&has(files.clubs,"comp:'PD'"));
check('registry has Barcelona aliases',has(files.clubs,"barca:'barcelona'")&&has(files.clubs,"fcb:'barcelona'"));
check('registry has Real Madrid aliases',has(files.clubs,"rma:'realmadrid'")&&has(files.clubs,"madrid:'realmadrid'"));
check('registry defines home venue fallbacks',has(files.clubs,'カンプ・ノウ')&&has(files.clubs,'サンティアゴ・ベルナベウ'));
check('registry uses tuned crest scales',has(files.clubs,'81:.96')&&has(files.clubs,'86:1.06'));
check('registry normalizes Malaga to Japanese',has(files.clubs,"'Málaga CF':'マラガ'")&&has(files.clubs,"'Málaga':'マラガ'"));

// Readability-first shared visual architecture.
check('shared themes include Manchester United',has(files.themes,'66:{')&&has(files.themes,"key:'manutd'"));
check('shared themes include Barcelona',has(files.themes,'81:{')&&has(files.themes,"key:'barcelona'"));
check('shared themes include Real Madrid',has(files.themes,'86:{')&&has(files.themes,"key:'realmadrid'"));
check('shared theme lookup is data-driven',has(files.themes,'CP_CLUB_THEME_REGISTRY[club?.team]'));
check('shared themes reuse canonical match renderers',!has(files.themes,'buildMatchMedium=function')&&!has(files.themes,'buildMatchSmall=function'));
check('shared themes customize tokens/components only',has(files.themes,'bg=function')&&has(files.themes,'cardBg=function')&&has(files.themes,'badge=function')&&has(files.themes,'buildHeaderMedium=function'));
check('outer shell is common and neutral',has(files.themes,'CP_COMMON_SHELL')&&has(files.themes,'return cpCommonShellGradient()'));
check('inner cards use simple horizontal gradient',has(files.themes,'function cpSimpleCardGradient')&&has(files.themes,'g.startPoint=new Point(0,.5)')&&has(files.themes,'g.endPoint=new Point(1,.5)'));
check('decorative line tokens are removed',!has(files.themes,'linePrimary')&&!has(files.themes,'lineSecondary')&&!has(files.identity,'linePrimary')&&!has(files.identity,'lineSecondary'));
check('Man U uses vivid red with restrained depth',has(files.themes,"cardSurface:'#5B0A0E'")&&has(files.themes,"cardPanel:'#B5121B'")&&has(files.themes,"cardGlow:'#DA291C'")&&has(files.themes,"accent:'#D6B45A'"));
check('Barcelona keeps strong warm purple',has(files.identity,"barca.cardSurface='#160B34'")&&has(files.identity,"barca.cardPanel='#32145F'")&&has(files.identity,"barca.cardGlow='#452078'"));
check('Barcelona uses explicit high-contrast team block',has(files.identity,'function cpBarcelonaTeamBlock')&&has(files.identity,"heavy(name,opt.name,opt.nameSize||(small?9.6:12.2),'#FFFFFF')")&&has(files.identity,'nm.minimumScaleFactor=.78'));
check('Barcelona uses high-contrast competition and side pills',has(files.identity,'function cpBarcelonaCompetitionPill')&&has(files.identity,"p.borderColor=C('#D9DCE5',.54)")&&has(files.identity,'function cpBarcelonaSidePill')&&has(files.identity,"p.borderColor=C('#E1BD61',.76)"));
check('Barcelona has dedicated readable medium metadata renderer',has(files.identity,'function cpBarcelonaMatchMedium')&&has(files.identity,"semibold(meta,metaLine(d,m),9.8,1,'#FFFFFF')")&&has(files.identity,'mt.minimumScaleFactor=.88'));
check('Barcelona has readable small kickoff renderer',has(files.identity,'function cpBarcelonaMatchSmall')&&has(files.identity,"semibold(meta,m.kickoff,9.4,1,'#FFFFFF')")&&has(files.identity,'mt.minimumScaleFactor=.92'));
check('Barcelona crest sizes are raised for readability',has(files.identity,'logoSize:58')&&has(files.identity,'logoSize:42'));
check('Real uses pearl white inner surface',has(files.identity,"real.cardSurface='#FAFAF8'")&&has(files.identity,"real.cardPanel='#F1F3F7'")&&has(files.identity,"real.cardText='#142443'"));
check('Real white surface has no decorative rails',has(files.identity,'function cpRealSimpleCardGradient')&&!has(files.identity,'cpRealCardGradient'));
check('club crest treatment has no circular plate',has(files.themes,"o.backgroundColor=C('#000000',0)")&&has(files.themes,'o.borderWidth=0')&&has(files.themes,"i.backgroundColor=C('#000000',0)"));
check('footer is flat and neutral',has(files.themes,'f.backgroundColor=C(t.panelDeep,.94)'));
check('secondary pills remain flat',has(files.themes,'p.backgroundColor=C(t.panelDeep,.96)'));

// Expanded-club readability guard: selective rescue, never global decoration.
check('readability guard is scoped to expanded clubs',has(files.readability,'new Set([5,524,98,65])')&&has(files.readability,'cpReadabilityIsExtra'));
check('readability guard selectively rescues Juventus crest',has(files.readability,"new Set(['JUV'])")&&has(files.readability,"backgroundColor=C('#D7DEE8',.20)")&&has(files.readability,"backgroundColor=C('#CBD5E1',.24)"));
check('readability guard does not add global white crest circles',!has(files.readability,"backgroundColor=C('#FFFFFF',1)")&&!has(files.readability,'cornerRadius=(size+4)/2'));
check('readability guard standardizes compact names',has(files.readability,'function cpCompactOpponentName')&&has(files.readability,"'パリ・サンジェルマン':'PSG'")&&has(files.readability,"'バイエルン・ミュンヘン':'バイエルン'"));
check('readability guard uses ellipsis for long labels',has(files.readability,"n.slice(0,max-1)+'…'"));

// Man U legacy state behavior retained while visual identity is shared.
check('Man U legacy renderer remains scoped to team 66',has(files.manutd,'club?.team===66'));
check('top-layout remains Man U scoped',has(files.top,'if(!CP_MU_IS())return CP_TOP_LAYOUT_BASE_MATCH_MEDIUM')&&has(files.top,'if(!CP_MU_IS())return CP_TOP_LAYOUT_BASE_MATCH_SMALL'));
check('Man U latest result sync remains',has(files.manutd,'CP_FORM_VIEW')&&has(files.manutd,"toLowerCase()==='post'"));

// Competition identity remains shared.
check('competition registry has PL',has(files.comp,'PL:{id:39}'));
check('competition registry has LaLiga',has(files.comp,'PD:{id:140}'));
check('competition registry has Champions League',has(files.comp,'CL:{id:2}'));
check('competition registry has Copa del Rey',has(files.comp,'CDR:{id:143}'));
check('competition renderer remains club-independent',has(files.comp,'function competitionPill('));

// Core / state behavior.
for(const mode of ['live','post','cl','fa','efl'])check(`core supports QA ${mode}`,has(files.core,`mode==='${mode}'`)||has(files.core,`qa==='${mode}'`));
check('core has LaLiga competition mapping',has(files.core,"PD:'ラ・リーガ'"));
check('core has Real Madrid Japanese alias',has(files.core,"'Real Madrid CF':'レアル・マドリード'"));
check('core has stale cache fallback',has(files.core,'if(c)return{...c,stale:true}'));
check('core has API daily quota guard',has(files.core,'API_DAILY_BUDGET'));
check('core separates live API token in Keychain',has(files.core,'clubpulse_api_football_token_v1'));

// Resilience should inherit any active shared theme.
check('resilience uses shared active theme',has(files.resilience,"typeof CP_ACTIVE_THEME==='function'")&&has(files.resilience,'CP_ACTIVE_THEME()'));
check('resilience still protects Man U state theme',has(files.resilience,"typeof CP_MU_IS==='function'&&CP_MU_IS()"));
check('resilience keeps offline-with-cache QA',has(files.resilience,"qa==='offline'")&&has(files.resilience,'stale:true'));
check('resilience keeps no-cache QA',has(files.resilience,"qa==='nocache'")&&has(files.resilience,'保存データがありません'));
check('resilience schedules retry',has(files.resilience,'refreshAfterDate')&&has(files.resilience,'5*60*1000'));

// Obsolete decorative-line implementation must not return.
check('obsolete edge-safe patch file is deleted',!fs.existsSync(path.join(root,'club-pulse-edge-safe-identity-patch.js')));
check('obsolete edge-safe QA file is deleted',!fs.existsSync(path.join(root,'club-pulse-edge-safe.test.js')));

if(failed){console.error(`\nClub Pulse contract QA FAILED: ${failed} check(s)`);process.exit(1)}
console.log('\nClub Pulse readability-first shared-theme contract QA PASSED');
