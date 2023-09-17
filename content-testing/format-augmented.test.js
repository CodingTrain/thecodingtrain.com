const { readFileSync, existsSync } = require('fs');
const path = require('path');
const { globSync } = require('glob');
const { object, string, number, date, boolean, array } = require('yup');

// Overlaps with `format.test.js`, but the tests here are more strict and specific to ensure better content integrity.
// Only videos/challenges and showcase contributions are handled at the moment.

const strictObject = (o) => object(o).strict().noUnknown();

const uniqueArray = (v) =>
  array(v).test((value, ctx) => {
    if (!value) return true;
    if (new Set(value).size === value.length) return true;

    // find dupe values to improve error message
    const seen = new Set();
    const dupes = new Set();
    for (const v of value) {
      seen.has(v) ? dupes.add(v) : seen.add(v);
    }

    const message = `Array values must be unique, ${dupes.size} dupe${
      dupes.size > 1 ? 's' : ''
    } found: ${[...dupes].join(', ')}`;

    return ctx.createError({ message });
  });

const strictRefsArray = (v, refSet) =>
  uniqueArray(v).test((value, ctx) => {
    if (!value) return true;
    if (refSet.size === value.length) return true;

    // find missing ref(s)
    const missing = [];
    refSet.forEach((v) => {
      if (value.indexOf(v) === -1) missing.push(v);
    });

    // it's possible that we had dupes, we let the `uniqueArray` test handle the error
    if (missing.length === 0) return true;

    const message = `Reference array is missing ${missing.length} reference${
      missing.length > 1 ? 's' : ''
    }: ${missing.join(', ')}`;

    return ctx.createError({ message });
  });

const guidesRefs = new Set(
  globSync('content/pages/guides/*.md')
    // only keep markdown files with frontmatter, the other ones are internal documentation
    .filter((f) => readFileSync(f).toString('utf-8').startsWith('---\n'))
    .map((f) => path.parse(f).name)
);

const tracksRefs = new Set(
  globSync('content/tracks/*/*/index.json').map((f) => {
    const parts = f.split('/');
    return `${parts[parts.length - 3]}/${parts[parts.length - 2]}`;
  })
);

const challengesRefs = new Set(
  globSync('content/videos/challenges/*/index.json').map((f) => {
    const parts = f.split('/');
    return parts[parts.length - 2];
  })
);

const makeRefValidator = (refName, refSet) =>
  string().test(
    `${refName} reference`,
    `Should be a valid ${refName} reference`,
    (value) => {
      if (!value) return true;
      return refSet.has(value);
    }
  );

const guidesRefValidator = makeRefValidator('guide', guidesRefs);
const tracksRefValidator = makeRefValidator('track', tracksRefs);
const challengesRefValidator = makeRefValidator('challenge', challengesRefs);

const earliest = new Date(2015, 1, 1);
const now = new Date();

const dateRangeValidator = string().test(
  'Valid Date',
  'Date needs to be valid and in bounds',
  (parsedValue, context) => {
    if (!parsedValue) return true;

    // yup is too leniant with `.date()` and allows broken string date formats
    // we only want to allow `yyyy-mm-dd` or a full ISO 8601 date in UTC
    // see https://github.com/jquense/yup/blob/master/src/util/isodate.js

    const original = context.originalValue;
    const value = new Date(original);

    // invalid date
    if (isNaN(value.getTime())) return false;

    // confirm that our parsed date matches the source when we transform it back
    // this will catch a number of issues like out of bound months/dates and weird Date parse behaviors on garbage
    if (original.length <= 10) {
      // yyyy-mm-dd (with leading zeros)
      const year = value.getUTCFullYear();
      const month = (value.getUTCMonth() + 1).toString().padStart(2, '0');
      const day = value.getUTCDate().toString().padStart(2, '0');

      if (original !== `${year}-${month}-${day}`) return false;
    } else {
      // ISO 8601
      if (original !== value.toISOString()) return false;
    }

    // out of bounds
    if (value < earliest || value > now) return false;

    return true;
  }
);

const urlRegex = /^http[s]?:\/\//;
const nonUrlStringValidator = string().test(
  'non-URL string',
  'String cannot be a URL',
  (value) => {
    if (!value) return true;
    return !urlRegex.test(value);
  }
);

const youtubeIdRegex = /^[A-Za-z0-9_\-]{11}$/;
const youtubeIdValidator = string().test(
  'YouTube ID',
  'Should be a valid YouTube ID',
  (value) => {
    if (!value) return true;
    return youtubeIdRegex.test(value);
  }
);

const videoNumberRegex = /^C?\d+(?:\.\d+)?$/;
const videoNumberValidator = string().test(
  'video number',
  'A video number should be a number optionally prefixed with `C`',
  (value) => {
    if (!value) return true;
    return videoNumberRegex.test(value);
  }
);

// 00:00 to 59:59, 0:00:00 to 9:59:59 - optional leading zeros for minutes and seconds
const timestampRegex = /^(?:[0-9]:)?[0-5]?\d:[0-5]?\d$/;
const timestampValidator = string().test(
  'timestamps',
  'A timestamp should be in the `mm:ss` or `h:mm:ss` format',
  (value) => {
    if (!value) return true;
    return timestampRegex.test(value);
  }
);

// keeping the internal links to /challenges/* and /tracks/* for now
const internalLinkRegex = /^\/(?:challenges|tracks)\//;
const urlOrInternalLinkValidator = string().test(
  'URL or internal link',
  'Should be a valid URL or internal link to `/challenges/*` or `/tracks/*`',
  (value) => {
    if (!value) return true;

    const isUrl = string().url().isValidSync(value);
    return isUrl || internalLinkRegex.test(value);
  }
);

// build schemas

const baseVideosSchema = strictObject({
  title: string().required(),
  description: string().required(),

  videoId: youtubeIdValidator.when(['parts'], (parts, schema) => {
    // videoId required if the `parts` array is missing or empty
    return parts && parts.length > 0 ? schema : schema.required();
  }),

  nebulaSlug: nonUrlStringValidator,
  date: dateRangeValidator.required(),

  languages: array(string().required()).required(), // the git videos don't have languages so we can't enforce .min(1)
  topics: array(string().required()).min(1).required(),

  canContribute: boolean().required(),

  parts: array(
    strictObject({
      title: string().required(),
      videoId: youtubeIdValidator.required(),
      nebulaSlug: nonUrlStringValidator,
      timestamps: array(
        strictObject({
          time: timestampValidator.required(),
          title: string().required()
        }).required()
      )
        .min(1)
        .required()
    }).required()
  ).min(2), // if we need parts, should have at least 2

  timestamps: array(
    strictObject({
      time: timestampValidator.required(),
      title: string().required()
    }).required()
  ).required(),

  codeExamples: array(
    strictObject({
      title: string().required(),
      description: string().required(),

      image: string()
        .test(
          'relative image',
          'Should be a relative image filename with `.png` or `.jpg` extension',
          (value) => {
            if (!value) return true;

            const properFormat = /^\S+\.(?:png|jpg)$/.test(value);
            if (!properFormat) return false;

            return true;
          }
        )
        .test(
          'image file exists',
          'Image file should exist on disk',
          (value, context) => {
            if (!value) return true;

            // extract the JSON filepath passed through the context
            const filepath = context.options.context.filepath;

            // these image files live in {video-dir}/images/{image}
            const imagepath = path.join(
              path.dirname(filepath),
              'images',
              value
            );
            if (!existsSync(imagepath)) return false;

            return true;
          }
        ), // not required, falls back to {video-dir}/index.jpg

      urls: strictObject({
        p5: string().url(),
        processing: string().url(),
        node: string().url(),
        other: string().url()
      })
        // all keys are optional but we require at least one to be set
        .test(
          'one object key required',
          'At least one key is required for this object',
          (value) => Object.keys(value).length > 0
        )
        .required()
    })
  ),

  groupLinks: array(
    strictObject({
      title: string().required(),
      links: array(
        strictObject({
          title: string().required(),
          url: urlOrInternalLinkValidator.required(), // TODO ref check instead of regex pattern matching for internal links?
          icon: string(),
          description: string()
        }).required()
      )
        .min(1)
        .required()
    }).required()
  ),

  credits: array(
    strictObject({
      title: string().required(),
      name: string().required(),
      url: string().url()
    }).required()
  )
    .min(1)
    .required(),

  canonicalTrack: string() // complex ref checks are in `content-testing/video-canonical-track.test.js`
});

const videosSchema = baseVideosSchema.concat(
  strictObject({
    videoNumber: videoNumberValidator,
    relatedChallenges: uniqueArray(challengesRefValidator.required())
  })
);

const challengesSchema = baseVideosSchema.concat(
  strictObject({
    videoNumber: videoNumberValidator.required(),
    relatedChallenges: uniqueArray(challengesRefValidator.required())
      .min(1)
      .required()
  })
);

const showcasesSchema = strictObject({
  title: string().required(),
  url: string().url().required(),
  submittedOn: dateRangeValidator, // TODO should be required, but we need to backfill these dates before enforcing
  author: strictObject({
    name: string().required(),
    url: string().url(),
    twitter: string(), // inconsistent - urls and user handles, some with `@` prefix
    instagram: string() // inconsistent - urls and user handles, some with `@` prefix
  }).required()
});

const guidesPageSchema = strictObject({
  title: string().required(),
  description: string().required(),

  guidesOrder: strictRefsArray(
    guidesRefValidator.required(),
    guidesRefs
  ).required()
});

const tracksIndexSchema = strictObject({
  trackOrder: strictRefsArray(
    tracksRefValidator.required(),
    tracksRefs
  ).required()
});

// associate JSON files to schemas

const videoPaths = globSync('content/videos/**/index.json', {
  ignore: 'content/videos/challenges/**'
});
const challengesPaths = globSync('content/videos/challenges/**/index.json');
const showcasesPaths = globSync('content/videos/**/showcase/*.json');
const guidesPagePath = ['content/pages/guides/index.json'];
const tracksIndexPath = ['content/tracks/index.json'];

const rules = {
  videos: [videoPaths, videosSchema],
  challenges: [challengesPaths, challengesSchema],
  showcases: [showcasesPaths, showcasesSchema],
  'guides page': [guidesPagePath, guidesPageSchema],
  'tracks index': [tracksIndexPath, tracksIndexSchema]
};

// validate JSON files against schemas

for (const [label, [paths, schema]] of Object.entries(rules)) {
  describe.each(paths)(`${label} › %s`, (path) => {
    const obj = JSON.parse(readFileSync(path));

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

// We need to always have at least one test block in a Jest file
test('', () => {});
