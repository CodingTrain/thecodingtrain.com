# Content structure guide for The Coding Train team

_Last update: June 7th 2022_

On december 3rd 2021, we decided to start adding real content to this project. This guide serves as starting point to understand how the workflow feels and if the content structure may need to be changed.

With that in mind, the purpose of this guide is to explain the structure of content that feeds the new Coding Train website that is being developed. As we learn about how the setup feels and works,
this guide will be updated accordingly.

## Content folder structure

The main content being considered are concerning videos, tracks and page text content.
They are all kept in the `content/` folder, inside the `videos/`, `tracks/` and `pages/` directories respectively.

The `templates/` folder currently contains metadata files that serve as examples for different types of content.
These can be copied, moved and edited to add new content to the site.

For videos and tracks, the rationale behind the current structure is that videos are the main building blocks of content from which tracks are composes from.
Videos are defined individually in `content/videos/` and tracks are defined in `content/tracks/` and reference which videos are part of them.

```
content
├─ videos
│  ├─ video-folder-1
│  ├─ video-folder-2
│  ├─ ...
│  └─ challenges
└─ tracks
   ├─ main-tracks
   │  ├─ main-track-1
   │  └─ ...
   └─ side-tracks
      ├─ side-track-2
      └─ ...
```

## Videos

Videos tackle specific themes and are part of a sequence of videos (tracks). Each video should have their own folder inside of `content/videos/`.

**Challenges** are a special kind of video, that can be part of tracks but also exists as one-off videos with the intention of inviting viewers to contribute their own work based on the challenge or coding experiment.
This are contained **specifically** inside of `content/videos/challenges`.

Each video, challenge or not, follow a similar folder structure:

```
[videos|challenges]
└─ video-slug
   ├─ index.json
   ├─ images
   │  ├─ image1.png
   │  ├─ image2.jpg
   │  └─ ...
   └─ showcase
      ├─ contribution-slug-1.json
      ├─ contribution-slug-1.png
      ├─ contribution-slug-2.json
      └─ ...

```

- `video-slug/` contains all data related to a specific video. The slug is used to identify the video and reference it on track definitions, and they also become part of the URL path to their video player pages.
- `video-slug/index.json` contains the main metadata for the video: title, description, YouTube video ID, etc...
- `video-slug/images/` contains images specific to the video and can be referenced in `video-slug/index.json` as code example thumbnails.
- `video-slug/showcase/` contains all metadata for contributions that viewers send and are accepted into the site to be part of the Passenger Showcase of the video.
- `video-slug/showcase/contribution-slug.json` contains the metadata for the contribution to be showcased: title, author information, links to code or live versions, etc...

### Video Metadata

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
  "relatedChallenges": ["challenge-1-slug", "challenge-2-slug"],
  "timestamps": [
    { "time": "0:00", "title": "Title 1" },
    { "time": "1:26", "title": "Title 2" },
    { "time": "1:26", "title": "Title 3" }
  ],
  "codeExamples": [
    {
      "title": "Code example 1 title",
      "description": "Code example 1 description",
      "image": "image1.png",
      "urls": {
        "p5": "url to p5 editor or code",
        "processing": "url to processing sketch",
        "other": "url to other source, like GitHub"
      }
    },
    {
      "title": "Code example 2 title",
      "description": "Code example 2 description",
      "image": "image2.png",
      "urls": {
        "other": "url to other source, like GitHub"
      }
    }
  ],
  "groupLinks": [
    {
      "title": "Group of links title",
      "links": [
        {
          "title": "Link 1 title",
          "url": "link 1 url",
          "description": "description of content linked"
        },
        {
          "title": "Link 2 title",
          "url": "link 2 url",
          "description": "description of content linked"
        }
      ]
    }
  ]
}
```

#### Title

Is the title of the video. It's a required metadata property.

#### Description

It's a description of the video. It shouldn't be very long. It's a required metadata property.

#### Video number

Is a text number to associate the video with.
These are specially important for challenge videos, and this value rendered along with the title of the challenge. It may have any value. This property isn't used in any way for normal videos.

#### Video IDs

This property makes reference to video ID found at the end of a YouTube video link. Only the ID is the value expected here, not the whole YouTube URL.

#### Languages and topics

These work as tags for the videos from which they can be filtered. Languages relates to the used coding languages in the video, and topics to specific themes being worked on. There's no limit on how many languages and topics can be specified on each video, but often one or two should be appropriate.

If `"languages"` or `"topics"` aren't set, they will default to an empty array.

#### Passenger Showcase contribution enabling

This property let's us disable the intention for users to send contributions for that specific videos. This property would show or hide the passenger showcase panel and button in a specific video by setting `"canContribute"` to `true` or `false` respectively. If `"canContribute"` is not set challenges default to `true` and regular videos to `false`.

#### Related challenges

This property let's us link challenges to a specific video in any way you see fit. It's an array of slugs, which should match the path slug of a challenge (relative to `content/videos/challenges`) to correctly reference it.

If it's not defined or is left empty, then no challenge panel is shown in the corresponding video page. Multiple slugs can be added, but only the first two will be shown in the page currently.

#### Code examples

`"codeExamples"` should contain objects that reference the main code shown in the video. Referenced images can be contained in the corresponding `images/` folder in the video's directory.

- They should at least have a `"title"`, and hopefully a `"description"`.
- `"image"` should directly reference a file inside of `images/`.
- `"urls"` contain all code sources specific to that code example. `"p5"`, `"processing"` or `"node"` are possible languages we support, and `"other"` is a fallback option.

If `"codeExamples"` isn't set, it will default to an empty array.

#### Group Links

Group links are an abstraction for specifying related groups of links that relate or are mentioned to the video.

It may contain URLs that go outside of The Coding Train site, in which cases the URL should be the full web URL, or it may be for an internal resource in The Coding Train site. For the later, the URL should be the sub-path in the site for that resource that starts with `/`.

The `"description"` and `"icon"` properties are optional, but `"title"` and `"url"` are required.

For now, `"icon"` expects a short emoji string that relates to the link.

`"description"` on the other hand can be a long-ish string that describes the link or something about it. It may also contain MD style urls that will be parsed, so it may also contain anchor links related to the link. For example: `"By [Dan Shiffman](https://shiffman.net/) and [DSI](https://designsystems.international/)!"`.

If `"groupLinks"` isn't set, it will default to an empty array.

### Video's Passenger Showcase

All Passenger Showcase Contributions' should have metadata files (`video-slug/showcase/contribution-slug.json`) that are also JSON files with the following structure:

```json
{
  "title": "Contribution title",
  "author": {
    "name": "Author name",
    "url": "Author url to own website or GitHub"
  },
  "url": "URL to live code of contribution"
}
```

As for required properties: `"title"`, `"author: {"name"}"`, `"url"` are required.

### Images

We also currently support the addition of images related to videos and their showcase to use in the website.

```
[videos|challenges]
├─ placeholder.[png|jpg]
└─ video-slug
   ├─ index.json
   ├─ index.[png|jpg]
   └─ showcase
      ├─ contribution-slug-1.json
      ├─ contribution-slug-1.[png|jpg]
      ├─ contribution-slug-2.json
      └─ ...

```

- `video-slug/showcase/contribution-slug.[png|jpg]` is an optional image (either PNG or JPG) to add at the showcase folder of a video.
  It would be used to visually preview the contribution made by a viewer.
  It should share the file name with their corresponding contribution.
- `video-slug/index.[png|jpg]` is an optional image (either PNG or JPG) to add at the root of a video directory.
  It will be used as visual representation of the video when listed in different pages,
  and also as a placeholder for contributions that also don't include their own `showcase/contribution-slug.[png|jpg]` image.
- `placeholder.[png|jpg]` is a **required** image (either PNG or JPG) to be used as a placeholder for whether a specific video doesn't include their corresponding image at `video-slug/index.[png|jpg]`.
  This image also may be used as a placeholder for contributions that also don't include their own `showcase/contribution-slug.[png|jpg]` image and don't have a video image to fallback on.

## Tracks

Tracks are collections of videos. They come in two types: main and side tracks.

**Main tracks** are sequenced video tutorials that you can follow like a course syllabus, and are the core and principal courses available in The Coding Train, which seek to teach a big theme of multiple videos.

**Side tracks** are collections of related videos but don’t necessarily need to be watched in order, they potentially come from different contexts that relate on a connecting theme.

The current setup separates folders for main and side tracks, and inside those individual folders per track.

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

### Track Metadata

Metadata for main and side tracks look the same. The properties `"title"` and `"description"` are all common and required to be set, and either the `"videos"` property or the `"chapters"` property should be defined on each track (but not both!). To define the collection of videos that compose the track, either `"chapters"` or `"videos"` should be used.

On the one hand, `"chapters"` organizes videos as an ordered sequence of chapters, where each is an ordered collection of videos. Each chapter should also have a `"title"` defined. To reference specific video, the same slug names used for subfolders in the `videos/` folder should be used.

```json
{
  "title": "Track title",
  "description": "Track description",
  "chapters": [
    {
      "title": "First chapter title",
      "videos": ["video-1-slug", "video-2-slug"]
    },
    {
      "title": "Second chapter title",
      "videos": ["video-3-slug", "video-4-slug"]
    }
  ]
}
```

On the other hand, `"videos"` is just a plain video sequence as an array of slugs.

```json
{
  "title": "Track title",
  "description": "Track description",
  "videos": ["video-1-slug", "challenges/video-2-slug", "video-3-slug"]
}
```

### Images

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

Because of the amount of videos, the `videos`, and `videos/challenges` folders may get very populated very quickly which can make file organization hard to query and maintain.

To help against that, video folder definitions can be further organized in arbitrary nested folders in any fashion that make sense to the content maintainers.
When doing this, tracks and videos that reference videos in nested folders must use the whole relative path to specifically reference the video instead of just using the folder slug.

For instance, videos may be organized based on the tracks and chapters that define them:

```
videos
├─ placeholder.[png|jpg]
├─ challenges/
└─ track-name
   ├─ chapter-1
   │  ├─ video-1-slug
   │  │  ├─ index.json
   │  │  ├─ index.[png|jpg]
   │  │  └─ showcase
   │  │     └─ ...
   │  └─ video-2-slug
   │     ├─ index.json
   │     ├─ index.[png|jpg]
   │     └─ showcase
   │        └─ ...
   └─ chapter-2
      ├─ video-3-slug
      │  ├─ index.json
      │  ├─ index.[png|jpg]
      │  └─ showcase
      │     └─ ...
      └─ video-4-slug
         └─ ...
```

This would result in less folders directly inside of `videos`.

To reference it in a track, the relative paths from `videos` should be used.

```json
{
  "title": "Track title",
  "description": "Track description",
  "chapters": [
    {
      "title": "First chapter title",
      "videos": [
        "track-name/chapter-1/video-1-slug",
        "track-name/chapter-1/video-2-slug"
      ]
    },
    {
      "title": "Second chapter title",
      "videos": [
        "track-name/chapter-2/video-3-slug",
        "track-name/chapter-2/video-4-slug"
      ]
    }
  ]
}
```

```json
{
  "title": "Track title",
  "description": "Track description",
  "videos": [
    "track-name/chapter-1/lesson-1-slug",
    "challenges/video-2-slug",
    "video-3-slug"
  ]
}
```

## Pages text content

The text content of most of the pages and sections of the site are also available as JSON or MD files to edit easily. This is all contained in the `content/pages/` folder.

### Homepage

The homepage is composed of seven sections. Each of them gets populated with the text content in the objects defined in a specific property of the JSON object defined in `content/pages/homepage/index.json`.

Most of them contain `"title"` and `"description"` properties to edit the corresponding header and description. A bunch of them have specific CTA sections which's text can also be found as objects in the corresponding section.

The tracks, challenges and passenger showcase sections have a specific set of featured content that can also be edited by adding or removing slugs to the corresponding content. The slugs are defined in a similar fashion as tracks define which videos compose them.

The events sections can show the information of any number of upcoming events. Each event should be defined inside the array associated to the `"upcoming"` property, and should look like the following structure:

```json
{
  "title": "Event title",
  "description": "Event description",
  "date": "YYYY-MM-DD",
  "time": "HH:MM GMT",
  "host": "Host name",
  "type": "IRL or Online",
  "url": "url to event information or access"
}
```

The support section also shows different options to support The Coding Train, and each option follow a similar structure as CTAs.

### Tracks and Challenges pages

The tracks page text content is populated from the contents of `content/pages/tracks/index.json`, while for the challenges page it's in `content/pages/challenges/index.json`. Both files populate the `"title"` and `"description"` sections of the corresponding page with those properties.

The challenges page also show a featured challenge. By setting the `"featuredChallenge"`property with a challenge slug, the corresponding challenge will show as featured. You can also edit the title text before the featured challenge info by editing the `"featuredText"`property.

### Guides page and guides

The guides page text content is populated from the contents of `content/pages/guides/index.json`. Similar to other pages, it populates the page using the `"title"` and `"description"` properties.

But also, guides written as MD documents (as this one) in `content/pages/guides/` can be included as part of the site's user guides.

The only requirement for a guide to be listed in the guides page is for it to also include a frontmatter section that contains a title property (unlike this guide).

Other frontmatter properties to look out for are `date`and `description`, that along side `title` are used to list out the guide in the guides page.

An thumbnail image can be associated to the guide by adding a PNG or JPG image to `content/pages/guides/` with the same name as the guide file.

The content of MD guides will be parsed and create a specific page for it. Local images can be added in the document, whose files should be available too inside of `content/pages/guides/`.

### FAQ page

The FAQ page text content is populated from the contents of `content/pages/faq/index.json`. Similar to other pages, it populates the page using the `"title"` and `"description"` properties.

But also, the `"sections"` key sets how the rest of the page is organized. It defines an array of section objects, each with a `"title"` and an `"questions"` array that contain the file names for the questions that should be part of the section.

Each file name should reference a JSON file in `content/pages/faq/`. The following is question content structure:

```json
{
  "question": "question prompt",
  "answer": {
    "text": "Main text [link text](url).",
    "list": ["item text [link text](url)."],
    "image": "image file name",
    "video": {
      "id": "YouTube video id",
      "list": "YouTube playlist id"
    }
  }
}
```

- Properties `"question"`and `"answer": {"text"}` are the minimum properties to set for any question. All other properties in `"answer"`are optional.
- Setting `"text"` will render a paragraph with the answer. It may contain URLs written in the MD format that will get parsed.
- Setting `"list"` will render a list of items that are expected to contain URLs written in the MD format.
- Setting `"image"` will render an image as part of the answer. The name of the image should be set, and the file should be available inside of `content/pages/faq/`.
- Setting `"video"` will render an embedded YouTube video as part of the answer. At least `"id"` should be set, is `"list"` is also set, then the embedded video will show the video as part of the corresponding playlist.

### About page

The about page text content is populated from the contents of `content/pages/about/index.json`. Similar to other pages, it populates the first section of the page using the `"title"` and `"description"` properties. These are meant to be used to describe Dan.

Two images are expected to be defined in the `"covers"` property, which should be contained in `content/pages/about/` too. `"coversDescription"` is a second part of the first description that relates to the cover images.

`"secondaryTitle"` and `"secondaryDescription"` are similar to `"title"` and `"description"`, but meant to describe The Coding Train.

`"personalSocials"`and `"siteSocials"` receive an array of groups of links. Each group has a `"title"` property, and an array of social media links. Each link has a `"url"` and `"site"` properties, the latter sets the social media icon to show. Values for `"site"` are: `"twitter"`, `"instagram"`, `"youtube"`, `"discord"` or `"github"`.

`"featuredTitle"`and `"featured"` sets the featured section content. Featured elements are objects that have `"title"`, `"description"`, `"thumbnail"` and `"url"` properties. `"thumbnail"` should be an image file, that similar to `"covers"`, files should be contained in `content/pages/about/` too.

Finally, `"acknowledgementsText"`and `"acknowledgements"` sets the acknowledgements section content. `"acknowledgements"` should be an array of groups of people or organizations. Each group should have a `"name"` property, and the `"people"` property defines an array of people/orgs to acknowledge. Each person/org is an object that at least contains a `"name"` property, but can also specify a `"url"` property to link to that person/org's info/site.

### 404 page

The 404 page text content is populated from the contents of `content/pages/404/index.json`. Similar to other pages, it populates the page using the `"title"` and `"description"` properties.

Links to other pages can be added, removed and edited by editing the `"links"` property. A page name, URL and color for the CTA should be provided for each one.

## Testing folder structure

Test scripts are added to the site that checks if all going on inside of `content/` is as expected.

Both commands `npm run test` and `npm run testv` run all available tests through the directory tree. The first one will only show a summary of the testing results and all failed tests, while `testv` would also do this but also log all the individual tests done (v for verbose).

Four types of tests are currently included:

- Testing the folder structure inside `content/`: checks that expected folders are present and that folder's that aren't expected aren't there. This also takes into account multi-level folders for certain specific cases, like content/videos.
- Testing file presence in each folder inside `content/`: similarly as with folders, required files are also checked to be present, and checks there aren't other not expected files.
- Testing that all present JSON files follow expected structure for their type. Track JSON files should have certain properties, while video JSON files should have another set of properties defined.
- Testing that all mentioned slug strings in JSON files correctly reference other existing files/folders. Hopefully this makes notice of spelling errors when referencing videos.
