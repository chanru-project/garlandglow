import fs from 'node:fs';
import path from 'node:path';

const distDir = path.resolve('dist');
const outputPublicDir = path.resolve('.output/public');
const assetsDir = path.join(distDir, 'assets');

if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
}
if (!fs.existsSync(outputPublicDir)) {
  fs.mkdirSync(outputPublicDir, { recursive: true });
}

let cssFile = '';
let entryJs = '';

if (fs.existsSync(assetsDir)) {
  const files = fs.readdirSync(assetsDir);
  cssFile = files.find(f => f.startsWith('styles-') && f.endsWith('.css')) || files.find(f => f.endsWith('.css')) || '';
  
  entryJs = files.find(f => f.startsWith('main-') && f.endsWith('.js'))
    || files.find(f => f.startsWith('index-') && f.endsWith('.js'))
    || files.filter(f => f.endsWith('.js')).sort((a, b) => fs.statSync(path.join(assetsDir, b)).size - fs.statSync(path.join(assetsDir, a)).size)[0]
    || '';
}

const scriptInjection = entryJs ? `<script type="module" src="/assets/${entryJs}"></script>` : '';
const cssInjection = cssFile ? `<link rel="stylesheet" href="/assets/${cssFile}">` : '';

const tsrBootstrap = `<script>window.$_TSR=window.$_TSR||{};window.$_TSR.router=window.$_TSR.router||{manifest:{routes:{}},matches:[],dehydratedData:{},lastMatchId:undefined};window.$_TSR.buffer=window.$_TSR.buffer||[];window.$_TSR.h=window.$_TSR.h||(()=>{});window.$_TSR.e=window.$_TSR.e||(()=>{});window.$_TSR.c=window.$_TSR.c||(()=>{});window.$_TSR.p=window.$_TSR.p||((cb)=>{try{cb()}catch{}});</script>`;

const htmlContent = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Malligai — Fresh Garlands & Flowers for Every Occasion</title>
    <link rel="icon" href="/favicon.ico" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
    <link
      href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=Inter:wght@400;500;600;700&display=swap"
      rel="stylesheet"
    />
    ${cssInjection}
    ${tsrBootstrap}
  </head>
  <body>
    <div id="root"></div>
    ${scriptInjection}
  </body>
</html>`;

// Write to dist/ for static SPA deployment
fs.writeFileSync(path.join(distDir, 'index.html'), htmlContent);
fs.writeFileSync(path.join(distDir, '200.html'), htmlContent);
fs.writeFileSync(path.join(distDir, '404.html'), htmlContent);

// Write to .output/public/ for Nitro server static fallback
fs.writeFileSync(path.join(outputPublicDir, 'index.html'), htmlContent);
fs.writeFileSync(path.join(outputPublicDir, '200.html'), htmlContent);
fs.writeFileSync(path.join(outputPublicDir, '404.html'), htmlContent);

// Patch Nitro's renderer template chunk if present so Nitro serves valid script references
const rendererChunkPath = path.resolve('.output/server/_chunks/renderer-template.mjs');
if (fs.existsSync(rendererChunkPath)) {
  let chunkContent = fs.readFileSync(rendererChunkPath, 'utf-8');
  if (chunkContent.includes('/src/main.tsx')) {
    const tsrBootstrap = `<script>window.$_TSR=window.$_TSR||{};window.$_TSR.router=window.$_TSR.router||{manifest:{routes:{}},matches:[],dehydratedData:{},lastMatchId:undefined};window.$_TSR.buffer=window.$_TSR.buffer||[];window.$_TSR.h=window.$_TSR.h||(()=>{});window.$_TSR.e=window.$_TSR.e||(()=>{});window.$_TSR.c=window.$_TSR.c||(()=>{});window.$_TSR.p=window.$_TSR.p||((cb)=>{try{cb()}catch{}});</script>`;
    const rawReplacement = `${cssInjection}${tsrBootstrap}${scriptInjection}`;
    const escapedReplacement = rawReplacement.replace(/"/g, '\\"');

    const targetStr1 = '<script type="module" src="/src/main.tsx"></script>';
    const targetStr2 = `<script type=\\"module\\" src=\\"/src/main.tsx\\"><\\/script>`;

    chunkContent = chunkContent.split(targetStr1).join(rawReplacement);
    chunkContent = chunkContent.split(targetStr2).join(escapedReplacement);

    fs.writeFileSync(rendererChunkPath, chunkContent, 'utf-8');
    console.log('Successfully patched .output/server/_chunks/renderer-template.mjs');
  }
}



// Create dist/server/server.js compatibility wrapper pointing to Nitro's server entry
const serverDir = path.join(distDir, 'server');
if (!fs.existsSync(serverDir)) {
  fs.mkdirSync(serverDir, { recursive: true });
}
fs.writeFileSync(
  path.join(serverDir, 'server.js'),
  `// Compatibility entry for Nitro server build\nimport '../../.output/server/index.mjs';\n`
);

console.log('Successfully generated index.html in dist and .output/public for deployment!');


