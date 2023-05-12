const memoTagsCleanup = (wordReplacements, tagTransforms) => {
  const wordReplacementsMap = new Map();
  for (let [key, value] of Object.entries(wordReplacements)) {
    // match words surrounded by white space or at beginning/end
    wordReplacementsMap.set(
      key,
      new RegExp(`(?<=^|\\s+)(${value})(?=\\s+|$)`, 'gi')
    );
  }

  // convert to a map, flipping kv relationship to get fast lookups
  const tagTransformsMap = new Map();
  for (let [key, values] of Object.entries(tagTransforms)) {
    if (!Array.isArray(values)) {
      throw Error(
        `Value for key "${key}" should be of type "string[]", found type "${typeof values}"`
      );
    }

    for (let value of values) {
      const normalizedValue = value.trim().toLowerCase();
      if (tagTransformsMap.has(normalizedValue)) {
        console.warn(
          `WARN: Tag replacement value "${value}" found more than once, last seen in key "${key}"`
        );
      }
      tagTransformsMap.set(normalizedValue, key);
    }
  }

  // return memoized tag cleanup function
  return (words) => {
    if (!words) return [];

    const wordsSet = new Set();

    for (let word of words) {
      let normalizedWord = word.trim();

      // regex replacements
      for (let [word, regex] of wordReplacementsMap.entries()) {
        normalizedWord = normalizedWord.replaceAll(regex, word);
      }

      // use special casing if we find a match
      const key = normalizedWord.toLowerCase();
      if (tagTransformsMap.has(key)) {
        normalizedWord = tagTransformsMap.get(key);
      }

      wordsSet.add(normalizedWord);
    }

    return [...wordsSet];
  };
};

module.exports = {
  memoTagsCleanup
};
