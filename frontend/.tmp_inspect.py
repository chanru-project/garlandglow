from pathlib import Path
import re

bundle_path = Path('.output/public/assets/index-wUEYUKuJ.js')
print('bundle exists:', bundle_path.exists())
if not bundle_path.exists():
    raise SystemExit(1)
text = bundle_path.read_text('utf-8', errors='ignore')
idx = text.find('forEach')
print('forEach idx:', idx)
if idx != -1:
    start = max(0, idx - 300)
    end = idx + 300
    snippet = text[start:end]
    print('SNIPPET:')
    print(repr(snippet))
    print('-------')
    print(snippet)

pattern = re.compile(r'window\.\$_TSR|window\._TSR|buffer\.forEach|\$\_TSR\.buffer|window\.\$\_TSR')
for m in pattern.finditer(text):
    print('PATTERN', m.group(0), 'at', m.start())
    start = max(0, m.start() - 80)
    end = m.end() + 80
    print(text[start:end])
    break

print('--- file lines around minified line 12 ---')
with open(bundle_path, 'r', encoding='utf-8', errors='ignore') as f:
    lines = f.readlines()
for i in range(max(0, 10), min(len(lines), 20)):
    print(i+1, lines[i][:200])
