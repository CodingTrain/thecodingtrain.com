import { Octokit } from '@octokit/core';
import sharp from 'sharp';
import crypto from 'node:crypto';

// Request JSON body expected to be:
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

export default async (request) => {
  console.log('Sync handler called');

  if (!process.env.GITHUB_TOKEN) {
    console.error('GitHub Token not loaded');
    return Response.json({}, { status: 500 });
  }

  // parse payload
  const postInfo = await request.json();

  // validate image and extract its extension
  const { error, imageExtension } = await validateImage(postInfo.image);
  if (error) {
    console.error(error);
    return Response.json({ error }, { status: 400 });
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
  const backgroundResponse = await fetch(
    new URL('/.netlify/functions/submission-background', request.url),
    {
      method: 'POST',
      body: JSON.stringify(payload),
      headers: {
        'Content-Type': 'application/json',
        'X-Signature': signature
      }
    }
  );

  if (!backgroundResponse.ok) {
    console.error('Background invocation failed:', backgroundResponse.status);
    return Response.json(
      { error: 'Could not start submission processing' },
      { status: 502 }
    );
  }

  return Response.json({ status: 'success' });
};
