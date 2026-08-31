const fs=require('fs');
const path=require('path');
const src=fs.readFileSync(path.join(__dirname,'club-pulse.js'),'utf8');
let failed=0;
function check(name,ok){if(ok)console.log(`✓ ${name}`);else{console.error(`✗ ${name}`);failed++}}
check('launcher pins core to immutable commit',src.includes('30a2b7f1b5c58d4ffa7e91047b637692c3cac7ce/scriptable/club-pulse-core.js'));
check('launcher uses core v2 local cache',src.includes('ClubPulseCore_v2.js')&&src.includes("CORE+'?v=core2'"));
check('launcher uses resilience v6 local cache',src.includes('ClubPulseResiliencePatch_v6.js'));
check('launcher fetch tag is resilience6',src.includes("'resilience6'"));
check('launcher pins resilience v6 commit',src.includes('968fd0308afd6ea0998d8317357d86af9d8aa0c3'));
check('launcher uses data policy v6 local cache',src.includes('ClubPulseDataPolicyPatch_v6.js'));
check('launcher fetch tag is data-policy6',src.includes("'data-policy6'"));
check('launcher pins data policy v6 commit',src.includes('c274078e2cd1742a61fe9c3548d54f703a84ebc5'));
check('launcher uses small presentation v4 local cache',src.includes('ClubPulseSmallPresentationPatch_v4.js'));
check('launcher fetch tag is small-presentation4',src.includes("'small-presentation4'"));
check('launcher pins small presentation v4 commit',src.includes('e231b5a7c67b9edd31073f83e8b640f489cfefb7'));
check('launcher uses wave2 clubs v1 local cache',src.includes('ClubPulseWave2ClubsPatch_v1.js')&&src.includes("'wave2-clubs1'"));
check('launcher uses wave2 themes v3 local cache',src.includes('ClubPulseWave2ThemesPatch_v3.js')&&src.includes("'wave2-themes3'"));
check('launcher pins wave2 clubs and themes to immutable commits',src.includes('c53a62e6308fb99d6605d9b6c8d960869140dd46/scriptable/club-pulse-wave2-clubs-patch.js')&&src.includes('64a0facd6a963a08f900a171540bd9a6dabfa15a/scriptable/club-pulse-wave2-themes-patch.js'));
check('wave2 club registry injects before core parameter resolution',src.includes("c=c.slice(0,pk)+cr+'\\n'+ec+'\\n'+w2c+'\\n'+c.slice(pk)"));
check('wave2 themes run after small presentation',src.includes("+dp+'\\n'+sp+'\\n'+w2t"));
check('patch loader remains local-first',src.includes("if(F.fileExists(file)){let s=F.readString(file);if(s&&s.length>=min)return s}"));
check('launcher documents 40-club architecture',src.includes('Club Pulse 40-club runtime')&&src.includes('Wave 2 adds 29 Big Five clubs'));
if(failed){console.error(`\nLauncher version QA FAILED: ${failed}`);process.exit(1)}
console.log('\nClub Pulse 40-club launcher version QA PASSED');
