const { getDirectoryContent } = require('./read-content-utils');
const { contentStructure } = require('./content-structure');

const content = getDirectoryContent('./content');

const compareFolderStructure = (dir, reference, folder) => {
  if (reference.isRequired) {
    test(`Required folder expected: ${dir}`, () =>
      expect(folder).toBeDefined());
  }
  if (folder === undefined) return;
  let testLocally = true;
  if (
    reference.canBeRecursive &&
    !('index.json' in folder.files) &&
    Object.keys(folder.folders).length > 0
  ) {
    testLocally = false;
  }
  if (testLocally && reference.isFolderSensitive) {
    for (let subfolder in folder.folders) {
      test(`Should this folder be here: ${folder.folders[subfolder].path}`, () =>
        expect(subfolder).toBeOneOf(Object.keys(reference.folders)));
    }
  }
  if (testLocally) {
    for (let folderReference in reference.folders) {
      if (folderReference !== '')
        compareFolderStructure(
          `${dir}/${folderReference}`,
          reference.folders[folderReference],
          folder.folders[folderReference]
        );
      else {
        for (let subfolder in folder.folders) {
          compareFolderStructure(
            `${dir}/${subfolder}`,
            reference.folders[folderReference],
            folder.folders[subfolder]
          );
        }
      }
    }
  } else {
    for (let subfolder in folder.folders) {
      compareFolderStructure(
        `${dir}/${subfolder}`,
        reference,
        folder.folders[subfolder]
      );
    }
  }
};

describe('Check folder structure', () =>
  compareFolderStructure('./content', contentStructure, content));
