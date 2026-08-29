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
  top:read('club-pulse-top-layout-patch.js'),
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
check('launcher injects registry before parameter resolution',has(files.launcher,"PM='const param=String(args.widgetParameter'")&&has(files.launcher,"c=c.slice(0,pk)+cr+'\\n'+c.slice(pk)"));
check('launcher loads club registry v2 cache',has(files.launcher,'ClubPulseClubRegistryPatch_v2.js')&&has(files.launcher,"'clubs2'"));
check('launcher loads stable UI',has(files.launcher,'club-pulse-ui-patch.js'));
check('launcher loads competition registry',has(files.launcher,'club-pulse-competition-logo-patch.js'));
check('launcher keeps frozen Man U theme',has(files.launcher,'club-pulse-manutd-theme-patch.js'));
check('launcher loads shared theme registry',has(files.launcher,'THEME_REGISTRY_PATCH')&&has(files.launcher,'club-pulse-theme-registry-patch.js'));
check('launcher loads theme registry v2 cache',has(files.launcher,'ClubPulseThemeRegistryPatch_v2.js')&&has(files.launcher,"'themes2'"));
check('launcher theme order is UI -> competition -> ManU -> shared themes -> top layout',has(files.launcher,"patches=x+'\\n'+y+'\\n'+z+'\\n'+tr+'\\n'+u"));
check('launcher loads resilience v2',has(files.launcher,'ClubPulseResiliencePatch_v2.js')&&has(files.launcher,"'resilience2'"));
check('launcher keeps remote-to-local fallback',has(files.launcher,'if(F.fileExists(file))return F.readString(file)'));
check('launcher keeps QA override persistence',has(files.launcher,'ClubPulseQAOverride_v1.json')&&has(files.launcher,'15*60*1000'));

// Club registry.
check('registry defines Barcelona team 81',has(files.clubs,"CLUBS.barcelona")&&has(files.clubs,"team:81")&&has(files.clubs,"comp:'PD'"));
check('registry defines Real Madrid team 86',has(files.clubs,"CLUBS.realmadrid")&&has(files.clubs,"team:86")&&has(files.clubs,"comp:'PD'"));
check('registry has Barcelona aliases',has(files.clubs,"barca:'barcelona'")&&has(files.clubs,"fcb:'barcelona'"));
check('registry has Real Madrid aliases',has(files.clubs,"rma:'realmadrid'")&&has(files.clubs,"madrid:'realmadrid'"));
check('registry defines home venue fallbacks',has(files.clubs,'カンプ・ノウ')&&has(files.clubs,'サンティアゴ・ベルナベウ'));
check('registry uses tuned crest scales',has(files.clubs,'81:.96')&&has(files.clubs,'86:1.06'));
check('registry normalizes Malaga to Japanese',has(files.clubs,"'Málaga CF':'マラガ'")&&has(files.clubs,"'Málaga':'マラガ'"));

// Shared theme architecture.
check('shared themes include Barcelona',has(files.themes,'81:{')&&has(files.themes,"key:'barcelona'"));
check('shared themes include Real Madrid',has(files.themes,'86:{')&&has(files.themes,"key:'realmadrid'"));
check('shared themes do not duplicate Man U',!has(files.themes,'66:{'));
check('shared theme lookup is data-driven',has(files.themes,'CP_CLUB_THEME_REGISTRY[club?.team]'));
check('shared themes reuse canonical match renderers',!has(files.themes,'buildMatchMedium=function')&&!has(files.themes,'buildMatchSmall=function'));
check('shared themes customize tokens/components only',has(files.themes,'bg=function')&&has(files.themes,'cardBg=function')&&has(files.themes,'badge=function')&&has(files.themes,'buildHeaderMedium=function'));
check('Barcelona theme has Blaugrana identity',has(files.themes,"'#A50044'")&&has(files.themes,"'#004D98'")&&has(files.themes,"accent:'#EDBB00'"));
check('Barcelona registry matches theme palette',has(files.clubs,"p:'#A50044'")&&has(files.clubs,"s:'#004D98'")&&has(files.clubs,"a:'#EDBB00'"));
check('Real theme has pearl royal-blue gold identity',has(files.themes,"accent:'#FEBE10'")&&has(files.themes,"border:'#F8F4E8'")&&has(files.clubs,"p:'#F8F7F2'")&&has(files.clubs,"s:'#00529F'")&&has(files.clubs,"a:'#FEBE10'"));
check('Real theme gets pearl crest treatment',has(files.themes,"t.key==='realmadrid'?'#FFFFFF':t.accent"));

// Man U freeze / existing behavior.
check('Man U theme remains scoped to team 66',has(files.manutd,'club?.team===66'));
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
check('resilience still protects Man U theme',has(files.resilience,"typeof CP_MU_IS==='function'&&CP_MU_IS()"));
check('resilience keeps offline-with-cache QA',has(files.resilience,"qa==='offline'")&&has(files.resilience,'stale:true'));
check('resilience keeps no-cache QA',has(files.resilience,"qa==='nocache'")&&has(files.resilience,'保存データがありません'));
check('resilience schedules retry',has(files.resilience,'refreshAfterDate')&&has(files.resilience,'5*60*1000'));

if(failed){console.error(`\nClub Pulse contract QA FAILED: ${failed} check(s)`);process.exit(1)}
console.log('\nClub Pulse multi-club contract QA PASSED');
