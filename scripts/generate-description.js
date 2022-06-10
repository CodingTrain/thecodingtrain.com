const fs = require('fs');
const path = require('path');

function findVideoFilesRecursive(dir, arrayOfFiles) {
  const files = fs.readdirSync(dir);

  arrayOfFiles = arrayOfFiles || [];

  for (const file of files) {
    if (fs.statSync(`${dir}/${file}`).isDirectory()) {
      arrayOfFiles = findVideoFilesRecursive(`${dir}/${file}`, arrayOfFiles);
    } else {
      if (file === 'index.json') {
        arrayOfFiles.push(path.join(dir, '/', file));
      }
    }
  }

  return arrayOfFiles;
}

// Cannot be ported as there is no way to get the YT playlist ID from the JSON
// function getPlaylist(file) {
//   const series = file.substring(0, file.lastIndexOf('/')) + '/index.md';
//   const content = fs.readFileSync(series);
//   const parsed = yaml.loadFront(content);
//   if (parsed.playlist_id) {
//     return parsed.playlist_id;
//   }
//   return false;
// }

function getVideoData() {
  const directories = [
    // 'content/pages',
    // 'content/tracks',
    'content/videos'
  ];

  const tracks = {
    noc: 'the-nature-of-code-2/noc',
    code: 'code-programming-with-p5-js/code'
  };

  const sideTracks = {
    workflow: '2018-workflow/workflow'
  };

  let files = [];
  for (const dir of directories) {
    findVideoFilesRecursive(dir, files);
  }

  const videos = [];
  for (const file of files) {
    console.log(file);
    const content = fs.readFileSync(`./${file}`, 'UTF8');
    const parsed = JSON.parse(content);

    const filePath = file.split(path.sep);
    let url;
    for (const track in tracks) {
      if (filePath.includes(track)) {
        url = `tracks/${tracks[track]}/${filePath.slice(-3, -1).join('/')}`;
      }
    }
    for (const track in sideTracks) {
      if (filePath.includes(track)) {
        url = `tracks/${sideTracks[track]}/${filePath[3]}`;
      }
    }
    if (filePath.includes('challenges')) {
      url = filePath.slice(2, 4).join('/');
    }
    if (filePath.includes('side-tracks')) {
      url = `tracks/${filePath[4]}/tracks/side-tracks/${filePath
        .slice(-3, -1)
        .join('/')}`;
    }
    if (!url) throw filePath;
    videos.push({
      pageURL: url,
      data: parsed
      //   playlist: getPlaylist(file)
    });
  }

  return videos;
}

function primeDirectory(dir) {
  fs.rmSync(dir, { recursive: true }, (err) => {
    if (err) {
      throw err;
    }
  });

  fs.mkdirSync(dir, (err) => {
    if (err) {
      throw err;
    }
  });
}

// function getVideoID(url) {
//   const location = url.substring(1, url.length);
//   let page;
//   try {
//     // link to page on the site
//     page = fs.readFileSync(`./_${location}.md`, 'UTF8');
//   } catch (err) {
//     try {
//       // link to series on site
//       const files = fs.readdirSync(`./_${location}`);
//       // get first page in series
//       page = fs.readFileSync(`./_${location}/${files[0]}.md`, 'UTF8');
//     } catch (e) {
//       // link to youtube playlist
//       return url;
//     }
//   }
//   const parsed_content = yaml.loadFront(page);
//   return `https://youtu.be/${parsed_content.video_id}`;
// }

function writeDescriptions(videos) {
  primeDirectory('./_descriptions');

  for (const video of videos) {
    const data = video.data;
    const pageURL = video.pageURL;
    // const playlist = video.playlist;

    let description = '';

    // Description
    let content = data.description;
    description += `${content.trim()}`;

    // Code
    // if (data.repository || data.web_editor) {
    description += ` https://thecodingtrain.com/${pageURL}`;
    // }

    description += '\n';

    // Web Editor Links
    const sketchUrls = data.codeExamples?.filter(
      (ex) => ex.urls.p5 && ex.urls.p5.includes('editor.p5js.org')
    );
    if (sketchUrls && sketchUrls.length > 0) {
      if (sketchUrls.length > 1) {
        description += '\np5.js Web Editor Sketches:\n';
        for (const sketch of sketchUrls) {
          description += `🕹️ ${sketch.title}: ${sketch.urls.p5}\n`;
        }
      } else {
        description += `\n🕹️ p5.js Web Editor Sketch: ${sketchUrls[0].urls.p5}\n`;
      }
    }

    // Next Video / Previous Video / Playlist
    // let nextID;
    // if (i !== videos.length - 1) {
    //   if (
    //     pageURL.substring(0, pageURL.lastIndexOf('/')) ===
    //     videos[i + 1].pageURL.substring(
    //       0,
    //       videos[i + 1].pageURL.lastIndexOf('/')
    //     )
    //   ) {
    //     nextID = videos[i + 1].data.video_id;
    //   } else {
    //     nextID = false;
    //   }
    // } else {
    //   nextID = false;
    // }

    // let previousID;
    // if (i !== 0) {
    //   if (
    //     pageURL.substring(0, pageURL.lastIndexOf('/')) ===
    //     videos[i - 1].pageURL.substring(
    //       0,
    //       videos[i - 1].pageURL.lastIndexOf('/')
    //     )
    //   ) {
    //     previousID = videos[i - 1].data.video_id;
    //   } else {
    //     previousID = false;
    //   }
    // } else {
    //   previousID = false;
    // }

    // if (playlist || nextID) {
    //   description += '\n';

    //   if (previousID && playlist) {
    //     description += `🎥 Previous video: https://youtu.be/${previousID}?list=${playlist}\n`;
    //   } else if (previousID) {
    //     description += `🎥 Previous video: https://youtu.be/${previousID}\n`;
    //   }

    //   if (nextID && playlist) {
    //     description += `🎥 Next video: https://youtu.be/${nextID}?list=${playlist}\n`;
    //   } else if (nextID) {
    //     description += `🎥 Next video: https://youtu.be/${nextID}\n`;
    //   }

    //   if (playlist) {
    //     description += `🎥 All videos: https://www.youtube.com/playlist?list=${playlist}\n`;
    //   }
    // }

    const links = data.groupLinks?.find(
      (group) => group.title === 'References'
    );
    const videosR = data.groupLinks?.find((group) => group.title === 'Videos');

    // Links
    if (links && links.links.length > 0) {
      description += '\nLinks discussed in this video:\n';
      for (const link of links.links) {
        const url = link.url;
        if (/https?:\/\/.*/.test(url)) {
          // starts with http:// or https://
          description += `🔗 ${link.title}: ${url}\n`;
        } else {
          // assume relative link in thecodingtrain.com
          description += `🔗 ${link.title}: https://thecodingtrain.com${url}\n`;
        }
      }
    }

    // Videos
    if (videosR && videosR.links.length > 0) {
      description += '\nOther videos mentioned in this video:\n';
      for (const video of videosR.links) {
        // Link as it is no matter what
        // if (
        //   video.url.includes('youtu.be') ||
        //   video.url.includes('youtube.com')
        // ) {
        description += `🎥 ${video.title}: ${video.url}\n`;
        // } else {
        //   description += `🎥 ${video.title}: ${getVideoID(video.url)}\n`;
        // }
      }
    }

    // Timestamps
    if (data.timestamps && data.timestamps.length > 0) {
      description += '\nTimestamps:\n';
      for (const topic of data.timestamps) {
        description += `${topic.time} ${topic.title}\n`;
      }
    }

    // General Links
    description += `
🚂 Website: http://thecodingtrain.com/
👾 Share Your Creation! https://thecodingtrain.com/guides/passenger-showcase-guide
🚩 Suggest Topics: https://github.com/CodingTrain/Suggestion-Box
💡 GitHub: https://github.com/CodingTrain
💬 Discord: https://discord.gg/hPuGy2g
💖 Membership: http://youtube.com/thecodingtrain/join
🛒 Store: https://standard.tv/codingtrain
📚 Books: https://www.amazon.com/shop/thecodingtrain
🖋️ Twitter: https://twitter.com/thecodingtrain
📸 Instagram: https://www.instagram.com/the.coding.train/

🎥 Coding Challenges: https://www.youtube.com/playlist?list=PLRqwX-V7Uu6ZiZxtDDRCi6uhfTH4FilpH
🎥 Intro to Programming: https://www.youtube.com/playlist?list=PLRqwX-V7Uu6Zy51Q-x9tMWIv9cueOFTFA

🔗 p5.js: https://p5js.org
🔗 p5.js Web Editor: https://editor.p5js.org/
🔗 Processing: https://processing.org

📄 Code of Conduct: https://github.com/CodingTrain/Code-of-Conduct

This description was auto-generated. If you see a problem, please open an issue: https://github.com/CodingTrain/thecodingtrain.com/issues/new`;

    //fs.writeFileSync(`_descriptions/${data.video_id}.txt`, description);
    // console.log(pageURL);
    let filename = /\/((?:.(?!\/))+)$/.exec(pageURL)[1];
    fs.writeFileSync(`_descriptions/${filename}.txt`, description);
  }
}

(() => {
  console.log('💫 Generating YouTube Descriptions 💫');

  writeDescriptions(getVideoData());
})();
