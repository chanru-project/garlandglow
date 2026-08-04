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
let jsFiles = [];

if (fs.existsSync(assetsDir)) {
  const files = fs.readdirSync(assetsDir);
  cssFile = files.find(f => f.startsWith('styles-') && f.endsWith('.css')) || files.find(f => f.endsWith('.css')) || '';
  
  // Find all key bundle scripts
  const indexJs = files.find(f => f.startsWith('index-') && f.endsWith('.js'));
  const routerJs = files.find(f => f.startsWith('router-') && f.endsWith('.js'));
  const routesJs = files.find(f => f.startsWith('routes-') && f.endsWith('.js'));
  const mainJs = files.find(f => f.startsWith('main-') && f.endsWith('.js'));

  if (mainJs) jsFiles.push(mainJs);
  if (routerJs) jsFiles.push(routerJs);
  if (routesJs) jsFiles.push(routesJs);
  if (indexJs) jsFiles.push(indexJs);

  if (jsFiles.length === 0) {
    jsFiles = files.filter(f => f.endsWith('.js')).slice(0, 3);
  }
}

const scriptTags = jsFiles.map(file => `<script type="module" src="/assets/${file}"></script>`).join('\n    ');

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
    ${cssFile ? `<link rel="stylesheet" href="/assets/${cssFile}">` : ''}
    <script>
      window.__TSR__ = window.__TSR__ || {
        manifest: { routes: {} },
        matches: [],
        stream: null
      };
    </script>
  </head>
  <body>
    <div id="app"></div>
    <div id="root"></div>
    ${scriptTags}
  </body>
</html>`;

// Write to dist/
fs.writeFileSync(path.join(distDir, 'index.html'), htmlContent);
fs.writeFileSync(path.join(distDir, '200.html'), htmlContent);
fs.writeFileSync(path.join(distDir, '404.html'), htmlContent);

// Write to .output/public/ for Nitro server
fs.writeFileSync(path.join(outputPublicDir, 'index.html'), htmlContent);
fs.writeFileSync(path.join(outputPublicDir, '200.html'), htmlContent);
fs.writeFileSync(path.join(outputPublicDir, '404.html'), htmlContent);

// Patch Nitro's renderer template chunk if present
const rendererChunkPath = path.resolve('.output/server/_chunks/renderer-template.mjs');
if (fs.existsSync(rendererChunkPath)) {
  let chunkContent = fs.readFileSync(rendererChunkPath, 'utf-8');
  if (chunkContent.includes('/src/main.tsx')) {
    const headInjection = cssFile ? `<link rel="stylesheet" href="/assets/${cssFile}">` : '';
    const scriptInjection = jsFiles.map(file => `<script type="module" src="/assets/${file}"></script>`).join('');
    
    const targetString = String.raw`<script type=\"module\" src=\"/src/main.tsx\"><\/script>`;
    const replacementString = `${headInjection}${scriptInjection}`
      .replace(/"/g, '\\"')
      .replace(/\//g, '\\/');

    chunkContent = chunkContent.split(targetString).join(replacementString);
    chunkContent = chunkContent.replace(
      '<script type="module" src="/src/main.tsx"></script>',
      `${headInjection}${scriptInjection}`
    );

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
