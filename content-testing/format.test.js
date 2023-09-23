const { readFileSync } = require('node:fs');
const { paths } = require('./content');
const schemas = require('./schemas');

for (const key of Object.keys(schemas)) {
  const filepaths = paths[key];
  const schema = schemas[key];

  describe.each(filepaths)(`${key} › %s`, (path) => {
    let obj;
    try {
      obj = JSON.parse(readFileSync(path));
    } catch {}

    test(`Failed to parse JSON file`, () => expect(obj).toBeDefined());

    try {
      schema.validateSync(obj, {
        abortEarly: false,
        context: { filepath: path }
      });
    } catch (e) {
      for (const err of e.inner) {
        test(err.message, () => {
          expect(err.params.originalValue).not.toBe(err.params.originalValue);
        });
      }
    }
  });
}
