const { memoTagsCleanup } = require('./utils');

describe('memoTagsCleanup()', () => {
  const tagsCleanup = memoTagsCleanup(
    { '3D': '3d' },
    {
      'p5.js': ['p5js', 'p5.js', 'p5'],
      Processing: ['processing'],
      Constructor: ['constructor'],
      Prototype: ['prototype']
    }
  );

  it('returns an empty array for invalid or empty inputs', () => {
    expect(tagsCleanup([])).toStrictEqual([]);
    expect(tagsCleanup(undefined)).toStrictEqual([]);
    expect(tagsCleanup(null)).toStrictEqual([]);
  });

  it('does not transform unknown keywords', () => {
    expect(tagsCleanup(['notInReplacementMap'])).toStrictEqual([
      'notInReplacementMap'
    ]);
  });

  it('returns special casing when it exists', () => {
    expect(tagsCleanup(['p5js'])).toStrictEqual(['p5.js']);
    expect(tagsCleanup(['P5.js'])).toStrictEqual(['p5.js']);
    expect(tagsCleanup(['P5'])).toStrictEqual(['p5.js']);
    expect(tagsCleanup(['p5.js'])).toStrictEqual(['p5.js']);
  });

  it('works with JavaScript keywords and object members', () => {
    expect(tagsCleanup(['constructor'])).toStrictEqual(['Constructor']);
    expect(tagsCleanup(['prototype'])).toStrictEqual(['Prototype']);
  });

  it('trims whitespace', () => {
    expect(tagsCleanup([' p5js '])).toStrictEqual(['p5.js']);
    expect(tagsCleanup([' 3d '])).toStrictEqual(['3D']);
    expect(tagsCleanup([' Some Other Topic '])).toStrictEqual([
      'Some Other Topic'
    ]);
  });

  it('dedupes after all transforms are applied', () => {
    const input = [
      'p5js',
      'processing',
      'P5',
      '3d modeling',
      'p5js',
      'Processing',
      'p5.js',
      'Processing ',
      ' P5',
      '3D modeling'
    ];
    expect(tagsCleanup(input)).toStrictEqual([
      'p5.js',
      'Processing',
      '3D modeling'
    ]);
  });

  it('transforms individual common key words', () => {
    expect(tagsCleanup(['3d'])).toStrictEqual(['3D']);
    expect(tagsCleanup(['3d at beginning'])).toStrictEqual(['3D at beginning']);
    expect(tagsCleanup(['middle 3d keyword'])).toStrictEqual([
      'middle 3D keyword'
    ]);
    expect(tagsCleanup(['end 3d'])).toStrictEqual(['end 3D']);
    expect(tagsCleanup(['multiple 3d matches 3d'])).toStrictEqual([
      'multiple 3D matches 3D'
    ]);
    expect(tagsCleanup(['not 3dim surrounded'])).toStrictEqual([
      'not 3dim surrounded'
    ]);
  });
});
