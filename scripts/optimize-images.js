/*
  Script: optimize-images.js
  Usage: yarn optimize:assets
  Losslessly compresses PNG and JPG images inside the assets folder.
*/

const imageminJpegtran = require('imagemin-jpegtran');
const imageminOptipng = require('imagemin-optipng');
const imageminPngquant = require('imagemin-pngquant');
const path = require('path');
const fs = require('fs');
const fg = require('fast-glob');

const srcDir = path.resolve(__dirname, '..', 'assets');

(async () => {
  const originals = await fg(['**/*.png', '**/*.jpg', '**/*.jpeg'], {
    cwd: srcDir,
    absolute: true,
  });
  const originalSize = originals.reduce((acc, file) => acc + fs.statSync(file).size, 0);

  const imagemin = (await import('imagemin')).default;

  const files = await imagemin([`${srcDir}/**/*.{jpg,jpeg,png}`], {
    destination: srcDir, // overwrite originals
    plugins: [
      imageminJpegtran({ progressive: true }),
      imageminOptipng({ optimizationLevel: 3 }),
      imageminPngquant({ quality: [0.8, 0.9], strip: true }),
    ],
  });

  const optimizedSize = originals.reduce((acc, file) => acc + fs.statSync(file).size, 0);
  const savings = originalSize - optimizedSize;

  console.log(
    `Optimized ${files.length} images. Saved ${(savings / 1024).toFixed(1)} KB (${(
      (savings / originalSize) *
      100
    ).toFixed(1)}%).`,
  );
})();
