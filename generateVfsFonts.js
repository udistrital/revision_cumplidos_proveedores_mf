const fs = require('fs');
const path = require('path');
const pdfmake = require('pdfmake');

const fontsPath = './src/assets/fonts'; // Cambia la ruta según la ubicación de tus fuentes
const outputFilePath = './src/assets/vfs_fonts.js';

const fonts = fs.readdirSync(fontsPath).reduce((acc, fontFile) => {
  const fontPath = path.join(fontsPath, fontFile);
  const fontName = path.basename(fontFile, path.extname(fontFile));
  acc[fontName] = fs.readFileSync(fontPath).toString('base64');
  return acc;
}, {});

const vfsContent = `export const vfs = ${JSON.stringify(fonts, null, 2)};`;

fs.writeFileSync(outputFilePath, vfsContent);

console.log(`Archivo vfs_fonts.js generado en: ${outputFilePath}`);
