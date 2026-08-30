const fs=require('fs');
const path=require('path');
const src=fs.readFileSync(path.join(__dirname,'club-pulse-edge-safe-identity-patch.js'),'utf8');
let failed=0;
function check(name,ok){if(ok)console.log(`✓ ${name}`);else{console.error(`✗ ${name}`);failed++}}
try{new Function(`return (async()=>{\n${src}\n})`);check('edge-safe patch syntax',true)}catch(e){console.error(e.message);check('edge-safe patch syntax',false)}
check('uses horizontal edge rails',src.includes('g.startPoint=new Point(0,.5)')&&src.includes('g.endPoint=new Point(1,.5)'));
check('keeps center decoration-free',src.includes("g.locations=[0,.022,.060,.110,.50,.890,.940,.978,1]"));
check('strengthens Barcelona purple',src.includes("barca.cardPanel='#32165F'")&&src.includes("barca.cardGlow='#54219C'")&&src.includes("barca.linePrimary='#8B5CF6'"));
check('does not alter shared outer shell',!src.includes('bg=function'));
check('overrides inner card only',src.includes('cardBg=function(mode)'));
if(failed){console.error(`\nEdge-safe identity QA FAILED: ${failed} check(s)`);process.exit(1)}
console.log('\nEdge-safe identity QA PASSED');
