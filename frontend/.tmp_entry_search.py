from pathlib import Path
import re
path = Path('.output/public/assets/index-wUEYUKuJ.js')
text = path.read_text('utf-8', errors='ignore')
for key in ['createRoot(', 'hydrateRoot(', 'ReactDOM.createRoot', 'ReactDOM.hydrateRoot', 'StartClient', 'window.$_TSR', 'import "./ssr-init"']:
    idx = text.find(key)
    print(key, idx)
    if idx != -1:
        start = max(0, idx - 120)
        end = min(len(text), idx + 120)
        print(text[start:end])
        print('---')

# Search for main.tsx content by looking for import and if branch strings
for pat in ['const rootElement = document.getElementById("root")', 'rootElement && !rootElement.innerHTML', 'ReactDOM.hydrateRoot']:
    idx = text.find(pat)
    print('PATTERN', pat, idx)
    if idx != -1:
        start = max(0, idx - 120)
        end = min(len(text), idx + 240)
        print(text[start:end])
        print('---')
