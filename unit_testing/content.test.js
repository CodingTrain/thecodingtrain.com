const fs = require('fs');
const path = require('path');

const { contentStructure } = require('./content-structure');

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

const content = getDirectoryContent('../content');
console.log({ content });

const compareFolderStructure = (dir, reference, folder) => {
  if (reference.isRequired) {
    test(`Required folder expected: ${dir}`, () =>
      expect(folder).toBeDefined());
  }
  if (folder === undefined) return;
  if (reference.isFolderSensitive) {
    for (let subfolder in folder.folders) {
      test(`Should this folder be here: ${folder.folders[subfolder].path}`, () =>
        expect(subfolder).toBeOneOf(Object.keys(reference.folders)));
    }
  }
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
};

describe('Check folder structure', () =>
  compareFolderStructure('../content', contentStructure, content));

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

const compareJsonFileFormat = (dir, reference, folder) => {
  for (let file in reference.files) {
    if (reference.files[file].jsonFormat !== undefined) {
      if (file !== '') {
        const fileContent = require(`${dir}/${file}`);
      } else {
        for (let folderFile in folder.files) {
          if (folderFile.endsWith('.json')) {
            const fileContent = require(`${dir}/${folderFile}`);
          }
        }
      }

      // test(`Required file expected: ${dir}/${file}`, () =>
      //   expect(folder.files[file]).toBeDefined());
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

// Check content of index.json files for required, optional and extra properties.
