const { Octokit } = require('@octokit/core');
const slugify = require('slugify');
const btoa = require('btoa');

// event.body expected to be:
// {
//   title: "Something",
//   image: "base64string="
//   imageExt: "png",
//   authorName: "Rune Madsen",
//   authorUrl: "https://runemadsen.com",
//   authorEmail: "rune@runemadsen.com",
//   url: "https://runemadsen.github.io/rune.js/",
//   challenge: "01-test",
// }

exports.handler = async function (event) {
  console.log('Handler called with: ', event.body);

  // Shared properties
  const postInfo = JSON.parse(event.body);
  const unix = Math.floor(Date.now() / 1000);
  const owner = 'CodingTrain';
  const repo = 'thecodingtrain.com';
  const showcasePath = `content/videos/challenges/${postInfo.challenge}/showcase`;
  const jsonPath = `${showcasePath}/contribution-${unix}.json`;
  const imagePath = `${showcasePath}/contribution-${unix}.${postInfo.imageExt}`;
  const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });

  if (!process.env.GITHUB_TOKEN) {
    console.error('GitHub Token not loaded');
  }

  /**
    Get the SHA of the main branch
  **/
  const shaRes = await octokit.request(
    `GET /repos/${owner}/${repo}/git/ref/heads/main`
  );
  const mainSha = shaRes.data.object.sha;

  /**
    Make a new branch
  **/
  const branchName = slugify(
    `showcase-${slugify(postInfo.authorName)}-${unix}`.toLowerCase()
  );

  const branchRes = await octokit.request(
    `POST /repos/${owner}/${repo}/git/refs`,
    {
      ref: `refs/heads/${branchName}`,
      sha: mainSha
    }
  );

  /**
    Add the JSON file
  **/
  const json = {
    title: postInfo.title,
    author: {
      name: postInfo.authorName
    },
    url: postInfo.url,
    submittedOn: new Date().toISOString().split('T')[0]
  };

  if (postInfo.authorUrl) {
    json.author.url = postInfo.authorUrl;
  }

  const jsonContent = btoa(JSON.stringify(json, null, 2));

  const jsonOpts = {
    branch: branchName,
    message: 'Added contribution JSON file',
    content: jsonContent
  };

  if (postInfo.authorName && postInfo.authorEmail) {
    jsonOpts.committer = {
      name: postInfo.authorName,
      email: postInfo.authorEmail
    };
  }

  const jsonRes = await octokit.request(
    `PUT /repos/${owner}/${repo}/contents/${jsonPath}`,
    jsonOpts
  );

  /**
    Add the image
  **/
  const imageOpts = {
    branch: branchName,
    message: 'Added contribution image file',
    content: postInfo.image
  };

  if (postInfo.authorName && postInfo.authorEmail) {
    imageOpts.committer = {
      name: postInfo.authorName,
      email: postInfo.authorEmail
    };
  }

  const imageRes = await octokit.request(
    `PUT /repos/${owner}/${repo}/contents/${imagePath}`,
    imageOpts
  );

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

![preview image](${imageRes.data.content.download_url})`,
    head: branchName,
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
