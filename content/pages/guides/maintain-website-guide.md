---
title: 'Maintaining the website'
description: 'Guide on adding content to the site'
date: '05/11/2022'
---

You want to help with integrating new content into the site? Great to hear that! Now let’s see how you can help:

A new Coding Train video has been released and you want to add it to the website so everyone else can find it there? OK, just follow these steps:

## Coding Challenges - adding video folder

Make a folder for the video inside `content/videos/challenges`. The folder title should be formatted as `#-name-of-challenge`, replacing '#' with the challenge's number. Add a file named `index.json` to the folder.

Then copy the template into the `index.json`

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
      "title": "Videos",
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
    }, 
    {
      "title": "References",
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

For the `groupLinks` section, links to videos should be put in a `Videos` group. Links to other pages, such as Wikipedia articles, blog posts, and documentation entries should be put in a `References` group.

## Coding Challenges - linking to code examples

In the `index.json` file of a challenge, the `codeExamples` field contains the code examples displayed below the video.

```jsonc
{
  // ...
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
    }
  ],
  // ...
}
```

The URLs of the code examples should ideally be in the following format:

| Language | Description | Example |
| -------- | ----------- | ------- |
| `p5`     | Link to p5.js Web Editor sketch | `https://editor.p5js.org/codingtrain/sketches/pLW3_PNDM` |
| `p5`, `processing`, `other`     | Link to code example on GitHub (from the [Coding Challenges repo](https://github.com/CodingTrain/Coding-Challenges/)) | `https://github.com/CodingTrain/Coding-Challenges/tree/main/169_Pi_Day/p5` |



To add thumbnail images for the code examples (the output of the code), the images should be inside a subfolder named `images` in the challenge folder.


## Tracks - adding template & video folder

Find the track to which the video belongs. Track folders are found in `content/videos/tracks` If the video's track doesn't exist yet, go ahead and create a folder for the track. The video should be formatted as `name-of-video`.

Follow the steps for adding a coding challenge, adding the `index.json` into the newly created video folder.

## Tracks - Adding video to track

Finally, navigate to `content/tracks/main-tracks` or `content/tracks/side-tracks` (depending on the type of track) and open the `index.json` file of the track the video belongs to.

For new tracks, decide whether the track is a Main Track or a Side Track:

- Main Tracks follow a linear progression, with each new video building on skills learned in the previous video
  - An example of a Main Track would be "The Nature of Code 2" track
- Side Tracks are organized around a central theme or idea, and don't necessarily follow a linear progression
  - An example of a Side Track would be the "2018 Workflow" track

Copy the template into the `index.json` file and fill out the track information. Add the path to the video (e.g. `tracks/name-of-track/name-of-video`) under the "videos" section.

```json
{
  "title": "Title of track",
  "description": "Track description",
  "videos": [
    "tracks/title-of-track/title-of-video-1",
    "tracks/title-of-track/title-of-video-2"
  ]
}
```

<br/>

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

| Property | Description                                           | Example                                                    |
| -------- | ----------------------------------------------------- | ---------------------------------------------------------- |
| `title`  | Official event title                                  | `"Neuroevolution - the Nature of Code"`                    |
| `date`   | The scheduled date for the event                      | `2022-07-16`                                               |
| `time`   | The schedule time for the event                       | `"20:00"`                                                  |
| `host`   | Host of the event                                     | "Coding Train",                                            |
| `type`   | Is the event in person? online?                       | `irl/livestream...`                                        |
| `url`    | Website where can attendees register or attend event. | `https://www.youtube.com/channel/UCvjgXvBlbQiydffZU7m1_aw` |
