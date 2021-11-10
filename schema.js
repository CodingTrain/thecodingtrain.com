// We don't necessarily need to add every field here, since
// Gatsby will auto-generate the fields when created. This is
// just to make sure that certain fields are set to certain types.
exports.schema = `
type Track implements Node {
  title: String!
  slug: String!
  type: String!
  description: String!
  chapters: [Chapter] @link
  numVideos: Int!
}

type Chapter implements Node {
  title: String
  track: Track! @link
  videos: [Video] @link
}

type Video implements Node {
  title: String!
  topics: [String!]
  languages: [String!]
  link: String!
  timestamps: [Timestamp!]
  groupLinks: [GroupLink!] 
  codeExamples: [CodeExample!] 
  canContribute: Boolean!
  contributions: [Contribution!]
}

type Challenge implements Node {
  title: String!
  slug: String!
  description: String!
  topics: [String!]
  languages: [String!]
  link: String!
  timestamps: [Timestamp!]
  groupLinks: [GroupLink!] 
  codeExamples: [CodeExample!] 
  contributions: [Contribution!]
}

type Timestamp implements Node {
  title: String!
  time: String!
  seconds: Int!
}

type GroupLink implements Node {
  title: String!
  links: [Link!]!
}

type Link implements Node {
  title: String!
  author: String
  url: String!
}

type CodeExample implements Node {
  title: String!
  type: String
  codeURL: String!
  githubURL: String!
  editorURL: String
}

type Contribution implements Node {
  title: String!
  url: String!
  author: Author!
}

type Author implements Node {
  name: String
  url: String
}
`;
