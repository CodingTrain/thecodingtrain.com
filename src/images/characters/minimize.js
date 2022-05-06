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
    if (
      !file.includes('.mini.') &&
      !file.includes('.js') &&
      file !== '.DS_Store'
    ) {
      const data = fs.readFileSync(file, 'utf8');
      const result = optimize(data, config);
      if (result.error) {
        console.error(result.error);
        console.log('File:', file);
      } else if (result.data) {
        console.log(
          'Length change:',
          `${
            Math.round(
              ((result.data.length - data.length) / data.length) * 10000
            ) / 100
          }%`,
          'File:',
          file
        );
        const optimizedSvgString = result.data;
        const [name, extension] = file.split('.');
        fs.writeFileSync(`${name}.mini.${extension}`, optimizedSvgString);
      } else {
        console.log('No result on file. File:', file);
      }
    }
  });
});
