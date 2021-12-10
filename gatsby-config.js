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
        name: 'lessons',
        path: './content/videos/lessons',
        ignore: [`**/src/**`]
      },
      __key: 'lessons'
    },
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        name: 'challenges',
        path: './content/videos/challenges',
        ignore: [`**/src/**`]
      },
      __key: 'challenges'
    },
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        name: 'guest-tutorials',
        path: './content/videos/guest-tutorials',
        ignore: [`**/src/**`]
      },
      __key: 'guest-tutorials'
    },
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        name: 'tracks',
        path: './content/tracks'
      },
      __key: 'tracks'
    },
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        name: 'talks',
        path: './content/talks'
      },
      __key: 'talks'
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
