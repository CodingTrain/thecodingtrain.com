import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);

export const onCreateWebpackConfig = ({ actions, getConfig }) => {
  const config = getConfig();

  // Exclude SVGs from the default file loader
  config.module.rules = config.module.rules.map((rule) => {
    if (rule.test?.toString().includes('svg')) {
      return { ...rule, exclude: /\.svg$/i };
    }
    return rule;
  });

  // Handle SVGs as either emitted asset URLs (`?url`) or React components
  config.module.rules.push({
    test: /\.svg$/i,
    oneOf: [
      {
        resourceQuery: /url/,
        type: 'asset/resource'
      },
      {
        issuer: /\.[jt]sx?$/,
        use: [
          {
            loader: require.resolve('@svgr/webpack'),
            options: {
              svgo: true,
              svgoConfig: {
                multipass: true,
                plugins: [
                  {
                    name: 'preset-default',
                    params: {
                      overrides: {
                        removeViewBox: false,
                        inlineStyles: {
                          onlyMatchedOnce: false
                        }
                      }
                    }
                  }
                ]
              }
            }
          }
        ]
      }
    ]
  });

  actions.replaceWebpackConfig(config);
};
