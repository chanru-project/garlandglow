import fs from 'node:fs';
import path from 'node:path';

const distDir = path.resolve('dist');
const assetsDir = path.join(distDir, 'assets');

if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
}

let cssFile = '';
let jsFile = '';

if (fs.existsSync(assetsDir)) {
  const files = fs.readdirSync(assetsDir);
  cssFile = files.find(f => f.startsWith('styles-') && f.endsWith('.css')) || files.find(f => f.endsWith('.css')) || '';
  jsFile = files.find(f => f.startsWith('index-') && f.endsWith('.js')) || files.find(f => f.endsWith('.js')) || '';
}

const htmlContent = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>GarlandGlow - Fresh Flowers & Custom Garlands</title>
    <link rel="icon" href="/favicon.ico" />
    ${cssFile ? `<link rel="stylesheet" href="/assets/${cssFile}">` : ''}
  </head>
  <body>
    <div id="app"></div>
    <div id="root"></div>
    ${jsFile ? `<script type="module" src="/assets/${jsFile}"></script>` : ''}
  </body>
</html>`;

fs.writeFileSync(path.join(distDir, 'index.html'), htmlContent);
fs.writeFileSync(path.join(distDir, '200.html'), htmlContent);
fs.writeFileSync(path.join(distDir, '404.html'), htmlContent);

console.log('Successfully generated dist/index.html, dist/200.html, and dist/404.html for static deployment!');
