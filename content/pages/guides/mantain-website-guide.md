---
title: 'Help Maintain the Website Guide'
description: 'Guide about how you can help us maintain the site'
date: '03/07/2022'
---

# Ex Core Contribution Guide

This short guide will help you set up a local copy of the entire Coding Train
website so you can help us making it even better. All the code for the website is available on [Github](https://github.com/CodingTrain/website).

## Create a Fork

First of all you should create a fork of this repository. This is especially
necessary when you want your modification to be merged into the live site at
a later point. GitHub has an excellent
[guide](https://guides.github.com/activities/forking/) on how to fork a
project. Carry on after you have successfully forked the repository and
cloned your fork locally.

## Environment Setup

This website is build on top of Jekyll, which is a static site generator. To
build the website you need to be able to run Jekyll on your system.
In order to do so you can choose between using Docker or a native installation.

### Using Docker

To make your life _a lot_ easier you can use Docker to run Jekyll. Everything is already
configured and ready to go. Just make sure you have Docker and `docker-compose` installed on your system.
After that, simply run

```
$ docker-compose up
```

Linux users may have to use `sudo` to build the site. It is a minor change to the original command, simply run

```
$ sudo docker-compose up
```

Docker will then run a container with all dependencies installed.
Head over to `http://localhost:4000` to see the built site.
You can leave the container running in the background and it will keep watching
your changes and rebuilding certain parts if necessary.

### Using Native Jekyll Installation

#### Install Jekyll

In order to install Jekyll, head over to the [Jekyll Docs](https://jekyllrb.com/docs/) and follow the
instructions there. Once you've installed Jekyll you can try to build the
site.

#### Install Gems

Jekyll's build on top of Ruby and has some dependencies that need to be
installed as well in order to work properly. You can think of it similar to
NPM and Node.JS modules where "Gems" are the dependencies managed by
"Bundler". You can check out a more detailed explanation on [Jekyll's
website](https://jekyllrb.com/docs/ruby-101/).

To install the Gems needed by Jekyll, run the following command in your
terminal from where you've cloned your fork:

```
$ bundle install
```

This might take some time since Bundler now goes ahead and fetches all Gems
listed in a file called `Gemfile` which you can find at the root of the
project.

#### Build The Site

After you've installed everything, you should be able to build the site. Just
run this command:

```
$ bundle exec jekyll build
```

Jekyll should now have created a new folder called `_site` with the finished version of the website inside. In order to view it, point a local webserver to that directory. One way you could do this is jump into the `_site` folder and run this command:

```
$ python -m SimpleHTTPServer
```

Now, fire up a web browser and go to `http://localhost:8000`. You should now have your own local copy of the website.

Keep in mind that after every change you've made, you need to rebuild the site using the build command as shown above. Since this gets annoying very quickly, Jekyll got you covered with another command:

```
$ bundle exec jekyll serve
```

This command doesn't finish by itself like the others did. Instead, it
instructs Jekyll to watch all your project files for changes and
automatically triggers a rebuild whenever you modify a file. Moreover, Jekyll
brings a built-in webserver that is reachable at `http://localhost:4000` as
long as the command is running so you also don't need to set up one yourself
like we did with the second command before.

At this point, you can finally start working! 🎉

## Create a Pull Request

Whenever you've finished working you can submit a pull request so that your
changes get merged into the actual website. If you don't know how to do so,
have a look at this handy
[guide](https://guides.github.com/activities/forking/#making-a-pull-request)
from GitHub.

## Troubleshooting

Sometimes, things don't work like they should. If you get stuck, don't worry!
Feel free to ask for help at any time! You can even join the `#website`
channel over on Slack if you are a member of The Coding Train.

# Ex Page contribution guide

_Last updated: October 20th 2020_

Pages who needs them? Well the Coding Train website. You may have noticed that the Coding Train website might be missing a page for any number of videos that have been released on YouTube. If you'd like to help by adding new pages or updating existing pages this guide should help you.

Everyone is welcome to work on the pages of the Coding Train website. In most cases you don't even need to understand how to code but if you're unfamiliar with how Git/GitHub works please checkout the [Coding Train's Git/GitHub series](https://thecodingtrain.com/beginners/git-and-github/). If you're new to the world of git version control the Coding Train website is a great open source project to get started with. There are no questions are stupid here on the Coding Train.

> **\*Note:** Developing pages is much easier to do locally. Check out the [Core Contribution Guide](https://thecodingtrain.com/Guides/core-contribution-guide.html) for steps on setting up a local development environment.\*

If the guide hasn't been updated in awhile then you might want to check in to make sure it's up to date before using it. Which leads us into the first thing to do.

## Check in before you start working.

Please [create an issue](https://github.com/CodingTrain/website/issues/new) on the repository before you start work to avoid two people working on the same project or working on a changes that won't be accepted when you make you're pull request. If there's already an issue that's requesting help then no need to make a new one but make sure you comment and say what you're working on.

## Where does the page go?

Think about how you would like to find a page from the landing page of the website. Which drop down menu would you click on and which section would you find you page in?

As a random (maybe not so random) example let's take the video about the random function in p5.js. It would be found under beginners and then p5.js. So it will go under `_beginners/p5js` and the page name would be `2.5-random.md` so the full path would be `_beginners/p5js/2.5-random.md`.

You might have a few questions.

- **Why the underscore at the beginning of the first directory?** I'm glad you asked that's because of [Jekyll](https://jekyllrb.com/). Jekyll is the static site generated that we use for the Coding Train site. When jekyll is building the site it doesn't include directories that begin with `_` in the final site. This way the markdown pages don't end up on thecodingtrain.com only the html pages generated from the markdown.

- **Why no period in p5.js?** Because then it maybe interpreted by the computer as a JavaScript file. These days most computers are smart enough not to treat directories as file but there's always edge cases so why not try to avoid them.

- **Why that particular way of writing the page title?** As a rule of thumb we keep titles of pages to the video number `2.5` in this case followed by a `-` and then title of the video using `-` instead of spaces. Feel free to shorten the title within reason. Avoid using special characters or spaces because it can cause problems between operating systems when working with the repository.

- **What is .md?** `.md` stands for Markdown. It's a markup language like html but has less feature. It's generally used on GitHub instead of text files. However, in this case the contents of the page is mostly YAML and HTML but we mark it as markdown because that's what Jekyll wants.

If you are creating a new directory you will need an index.md page to make sure the videos are listed. Most of these will be for a series you are adding. Here's an example:

```yaml
---
title: # Series or Section Title
layout: series-index
redirect_from: # short urls or if series was moved
  - /p5js # would be an example, meaning https://thecodingtrain.com/p5js goes to this page
---
<!-- A couple sentences of description about series -->
```

If you've got further questions then don't hesitate to ask.

> **\*Note:** We've been restructuring the site so pages might not be where you expect them to be as some haven't been moved. If you're unsure about where things are or want to know what to do in these weird case please reach out\*

## What should I put in the page?

You find a template below which covers most of options for the YAML section of the file. YAML stands for yet another markup language and we use it to basically make formatted lists of video traits.

Please watch the whole video so you can include the links and videos sections in the page. Don't include dead links though.

```yaml
---
title: # Video name without series name
video_number: # Number of video. Example 2.5 (# is not needed that's a comment in yaml).
date: # Date video was released must be in YYYY-MM-DD format
video_id: # YouTube video id can get from hitting share on yt and it's the string after https://youtu.be/
ignore_filename: # Boolean defaults to false. Sometimes needed to pass unit tests with files that have 0.something as the number. Only use if necessary.
repository: # Location of code without top directory so "beginners/p5js/<code folder name>" would be "/p5js/<code folder name>"
web_editor: # The id for the main p5.js web editor sketch if there's a p5.js example.
can_contribute: # Boolean to allow contributions, defaults to true or false based on folder configuration in _config.yml
remake: # If this video has been remade and is in the archive include a the location of new page without .md. Example /beginners/p5js/1.3-shapes-and-drawing.
redirect_from: # If page has been moved then include it's old location (next two lines are an example)
  -  # /Tutorials/1-p5js-basics/1.1-introduction
  -  # /Tutorials/1-p5js-basics/1.1-introduction.html

variations: # Only need when multiple code examples with the same languages or library. Example: two p5.js code examples.
  - name: # Name of code example.
    lang: # Language or library used currently "p5js", "Processing", "Javascript" and "Nodejs" are the only supported options.
    folder: # The sub-folder name for the code example. This would be instead of P5 or Processing which are the defaults.
    web_editor: # Optional, if p5.js sketch then include link to a web editor version

links: # Links mentioned in the video
  - title: # What is this a link to?
    url: # The actual link
    author: # Optional, the creator of the content that is linked to.

videos: # Other YouTube videos mentioned in this video.
  - title: # Video name.
    author: # Who made the video.
    video_id: # YouTube video id see above for more info (do not include if it's a coding train video and it has a webpage.
    url: # If coding train video and has webpage then link to it here (example "/learning/nature-of-code/1.4-static-functions").
---
<!-- Video description, a 1-2 sentence description of video. Can be found at the beginning of the YouTube description. -->
```

## What about the code?

If the video you're working on has code in it then you want to make sure people can find it as that's one of the main reasons for the Coding Train website to exist.

Code goes in a similar place to the page itself but the path doesn't begin with an underscore. And you'll have to add a sub-folder for the code to be put in. As an example `_beginners/p5js/2.5-random.md` becomes `beginners/p5js/2.5-random/P5`. Each language or library has a default folder name which is automatically discovered and added to the page. `P5` for p5.js, `Processing` for Processing, `JavaScript` for JavaScript, and `Node` for Node.js. If another directory name is used it won't be detected unless it's added to in the variations section of the page.

The easiest way to find the code is in the description of the YouTube video but if it's not there then you can check [Coding Train p5.js web editor sketches](https://editor.p5js.org/codingtrain/sketches/), [Coding Train Repositories](https://github.com/CodingTrain), [Dan's GitHub](https://github.com/shiffman), and [RainbowCoder](https://github.com/RainbowCoder). If none of those work bring it up and we'll do our best to find it but in some case we might have to copy it from the video.

## Am I done yet?

Mostly it's sometimes easier to catch problems before making a pull request, especially if you made a lot of changes. So if you want to run unit tests and linting before hand here's how. You'll need [Node.js](https://nodejs.org) installed.

**Unit Testing**

```bash
# in root of website repository
cd unit-testing
npm install
npm test
```

**Linting**

```bash
# in root of website repository
npm install
npm run lint
```

If you've made it to here then you should be all set to make a pull request. Thanks for all your help with the Coding Train website!

# Ex content contribution guide

You want to help with integrating new content into the repository? Great to hear that! Now let's see how you can help:

A new CodingTrain video has been released and you want to add it to the website so everyone else can find it there? OK, just follow these steps:

## Where to put it?

First of all, you have to find out to which category (or collection as [Jekyll](https://jekyllrb.com/) calls them) the video belongs. Available collections are:

- CodingChallenges
- Tutorials
- GuestTutorials
- Courses
- Streams

Selecting the right one is pretty straightforward. You can find the corresponding folders in the root directory of this repository preceded by an `_`.

For some collections (namely tutorials and courses - this does **not** apply to streams and coding challenges) you will find subdirectories in the collection's folder. You also have to decide, to which subcategory the video belongs. This is necessary to help Jekyll build nice URLs. In most cases, the correct subfolder has already been created. Otherwise, feel free to do it yourself. You can follow the video number (like Tutorial 1.2) if you are unsure about how to name it. In this case, `1` would indicate that this video is part of tutorial one (which therefore is a subcategory of the collection). Such a subcategory is called a "series".

## What's a series?

A series is just a collection of related videos. There can be two types of them: A series of videos as found in tutorials (the path structure looks like `_Tutorials/<tutorial-name>/<video-name>.md`) or a series of more series which contain videos like you can see in the courses collection (path here is `_Courses/<course-name>/<session-name>/<video-name>.md`).

If you take a look inside a series folder, you will find a file called `index.md`. This file contains meta-information about the series such as:

```markdown
---
title: "Put the series's title here"
subtitle: "Put the series's subtitle here (only used for tutorials)"
series_number: <series number>
layout: series-index
---

Put a short description of the series here.
```

Taking a closer look at those properties:

| Property        | Description                                                          | Example            |
| --------------- | -------------------------------------------------------------------- | ------------------ |
| `title`         | The series's title                                                   | `"P5.JS Basics"`   |
| `subtitle`      | The series's subtitle (for tutorials, put the type of tutorial here) | `"P5.JS Tutorial"` |
| `series_number` | The series's number (will be used for sorting - must be an integer)  | `1`                |

## How to name everything?

There is a pretty simple naming convention you should follow. The filename for each video should **always** start with the video's number. Let's keep the example from above. The video you want to add is called "1.2: p5.js Workflow - p5.js Tutorial" (as of the date this article was written).

If you take a look inside the `_Tutorials` collection folder, you will already find several subfolders, especially one named `1-p5js-basics` (again, `1` coming from `1.2`). Everything after the first number should be a short title of the series. If you find yourself creating a subfolder of any collection, make sure to provide that as well which should't be that hard.

Next up: the filename! Each file inside a collection starts with the number corresponding to the video's title on YouTube followed by a short title (or less-than-five-words-summary). Please use `-` instead of `_` or spaces and remove any special characters like `&`, `#`, `+` and so on. Keep the title in an URL-like style, everything should be lowercase, no "stopwords" (and, or, with, ...), etc. In our example, the file you would have to create would be called `1.2-p5js-workflow.md`.

## What to put inside?

Every video file follows the same blueprint as below (you can even copy-paste this into the new file you created):

```markdown
---
title: "Put the video's title here"
video_number: <primary video number>
date: YYYY-MM-DD
video_id: <copy id from YouTube>
---

Put a short description of the video here.
This can also be copied from the YouTube's description below the video.

Everything after the first paragraph will only be visible on the video's page, not in the video's summary.
```

The block between the two `---` is called YAML front matter. You can learn more about it in the [official Jekyll docs](https://jekyllrb.com/docs/frontmatter/)!

Now let's take a closer look at each property:

| Property         | Description                                                | Example            |
| ---------------- | ---------------------------------------------------------- | ------------------ |
| `title`          | The video's title (copy from YouTube)                      | `"p5.js Workflow"` |
| `video_number`   | The video's number                                         | `2`                |
| `date`           | The date this video has been released (copy from YouTube)  | `2017-10-31`       |
| `video_id`       | YouTube's video id from the URL (`...?v=HZD3wDRaec...`)    | `HZ4D3wDRaec`      |
| `repository`     | Path to the corresponding code files inside the repository | `/P5JS/p5.js/...`  |
| `live_example`   | Path to a running live example inside the repository       | `/P5JS/p5.js/...`  |
| `web_editor`     | The id of the sketch from the P5 Web Editor                | `HkDVpSvDm`        |
| `can_contribute` | Indicates wether community versions can be added later     | `true`             |

For coding challenges and streams, the video number may contain a decimal point when the stream/coding challenge is split into multiple parts. Important to know is that this only works if there are a maximum of nine parts. Otherwise, the sorting alogithm fails.

When specifying the repository, the full URL to the code will be build like this: `https://github.com/CodingTrain/Rainbow-Code/tree/master/<video-collection>/<repository>`. Make sure that this property start with a `/` because otherwise the URL won't be built correctly.

If you don't specify a `live_example`, the value of `repository` will be used automatically. To link to another folder containing the live example, just specify the folder the same way as you specified `repository`. It is also possible that there is no live_example even though there is a folder inside the repository containing the code (think Processing sketches). To disable the live example button, just set `live_example: false`.

If the code was written with the P5 Web Editor, don't specify `repository` or `live_example`. Use the `web_editor` property instead. The link to a running version will then be generated automatically.

If it should be possible to add community versions of this video using the `contributions` property (see the [Community Contribution Guide](community-contribution-guide)), set `can_contribute: true` which is the default for coding challenges so you don't need to explicitly speicfy it here. This is mainly useful for tutorials where it only makes sense for some videos to allow contributions. Streams should never have this option set.

## Wait, there's more!

Of course! There are a lot more of properties you can specify. Let's also look at them:

| Property | Description (or corresponding section in the video's description on YouTube) |
| -------- | ---------------------------------------------------------------------------- |
| `topics` | The topics spoken about in this `<collection-name>` (especially for streams) |
| `links`  | Links discussed in this `<collection-name>`                                  |
| `videos` | Videos discussed in this `<collection-name>`                                 |
| `books`  | Books and Papers                                                             |
| `tools`  | Tools discussed in this `<collection-name>`                                  |

Each one of those itself is an array of link objects which can contain the following information:

| Property      | Description                                               | Example                      |
| ------------- | --------------------------------------------------------- | ---------------------------- |
| `title`       | The text shown for this link                              | `"The Nature of Code"`       |
| `author`      | The author of the resource linked to (think books/papers) |                              |
| `author.name` | The author's name                                         | `"Daniel Shiffman"`          |
| `author.url`  | A URL where people can find more of the author's work     | `http://shiffman.net`        |
| `time`        | The timecode to jump to in the video                      | `"14:42"`                    |
| `url`         | The link's url                                            | `https://natureofcode.com`   |
| `video_id`    | YouTube's video id (found in the video's url)             | `HZ4D3wDRaec`                |
| `playlist_id` | YouTube's playlist id (for linking to a series of videos) | `PLRqwX-V7Uu6Zy51Q-x9tMW...` |

Looking at this list, you may notice that you wouldn't use all of them at once, especially the last three as only one per link is supported of course. Speaking of them, `video_id` and `playlist_id` are rarely used as it is encouraged to link to videos and playlists that are already part of a collection. But if some third party video or playlist is referenced, please use those over a direct link as YouTube may decide to change its link style at some point in which case the new style has only to be applied at one central point rather than the entire repository.

It should be noted that the `topic` links are a little bit special as those will be present right next to the video beneath the description. It is encouraged to have this section be present especially for streams since they cover multiple topics in one video. Users are therefore able to skip to the part they are interested in. To enable this, you need `title`, `time` and `url` (which should link to the edited version of the video covering this topic in more detail).

But wait, we're still not done yet! What if you want to have a section not listed above? Thankfully there is an easy way to do this. Just add the following to your YAML front matter.

```yaml
custom_sections:
  - title: "Other links I want to share"
    items:
      - title: "Processing Foundation"
        url: https://processingfoundation.org/
      ...
```

You can add as many custom sections with as many links as you want. Just a side note: The links under `items` are fully featured link objects so you can use the same properties as listed above!

&nbsp;

---

## Appendix A: Links within markdown files to other markdown files

If you want to link to another page from within a markdown file, you have to use the following snippet:

```markdown
{% raw %}[link title here]({{ site.baseurl }}{% link _Collection/series/video-file.md %}){% endraw %}
```

Otherwise, links won't be resolved correctly because when using GitHub Pages, the website is hosted from within a subdirectory (for this site, it's `/Rainbow-Code`).
