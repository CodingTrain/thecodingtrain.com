const { Octokit } = require('@octokit/core');
const slugify = require('slugify');
const sharp = require('sharp');

// event.body expected to be:
// {
//   title: "Something",
//   authorName: "Coding Train",
//   authorUrl: "https://thecodingtrain.com",
//   url: "https://thecodingtrain.com/tracks",
//   challenge: "01-test",
//   imageUrl: "https://github.com/branch/image.png",
//   branchName: "showcase-coding-train-1234567890"
// }

exports.handler = async function (event) {
  console.log('Background handler called with: ', event.body);

  if (!process.env.GITHUB_TOKEN) {
    console.error('GitHub Token not loaded');
    return;
  }

  // parse payload
  const postInfo = JSON.parse(event.body);

  // Shared properties
  const owner = 'CodingTrain';
  const repo = 'thecodingtrain.com';
  const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });

  /**
    Make a PR to main
  **/
  const prRes = await octokit.request(`POST /repos/${owner}/${repo}/pulls`, {
    title: `Showcase Submission for ${postInfo.challenge}`,
    body: `Thank you ${
      postInfo.authorName
    } for your contribution! A member of the Coding Train team will review it shortly.

* [${postInfo.title}](${postInfo.url})
* ${
      postInfo.authorUrl
        ? `[${postInfo.authorName}](${postInfo.authorUrl})`
        : postInfo.authorName
    }

![preview image](${postInfo.imageUrl})`,
    head: postInfo.branchName,
    base: 'main'
  });

  /** Add showcase label **/
  await octokit.request(
    `PATCH /repos/${owner}/${repo}/issues/${prRes.data.number}`,
    {
      labels: ['showcase']
    }
  );

  console.log('Done!');
};
