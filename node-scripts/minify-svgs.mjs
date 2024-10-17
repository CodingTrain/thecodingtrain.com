import fs from 'node:fs/promises';
import { optimize } from 'svgo';
import { glob } from 'glob';
import path from 'node:path';

// Find non-minified SVG imports in codebase with regex search: (\S+(?<!\.mini)\.svg)

const config = {
  multipass: true,
  plugins: [
    {
      name: 'preset-default',
      params: {
        overrides: {
          inlineStyles: {
            onlyMatchedOnce: false
          }
        }
      }
    },
    'removeStyleElement'
  ]
};

const srcImages = await glob(
  ['src/images/**/*.svg', 'static/images/**/*.svg'],
  { ignore: '**/*.mini.svg' }
);

let bytesSaved = 0;

const promises = srcImages.map(async (file) => {
  const data = await fs.readFile(file, 'utf-8');
  const result = optimize(data, config);

  if (result.error) {
    console.error(result.error);
    process.exit(1);
  }

  const sizeDelta = result.data.length - data.length;
  bytesSaved += sizeDelta;

  console.log(file);
  console.log(
    sizeDelta <= 0 ? '  🟢' : '  🟡',
    `${((sizeDelta / data.length) * 100).toFixed(2)}%`
  );
  console.log('    ', (sizeDelta / 1024).toFixed(2), 'kB');

  const { dir, name } = path.parse(file);
  const destinationFile = path.join(dir, `${name}.mini.svg`);

  await fs.writeFile(destinationFile, result.data, 'utf-8');
});

await Promise.all(promises);

console.log(
  'Done!',
  (bytesSaved / 1024).toFixed(2),
  'kB size difference total'
);
