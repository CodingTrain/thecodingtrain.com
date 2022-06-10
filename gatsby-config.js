module.exports = {
  siteMetadata: {
    siteUrl: 'https://www.thecodingtrain.com',
    title: 'The Coding Train',
    description:
      'All aboard the Coding Train with Daniel Shiffman, a YouTube channel dedicated to beginner-friendly creative coding tutorials and challenges.'
  },
  flags: {
    DEV_SSR: true
  },
  plugins: [
    `gatsby-plugin-gatsby-cloud`,
    {
      resolve: `gatsby-plugin-postcss`,
      options: {
        cssLoaderOptions: {
          localIdentName: '[name]-[local]-[hash:base64:3]'
        },
        postCssPlugins: [
          require(`postcss-import`),
          require('postcss-normalize'),
          require('postcss-nesting'),
          require('postcss-custom-properties')({
            importFrom: './src/styles/variables.css'
          }),
          require('postcss-calc')(),
          require('postcss-custom-media')({
            importFrom: './src/styles/variables.css'
          })
        ]
      }
    },
    'gatsby-plugin-image',
    'gatsby-plugin-react-helmet',
    'gatsby-plugin-sharp',
    'gatsby-transformer-sharp',
    {
      resolve: `gatsby-transformer-json`,
      options: {
        typeName: 'Json'
      }
    },
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        name: 'images',
        path: './src/images/'
      },
      __key: 'images'
    },
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        name: 'pages',
        path: './src/pages/'
      },
      __key: 'pages'
    },
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        name: 'videos',
        path: './content/videos',
        ignore: [
          './**/src',
          './**/videos/challenges/**/*',
          './**/videos/guest-tutorials/**/*'
        ]
      },
      __key: 'videos'
    },
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        name: 'challenges',
        path: './content/videos/challenges',
        ignore: [`./**/src`]
      },
      __key: 'challenges'
    },
    // {
    //   resolve: 'gatsby-source-filesystem',
    //   options: {
    //     name: 'guest-tutorials',
    //     path: './content/videos/guest-tutorials',
    //     ignore: [`./**/src`]
    //   },
    //   __key: 'guest-tutorials'
    // },
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        name: 'main-tracks',
        path: './content/tracks/main-tracks'
      },
      __key: 'main-tracks'
    },
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        name: 'side-tracks',
        path: './content/tracks/side-tracks'
      },
      __key: 'side-tracks'
    },
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        name: 'guides',
        path: './content/pages/guides'
      },
      __key: 'guides'
    },
    {
      resolve: `gatsby-plugin-mdx`,
      options: {
        extensions: [`.mdx`, `.md`]
      }
    },
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        name: 'homepage-data',
        path: './content/pages/homepage'
      },
      __key: 'homepage-data'
    },
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        name: 'tracks-page-data',
        path: './content/pages/tracks'
      },
      __key: 'tracks-page-data'
    },
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        name: 'challenges-page-data',
        path: './content/pages/challenges'
      },
      __key: 'challenges-page-data'
    },
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        name: 'faqs',
        path: './content/pages/faqs'
      },
      __key: 'faqs'
    },
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        name: 'about-page-data',
        path: './content/pages/about'
      },
      __key: 'about-page-data'
    },
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        name: '404-page-data',
        path: './content/pages/404'
      },
      __key: '404-page-data'
    },
    {
      resolve: 'gatsby-plugin-react-svg',
      options: {
        rules: {
          include: './src/images'
        }
      }
    },
    `gatsby-plugin-meta-redirect`
  ]
};
