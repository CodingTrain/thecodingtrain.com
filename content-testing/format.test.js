const { getDirectoryContent } = require('./read-content-utils');
const { contentStructure } = require('./content-structure');
const {
  RequiredPropertyError,
  UnexpectedPropertyError,
  TypePropertyError,
  TypeArrayContentError
} = require('./errors');

const content = getDirectoryContent('./content');

const checkPropertiesMatch = (object, reference, name) => {
  for (let property in reference.properties) {
    if (
      reference.properties[property].isRequired &&
      object[property] === undefined &&
      (!reference.properties[property].requireAlternative ||
        object[reference.properties[property].requireAlternative] === undefined)
    ) {
      throw new RequiredPropertyError(
        property,
        name,
        reference.properties[property].requireAlternative
      );
    }
  }
  for (let property in object) {
    if (reference.properties[property] === undefined) {
      throw new UnexpectedPropertyError(property, name);
    } else {
      const referenceType = reference.properties[property].type;

      if (referenceType === 'array') {
        if (!Array.isArray(object[property])) {
          throw new TypePropertyError(
            property,
            name,
            typeof object[property],
            referenceType
          );
        }
        const arrayValue = object[property];
        const contentReferenceType =
          reference.properties[property].content.type;
        for (let v of arrayValue) {
          if (typeof v !== contentReferenceType) {
            throw new TypeArrayContentError(
              property,
              name,
              typeof v,
              contentReferenceType
            );
          }
          if (contentReferenceType === 'object') {
            checkPropertiesMatch(
              v,
              reference.properties[property].content,
              property
            );
          }
        }
      } else if (referenceType === 'object') {
        if (typeof object[property] !== referenceType) {
          throw new TypePropertyError(
            property,
            name,
            typeof object[property],
            referenceType
          );
        }
        checkPropertiesMatch(
          object[property],
          reference.properties[property],
          property
        );
      } else {
        if (typeof object[property] !== referenceType) {
          throw new TypePropertyError(
            property,
            name,
            typeof object[property],
            referenceType
          );
        }
      }
    }
  }
};

const testContentFormat = (json, format, path) => {
  test(`Checking ${format.name} format for ${path}`, () =>
    expect(() =>
      checkPropertiesMatch(json, format.init, format.name)
    ).not.toThrowError());
};

const compareJsonFileFormat = (dir, reference, folder) => {
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
      if (reference.files[file].jsonFormat !== undefined) {
        if (file !== '') {
          test(`File ${dir}/${file} can be loaded as JSON`, () =>
            expect(() => require(`../${dir}/${file}`)).not.toThrowError());
          let canLoad;
          try {
            require(`../${dir}/${file}`);
            canLoad = true;
          } catch {
            canLoad = false;
          }
          if (canLoad) {
            const fileContent = require(`../${dir}/${file}`);
            if (
              reference.files[file].jsonFormat.exceptions &&
              reference.files[file].jsonFormat.exceptions.includes(file)
            )
              break;
            testContentFormat(
              fileContent,
              reference.files[file].jsonFormat,
              `${dir}/${file}`
            );
          }
        } else {
          for (let folderFile in folder.files) {
            if (folderFile.endsWith('.json')) {
              if (
                reference.files[file].jsonFormat.exceptions &&
                reference.files[file].jsonFormat.exceptions.includes(file)
              )
                break;
              // console.log({ dir, folderFile });
              test(`File ${dir}/${folderFile} can be loaded as JSON`, () =>
                expect(() =>
                  require(`../${dir}/${folderFile}`)
                ).not.toThrowError());
              let canLoad;
              try {
                require(`../${dir}/${folderFile}`);
                canLoad = true;
              } catch {
                canLoad = false;
              }
              if (canLoad) {
                const fileContent = require(`../${dir}/${folderFile}`);
                testContentFormat(
                  fileContent,
                  reference.files[file].jsonFormat,
                  `${dir}/${folderFile}`
                );
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
  } else {
    for (let subfolder in folder.folders) {
      compareJsonFileFormat(
        `${dir}/${subfolder}`,
        reference,
        folder.folders[subfolder]
      );
    }
  }
};

describe('Check if JSON file content fits format', () =>
  compareJsonFileFormat('./content', contentStructure, content));
