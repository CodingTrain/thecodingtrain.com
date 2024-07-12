// The JSON lookup gets generated at build time, do not manually edit. See `node-scripts/generate-youtube-redirects.js`
import redirects from './redirects.json' assert { type: 'json' };

export default async (request) => {
  const url = new URL(request.url);
  const youtubeId = url.pathname.split('/')[2];

  const headers = {
    'Cache-Control': 'public, max-age=86400' // 24h
  };

  if (redirects[youtubeId]) {
    return new Response(null, {
      status: 302,
      headers: {
        ...headers,
        Location: redirects[youtubeId]
      }
    });
  }

  return new Response('Not Found', {
    status: 404,
    headers
  });
};

export const config = { path: '/yt/:youtubeId' };
