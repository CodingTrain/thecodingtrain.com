const fs = require('fs');
const path = require('path');
const { getDirectoryContent } = require('./read-content-utils');
const { contentStructure } = require('./content-structure');
const content = getDirectoryContent('./content');

const checkSlugReferences = (dir, reference, folder) => {
  if (folder === undefined) return;
  let testLocally = true;
  if (
    reference.canBeRecursive &&
    !('index.json' in folder.files) &&
    Object.keys(folder.folders).length > 0
  ) {
    testLocally = false;
  }
  if (testLocally) {
    for (let file in reference.files) {
      if (reference.files[file].slugReferences !== undefined) {
        const { slugReferences } = reference.files[file];
        if (file !== '') {
          let canLoad;
          try {
            require(`../${dir}/${file}`);
            canLoad = true;
          } catch {
            canLoad = false;
          }
          if (canLoad) {
            const fileContent = require(`../${dir}/${file}`);
            const slugs = slugReferences.getSlugs(fileContent);
            for (let slug of slugs) {
              test(`Checking if slug "${slug}" in ${
                slugReferences.name
              } (${`${dir}/${file}`}) exists`, () => {
                expect(() =>
                  fs.readdirSync(
                    path.join(...slugReferences.relativePath.split('/'), slug)
                  )
                ).not.toThrowError();
              });
            }
          }
        } else {
          for (let folderFile in folder.files) {
            if (folderFile.endsWith('.json')) {
              let canLoad;
              try {
                require(`../${dir}/${folderFile}`);
                canLoad = true;
              } catch {
                canLoad = false;
              }
              if (canLoad) {
                const fileContent = require(`../${dir}/${folderFile}`);
                const slugs = slugReferences.getSlugs(fileContent);
                for (let slug of slugs) {
                  test(`Checking if slug "${slug}" in ${
                    slugReferences.name
                  } (${`${dir}/${folderFile}`}) exists`, () => {
                    expect(() =>
                      fs.readdirSync(
                        path.join(
                          ...slugReferences.relativePath.split('/'),
                          slug
                        )
                      )
                    ).not.toThrowError();
                  });
                }
              }
            }
          }
        }
      }
    }
  }

  if (testLocally) {
    for (let folderReference in reference.folders) {
      if (folderReference !== '')
        checkSlugReferences(
          `${dir}/${folderReference}`,
          reference.folders[folderReference],
          folder.folders[folderReference]
        );
      else {
        for (let subfolder in folder.folders) {
          checkSlugReferences(
            `${dir}/${subfolder}`,
            reference.folders[folderReference],
            folder.folders[subfolder]
          );
        }
      }
    }
  } else {
    for (let subfolder in folder.folders) {
      checkSlugReferences(
        `${dir}/${subfolder}`,
        reference,
        folder.folders[subfolder]
      );
    }
  }
};

describe('Check if slug references exists', () =>
  checkSlugReferences('./content', contentStructure, content));
