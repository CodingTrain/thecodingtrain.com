# Content structure guide for The Coding Train team

_Last update: December 9th 2021_

On december 3rd 2021 there was an agreement to start adding real content to this project.
This would serve as a way to understand how the workflow feels and if the developing structure may benefit of changes or tweaks.

With that in mind,
the purpose of this guide is to explain the structure of content that feeds the new Coding Train website that is being developed.
As we learn about how the setup feels and works,
this guide will be updated accordingly.

## Content folder structure

For now,
we'll be just considering content concerning videos
and tracks.
They are all kept in the `content/` folder,
inside the `videos/` and `tracks/` directories respectively.

The `guides/` folder currently has the website user guides that are in the existing Coding Train website,
and are just placeholders for now that would need updating once we settle on the content folder setup.
Similarly,
the `talks/` folder contains talk information for the about page,
and `collaborators.json` contains information on the sites collaborators.
All these can be ignored for now,
but feel free to point out or add real data there too.

The rationale behind the current structure thinks of videos as the building blocks of content from which tracks are compose from.

```
content
├── videos
│   ├── lessons
│   ├── challenges
│   └── guest-tutorials
└── tracks
```

**Note**: At the moment of writing this guide,
only the files contained in `content/videos/challenges` and `content/videos/guest-tutorials` really follow the structure and descriptions that gets explained in the rest of this guide.
The files contained in those folders were created based on the existing videos in the site,
so they should also be good examples for you on how to add similar content.
Feel free to delete all folders and files in
`content/videos/lessons`,
as these were created as dummy examples and not to represent a real video.

## Videos

Videos on one hand can be divided in three specific flavors with distinct objectives:

- **Lessons** tackle specific themes and are part of a sequence of lessons (main tracks),
- **guest tutorials** are more autocontained lessons on very different subjects given by guests lecturers,
- and **challenges** are also very specific and autocontained resources with the intention of inviting viewers to send contributions based on the challenge or coding experiment.

Each video,
whatever flavor of video they are,
follow a similar folder structure:

```
[lessons|challenges|guest-tutorials]
└─ video-slug
    ├─ index.json
    ├─ src
    │   ├─ code-folder-1
    │   └─ ...
    └─ contributions
        ├─ contribution-slug-1.json
        ├─ contribution-slug-2.json
        └─ ...

```

- `video-slug/` folder contains all data related to a specific video. The slug is used to identify the video and reference it on track definitions,
  and they also become part of the path to their video player pages.
- `video-slug/index.json` file contains the main metadata for the video: title, description, YouTube video ID, etc...
- `video-slug/src/` folder contains subfolders with source code related to the video and can be referenced in `video-slug/index.json` as code examples.
- `video-slug/contributions/` folder contains all metadata for contributions that viewers send and are accepted into the site.
- `video-slug/contributions/contribution-slug.json` file contains the metadata for the contribution: title, author information, links to code or live versions, etc...

### Metadata

Each video's metadata file (`video-slug/index.json`) is a JSON file.
Each file has the following structure:

```json
{
  "title": "Video title",
  "description": "Video description",
  "videoNumber": 34,
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
      "wedEditor": "p5 editor code"
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

Most of the properties should translate directly from the current setup.

#### Video numbers

Video numbers are contextual and that nature depends on the type of video.
Challenges and guest tutorials are thought of their own type of collections of videos,
so numbers are relative to those collections.
Lessons on the other hand are relative to main tracks and chapters.

How these numbers are used in the new site is unclear.
Feel free to propose how video numbers could be used.

#### Languages and topics

The actual values for these haven't been decided,
so we are open for you to suggest the set of possible values to have as options.
There's not real limit to how many languages and topics can be specified on each video,
but up to two or three should be appropriate.

#### Contributions enabling

Es you would expect,
the corresponding value can be either `true` or `false`.
Setting it to false would hide the contributions panel in the corresponding video page.
If not set,
lessons and guest tutorials default to `false` and challenges to `true`.

#### Code examples

`"codeExamples"` are thought to contain objects that reference the main code worked on the video,
and that are contained in the corresponding `src/` folder in the video's directory.

`"folder"` should directly reference a subfolder inside of `src/`.

`"language"` is the main language, framework or library being used.
We are curretly considering values `"p5js"`, `"node"` and `"processing"`.
Please let us know if more should be added to add the corresponding image icons.

While `"webEditor"` are considered only for p5.js editors,
and is an optional property.

If there are missing properties to consider in this translation,
please let us know!

#### Group Links

Group links are a more general abstraction for specifying theme related groups of links that can be used to specify the "Links discussed" section of videos,
"Guest contact information" for guest tutorials,
"Videos discussed" ,
or whatever new section is needed for each video.

In the case of "Videos discussed" or whatever content that lives in the Coding Train site,
instead of specifying the whole url to the resource,
the URL can contain the sub-path in the site for hat resource that starts with `/`.

The `"author"` property is optional, but `"title"` and `"url"` are required.

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
├── placeholder.[png|jpg]
└── video-slug
    ├── index.json
    ├── index.[png|jpg]
    └── contributions
        ├── contribution-slug-1.json
        ├── contribution-slug-1.[png|jpg]
        ├── contribution-slug-2.json
        └── ...

```

- `video-slug/contributions/contribution-slug.[png|jpg]` is an optional image (either PNG or JPG) to add at the contributions folder of a video.
  It would be used to visually preview the contribution made by a viewer.
  It should share the file name with their corresponding contribution.
- `video-slug/index.[png|jpg]` is an optional image (either PNG or JPG) to add at the root of a video directory.
  It will be used as visual representation of the video when listed in different pages,
  and also as a placeholder for contributions that also don't include their own `contributions/contribution-slug.[png|jpg]` image.
- `placeholder.[png|jpg]` is a **required** image (either PNG or JPG) to be used as a placeholder for whether a specific video doesn't include their corresponding image at `video-slug/index.[png|jpg]`.
  This image also may be used as a placeholder for contributions that also don't include their own `contributions/contribution-slug.[png|jpg]` image and don't have a video image to fallback on.

### Tracks

On the other hand,
tracks come in two types.

**Main tracks** are the core and principal courses available in the coding train,
which seek to teach a big theme of multiple lessons.
Main tracks also are composed of a sequence of chapters,
where each one is further composed of a sequence of **lessons**.

**Side tracks** are curated collection of **videos** from potentially different contexts that relate on a connecting theme.
Side tracks are a simple sequence of videos,
and therefore can contain either lessons from main tracks,
challenges and guest tutorials.

The current setup is more straightforward:

```
tracks
├── track-slug-1.json
├── track-slug-2.json
└── ...

```

Each `track-slug-1.json` file defines a new track and contains the track metadata.

#### Metadata

Metadata for main and side tracks are very similar,
they just differ in a `"type"` property and a corresponding property to define the video collection it includes.

For main tracks,
the property you should use is `"chapters"`.
This defines an ordered sequence of chapters,
where each is an ordered collection of lessons.
To reference specific lessons,
the same slug names used for subfolders in the `videos/lessons` folder should be used.

```json
{
  "title": "Main track title",
  "type": "main",
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

For side tracks,
you should use `"videos"`,
which is a plain video sequence.
In this case,
a path like notation should be used as to clarify if the slug being added for each video is a lesson, challenge or guest tutorial:

```json
{
  "title": "Side track title",
  "type": "side",
  "description": "Side track description",
  "videos": [
    "lessons/video-1-slug",
    "challenges/video-2-slug",
    "guest-tutorials/video-3-slug"
  ]
}
```

#### Images

Similar to videos,
we currently support the addition of an image for each track to use as a cover in different pages.
The image for each track should have the same file name as the corresponding track and their presence is optional.

```
tracks
├── placeholder.[png|jpg]
├── track-slug-1.json
├── track-slug-1.[png|jpg]
├── track-slug-2.json
├── track-slug-2.[png|jpg]
└── ...

```

On the other hand,
the `placeholder.[png|jpg]` image is required and will be used as fallback for all tracks that don't have a cover image.
