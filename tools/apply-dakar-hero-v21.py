from pathlib import Path
import json
import re

widget_path = Path('dakar-widget.js')
widget = widget_path.read_text()

old_block = """const HERO_VARIANTS=[
 {label:'PHOTO 1',filename:'Dacia Sandrider GIMS 2024 1X7A2026.jpg',urls:[
  'https://commons.wikimedia.org/wiki/Special:Redirect/file/Dacia%20Sandrider%20GIMS%202024%201X7A2026.jpg?width=2048',
  'https://commons.wikimedia.org/wiki/Special:Redirect/file/Dacia%20Sandrider%20GIMS%202024%201X7A2026.jpg?width=1280'
 ],focus:.58,zoom:1,smallShift:18,mediumShift:70},
 {label:'PHOTO 2',filename:'Dacia Sandrider GIMS 2024 1X7A2028.jpg',urls:[
  'https://commons.wikimedia.org/wiki/Special:Redirect/file/Dacia%20Sandrider%20GIMS%202024%201X7A2028.jpg?width=2048',
  'https://commons.wikimedia.org/wiki/Special:Redirect/file/Dacia%20Sandrider%20GIMS%202024%201X7A2028.jpg?width=1280'
 ],focus:.56,zoom:1.03,smallShift:10,mediumShift:45},
 {label:'PHOTO 3',filename:'Dacia Sandrider GIMS 2024 1X7A2029.jpg',urls:[
  'https://commons.wikimedia.org/wiki/Special:Redirect/file/Dacia%20Sandrider%20GIMS%202024%201X7A2029.jpg?width=2048',
  'https://commons.wikimedia.org/wiki/Special:Redirect/file/Dacia%20Sandrider%20GIMS%202024%201X7A2029.jpg?width=1280'
 ],focus:.52,zoom:1.02,smallShift:20,mediumShift:70}
];"""

new_block = """const HERO_VARIANTS=[
 {label:'PHOTO 1',filename:'Dacia Sandrider GIMS 2024 1X7A2026.jpg',urls:[
  'https://commons.wikimedia.org/wiki/Special:Redirect/file/Dacia%20Sandrider%20GIMS%202024%201X7A2026.jpg?width=2048',
  'https://commons.wikimedia.org/wiki/Special:Redirect/file/Dacia%20Sandrider%20GIMS%202024%201X7A2026.jpg?width=1280'
 ],focus:.58,zoom:1,smallShift:18,mediumShift:70},
 {label:'PHOTO 2',filename:'Dakar Rally 2021 - Stage 05 (50810898083).jpg',urls:[
  'https://commons.wikimedia.org/wiki/Special:Redirect/file/Dakar%20Rally%202021%20-%20Stage%2005%20%2850810898083%29.jpg?width=2048',
  'https://commons.wikimedia.org/wiki/Special:Redirect/file/Dakar%20Rally%202021%20-%20Stage%2005%20%2850810898083%29.jpg?width=1280'
 ],focus:.50,zoom:1.02,smallShift:0,mediumShift:12},
 {label:'PHOTO 3',filename:'Dakar Rally 2021 - Stage 10 (50832314671).jpg',urls:[
  'https://commons.wikimedia.org/wiki/Special:Redirect/file/Dakar%20Rally%202021%20-%20Stage%2010%20%2850832314671%29.jpg?width=2048',
  'https://commons.wikimedia.org/wiki/Special:Redirect/file/Dakar%20Rally%202021%20-%20Stage%2010%20%2850832314671%29.jpg?width=1280'
 ],focus:.50,zoom:1.02,smallShift:0,mediumShift:0}
];"""

if old_block not in widget:
    raise SystemExit('Expected Dakar HERO_VARIANTS block not found; refusing unsafe rewrite')
widget = widget.replace(old_block, new_block, 1)
for old, new in [
    ('// Motorsport Hub v9.5.2-hardening — DAKAR dedicated rally-raid module', '// Motorsport Hub v9.5.3-hardening — DAKAR dedicated rally-raid module'),
    ('// Tap Action v2: tap widget to cycle three distinct persisted Hero photos; Medium DAKAR badge opens official site.', '// Tap Action v2.1: tap widget to cycle visually distinct persisted Hero photos (show car + Dakar action); Medium DAKAR badge opens official site.'),
    ("const V='9.5.2-hardening'", "const V='9.5.3-hardening'"),
    ('// Hero photo set: Alexander-93 Dacia Sandrider GIMS 2024 series. Exact source pages are tracked in hero-assets.json.', '// Hero photo set: current Dacia Sandrider design reference + two licensed Dakar action frames. Exact source pages are tracked in hero-assets.json.'),
    ('MotorsportHub/9.5.2', 'MotorsportHub/9.5.3'),
    ('motorsport-hero-v952-', 'motorsport-hero-v953-'),
    ('&v=952', '&v=953'),
]:
    if old not in widget:
        raise SystemExit(f'Expected widget token missing: {old}')
    widget = widget.replace(old, new)
widget_path.write_text(widget)

manifest_path = Path('hero-assets.json')
manifest = json.loads(manifest_path.read_text())
replacements = {
    'dakar-dacia-sandrider-gims-2024-photo2': {
        'assetId': 'dakar-2021-stage05-action',
        'category': 'DAKAR',
        'filename': 'Dakar Rally 2021 - Stage 05 (50810898083).jpg',
        'runtimeUrls': [
            'https://commons.wikimedia.org/wiki/Special:Redirect/file/Dakar%20Rally%202021%20-%20Stage%2005%20%2850810898083%29.jpg?width=2048',
            'https://commons.wikimedia.org/wiki/Special:Redirect/file/Dakar%20Rally%202021%20-%20Stage%2005%20%2850810898083%29.jpg?width=1280'
        ],
        'sourcePage': 'https://commons.wikimedia.org/wiki/File:Dakar_Rally_2021_-_Stage_05_(50810898083).jpg',
        'author': 'EKSRX (source photo credit: Eric Vargiolu / DPPI)',
        'license': 'CC BY 2.0',
        'modificationNoticeRequired': True,
        'reviewNote': 'Exact Wikimedia file page verified 2026-08-27; Commons records Flickr license review as CC BY 2.0.'
    },
    'dakar-dacia-sandrider-gims-2024-photo3': {
        'assetId': 'dakar-2021-stage10-action',
        'category': 'DAKAR',
        'filename': 'Dakar Rally 2021 - Stage 10 (50832314671).jpg',
        'runtimeUrls': [
            'https://commons.wikimedia.org/wiki/Special:Redirect/file/Dakar%20Rally%202021%20-%20Stage%2010%20%2850832314671%29.jpg?width=2048',
            'https://commons.wikimedia.org/wiki/Special:Redirect/file/Dakar%20Rally%202021%20-%20Stage%2010%20%2850832314671%29.jpg?width=1280'
        ],
        'sourcePage': 'https://commons.wikimedia.org/wiki/File:Dakar_Rally_2021_-_Stage_10_(50832314671).jpg',
        'author': 'EKSRX (source photo credit: Antonin Vincent / DPPI)',
        'license': 'CC BY 2.0',
        'modificationNoticeRequired': True,
        'reviewNote': 'Exact Wikimedia file page verified 2026-08-27; Commons records Flickr license review as CC BY 2.0.'
    }
}
seen = set()
for i, asset in enumerate(manifest.get('assets', [])):
    aid = asset.get('assetId')
    if aid in replacements:
        manifest['assets'][i] = replacements[aid]
        seen.add(aid)
if seen != set(replacements):
    raise SystemExit(f'Expected manifest Dakar assets missing: {set(replacements)-seen}')
manifest['auditedAt'] = '2026-08-27'
manifest_path.write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + '\n')

tap_path = Path('tests/tap-action-gate.mjs')
tap = tap_path.read_text()
old_tokens = "'1X7A2028.jpg','1X7A2029.jpg'"
new_tokens = "'50810898083).jpg','50832314671).jpg'"
if old_tokens not in tap or "p.includes('motorsport-hero-v952-')" not in tap:
    raise SystemExit('Expected tap-action gate tokens missing')
tap = tap.replace(old_tokens, new_tokens, 1)
tap = tap.replace("p.includes('motorsport-hero-v952-')", "p.includes('motorsport-hero-v953-')")
tap_path.write_text(tap)

attr_path = Path('ATTRIBUTION.md')
attr = attr_path.read_text()
attr = attr.replace('Scope: current v9.5.2 hardening build / 12 category hero assets used by the Scriptable widget.', 'Scope: current v9.5.3 hardening build / 12 category hero assets used by the Scriptable widget.', 1)
new_dakar = '''## Dakar Rally — Tap Action v2.1
The widget cycles three visually distinct Hero photos: one current Dacia Sandrider design reference plus two real Dakar action frames.

### Hero 1 — current car identity
- **Dacia Sandrider GIMS 2024 1X7A2026.jpg**.
- Author: **Alexander-93**.
- License: **CC BY-SA 4.0 International** — exact file page verified.
- Original resolution: 5,378 × 3,588.
- File page: https://commons.wikimedia.org/wiki/File:Dacia_Sandrider_GIMS_2024_1X7A2026.jpg

### Hero 2 — action
- **Dakar Rally 2021 - Stage 05 (50810898083).jpg**.
- Commons author: **EKSRX**; source metadata credits **Eric Vargiolu / DPPI**.
- License: **CC BY 2.0 Generic** — exact Commons file page verified; Flickr license review recorded by Commons.
- Original resolution: 4,800 × 3,194.
- File page: https://commons.wikimedia.org/wiki/File:Dakar_Rally_2021_-_Stage_05_(50810898083).jpg

### Hero 3 — action / environmental variation
- **Dakar Rally 2021 - Stage 10 (50832314671).jpg**.
- Commons author: **EKSRX**; source metadata credits **Antonin Vincent / DPPI**.
- License: **CC BY 2.0 Generic** — exact Commons file page verified; Flickr license review recorded by Commons.
- Original resolution: 4,800 × 3,200.
- File page: https://commons.wikimedia.org/wiki/File:Dakar_Rally_2021_-_Stage_10_(50832314671).jpg

All three widget variants are cropped/resized and darkened for presentation. Attribution and modification notice obligations remain applicable where required.

'''
attr, count = re.subn(r'## Dakar Rally — Tap Action v2\n.*?(?=## Audit decision)', new_dakar, attr, count=1, flags=re.S)
if count != 1:
    raise SystemExit('Expected ATTRIBUTION Dakar section not found')
old_audit = '''- Dakar Tap Action v2 runtime inventory: **PASS**.
- Dakar Hero 1 exact-page licensing: **PASS**.
- Dakar Hero 2/3 exact-page license verification: **PENDING BEFORE PUBLIC RELEASE**.
- Current hardening build may continue development/testing; **public licensing approval is not yet granted for the new three-photo Dakar rotation**.'''
new_audit = '''- Dakar Tap Action v2.1 runtime inventory: **PASS**.
- Dakar Hero 1/2/3 exact-page license metadata verification: **PASS**.
- Public release remains blocked by the overall Release/QA process; the selected Dakar Hero records no longer carry a pending exact-page-license check.'''
if old_audit not in attr:
    raise SystemExit('Expected Dakar audit block not found')
attr = attr.replace(old_audit, new_audit, 1)
attr_path.write_text(attr)

print('Dakar Hero v2.1 patch applied')
