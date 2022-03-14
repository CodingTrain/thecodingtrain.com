const fs = require('fs');
const { optimize } = require('svgo');

const config = {
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

fs.readdir('.', (err, files) => {
  files.forEach((file) => {
    if (!file.includes('.mini.') && !file.includes('.js')) {
      const data = fs.readFileSync(file, 'utf8');
      const result = optimize(data, config);
      const optimizedSvgString = result.data;
      const [name, extension] = file.split('.');
      fs.writeFileSync(`${name}.mini.${extension}`, optimizedSvgString);
    }
  });
});
