const { object, string, array } = require('yup');
const { toSlug, slugs, paths } = require('./content');
const { readFileSync } = require('node:fs');

// --- extensions to yup

const strictObject = (o) => object(o).strict().noUnknown();

const uniqueArray = (v) =>
  array(v).test((value, context) => {
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

    return context.createError({ message });
  });

// an array that contains ALL slugs in the provided set
const strictSlugsArray = (v, slugSet) =>
  uniqueArray(v).test((value, context) => {
    if (!value) return true;
    if (slugSet.size === value.length) return true;

    // find missing slug(s)
    const missing = [...slugSet].filter((v) => !value.includes(v));

    // it's possible that we had dupes, we let the `uniqueArray` test handle the error
    if (missing.length === 0) return true;

    const plural = missing.length > 1 ? 's' : '';
    const message = `Reference array is missing ${
      missing.length
    } reference${plural}: ${missing.join(', ')}`;

    return context.createError({ message });
  });

const makeSlugValidator = (slugType, slugSet) =>
  string().test((value, context) => {
    if (!value) return true;

    if (
      slugType === 'challenge' &&
      value === toSlug.challenges(context.options.context.filepath)
    ) {
      return context.createError({
        message: `A challenge video should not reference itself`
      });
    }

    if (!slugSet.has(value)) {
      return context.createError({
        message: `Should be a valid ${slugType} reference`
      });
    }

    return true;
  });

// --- custom validators

const slugValidators = {
  guides: makeSlugValidator('guide', slugs.guides),
  tracks: makeSlugValidator('track', slugs.tracks),
  challenges: makeSlugValidator('challenge', slugs.challenges),
  showcases: makeSlugValidator('showcase', slugs.showcases),
  faqs: makeSlugValidator('faqs', slugs.faqs),
  videosAndChallenges: makeSlugValidator('videos', slugs.videosAndChallenges)
};

const earliest = new Date(2015, 0, 1);
const now = new Date();

const dateRangeValidator = string().test(
  'Valid Date',
  'Date needs to be valid and in bounds',
  (value, context) => {
    if (!value) return true;

    // yup is too leniant with `.date()` and allows broken string date formats
    // we only want to allow `yyyy-mm-dd` or a full ISO 8601 date in UTC
    // see https://github.com/jquense/yup/blob/master/src/util/isodate.js

    const date = new Date(value);

    // invalid date
    if (isNaN(date.getTime())) {
      return context.createError({
        message: `Date is invalid and cannot be parsed`
      });
    }

    // confirm that our parsed date matches the source when we transform it back
    // this will catch a number of issues like out of bound months/dates and weird Date parse behaviors on garbage
    let correctFormat = true;

    if (value.length <= 10) {
      // yyyy-mm-dd (with leading zeros)
      const year = date.getUTCFullYear();
      const month = (date.getUTCMonth() + 1).toString().padStart(2, '0');
      const day = date.getUTCDate().toString().padStart(2, '0');

      if (value !== `${year}-${month}-${day}`) correctFormat = false;
    } else {
      // ISO 8601 timestamp
      if (value !== date.toISOString()) correctFormat = false;
    }

    if (!correctFormat) {
      return context.createError({
        message: `Date is not correctly formatted`
      });
    }

    // verify that the date is within defined bounds
    if (date < earliest) {
      return context.createError({
        message: `Date is before ${earliest.toLocaleString()}")`
      });
    }
    if (date > now) {
      return context.createError({ message: `Date is in the future` });
    }

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

// this 12 chars prefix seems to reliably identify the Coding Train channel
const youtubePlaylistIdRegex = /^PLRqwX-V7Uu6[A-Za-z0-9_\-]{22}$/;
const youtubePlaylistIdValidator = string().test(
  'YouTube playlist ID',
  'Should be a valid YouTube playlist ID from the Coding Train channel',
  (value) => {
    if (!value) return true;
    return youtubePlaylistIdRegex.test(value);
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

const timestampToSeconds = (timestamp) => {
  // NOTE: copied from `./gatsby/utils.mjs`, can't use directly for now because of ESM/CJS mismatch

  return timestamp
    .split(':')
    .reverse()
    .map(Number)
    .reduce((totalSeconds, component, index) => {
      return totalSeconds + component * 60 ** index;
    }, 0);
};

const timestampsArrayValidator = array(
  strictObject({
    time: timestampValidator.required(),
    title: string().required()
  }).required()
).test((values, context) => {
  if (!values) return true;

  // Per https://support.google.com/youtube/answer/9884579?hl=en

  // At least 3 timestamps are required
  if (values.length > 0 && values.length < 3) {
    return context.createError({
      message: 'At least 3 timestamps are required'
    });
  }

  // first timestamp should be `0:00`
  if (values.length > 0 && timestampToSeconds(values[0].time) !== 0) {
    return context.createError({
      message: 'The first timestamp should be `0:00`'
    });
  }

  // Timestamps should be sequential and at least 10 seconds apart from each other
  const sequenceErrors = [];
  const lengthErrors = [];
  let previousTime = -1;

  for (const value of values) {
    const currentTime = timestampToSeconds(value.time);

    if (currentTime <= previousTime) sequenceErrors.push(value);
    if (currentTime > 0 && currentTime - previousTime < 10)
      lengthErrors.push(value);

    previousTime = currentTime;
  }

  if (sequenceErrors.length > 0) {
    const details = sequenceErrors
      .map((v) => `${v.time} - ${v.title}`)
      .join(' | ');
    const plural = sequenceErrors.length > 1 ? 's are' : ' is';

    return context.createError({
      message: `${sequenceErrors.length} timestamp${plural} not in sequential order | ${details}`
    });
  }

  if (lengthErrors.length > 0) {
    const details = lengthErrors
      .map((v) => `${v.time} - ${v.title}`)
      .join(' | ');
    const plural = lengthErrors.length > 1 ? 's are' : ' is';

    return context.createError({
      message: `${lengthErrors.length} timestamp${plural} less than 10 seconds after the previous one | ${details}`
    });
  }

  return true;
});

const correctionsArrayValidator = array(
  strictObject({
    time: timestampValidator.required(),
    title: string().required()
  }).required()
).test((values, context) => {
  if (!values) return true;

  // Per https://support.google.com/youtube/answer/57404

  // Timestamps should be sequential
  const sequenceErrors = [];
  let previousTime = -1;

  for (const value of values) {
    const currentTime = timestampToSeconds(value.time);

    if (currentTime <= previousTime) sequenceErrors.push(value);

    previousTime = currentTime;
  }

  if (sequenceErrors.length > 0) {
    const details = sequenceErrors
      .map((v) => `${v.time} - ${v.title}`)
      .join(' | ');
    const plural = sequenceErrors.length > 1 ? 's are' : ' is';

    return context.createError({
      message: `${sequenceErrors.length} correction${plural} not in sequential order | ${details}`
    });
  }

  return true;
});

// generate all valid track paths, including deeplinks to chapters and videos
const tracksWithChaptersOrVideosSlugs = new Set(slugs.tracks);
paths.tracks.forEach((p) => {
  const o = JSON.parse(readFileSync(p));
  const chaptersOrVideos = o.videos ?? o.chapters.flatMap((c) => c.videos);

  const slug = toSlug.tracks(p);
  chaptersOrVideos.forEach((c) => {
    tracksWithChaptersOrVideosSlugs.add(`${slug}/${c}`);
  });
});

// Reminder: filters, pagination, and URI fragments are not taken into account
const relativeLinks = {
  '/tracks': tracksWithChaptersOrVideosSlugs,
  '/challenges': slugs.challenges,
  '/guides': slugs.guides,
  '/showcase': new Set(),
  '/faq': new Set(),
  '/about': new Set()
};

const urlOrRelativeLinkValidator = string().test(
  'URL or relative link',
  'Should be a valid URL or relative link`',
  (value, context) => {
    if (!value) return true;

    if (value.startsWith('https://thecodingtrain.com/')) {
      return context.createError({
        message: `This link should be relative instead of absolute`
      });
    }

    // external links
    const isUrl = string().url().isValidSync(value);
    if (isUrl) return true;

    // relative links
    const parts = value.split('/');
    const prefix = parts[1];

    const slugSet = relativeLinks[`/${prefix}`];
    if (!slugSet) return false;

    const slug = parts.slice(2).join('/');
    if (!slug || slugSet.has(slug)) return true;

    return false;
  }
);

module.exports = {
  // yup extensions
  strictObject,
  uniqueArray,
  strictSlugsArray,

  // custom validators
  slugValidators,
  dateRangeValidator,
  nonUrlStringValidator,
  youtubeIdValidator,
  youtubePlaylistIdValidator,
  videoNumberValidator,
  timestampsArrayValidator,
  correctionsArrayValidator,
  urlOrRelativeLinkValidator
};
