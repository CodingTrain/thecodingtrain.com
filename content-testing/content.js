const { globSync } = require('glob');
const { readFileSync } = require('node:fs');
const path = require('node:path');

/**
 * Paths to content files
 * @type {Object.<string, string[]>}
 */
const paths = {
  // collections
  guides: globSync('content/pages/guides/*.md'),
  tracks: globSync('content/tracks/*/*/index.json'),
  showcases: globSync('content/videos/**/showcase/*.json'),
  faqs: globSync('content/pages/faqs/*.json', {
    ignore: '**/index.json'
  }),
  videosAndChallenges: globSync('content/videos/**/index.json'),
  videos: globSync('content/videos/**/index.json', {
    ignore: 'content/videos/challenges/**'
  }),
  challenges: globSync('content/videos/challenges/*/index.json'),

  // single pages
  pageGuides: ['content/pages/guides/index.json'],
  pageHome: ['content/pages/homepage/index.json'],
  pageFaqs: ['content/pages/faqs/index.json'],
  pageAbout: ['content/pages/about/index.json'],
  tracksIndex: ['content/tracks/index.json']
};

/**
 * Path to slug conversion functions
 * @type {Object.<string, function(string): string>}
 */
const toSlug = {
  guides: (p) => path.parse(p).name,
  tracks: (p) => p.split('/').at(-2),
  showcases: (p) => p.split('/').slice(2).join('/'),
  faqs: (p) => path.parse(p).name,
  videosAndChallenges: (p) => p.split('/').slice(2, -1).join('/'),
  challenges: (p) => p.split('/').at(-2)
};

/**
 * Slug sets
 * @type {Object.<string, Set<string>>}
 */
const slugs = {
  guides: new Set(
    paths.guides
      // only keep markdown files with frontmatter, the other ones are internal documentation
      .filter((p) => readFileSync(p).toString('utf-8').startsWith('---\n'))
      .map(toSlug.guides)
  ),
  tracks: (() => {
    const tracksSlugs = new Set();
    for (const p of paths.tracks) {
      const slug = toSlug.tracks(p);
      if (tracksSlugs.has(slug)) {
        throw new Error(
          `A main and side track share the slug "${slug}". Rename one of their content directories to resolve the conflict.`
        );
      }
      tracksSlugs.add(slug);
    }
    return tracksSlugs;
  })(),
  showcases: new Set(paths.showcases.map(toSlug.showcases)),
  faqs: new Set(paths.faqs.map(toSlug.faqs)),
  challenges: new Set(paths.challenges.map(toSlug.challenges)),
  videosAndChallenges: new Set(
    paths.videosAndChallenges.map(toSlug.videosAndChallenges)
  )
};

module.exports = {
  paths,
  toSlug,
  slugs
};
