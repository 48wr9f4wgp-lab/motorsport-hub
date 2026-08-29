const fs = require('fs');
const path = require('path');

const root = __dirname;
const read = name => fs.readFileSync(path.join(root, name), 'utf8');
const files = {
  launcher: read('club-pulse.js'),
  loader: read('loader.js'),
  core: read('club-pulse-core.js'),
  ui: read('club-pulse-ui-patch.js'),
  comp: read('club-pulse-competition-logo-patch.js'),
  theme: read('club-pulse-manutd-theme-patch.js'),
  topLayout: read('club-pulse-top-layout-patch.js'),
  liveContext: read('club-pulse-live-context-patch.js'),
  resilience: read('club-pulse-resilience-patch.js'),
};
const combined = Object.values(files).join('\n');

let failed = 0;
function check(name, condition) {
  if (condition) console.log(`✓ ${name}`);
  else { console.error(`✗ ${name}`); failed++; }
}
function has(src, token) { return src.includes(token); }
function syntax(name, src) {
  try {
    new Function(`return (async()=>{\n${src}\n})`);
    check(`${name}: syntax`, true);
  } catch (e) {
    console.error(`${name}: ${e.message}`);
    check(`${name}: syntax`, false);
  }
}

for (const [name, src] of Object.entries(files)) syntax(name, src);

check('launcher loads core', has(files.launcher, 'club-pulse-core.js'));
check('launcher loads stable UI patch', has(files.launcher, 'club-pulse-ui-patch.js'));
check('launcher loads competition logo patch', has(files.launcher, 'club-pulse-competition-logo-patch.js'));
check('launcher loads Manchester United theme patch', has(files.launcher, 'club-pulse-manutd-theme-patch.js'));
check('launcher loads top-layout patch', has(files.launcher, 'club-pulse-top-layout-patch.js'));
check('launcher loads top-layout v2 cache', has(files.launcher, 'ClubPulseTopLayoutPatch_v2.js') && has(files.launcher, "'toplayout2'"));
check('launcher loads LIVE context patch', has(files.launcher, 'club-pulse-live-context-patch.js'));
check('launcher loads resilience patch', has(files.launcher, 'club-pulse-resilience-patch.js'));
check('launcher exposes only resilience compatibility submenu', has(files.launcher, 'Club Pulse 耐障害QA') && has(files.launcher, '通信障害・保存あり') && has(files.launcher, '通信障害・保存なし') && !has(files.launcher, 'LIVE 67分 2-1'));
check('launcher has remote-to-local fallback', has(files.launcher, 'if(F.fileExists(file))return F.readString(file)'));
check('launcher injects patches before runtime marker', has(files.launcher, "M='if(config.runsInApp&&!getLiveToken())await setupLiveToken();'"));
check('launcher inject order is UI -> competition -> theme -> top layout -> live -> resilience', has(files.launcher, "+'\\n'+x+'\\n'+y+'\\n'+z+'\\n'+u+'\\n'+q+'\\n'+r+'\\n'"));
check('launcher persists QA override', has(files.launcher, 'ClubPulseQAOverride_v1.json') && has(files.launcher, '15*60*1000'));

for (const mode of ['live','post','cl','fa','efl']) {
  check(`core supports QA mode ${mode}`, has(files.core, `mode==='${mode}'`) || has(files.core, `qa==='${mode}'`));
}
check('core supports normal/auto mode', has(files.core, "qa==='auto'"));
check('loader exposes offline-cache QA', has(files.loader, "'offline'") && has(files.loader, '通信障害・保存あり'));
check('loader exposes no-cache QA', has(files.loader, "'nocache'") && has(files.loader, '通信障害・保存なし'));
check('runtime has Small renderer', has(combined, 'buildMatchSmall'));
check('runtime has Medium renderer', has(combined, 'buildMatchMedium'));
check('core contains stale-cache fallback', has(files.core, 'if(c)return{...c,stale:true}'));
check('core contains no-cache error widget', has(files.core, 'errorWidget'));
check('core applies API daily quota guard', has(files.core, 'API_DAILY_BUDGET'));
check('core separates live API token in Keychain', has(files.core, 'clubpulse_api_football_token_v1'));

check('resilience forces cached offline state without deleting cache', has(files.resilience, "qa==='offline'") && has(files.resilience, 'readJSON(cachePath())') && has(files.resilience, 'stale:true'));
check('resilience forces no-cache failure without deleting real cache', has(files.resilience, "qa==='nocache'") && !has(files.resilience, 'remove(cachePath'));
check('resilience shows stale marker on Small', has(files.resilience, "text(s,'保存'"));
check('resilience gives safe no-cache copy', has(files.resilience, '保存データがありません') && has(files.resilience, '次回更新で自動再試行します'));
check('resilience error widget schedules retry', has(files.resilience, 'refreshAfterDate') && has(files.resilience, '5*60*1000'));

check('UI patch keeps compact Small team names', has(files.ui, 'smallTeamName'));
check('UI patch highlights latest form result', has(files.ui, 'latest?1:.5') || has(files.ui, 'latest?1'));
check('UI patch uses safe crest scale for Man U', /66:\.91/.test(files.ui));

check('competition patch has league/cup asset map', has(files.comp, 'CP_COMP_ASSETS'));
check('competition patch uses API-Sports league CDN', has(files.comp, 'media.api-sports.io/football/leagues/'));
check('competition patch overrides competition pill', has(files.comp, 'function competitionPill('));
check('competition patch has local image fallback', has(files.comp, 'cpCompetitionLogoImage'));
check('competition patch tolerates missing competition image', has(files.comp, 'if(logo){'));
for (const mark of ['PL','CL','FAC','EFL']) check(`competition patch covers ${mark}`, has(files.comp, mark));

check('Man U theme is scoped to team 66', has(files.theme, 'club?.team===66'));
check('Man U theme preserves non-ManU base theme', has(files.theme, 'if(!CP_MU_IS())'));
check('Man U theme adds gold accent', has(files.theme, "gold:'#E7B93F'"));
check('Man U theme overrides both Small and Medium match cards', has(files.theme, 'buildMatchSmall=function') && has(files.theme, 'buildMatchMedium=function'));
check('Man U theme keeps competition colors delegated', !has(files.theme, 'competitionPill=function'));
check('POST QA synchronizes latest form result', has(files.theme, 'CP_FORM_VIEW') && has(files.theme, "toLowerCase()==='post'") && has(files.theme, 'f[0]=r'));

check('top-layout patch is Man U scoped', has(files.topLayout, 'if(!CP_MU_IS())return CP_TOP_LAYOUT_BASE_MATCH_MEDIUM') && has(files.topLayout, 'if(!CP_MU_IS())return CP_TOP_LAYOUT_BASE_MATCH_SMALL'));
check('top-layout patch groups state and competition on left rail', has(files.topLayout, 'cpMuTopInfoRail') && has(files.topLayout, 'competitionPill(left,m,small)'));
check('top-layout patch keeps home/away on right rail', has(files.topLayout, 'sidePill(top,m,small)'));
check('top-layout patch compacts Medium card vertically', has(files.topLayout, 'c.setPadding(4,10,3,10)') && has(files.topLayout, 'c.addSpacer(2)'));
check('top-layout patch compacts Small card vertically', has(files.topLayout, 'c.setPadding(5,7,4,7)') && has(files.topLayout, 'logoSize:38'));
check('top-layout patch owns bounded Medium widget spacing', has(files.topLayout, 'buildMedium=function') && has(files.topLayout, 'w.setPadding(4,10,4,10)') && has(files.topLayout, 'w.addSpacer(1)'));
check('top-layout patch owns bounded Small widget spacing', has(files.topLayout, 'buildSmall=function') && has(files.topLayout, 'w.setPadding(7,8,7,8)') && has(files.topLayout, 'w.addSpacer(1)'));
check('top-layout patch aligns Medium header inward without extra vertical padding', has(files.topLayout, 'h.setPadding(0,3,0,3)'));

if (failed) {
  console.error(`\nClub Pulse contract QA FAILED: ${failed} check(s)`);
  process.exit(1);
}
console.log('\nClub Pulse contract QA PASSED');
