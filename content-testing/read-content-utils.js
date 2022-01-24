const fs = require('fs');
const path = require('path');

const getDirectoryContent = (dir) => {
  const content = { path: dir, files: {}, folders: {} };
  const elements = fs.readdirSync(dir);
  elements.forEach((element) => {
    const filepath = path.join(dir, element);
    const stats = fs.statSync(filepath);
    if (stats.isDirectory()) {
      content.folders[element] = getDirectoryContent(filepath);
    } else if (stats.isFile()) {
      content.files[element] = { path: filepath };
    }
  });
  return content;
};

module.exports = { getDirectoryContent };
