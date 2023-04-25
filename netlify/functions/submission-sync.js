const { Octokit } = require('@octokit/core');
const slugify = require('slugify');
const sharp = require('sharp');

// event.body expected to be:
// {
//   title: "Something",
//   image: "base64string=",
//   authorName: "Coding Train",
//   authorUrl: "https://thecodingtrain.com",
//   authorEmail: "help@thecodingtrain.com",
//   authorTwitter: "@thecodingtrain",
//   authorInstagram: "@the.coding.train"
//   url: "https://thecodingtrain.com/tracks",
//   challenge: "01-test",
// }

async function validateImage(imageBase64) {
  const supportedImageFormatsToExtensions = new Map([
    ['png', 'png'],
    ['jpeg', 'jpg']
  ]);

  try {
    const { info } = await sharp(Buffer.from(imageBase64, 'base64')).toBuffer({
      resolveWithObject: true
    });

    const imageExtension = supportedImageFormatsToExtensions.get(info.format);

    return imageExtension
      ? { imageExtension }
      : { error: `Unsupported image format: ${info.format}` };
  } catch (e) {
    return { error: "Can't decode submitted image" };
  }
}

exports.handler = async function (event, context) {
  console.log('Sync handler called with', event.body);

  if (!process.env.GITHUB_TOKEN) {
    console.error('GitHub Token not loaded');
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'GitHub Token not loaded' })
    };
  }

  // parse payload
  const postInfo = JSON.parse(event.body);

  // validate image and extract its extension
  const { error, imageExtension } = await validateImage(postInfo.image);
  if (error) {
    console.error(error);
    return {
      statusCode: 400,
      body: JSON.stringify({ error })
    };
  }

  // Shared properties
  const unix = Math.floor(Date.now() / 1000);
  const owner = 'CodingTrain';
  const repo = 'thecodingtrain.com';
  const showcasePath = `content/videos/challenges/${postInfo.challenge}/showcase`;
  const jsonPath = `${showcasePath}/contribution-${unix}.json`;
  const imagePath = `${showcasePath}/contribution-${unix}.${imageExtension}`;
  const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });

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
    Pass the data to the background function
  **/
  await fetch(
    event.rawUrl.replace('submission-sync', 'submission-background'),
    {
      method: 'POST',
      body: JSON.stringify({
        title: postInfo.title,
        authorName: postInfo.authorName,
        authorUrl: postInfo.authorUrl,
        url: postInfo.url,
        challenge: postInfo.challenge,
        imageUrl: imageRes.data.content.download_url,
        branchName: branchName
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    }
  );

  return {
    statusCode: 200,
    body: JSON.stringify({
      status: 'success',
      branchName: branchName
    })
  };
};
