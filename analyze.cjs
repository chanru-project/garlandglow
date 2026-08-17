const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const dir = 'E:\\garlandglow\\frontend\\src\\assets\\banner';
const files = fs.readdirSync(dir).filter(f => f.toLowerCase().endsWith('.jpeg'));

async function analyze() {
  for (const file of files) {
    const filePath = path.join(dir, file);
    const img = sharp(filePath);
    const meta = await img.metadata();
    
    const { data, info } = await img.raw().toBuffer({ resolveWithObject: true });
    
    let sumLuminance = 0;
    const pixelCount = info.width * info.height;
    
    if (info.channels === 3) {
      for (let i = 0; i < data.length; i += 3) {
        const r = data[i];
        const g = data[i+1];
        const b = data[i+2];
        const lum = 0.2126 * r + 0.7152 * g + 0.0722 * b;
        sumLuminance += lum;
      }
    } else if (info.channels === 4) {
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i+1];
        const b = data[i+2];
        const lum = 0.2126 * r + 0.7152 * g + 0.0722 * b;
        sumLuminance += lum;
      }
    } else if (info.channels === 1) {
      for (let i = 0; i < data.length; i++) {
        sumLuminance += data[i];
      }
    }
    
    const avgLuminance = sumLuminance / pixelCount;
    console.log(`File: ${file} | Width: ${meta.width} | Height: ${meta.height} | Average Luminance: ${avgLuminance.toFixed(4)}`);
  }
}

analyze().catch(err => {
  console.error(err);
});
