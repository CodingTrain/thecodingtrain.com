const { existsSync } = require('node:fs');
const path = require('node:path');
const { string, boolean, array } = require('yup');
const { slugs } = require('./content');
const {
  strictObject,
  uniqueArray,
  strictSlugsArray,
  slugValidators,
  dateRangeValidator,
  nonUrlStringValidator,
  youtubeIdValidator,
  youtubePlaylistIdValidator,
  videoNumberValidator,
  timestampsArrayValidator,
  urlOrRelativeLinkValidator
} = require('./validators');

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
      timestamps: timestampsArrayValidator.min(1).required()
    }).required()
  ).min(2), // if we need parts, should have at least 2

  timestamps: timestampsArrayValidator.required(),

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
          url: urlOrRelativeLinkValidator.required(), // TODO ref check instead of regex pattern matching for internal links?
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
    .required()
});

const videosSchema = baseVideosSchema.concat(
  strictObject({
    videoNumber: videoNumberValidator,
    relatedChallenges: uniqueArray(slugValidators.challenges.required()),
    canonicalTrack: slugValidators.tracks // related tests in `./content-testing/video-canonical-track.test.js`
  })
);

const challengesSchema = baseVideosSchema.concat(
  strictObject({
    videoNumber: videoNumberValidator.required(),
    relatedChallenges: uniqueArray(slugValidators.challenges.required())
      .min(1)
      .required()
  })
);

const showcasesSchema = strictObject({
  title: string().required(),
  url: string().url().required(),
  submittedOn: dateRangeValidator.required(),
  author: strictObject({
    name: string().required(),
    url: string().url(),
    twitter: string(), // inconsistent - urls and user handles, some with `@` prefix
    instagram: string() // inconsistent - urls and user handles, some with `@` prefix
  }).required()
});

const pageGuidesSchema = strictObject({
  title: string().required(),
  description: string().required(),

  guidesOrder: strictSlugsArray(
    slugValidators.guides.required(),
    slugs.guides
  ).required()
});

const tracksIndexSchema = strictObject({
  trackOrder: strictSlugsArray(
    slugValidators.tracks.required(),
    slugs.tracks
  ).required()
});

const pageFaqsSchema = strictObject({
  title: string().required(),
  description: string().required(),
  sections: array(
    strictObject({
      title: string().required(),
      questions: uniqueArray(slugValidators.faqs).min(1).required()
    })
  ).required()
});

const faqsSchema = strictObject({
  question: string().required(),
  answer: strictObject({
    text: string().required(),
    list: array(string()).min(1)
  }).required()
});

const ctaObject = strictObject({
  text: string().required(),
  buttonText: string().required(),
  href: urlOrRelativeLinkValidator.required() // internal relative links, can't validate with url()
});

const pageHomeSchema = strictObject({
  header: strictObject({
    title: string().required(),
    description: string().required()
  }).required(),

  newToCoding: strictObject({
    title: string().required(),
    description: string().required(),
    guideCta: ctaObject.required(),
    discordCta: ctaObject.required() // TODO this is not a Discord link, maybe these CTAs need to be more flexible/generic
  }).required(),

  tracks: strictObject({
    title: string().required(),
    description: string().required(),
    featured: uniqueArray(slugValidators.tracks).min(2).required(),
    tracksCta: ctaObject.required()
  }).required(),

  challenges: strictObject({
    title: string().required(),
    description: string().required(),
    featured: uniqueArray(slugValidators.challenges).min(3).required(),
    challengesCta: ctaObject.required()
  }).required(),

  passengerShowcase: strictObject({
    title: string().required(),
    featured: uniqueArray(slugValidators.showcases).min(3).required(),
    showcaseCta: ctaObject.required()
  }).required(),

  events: strictObject({
    title: string().required(),
    comingEventsDescription: string().required(),
    noEventsDescription: string().required(),
    upcoming: array(
      strictObject({
        title: string().required(),
        description: string().required(),
        date: string().required(),
        time: string().required(),
        host: string().required(),
        type: string().required(),
        url: string().url().required()
      })
    ).required()
  }).required(),

  support: strictObject({
    title: string().required(),
    description: string().required(),
    options: array(ctaObject.required()).required()
  }).required()
});

const tracksSchema = strictObject({
  title: string().required(),
  description: string().required(),

  // side and main tracks use the same schema at the moment, but usually side tracks don't have date and playlistId
  date: dateRangeValidator,
  playlistId: youtubePlaylistIdValidator,

  videos: uniqueArray(slugValidators.videosAndChallenges).min(1),
  chapters: array(
    strictObject({
      title: string().required(),
      videos: uniqueArray(slugValidators.videosAndChallenges).min(1).required()
    })
  ).min(1)
}).test((schema, context) => {
  if (schema.videos && schema.chapters) {
    return context.createError({
      message: 'Cannot have both `videos` and `chapters` present'
    });
  }
  if (!schema.videos && !schema.chapters) {
    return context.createError({
      message: '`videos` and `chapters` are missing, one of them is required'
    });
  }
  return true;
});

const socialGroup = strictObject({
  title: string().required(),
  links: array(
    strictObject({
      url: string().url().required(),
      site: string()
        .oneOf(['twitter', 'discord', 'instagram', 'youtube', 'github'])
        .required()
    })
  ).required()
});

const pageAboutSchema = strictObject({
  title: string().required(),
  description: string().required(),
  covers: array(string()).min(1).required(),
  coversDescription: string().required(),
  personalSocials: array(socialGroup).required(),
  secondaryTitle: string().required(),
  secondaryDescription: string().required(),
  siteSocials: array(socialGroup).required(),
  featuredTitle: string().required(),
  featured: array(
    strictObject({
      title: string().required(),
      description: string().required(),
      thumbnail: string().required(),
      url: string().url().required()
    })
  ).required(),
  acknowledgementsText: string().required(),
  acknowledgements: array(
    strictObject({
      name: string().required(),
      people: array(
        strictObject({
          name: string().required(),
          role: string(),
          url: string().url()
        })
      ).required()
    })
  ).required()
});

module.exports = {
  videos: videosSchema,
  challenges: challengesSchema,
  showcases: showcasesSchema,
  faqs: faqsSchema,
  tracks: tracksSchema,

  pageGuides: pageGuidesSchema,
  pageHome: pageHomeSchema,
  pageFaqs: pageFaqsSchema,
  pageAbout: pageAboutSchema,
  tracksIndex: tracksIndexSchema
};
