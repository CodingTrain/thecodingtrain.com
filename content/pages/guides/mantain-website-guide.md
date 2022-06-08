---
title: 'Maintaining the website'
description: 'Guide on adding content to the site'
date: '06/08/2022'
---

You want to help with integrating new content into the site? Great to hear that! Now let’s see how you can help:

A new Coding Train video has been released and you want to add it to the website so everyone else can find it there? OK, just follow these steps:

## Coding Challenges - Adding video

If you want to add a new (or old) challenge video to the site, you can follow these instructions.

Make a folder for the video inside `content/videos/challenges`. The folder title should be formatted as `#-name-of-challenge`, replacing '#' with the challenge's number. Add a file named `index.json` to the folder.

Then copy the template into the `index.json`:

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
  "relatedChallenges": ["number-challenge-1", "number-challenge-2"],
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

Then edit this template and fill it with all the video's metadata. Most keys should explain themselves (we hope!), except maybe the following:

The `"videoNumber"` key is important for challenges! It should match the challenge number.

The `"languages"` and `"topics"` refer to ways of tagging the content of the video, with the coding languages present in the video and the themes being worked on the video. Don't add more than two tags for each video (two languages and two topics).

The `"canContribute"` key sets if the passenger showcase for the video will be shown. Challenges should be set to `true`, other videos may vary.

The `"relatedChallenges"` key specifies an array of challenges that relate to the new video. It may be an empty array.

For the `"codeExamples"` section, each code example should at least contain one URL to the code in the `"urls"` object. The keys for that object `"p5"`, `"processing"` or `"node"` reference the possible languages we support for icons, and `"other"` is a fallback option in case none of the previous ones apply.

Also, each code example can have a thumbnail linked to it using the `"image"`key. You should also add the corresponding image to the file system, in an `images/` folder inside the video folder.

For the `"groupLinks"` section, links to videos should be put in a `"Videos"` group. Links to other pages, such as Wikipedia articles, blog posts, and documentation entries should be put in a `"References"` group.

### Adding video thumbnail

You can also add a thumbnail for the video! To do that, just add an image file (either PNG or JPG) to video's folder, next to `index.json`, and call it `index.png` or `index.jpg`.

The site will generate multiple different sized version for the image, so you shouldn't worry about adding multiple images. But, in general it's better to provide a bigger image so that all sizes are of good quality.

## Tracks - Adding video

If you want to add a new (or old) video that belongs to a track to the site, you can follow these instructions.

Find the track to which the video belongs. Track folders are found in `content/videos/tracks`, either inside of `main-tracks/` or `side-tracks/`. If the video's track doesn't exist yet, check the [create track section](#tracks---adding-new-track).

Then, add a folder for the video in `content/videos/`, it should be formatted as `"name-of-video"`. Then, follow the steps for adding a coding challenge, adding the `index.json` into the newly created video folder. In this case, the video number is not relevant.

You can also nest that video folder further in the folder organization. To do that, check the [videos in nested folders section](#videos-in-nested-folders).

Finally, make sure that the newly added video's folder name (let's say `"name-of-video"`) is present in the corresponding track's `index.json` file in the position you feel is right in the track's organization (if the video is further nested inside of `content/videos/`, check [videos in nested folders section](#videos-in-nested-folders).).

### Adding track thumbnail

You can also add a thumbnail for the track! To do that, just add an image file (either PNG or JPG) to tracks's folder, next to `index.json`, and call it `index.png` or `index.jpg`.

The site will generate multiple different sized version for the image, so you shouldn't worry about adding multiple images. But, in general it's better to provide a bigger image so that all sizes are of good quality.

## Tracks - Adding new track

Navigate to `content/tracks/main-tracks` or `content/tracks/side-tracks` (depending on the type of track) and create a folder for the track, it should be formatted as `"name-of-track"`. Then create a `index.json` file for the track inside of that folder.

To decide whether the track is a Main Track or a Side Track:

- Main Tracks follow a linear progression, with each new video building on skills learned in the previous video
  - An example of a Main Track would be "The Nature of Code 2" track
- Side Tracks are organized around a central theme or idea, and don't necessarily follow a linear progression
  - An example of a Side Track would be the "2018 Workflow" track

Once you've created the folder and file inside of either `content/tracks/main-tracks` or `content/tracks/side-tracks`, then you should fill out the track's metadata. There's two ways of organizing the tracks' videos: through a `"chapters"`key or a `"videos"`key.

On the one hand, `"chapters"` organizes videos as an ordered sequence of chapters, where each is an ordered array of videos. Each chapter should also have a `"title"` defined. To reference specific video, you should use reference the name of the corresponding video inside of `content/videos/`. To follow the chapter structure, you can copy the following template:

```json
{
  "title": "Track title",
  "description": "Track description",
  "chapters": [
    {
      "title": "First chapter title",
      "videos": ["name-of-video-1", "name-of-video-2"]
    },
    {
      "title": "Second chapter title",
      "videos": ["name-of-video-3", "name-of-video-4"]
    }
  ]
}
```

On the other hand, `"videos"` is just a plain array of video names. To follow the videos structure, you can copy the following template:

```json
{
  "title": "Track title",
  "description": "Track description",
  "videos": ["name-of-video-1", "name-of-video-2", "name-of-video-3"]
}
```

## Create a Pull Request

Whenever you've finished working you can submit a pull request so that your
changes get merged into the actual website. If you don't know how to do so,
have a look at this handy
[guide](https://guides.github.com/activities/forking/#making-a-pull-request)
from GitHub.

## Troubleshooting

Sometimes, things don't work like they should. If you get stuck, don't worry!
Feel free to ask for help at any time, file an issue or come say hello in the [Coding Train Discord](https://discord.com/invite/hPuGy2g).

## Adding a New Event

If you'd like to an event to the Coding Train homepage you will need to edit the `content/pages/homepage/index.json` file. By adding a new event object to the `events` object's array of `"upcoming"` events. Note, if there are currently no upcoming events then `"upcoming"` will be an empty array like `"upcoming": []`.

```json
  "upcoming": [{
        "title": "Neuroevolution - the Nature of Code",
        "description": "Watch as Dan steps through each of these fun challenges, then put your new knowledge to work and create your own projects.",
        "date": "2022-07-16",
        "time": "20:00",
        "host": "dan Shiffman",
        "type": "Livestream",
        "url": "https://www.youtube.com/channel/UCvjgXvBlbQiydffZU7m1_aw"
  }]
```

Now let's take a closer look at each property:

| Property | Description                                                | Example                                                    |
| -------- | ---------------------------------------------------------- | ---------------------------------------------------------- |
| `title`  | Official event title                                       | `"Neuroevolution - the Nature of Code"`                    |
| `date`   | The scheduled date for the event                           | `2022-07-16`                                               |
| `time`   | The schedule time for the event                            | `"20:00"`                                                  |
| `host`   | Path to the corresponding code files inside the repository | "dan Shiffman",                                            |
| `type`   | Is the event in person? online?                            | `irl/livestream...`                                        |
| `url`    | Website where can attendees register or attend event.      | `https://www.youtube.com/channel/UCvjgXvBlbQiydffZU7m1_aw` |

## Videos in nested folders

The `videos/`, and `videos/challenges/` folders' folder definitions can be further organized in arbitrary nested folders in any fashion that makes sense.

When doing this, tracks and videos that reference videos in nested folders must use the whole relative path to specifically reference the video instead of just using the folder slug.

For instance, videos may be organized based on the tracks and chapters that define them:

```
videos
├─ challenges/
└─ track-name
   ├─ chapter-1
   │  ├─ video-1-slug
   │  │  └─ index.json
   │  └─ video-2-slug
   │     └─ index.json
   └─ chapter-2
      ├─ video-3-slug
      │  └─ index.json
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
