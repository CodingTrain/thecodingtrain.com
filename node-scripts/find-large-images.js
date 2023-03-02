const { globSync } = require('glob');
const fs = require('fs');

const files = globSync('**/showcase/contribution*.png');

for (const file of files) {
  const stats = fs.statSync(file);
  const sizeMb = stats.size / (1024 * 1024);
  if (sizeMb > 1) {
    console.log(file, sizeMb);
  }
}
