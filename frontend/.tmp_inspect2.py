from pathlib import Path
from re import search

path = Path('.output/public/assets/index-wUEYUKuJ.js')
text = path.read_text('utf-8', errors='ignore')
pos = text.find('async function rs(e)')
print('pos', pos)
if pos == -1:
    for func in ['async function rs(', 'function rs(', 'rs (']:
        i = text.find(func)
        print('find', func, i)
    raise SystemExit(1)
start = max(0, pos - 400)
end = pos + 800
snippet = text[start:end]
print('--- SNIPPET ---')
print(snippet)
print('--- END ---')

# also find the exact line by counting newlines
line = text[:pos].count('\n') + 1
print('line', line)

# inspect window.$_TSR initialization portion
for pat in ['window.$_TSR', 'window.$_TSR.buffer', 'window.$_TSR.h', 'window.$_TSR.e', 'window.$_TSR.c', 'window.$_TSR.p']:
    p = text.find(pat)
    print(pat, p)
