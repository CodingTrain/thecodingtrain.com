import postcssGlobalData from '@csstools/postcss-global-data';
import remarkGFM from 'remark-gfm';

export default {
  siteMetadata: {
    siteUrl: 'https://thecodingtrain.com',
    title: 'The Coding Train',
    description:
      'All aboard the Coding Train with Daniel Shiffman, a YouTube channel dedicated to beginner-friendly creative coding tutorials and challenges.'
  },
  trailingSlash: 'never',
  plugins: [
    {
      resolve: 'gatsby-plugin-postcss',
      options: {
        cssLoaderOptions: {
          localIdentName: '[name]-[local]-[hash:base64:3]'
        },
        postCssPlugins: [
          'postcss-import',
          'postcss-normalize',
          postcssGlobalData({ files: ['./src/styles/variables.css'] }),
          'postcss-nesting',
          'postcss-custom-properties',
          'postcss-calc',
          'postcss-custom-media'
        ]
      }
    },
    'gatsby-plugin-image',
    'gatsby-plugin-react-helmet',
    'gatsby-plugin-sharp',
    'gatsby-transformer-sharp',
    {
      resolve: 'gatsby-transformer-json',
      options: {
        typeName: 'Json'
      }
    },
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        name: 'images',
        path: './src/images/'
      }
    },
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        name: 'videos',
        path: './content/videos',
        ignore: ['./**/videos/challenges/**/*']
      }
    },
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        name: 'challenges',
        path: './content/videos/challenges'
      }
    },
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        name: 'main-tracks',
        path: './content/tracks/main-tracks'
      }
    },
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        name: 'side-tracks',
        path: './content/tracks/side-tracks'
      }
    },
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        name: 'tracks-order',
        path: './content/tracks/index.json'
      }
    },
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        name: 'guides',
        path: './content/pages/guides'
      }
    },
    {
      resolve: 'gatsby-plugin-mdx',
      options: {
        extensions: ['.mdx', '.md'],
        mdxOptions: {
          remarkPlugins: [remarkGFM]
        }
      }
    },
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        name: 'homepage-data',
        path: './content/pages/homepage'
      }
    },
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        name: 'tracks-page-data',
        path: './content/pages/tracks'
      }
    },
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        name: 'challenges-page-data',
        path: './content/pages/challenges'
      }
    },
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        name: 'showcase-page-data',
        path: './content/pages/showcase'
      }
    },
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        name: 'faqs',
        path: './content/pages/faqs'
      }
    },
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        name: 'about-page-data',
        path: './content/pages/about'
      }
    },
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        name: '404-page-data',
        path: './content/pages/404'
      }
    },
    {
      resolve: 'gatsby-plugin-react-svg',
      options: {
        rules: {
          include: './src/images'
        }
      }
    },
    'gatsby-plugin-netlify'
  ]
};
