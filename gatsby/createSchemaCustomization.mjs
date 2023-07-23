// We don't necessarily need to add every field here, since
// Gatsby will auto-generate the fields when created. This is
// just to make sure that certain fields are set to certain types.
const schema = /* GraphQL */ `
  interface VideoInterface implements Node {
    id: ID!
    title: String!
    slug: String!
    videoId: String!
    description: String!
    date: String
    videoNumber: String
    topics: [String!]
    languages: [String!]
    timestamps: [Timestamp!]
    parts: [ChallengePart!]
    codeExamples: [CodeExample!]
    canContribute: Boolean!
    relatedChallenges: [Challenge!] @link
    cover: CoverImage @link
    groupLinks: [GroupLink!]
    source: String!
    nebulaSlug: String
    credits: [Credit!]!

    # as resolver
    showcase: [Contribution]
    canonicalTrack: Track
  }

  type Video implements VideoInterface & Node {
    id: ID!
    title: String!
    slug: String!
    videoId: String!
    description: String!
    date: String
    videoNumber: String
    topics: [String!]
    languages: [String!]
    timestamps: [Timestamp!]
    parts: [ChallengePart!]
    codeExamples: [CodeExample!]
    canContribute: Boolean!
    relatedChallenges: [Challenge!] @link
    cover: CoverImage @link
    groupLinks: [GroupLink!]
    source: String!
    nebulaSlug: String
    credits: [Credit!]!

    # as resolver
    showcase: [Contribution]
    canonicalTrack: Track
  }

  type Challenge implements VideoInterface & Node {
    id: ID!
    title: String!
    slug: String!
    videoId: String!
    description: String!
    date: String
    videoNumber: String
    topics: [String!]
    languages: [String!]
    timestamps: [Timestamp!]
    codeExamples: [CodeExample!]
    parts: [ChallengePart!]
    canContribute: Boolean!
    relatedChallenges: [Challenge!] @link
    cover: CoverImage @link
    groupLinks: [GroupLink!]
    source: String!
    nebulaSlug: String
    credits: [Credit!]!

    # as resolver
    showcase: [Contribution]
    canonicalTrack: Track
  }

  type Credit {
    title: String!
    name: String!
    url: String
  }

  type Contribution implements Node {
    title: String!
    name: String!
    author: Author!
    url: String
    video: VideoInterface! @link
    cover: CoverImage @link

    # as resolver
    submittedOn: String
  }

  type Timestamp implements Node {
    title: String!
    time: String!
    seconds: Int!
  }

  type ChallengePart implements Node {
    title: String!
    videoId: String!
    nebulaSlug: String
    timestamps: [Timestamp!]
  }

  type GroupLink implements Node {
    title: String!
    links: [Link!]!
  }

  type Link implements Node {
    title: String!
    url: String!
    icon: String
    description: String
  }

  type CodeExample implements Node {
    title: String!
    description: String
    image: CoverImage @link
    urls: CodeUrls!
  }

  type CodeUrls implements Node {
    p5: String
    processing: String
    node: String
    other: String
  }

  type Author implements Node {
    name: String!
    nameSlug: String!
    url: String
  }

  type Chapter implements Node {
    title: String
    videos: [VideoInterface] @link
  }

  type Track implements Node {
    title: String!
    slug: String!
    type: String!
    description: String!
    date: String
    chapters: [Chapter] @link
    videos: [VideoInterface] @link
    cover: CoverImage @link
    numVideos: Int!

    # as resolvers
    topics: [String!]
    languages: [String!]
  }

  type Guide implements Node {
    mdx: Mdx! @link
    cover: CoverImage @link
  }

  type TrackPageInfo implements Node {
    title: String!
    description: String!
  }

  type ChallengesPageInfo implements Node {
    title: String!
    description: String!
    featuredText: String!
    featuredChallenge: Challenge @link
  }

  type GuidesPageInfo implements Node {
    title: String!
    description: String!
  }

  type NotFoundInfo implements Node {
    title: String!
    description: String!
    links: [SiteCta]!
  }

  type SiteCta implements Node {
    page: String!
    url: String!
    color: String!
  }

  type FAQPage implements Node {
    title: String!
    description: String!
    sections: [FAQSection]! @link
  }

  type FAQSection implements Node {
    title: String!
    questions: [FAQ]! @link
  }

  type FAQ implements Node {
    slug: String!
    question: String!
    answer: Answer!
  }

  type Answer implements Node {
    text: String!
    list: [String]
    video: YouTubeVideoId
    image: CoverImage @link
  }

  type YouTubeVideoId implements Node {
    id: String!
    list: String
  }

  type CoverImage implements Node {
    id: ID!
    file: File! @link
  }

  type AboutPageInfo implements Node {
    title: String!
    description: String!
    covers: [CoverImage] @link
    coversDescription: String!
    personalSocials: [SocialLinkGroup]!
    secondaryTitle: String!
    secondaryDescription: String!
    siteSocials: [SocialLinkGroup]!
    featuredTitle: String!
    featured: [FeaturedContent]!
    acknowledgementsText: String!
    acknowledgements: [CollaboratorTeam]!
  }

  type SocialLinkGroup implements Node {
    title: String!
    links: [SocialLink!]!
  }

  type SocialLink implements Node {
    site: String!
    url: String!
  }

  type FeaturedContent implements Node {
    title: String!
    description: String!
    thumbnail: CoverImage @link
    url: String!
  }

  type CollaboratorTeam implements Node {
    name: String!
    people: [Collaborator]!
  }

  type Collaborator implements Node {
    name: String!
    url: String
    role: String
  }

  type HomepageInfo implements Node {
    header: PageSection!
    newToCoding: NewToCodingSection!
    tracks: TracksSection!
    challenges: ChallengesSection!
    passengerShowcase: PassengerSection!
    events: EventsSection!
    support: SupportSection!
  }

  type PageSection implements Node {
    title: String!
    description: String!
  }

  type NewToCodingSection implements Node {
    title: String!
    description: String!
    guideCta: Cta!
    discordCta: Cta!
  }

  type Cta implements Node {
    text: String!
    buttonText: String!
    href: String!
  }

  type TracksSection implements Node {
    title: String!
    description: String!
    featured: [Track]! @link
    tracksCta: Cta!
  }

  type ChallengesSection implements Node {
    title: String!
    description: String!
    featured: [Challenge]! @link
    challengesCta: Cta!
  }

  type PassengerSection implements Node {
    title: String!
    featured: [Contribution!]! @link
    cta: Cta!
  }

  type EventsSection implements Node {
    title: String!
    comingEventsDescription: String!
    noEventsDescription: String!
    upcoming: [Event]!
  }

  type Event implements Node {
    title: String!
    description: String!
    date: String!
    time: String!
    host: String!
    type: String!
    url: String!
  }

  type SupportSection implements Node {
    title: String!
    description: String!
    options: [Cta]
  }

  type Query {
    tracksPaginatedFilteredByTags(
      language: String
      topic: String
      skip: Int
      limit: Int
    ): [Track]

    challengesPaginatedFilteredByTags(
      language: String
      topic: String
      skip: Int
      limit: Int
    ): [Challenge]

    contributionsPaginatedFilteredByTags(
      authorSlug: String
      skip: Int
      limit: Int
    ): [Contribution]
  }
`;

export const createSchemaCustomization = ({ actions }) => {
  actions.createTypes(schema);
};
