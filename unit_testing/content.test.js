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
  for (let elementName in content) {
    const element = content[elementName];
    if (element.files !== undefined) {
      test(`folder ${elementName}/ is expected`, () => {
        expect(folderStructure[elementName]).toBeDefined();
      });
    }
  }
});

describe('Videos must have index.json', () => {
  for (let videoType of ['challenges', 'lessons', 'guest-tutorials']) {
    for (let elementName in content.videos.files[videoType].files) {
      const element = content.videos.files[videoType].files[elementName];
      console.log({ element });
      if (element.files !== undefined) {
        test(`${videoType}/${elementName}/index.js found`, () => {
          expect(Object.keys(element.files)).toContain('index.json');
        });
      }
    }
  }
});

// Add similar check for index.json for tracks

// Generalize that process

// Check presence of other folders other than contributions and src for videos

// Check content of index.json files for required, optional and extra properties.
