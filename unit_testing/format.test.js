const { getDirectoryContent } = require('./read-content-utils');
const { contentStructure } = require('./content-structure');

const content = getDirectoryContent('../content');

const compareJsonFileFormat = (dir, reference, folder) => {
  for (let file in reference.files) {
    if (reference.files[file].jsonFormat !== undefined) {
      if (file !== '') {
        const fileContent = require(`${dir}/${file}`);
      } else {
        for (let folderFile in folder.files) {
          if (folderFile.endsWith('.json')) {
            test(`JSON file ${dir}/${folderFile} can be loaded`, () =>
              expect(() => require(`${dir}/${folderFile}`)).not.toThrowError());
            const fileContent = require(`${dir}/${folderFile}`);
          }
        }
      }

      test(`Required file expected: ${dir}/${file}`, () =>
        expect(1).toBeDefined());
    }
  }
  for (let folderReference in reference.folders) {
    if (folderReference !== '')
      compareJsonFileFormat(
        `${dir}/${folderReference}`,
        reference.folders[folderReference],
        folder.folders[folderReference]
      );
    else {
      for (let subfolder in folder.folders) {
        compareJsonFileFormat(
          `${dir}/${subfolder}`,
          reference.folders[folderReference],
          folder.folders[subfolder]
        );
      }
    }
  }
};

describe('Check if JSON file content fits format', () =>
  compareJsonFileFormat('../content', contentStructure, content));
