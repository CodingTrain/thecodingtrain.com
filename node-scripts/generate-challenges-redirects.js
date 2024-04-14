const { appendFileSync } = require('node:fs');
const { slugs } = require('../content-testing/content');

let challengesRedirects = '\n';
slugs.challenges.forEach((slug) => {
  const videoNumber = slug.split('-')[0];
  challengesRedirects += `/${videoNumber} /challenges/${slug} 302!\n`;
});

const redirectsFilePath = './static/_redirects';
appendFileSync(redirectsFilePath, challengesRedirects);

console.log(
  `${slugs.challenges.size} challenges redirects were appended to '${redirectsFilePath}'`
);
