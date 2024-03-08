const { Octokit } = require('@octokit/core');
const sharp = require('sharp');
const crypto = require('crypto');

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
//   track: "challenges",
//   video: "01-starfield",
//   socialPermission: true
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
      body: JSON.stringify({})
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
  const owner = 'CodingTrain';
  const repo = 'thecodingtrain.com';
  const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });
  const hmac = crypto.createHmac('sha256', process.env.GITHUB_TOKEN);

  /**
    Create the image blob
   */
  const blobRes = await octokit.request(
    `POST /repos/${owner}/${repo}/git/blobs`,
    {
      content: postInfo.image,
      encoding: 'base64'
    }
  );

  /**
    Pass the data to the background function
  **/
  const payload = {
    title: postInfo.title,
    authorName: postInfo.authorName,
    authorUrl: postInfo.authorUrl,
    authorEmail: postInfo.authorEmail,
    authorTwitter: postInfo.authorTwitter,
    authorInstagram: postInfo.authorInstagram,
    url: postInfo.url,
    socialPermission: postInfo.socialPermission,
    videoDir:
      postInfo.track === 'challenges'
        ? `challenges/${postInfo.video}`
        : postInfo.video,
    imageBlobSha: blobRes.data.sha,
    imageExtension
  };
  const signature = hmac.update(JSON.stringify(payload)).digest('hex');
  await fetch(
    event.rawUrl.replace('submission-sync', 'submission-background'),
    {
      method: 'POST',
      body: JSON.stringify(payload),
      headers: {
        'Content-Type': 'application/json',
        'X-Signature': signature
      }
    }
  );

  return {
    statusCode: 200,
    body: JSON.stringify({
      status: 'success'
    })
  };
};
