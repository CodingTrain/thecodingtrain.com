module.exports = {
  siteMetadata: {
    siteUrl: 'https://www.thecodingtrain.com',
    title: 'The Coding Train'
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
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        name: 'guides',
        path: './content/guides'
      },
      __key: 'guides'
    },
    {
      resolve: `gatsby-plugin-mdx`,
      options: {
        extensions: [`.mdx`, `.md`]
      }
    },
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
          './**/videos/journeys/**/*',
          './**/videos/guest-tutorials/**/*'
        ]
      },
      __key: 'videos'
    },
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        name: 'journeys',
        path: './content/videos/journeys',
        ignore: [`./**/src`]
      },
      __key: 'journeys'
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
    // {
    //   resolve: 'gatsby-source-filesystem',
    //   options: {
    //     name: 'talks',
    //     path: './content/talks'
    //   },
    //   __key: 'talks'
    // },
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        name: 'faqs',
        path: './content/faqs'
      },
      __key: 'faqs'
    },
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        name: 'collaborators',
        path: './content/collaborators.json'
      },
      __key: 'collaborators'
    },
    {
      resolve: 'gatsby-plugin-react-svg',
      options: {
        rules: {
          include: './src/images'
        }
      }
    }
  ]
};
