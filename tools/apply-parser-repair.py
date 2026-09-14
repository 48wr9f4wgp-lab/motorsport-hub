from pathlib import Path


def replace_once(path: str, old: str, new: str) -> None:
    p = Path(path)
    text = p.read_text(encoding="utf-8")
    if new in text:
        return
    if old not in text:
        raise SystemExit(f"expected source block not found: {path}: {old[:80]!r}")
    p.write_text(text.replace(old, new, 1), encoding="utf-8")


# WEC: current official heading contains markup between heading words. Run identity
# checks against cleaned visible text, then keep the existing table parser.
replace_once("wec-widget-flat-v1000.js", "// Motorsport Hub v10.0.2-hardening", "// Motorsport Hub v10.0.4-hardening")
replace_once("wec-widget-flat-v1000.js", "const V='10.0.2-hardening'", "const V='10.0.4-hardening'")
replace_once(
    "wec-widget-flat-v1000.js",
    " {pos:1,name:'TOYOTA',points:'132 pts',maker:'TOYOTA',machine:'TR010 Hybrid',team:'TOYOTA RACING'},\n {pos:2,name:'BMW',points:'127 pts',maker:'BMW',machine:'M Hybrid V8',team:'BMW M Team WRT'},\n {pos:3,name:'FERRARI',points:'88 pts',maker:'FERRARI',machine:'499P',team:'Ferrari AF Corse'}",
    " {pos:1,name:'TOYOTA',points:'140 pts',maker:'TOYOTA',machine:'TR010 Hybrid',team:'TOYOTA RACING'},\n {pos:2,name:'BMW',points:'131 pts',maker:'BMW',machine:'M Hybrid V8',team:'BMW M Team WRT'},\n {pos:3,name:'FERRARI',points:'114 pts',maker:'FERRARI',machine:'499P',team:'Ferrari AF Corse'}",
)
replace_once(
    "wec-widget-flat-v1000.js",
    " const h=await txt(DATA_SOURCE);if(!/Manufacturers['’]?\\s*standings/i.test(h)||!/FIA Hypercar World Endurance Manufacturers/i.test(h))throw Error('WEC table identity');const a=[];",
    " const h=await txt(DATA_SOURCE),plain=clean(h);if(!/Manufacturers['’]?\\s*standings/i.test(plain)||!/FIA Hypercar World Endurance Manufacturers/i.test(plain))throw Error('WEC table identity');const a=[];",
)
replace_once(
    "tests/wec-flat-gate.mjs",
    "const validHtml=`<html><body><h1>Manufacturers' standings</h1><h2>FIA Hypercar World Endurance Manufacturers Championship</h2><table>",
    "const validHtml=`<html><body><h1><span>Manufacturers'</span><br><span>standings</span></h1><h2>FIA Hypercar <span>World Endurance</span> Manufacturers Championship</h2><table>",
)

# SUPER GT: current navigation contains GT500/GT300 before the ranking table.
# Stop slicing at the first GT300 token; identify the real ranking header and its
# total-points column, then parse only numeric ranking rows against that column.
replace_once("supergt-widget-flat-v1000.js", "// Motorsport Hub v10.0.3-hardening", "// Motorsport Hub v10.0.4-hardening")
replace_once("supergt-widget-flat-v1000.js", "const V='10.0.3-hardening'", "const V='10.0.4-hardening'")
replace_once(
    "supergt-widget-flat-v1000.js",
    " const h=await txt(DATA_SOURCE);if(!/GT\\s*500/i.test(h)||!/(?:ドライバーランキング|Driver Ranking)/i.test(h))throw Error('SUPER GT table identity');const lo=Math.max(h.search(/GT\\s*500/i),0),gt300=h.search(/GT\\s*300/i),seg=gt300>lo?h.slice(lo,gt300):h.slice(lo),a=[];\n for(const c of rows(seg)){\n  if(c.length<6)continue;const p=num(c[0]),no=String(c[1]||'').match(/\\d+/)?.[0]||'',pts=num(c[c.length-3]);if(!(p>=1&&p<=30)||!no||!isFinite(pts))continue;",
    " const h=await txt(DATA_SOURCE),plain=clean(h),tableRows=rows(h);if(!/GT\\s*500/i.test(plain)||!/(?:ドライバーランキング|Driver Ranking)/i.test(plain))throw Error('SUPER GT table identity');let totalIndex=-1;\n for(const c of tableRows){const i=c.findIndex(v=>/^(?:合計|Total(?:\\s*points?)?)$/i.test(String(v||'').trim()));if(i>=0&&c.some(v=>/(?:ドライバー|Driver)/i.test(String(v||'')))){totalIndex=i;break}}\n if(totalIndex<3)throw Error('SUPER GT total column');const a=[];\n for(const c of tableRows){\n  if(c.length<=totalIndex)continue;const p=num(c[0]),no=String(c[1]||'').match(/\\d+/)?.[0]||'',pts=num(c[totalIndex]);if(!(p>=1&&p<=30)||!no||!isFinite(pts))continue;",
)
replace_once(
    "tests/supergt-flat-gate.mjs",
    "const validHtml=`<html><body><h1>GT500 ドライバーランキング</h1><table>",
    "const validHtml=`<html><body><nav>GT500 GT300</nav><h1>GT500 ドライバーランキング</h1><table>",
)

print("branch parser repair applied")
