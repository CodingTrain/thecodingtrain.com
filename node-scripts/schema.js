// We don't necessarily need to add every field here, since
// Gatsby will auto-generate the fields when created. This is
// just to make sure that certain fields are set to certain types.
exports.schema = `

interface Video implements Node {
  id: ID!
  title: String!
  slug: String!
  contributionsPath: String!
  videoId: String!
  description: String!
  date: String
  repository: String
  topics: [String!]
  languages: [String!]
  timestamps: [Timestamp!]
  codeExamples: [CodeExample!] 
  canContribute: Boolean!
  contributions: [Contribution!] @link
  groupLinks: [GroupLink!]
}

type Lesson implements Video & Node {
  id: ID!
  title: String!
  slug: String!
  videoId: String!
  contributionsPath: String!
  description: String!
  date: String
  repository: String
  topics: [String!]
  languages: [String!]
  timestamps: [Timestamp!]
  codeExamples: [CodeExample!] 
  canContribute: Boolean!
  contributions: [Contribution!] @link
  groupLinks: [GroupLink!]
}

type Challenge implements Video & Node {
  id: ID!
  title: String!
  slug: String!
  contributionsPath: String!
  videoId: String!
  description: String!
  date: String
  repository: String
  topics: [String!]
  languages: [String!]
  timestamps: [Timestamp!]
  codeExamples: [CodeExample!] 
  canContribute: Boolean!
  contributions: [Contribution!] @link
  groupLinks: [GroupLink!]
}

type GuestTutorial implements Video & Node {
  id: ID!
  title: String!
  slug: String!
  contributionsPath: String!
  videoId: String!
  description: String!
  date: String
  repository: String
  topics: [String!]
  languages: [String!]
  timestamps: [Timestamp!]
  codeExamples: [CodeExample!] 
  canContribute: Boolean!
  contributions: [Contribution!] @link
  groupLinks: [GroupLink!]
}

type Contribution implements Node {
  title: String!
  name: String!
  author: Author!
  url: String
  videoId: String
  source: String
  notes: [String],
  video: Video! @link
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
  url: String!
  author: String
}

type CodeExample implements Node {
  title: String!
  language: String
  codeURL: String!
  githubURL: String!
  editorURL: String
}

type Author implements Node {
  name: String!
  url: String
}

type Chapter implements Node {
  title: String
  lessons: [Lesson] @link
}

type Track implements Node {
  title: String!
  slug: String!
  type: String!
  description: String!
  chapters: [Chapter] @link
  videos: [Video] @link
  numVideos: Int!
}

type Guide implements Node

type Talk implements Node {
  name: String!
  description: String!
  meta: String!
  link: String
}

type Collaborator implements Node {
  name: String!
  type: String!
  url: String
} 

`;
