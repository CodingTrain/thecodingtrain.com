const { Octokit } = require('@octokit/core');
const slugify = require('slugify');
const sharp = require('sharp');
const crypto = require('crypto');

// event.body expected to be:
// {
//   title: "Something",
//   imageBlobSha: "sha",
//   authorName: "Coding Train",
//   authorUrl: "https://thecodingtrain.com",
//   authorEmail: "help@thecodingtrain.com",
//   authorTwitter: "@thecodingtrain",
//   authorInstagram: "@the.coding.train"
//   url: "https://thecodingtrain.com/tracks",
//   videoDir: "challenges/01-test",
//   imageExtension: "png|jpg"
// }
// X-Signature: sha256=...

exports.handler = async function (event) {
  console.log('Background handler called with: ', event.body);

  if (!process.env.GITHUB_TOKEN) {
    console.error('GitHub Token not loaded');
    return;
  }

  // parse payload and validate signature
  const postInfo = JSON.parse(event.body);
  const hmac = crypto.createHmac('sha256', process.env.GITHUB_TOKEN);
  const signature = hmac.update(JSON.stringify(postInfo)).digest('hex');
  if (signature !== event.headers['x-signature']) {
    console.error('Invalid signature');
    return;
  }

  // Shared properties
  const unix = Math.floor(Date.now() / 1000);
  const owner = 'CodingTrain';
  const repo = 'thecodingtrain.com';
  const showcasePath = `content/videos/${postInfo.videoDir}/showcase`;
  const jsonPath = `${showcasePath}/contribution-${unix}.json`;
  const imagePath = `${showcasePath}/contribution-${unix}.${postInfo.imageExtension}`;
  const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });

  /**
    Get the SHA of the main branch
  **/
  const shaRes = await octokit.request(
    `GET /repos/${owner}/${repo}/git/ref/heads/main`
  );
  const mainSha = shaRes.data.object.sha;

  /**
    Add the JSON file
  **/
  const json = {
    title: postInfo.title,
    author: {
      name: postInfo.authorName
    },
    url: postInfo.url,
    submittedOn: new Date().toISOString()
  };

  if (postInfo.authorUrl) {
    json.author.url = postInfo.authorUrl;
  }

  // Including the social media handles in the JSON for future reference
  if (postInfo.authorTwitter) {
    json.author.twitter = postInfo.authorTwitter;
  }

  if (postInfo.authorInstagram) {
    json.author.instagram = postInfo.authorInstagram;
  }

  const jsonString = JSON.stringify(json, null, 2) + '\n';
  const jsonContent = Buffer.from(jsonString).toString('base64');

  const jsonBlobRes = await octokit.request(
    `POST /repos/${owner}/${repo}/git/blobs`,
    {
      content: jsonContent,
      encoding: 'base64'
    }
  );

  /**
    Create a git tree
   */
  const treeRes = await octokit.request(
    `POST /repos/${owner}/${repo}/git/trees`,
    {
      tree: [
        {
          path: jsonPath,
          mode: '100644',
          type: 'blob',
          sha: jsonBlobRes.data.sha
        },
        {
          path: imagePath,
          mode: '100644',
          type: 'blob',
          sha: postInfo.imageBlobSha
        }
      ],
      base_tree: mainSha
    }
  );

  const commitOpts = {
    message: 'Added new contribution',
    tree: treeRes.data.sha,
    parents: [mainSha]
  };

  if (postInfo.authorName && postInfo.authorEmail) {
    commitOpts.author = {
      name: postInfo.authorName,
      email: postInfo.authorEmail
    };
  }

  const commitRes = await octokit.request(
    `POST /repos/${owner}/${repo}/git/commits`,
    commitOpts
  );

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
      sha: commitRes.data.sha
    }
  );

  /**
    Make a PR to main
  **/
  const imgUrl = `https://raw.githubusercontent.com/${owner}/${repo}/${commitRes.data.sha}/${imagePath}`;
  const prRes = await octokit.request(`POST /repos/${owner}/${repo}/pulls`, {
    title: `Showcase Submission for ${postInfo.videoDir}`,
    body: `Thank you ${
      postInfo.authorName
    } for your contribution! A member of the Coding Train team will review it shortly.

* [${postInfo.title}](${postInfo.url})
* ${
      postInfo.authorUrl
        ? `[${postInfo.authorName}](${postInfo.authorUrl})`
        : postInfo.authorName
    }

![preview image](${imgUrl})`,
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
