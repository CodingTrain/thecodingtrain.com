# Adding content guide for The Coding Train team

_Last update: December 6th 2021_

On december 3rd 2021 there was an agreement to start adding real content to this project.
This would serve as a way to understand how the workflow feels and if the developing structure may benefit of changes or tweaks.

With that in mind,
the purpose of this guide is to show how to add content to the new Coding Train website being develop.
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
So this can be ignored for now.

```
content
├── videos
│   ├── lessons
│   ├── challenges
│   └── guest-tutorials
└── tracks
```

The rationale behind this structure thinks of videos as the building blocks of content from which tracks are compose from.

### Video

Videos on one hand can be divided in three specific flavors with distinct functions.
**Lessons** tackle specific themes and are part of a sequence of lessons (main tracks),
**guest tutorials** are more autocontained lessons on very different subjects given by guests lecturers,
and **challenges** are also very specific and autocontained resources with the intention of inviting viewers to send contributions based on the challenge.

Each video,
whatever flavor of video they are,
follow a similar folder structure:

```
[lessons|challenges|guest-tutorials]
└── video-slug
    ├── index.json
    └── contributions
        ├─ contribution-slug-1.json
        ├─ contribution-slug-2.json
        └─ ...

```

- `video-slug/` folder contains all data related to a specific video. The slug used to identify the video and reference it on track definitions.
- `video-slug/index.json` file contains the main metadata for the video: title, description, YouTube video ID, etc...
- `video-slug/contributions/` folder contains all code contributions that viewers send and are accepted into the site.
- `video-slug/contributions/contribution-slug.json` file contains the metadata for the contribution: title, author information, links to code or live versions, etc...

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
  It should share it's file name with the corresponding contribution.
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

Each `track-slug-1.json` file defines a new track and contains

#### Images

```
tracks
├── track-slug-1.json
├── track-slug-1.[png|jpg]
├── track-slug-2.json
├── track-slug-2.[png|jpg]
└── ...

```
