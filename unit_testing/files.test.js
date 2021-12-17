const { getDirectoryContent } = require('./read-content-utils');
const { contentStructure } = require('./content-structure');

const content = getDirectoryContent('../content');

const fileExceptions = ['.DS_Store'];

const compareFilePresence = (dir, reference, folder) => {
  if (reference.isFileSensitive) {
    for (let file in folder.files) {
      test(`Should this file be here: ${folder.files[file].path}`, () =>
        expect(file).toBeOneOf([
          ...Object.keys(reference.files),
          ...fileExceptions
        ]));
    }
  }
  for (let file in reference.files) {
    if (
      reference.files[file].isRequired &&
      reference.files[file].requiredAlternative === undefined
    )
      test(`Required file expected: ${dir}/${file}`, () =>
        expect(folder.files[file]).toBeDefined());
    else if (
      reference.files[file].isRequired &&
      reference.files[file].requiredAlternative !== undefined
    )
      test(`Required file expected (or alternative): ${dir}/${file}`, () =>
        expect(
          folder.files[file] !== undefined ||
            folder.files[reference.files[file].requiredAlternative] !==
              undefined
        ).toBeTrue());
  }
  for (let folderReference in reference.folders) {
    if (folderReference !== '')
      compareFilePresence(
        `${dir}/${folderReference}`,
        reference.folders[folderReference],
        folder.folders[folderReference]
      );
    else {
      for (let subfolder in folder.folders) {
        compareFilePresence(
          `${dir}/${subfolder}`,
          reference.folders[folderReference],
          folder.folders[subfolder]
        );
      }
    }
  }
};

describe('Check file presence', () =>
  compareFilePresence('../content', contentStructure, content));
