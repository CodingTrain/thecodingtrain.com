const slugify = require('slugify');

const toSlug = (path) =>
  slugify(path, { lower: true, trim: true }).replace('.', '-');

module.exports = {
  toSlug
};
