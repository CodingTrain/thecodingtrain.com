const glob = require('glob');
const isEqual = require('lodash/isEqual');
const prettier = require('prettier');
const { readFileSync, writeFileSync } = require('fs');
const { memoTagsCleanup } = require('./utils');
const { wordReplacements, tagTransforms } = require('./tags-transforms.json');

const tagsCleanup = memoTagsCleanup(wordReplacements, tagTransforms);
const paths = glob.sync('content/videos/**/index.json');
let count = 0;

for (let path of paths) {
  const raw = readFileSync(path);
  const o = JSON.parse(raw);

  const languages = tagsCleanup(o.languages);
  const topics = tagsCleanup(o.topics);

  if (!isEqual(languages, o.languages) || !isEqual(topics, o.topics)) {
    o.languages = languages;
    o.topics = topics;

    const udpatedSource = prettier.format(JSON.stringify(o), {
      parser: 'json'
    });

    writeFileSync(path, udpatedSource);

    count++;
  }
}

console.log(
  `${count} of ${paths.length} video JSON files were modified to transform language and topic tags`
);
