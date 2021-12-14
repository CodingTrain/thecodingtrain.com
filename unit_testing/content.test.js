const fs = require('fs');
const path = require('path');

const { folderStructure } = require('./folder-structure');

const getDirectoryContent = (dir) => {
  const content = {};
  const files = fs.readdirSync(dir);
  files.forEach((file) => {
    const filepath = path.join(dir, file);
    const stats = fs.statSync(filepath);
    if (stats.isDirectory()) {
      content[file] = {
        name: file,
        filepath,
        files: getDirectoryContent(filepath)
      };
    } else if (stats.isFile()) {
      content[file] = { name: file, filepath };
    }
  });
  return content;
};

const content = getDirectoryContent('../content');
console.log({ content });

describe('Folder structure', () => {
  for (let folder in folderStructure) {
    test(`folder ${folder}/ exists`, () => {
      expect(content[folder]).toBeDefined();
      expect(content[folder].files).toBeDefined();
    });
    for (let subfolder in folderStructure[folder]) {
      test(`${folder}/ contains subfolder ${subfolder}/`, () => {
        expect(content[folder]).toBeDefined();
        expect(content[folder].files).toBeDefined();
      });
    }
  }
});
