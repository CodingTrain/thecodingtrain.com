const slugify = require('slugify');

const toSlug = (path) =>
  slugify(path, { lower: true, trim: true }).replace('.', '-');

const specialCasing = {
  p5js: 'p5.js',
  p5: 'p5.js'
};

const getFormattedWord = (word) => {
  const getLookupKey = (word) => {
    return word
      .replace(/[!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~]/g, '')
      .toLowerCase();
  };

  if (specialCasing[getLookupKey(word)]) {
    return specialCasing[getLookupKey(word)];
  }

  return word
    .split('')
    .reduce((acc, letter) => {
      acc.length
        ? acc.push(letter.toLowerCase())
        : acc.push(letter.toUpperCase());
      return acc;
    }, [])
    .join('');
};
const cleanUp = (words) => {
  console.log('we are trying to process', words);
  if (!words) return [];
  const formattedWords = [];
  for (let word of words) {
    formattedWords.push(getFormattedWord(word));
  }
  return formattedWords;
};
module.exports = {
  cleanUp,
  toSlug
};
