const { glob } = require('glob');
const isEqual = require('lodash/isEqual');
const prettier = require('prettier');
const { readFile, writeFile } = require('fs/promises');
const { memoTagsCleanup } = require('./utils');
const { wordReplacements, tagTransforms } = require('./tags-transforms.json');

const tagsCleanup = memoTagsCleanup(wordReplacements, tagTransforms);

(async () => {
  const paths = await glob('content/videos/**/index.json');
  let count = 0;

  for (const path of paths) {
    const raw = await readFile(path);
    const o = JSON.parse(raw);

    const languages = tagsCleanup(o.languages);
    const topics = tagsCleanup(o.topics);

    if (!isEqual(languages, o.languages) || !isEqual(topics, o.topics)) {
      o.languages = languages;
      o.topics = topics;

      const updatedSource = await prettier.format(JSON.stringify(o), {
        parser: 'json'
      });

      await writeFile(path, updatedSource);

      count++;
    }
  }

  console.log(
    `${count} of ${paths.length} video JSON files were modified to transform language and topic tags`
  );
})();
