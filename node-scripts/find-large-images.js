const glob = require('glob');
const fs = require('fs');

// options is optional
glob('**/showcase/showcase*.png', {}, function (e, files) {
  files.forEach((file) => {
    const stats = fs.statSync(file);
    const sizeMb = stats.size / (1024 * 1024);
    if (sizeMb > 1) {
      console.log(file, sizeMb);
    }
  });
});
