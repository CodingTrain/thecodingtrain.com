# Content structure guide for The Coding Train team

_Last update: January 10th 2022_

On december 3rd 2021, we decided to start adding real content to this project. This guide serves as a way to understand how the workflow feels and if the content structure may need to be changed.

With that in mind, the purpose of this guide is to explain the structure of content that feeds the new Coding Train website that is being developed. As we learn about how the setup feels and works,
this guide will be updated accordingly.

## Content folder structure

For now, we'll be just considering content concerning videos and tracks.
They are all kept in the `content/` folder, inside the `videos/` and `tracks/` directories respectively.

The `guides/` folder currently has the website user guides that are in the existing Coding Train website, and are just placeholders for now that would need updating once we settle on the content folder setup.

Similarly, the `talks/` folder contains talk information for the about page, and `collaborators.json` contains information on the sites collaborators. All these can be ignored for now, but feel free to point out aspects that may need tweaks or add real data there too.

The rationale behind the current structure is that videos are the building blocks of content from which tracks are composes from.

```
content
├─ videos
│  ├─ lessons
│  ├─ challenges
│  └─ guest-tutorials
└─ tracks
   ├─ main-tracks
   └─ side-tracks
```

**Note**: At the moment of writing this guide, only the files contained in `content/videos/challenges` and `content/videos/guest-tutorials` really follow the structure and descriptions that gets explained in the rest of this guide. The files contained in those folders were created based on the existing videos in the site, so they should also be good examples for you on how to add similar content. Feel free to delete all folders and files in `content/videos/lessons`, `content/tracks/main-tracks` and `content/tracks/side-tracks`; as these were created as dummy examples and not to represent a real videos.

## Videos

Videos on one hand can be divided in three specific flavors with distinct objectives:

- **Lessons** tackle specific themes and are part of a sequence of lessons (main tracks)
- **Guest tutorials** are one-off lessons on different subjects given by guests lecturers
- **Challenges** are also one-off videos with the intention of inviting viewers to send contributions based on the challenge or coding experiment.

Each video, whatever flavor of video they are, follow a similar folder structure:

```
[lessons|challenges|guest-tutorials]
└─ video-slug
   ├─ index.json
   ├─ src
   │  ├─ code-folder-1
   │  └─ ...
   └─ contributions
      ├─ contribution-slug-1.json
      ├─ contribution-slug-2.json
      └─ ...

```

- `video-slug/` contains all data related to a specific video. The slug is used to identify the video and reference it on track definitions, and they also become part of the path to their video player pages.
- `video-slug/index.json` contains the main metadata for the video: title, description, YouTube video ID, etc...
- `video-slug/src/` contains subfolders with source code related to the video and can be referenced in `video-slug/index.json` as code examples.
- `video-slug/contributions/` contains all metadata for contributions that viewers send and are accepted into the site.
- `video-slug/contributions/contribution-slug.json` contains the metadata for the contribution: title, author information, links to code or live versions, etc...

### Metadata

Each video's metadata file (`video-slug/index.json`) is a JSON file. Each file has the following structure:

```json
{
  "title": "Video title",
  "description": "Video description",
  "videoNumber": "Video number",
  "videoId": "YouTube video ID",
  "date": "YYYY-MM-DD",
  "languages": ["language1", "language2"],
  "topics": ["topic1", "topic2"],
  "canContribute": true,
  "timestamps": [
    { "time": "0:00", "title": "Title 1" },
    { "time": "1:26", "title": "Title 2" },
    { "time": "1:26", "title": "Title 3" }
  ],
  "codeExamples": [
    {
      "title": "Code example 1 title",
      "language": "p5js",
      "folder": "code-folder-1",
      "webEditor": "p5 editor code ID"
    },
    {
      "title": "Code example 2 title",
      "language": "processing",
      "folder": "code-folder-2"
    }
  ],
  "groupLinks": [
    {
      "title": "Group of links title",
      "links": [
        {
          "title": "Link 1 title",
          "url": "link 1 url",
          "author": "author of content linked"
        },
        {
          "title": "Link 2 title",
          "url": "link 2 url",
          "author": "author of content linked"
        }
      ]
    }
  ]
}
```

Most of the properties should translate directly from the current setup. `"title"`, `"description"`, and `"videoId"`, are the only required properties. The rest have a fallback value if not set.

#### Video numbers

We are currently undecided on whether videos should be numbered or not. Currently, videos have numbers in their titles on YouTube and the current website, but the new website might not need them.

We currently have a `"videoNumber"` property in the video JSON that can be set to whatever you want, and it's currently not used in the website.

> **NOTE**: This is an open question to The Coding Train team. If you could give us insight to whether this video number is needed in general or just for some cases, that would be greatly appreciated. Feel free to propose how video numbers should or should not be used.

#### Video IDs

Similar to the current site setup, this property makes reference to video ID found at the end of a YouTube video link. Only the ID is the value expected here, not the whole URL.

#### Languages and topics

The actual values for these haven't been decided, so we are open for you to suggest the set of possible values to have as options. There's no limit on how many languages and topics can be specified on each video, but often one or two should be appropriate.

If `"languages"` or `"topics"` aren't set, they will default to an empty array.

#### Contributions enabling

This property let's us disable the intention for users to send contributions for that specific videos. This property would show or hide the contributions panel and button in a specific video by setting `"canContribute"` to `true` or `false` respectively. If `"canContribute"` is not set, lessons and guest tutorials default to `false` and challenges to `true`.

#### Code examples

`"codeExamples"` are thought to contain objects that reference the main code shown in the video,
and that are contained in the corresponding `src/` folder in the video's directory.

- `"folder"` should directly reference a subfolder inside of `src/`.
- `"language"` is the main language, framework or library being used. We are currently considering values `"p5js"`, `"node"` and `"processing"`. Please let us know if more should be added to add the corresponding image icons.
- `"webEditor"` is only considered for p5.js editors, and is an optional property. In a similar fashion to YouTube video ID's this property only expects the ID at the end of a p5 coding train sketch URL.

If `"codeExamples"` isn't set, it will default to an empty array.

#### Group Links

Group links are a more general abstraction for specifying related groups of links that can be used to specify the "Links discussed" section of videos, "Guest contact information" for guest tutorials,
"Videos discussed", or whatever new section is needed for each video.

In the case of "Videos discussed" or whatever content that lives in the Coding Train site,
instead of specifying the whole url to the resource, the URL can contain the sub-path in the site for that resource that starts with `/`.

The `"author"` property is optional, but `"title"` and `"url"` are required.

If `"groupLinks"` isn't set, it will default to an empty array.

#### Contributions

Contributions' metadata files (`video-slug/contributions/contribution-slug.json`) are also JSON files with the following structure that closely resembles the one suggested in the [current contribution guide](https://thecodingtrain.com/Guides/community-contribution-guide.html):

```json
{
  "title": "Contribution title",
  "author": {
    "name": "Author name",
    "url": "Author url to own website or GitHub"
  },
  "url": "URL to live code of contribution",
  "videoId": "YouTube video ID to video of contribution",
  "source": "URL to source code of contribution"
}
```

Similar to the current one,
`"title"`, `"author: {"name"}"` are required, and either `"url"`, `"videoId"` or `"source"` is expected.

#### Images

We also currently support the addition of images related to videos and their contributions to use in the website.

```
[lessons|challenges|guest-tutorials]
├─ placeholder.[png|jpg]
└─ video-slug
   ├─ index.json
   ├─ index.[png|jpg]
   └─ contributions
      ├─ contribution-slug-1.json
      ├─ contribution-slug-1.[png|jpg]
      ├─ contribution-slug-2.json
      └─ ...

```

- `video-slug/contributions/contribution-slug.[png|jpg]` is an optional image (either PNG or JPG) to add at the contributions folder of a video.
  It would be used to visually preview the contribution made by a viewer.
  It should share the file name with their corresponding contribution.
- `video-slug/index.[png|jpg]` is an optional image (either PNG or JPG) to add at the root of a video directory.
  It will be used as visual representation of the video when listed in different pages,
  and also as a placeholder for contributions that also don't include their own `contributions/contribution-slug.[png|jpg]` image.
- `placeholder.[png|jpg]` is a **required** image (either PNG or JPG) to be used as a placeholder for whether a specific video doesn't include their corresponding image at `video-slug/index.[png|jpg]`.
  This image also may be used as a placeholder for contributions that also don't include their own `contributions/contribution-slug.[png|jpg]` image and don't have a video image to fallback on.

Feel free to also update the current placeholder images!

### Tracks

On the other hand, tracks come in two types: main and side tracks.

**Main tracks** are the core and principal courses available in the coding train, which seek to teach a big theme of multiple lessons. Main tracks also are composed of a sequence of chapters,
where each one is further composed of a sequence of **lessons**.

**Side tracks** are curated collection of **videos** from potentially different contexts that relate on a connecting theme. Side tracks are a simple sequence of videos, and therefore can contain either lessons from main tracks, challenges and guest tutorials.

The current setup is similar to `videos/`, where there's separate folders for main and side tracks, and inside those individual folders per track.

```
tracks
├─ main-tracks
│  ├─ track-slug-1
│  │  └─ index.json
│  └─ track-slug-2
│     └─ index.json
└─ side-tracks
   ├─ track-slug-3
   │  └─ index.json
   ├─ track-slug-4
   │  └─ index.json
   └─ ...
```

Each `track-slug/` folder defines a new track and contains the track metadata in `index.json`.

#### Metadata

Metadata for main and side tracks are very similar,
they just differ in a property to define the video collection it includes. The properties `"title"` and `"description"` are all common and required to be set.

For main tracks, the required property to define the collection is `"chapters"`. This defines an ordered sequence of chapters, where each is an ordered collection of lessons. Each chapter should also have a `"title"` defined. To reference specific lessons, the same slug names used for subfolders in the `videos/lessons` folder should be used.

```json
{
  "title": "Main track title",
  "description": "Main track description",
  "chapters": [
    {
      "title": "First chapter title",
      "lessons": ["lesson-1-slug", "lesson-2-slug"]
    },
    {
      "title": "Second chapter title",
      "lessons": ["lesson-3-slug", "lesson-4-slug"]
    }
  ]
}
```

For side tracks, the required property is `"videos"`, which is a plain video sequence array. In this case, a path like notation should be used as to clarify if the slug being added for each video is a lesson, challenge or guest tutorial:

```json
{
  "title": "Side track title",
  "description": "Side track description",
  "videos": [
    "lessons/video-1-slug",
    "challenges/video-2-slug",
    "guest-tutorials/video-3-slug"
  ]
}
```

#### Images

Similar to videos, we currently support the addition of an image for each track to use as a cover in different pages.

The `tracks/[main|side]-tracks/track-slug/index.[png|jpg]` images are each track individual cover images and their presence is optional.

```
tracks
├─ main-tracks
│  ├─ placeholder.[png|jpg]
│  ├─ track-slug-1
│  │  ├─ index.[png|jpg]
│  │  └─ index.json
│  └─ track-slug-2
│     ├─ index.[png|jpg]
│     └─ index.json
└─ side-tracks
   ├─ placeholder.[png|jpg]
   ├─ track-slug-3
   |  ├─ index.[png|jpg]
   │  └─ index.json
   ├─ track-slug-4
   |  ├─ index.[png|jpg]
   │  └─ index.json
   └─ ...
```

On the other hand, the `tracks/[main|side]-tracks/placeholder.[png|jpg]` images are required and will be used as fallback for each side of tracks that don't have a cover image.

### Nested folders in video folders

Because of the amount of videos, the `lessons`, `challenges` and `guest-tutorials` folders may get very populated very quickly which can make file organization hard to query and maintain.

To help against that, video folder definitions can be further organized in arbitrary nested folders in any fashion that make sense to the content maintainers.
When doing this, tracks that reference videos in nested folders must use the whole relative path to specifically reference the video instead of just using the folder slug.

For instance, lessons may be organized based on the tracks and chapters that define them:

```
lessons
├─ placeholder.[png|jpg]
└─ track
   ├─ chapter-1
   │  ├─ lesson-1-slug
   │  │  ├─ index.json
   │  │  ├─ index.[png|jpg]
   │  │  └─ contributions
   │  │     └─ ...
   │  └─ lesson-2-slug
   │     ├─ index.json
   │     ├─ index.[png|jpg]
   │     └─ contributions
   │        └─ ...
   └─ chapter-2
      ├─ lesson-3-slug
      │  ├─ index.json
      │  ├─ index.[png|jpg]
      │  └─ contributions
      │     └─ ...
      └─ lesson-4-slug
         └─ ...
```

This would result in less folders directly inside of `lessons`.

To reference it in a main track, the relative paths from `lessons` should be used.

```json
{
  "title": "Main track title",
  "description": "Main track description",
  "chapters": [
    {
      "title": "First chapter title",
      "lessons": [
        "track/chapter-1/lesson-1-slug",
        "track/chapter-1/lesson-2-slug"
      ]
    },
    {
      "title": "Second chapter title",
      "lessons": [
        "track/chapter-2/lesson-3-slug",
        "track/chapter-2/lesson-4-slug"
      ]
    }
  ]
}
```

While in side tracks, the relative path from `videos` should be used:

```json
{
  "title": "Side track title",
  "description": "Side track description",
  "videos": [
    "lessons/track/chapter-1/lesson-1-slug",
    "challenges/video-2-slug",
    "guest-tutorials/video-3-slug"
  ]
}
```

This can be done with the three main video folders: `lessons`, `challenges` and `guest-tutorials`.
