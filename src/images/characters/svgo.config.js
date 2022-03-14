module.exports = {
  plugins: [
    {
      name: 'preset-default',
      params: {
        overrides: {
          inlineStyles: {
            onlyMatchedOnce: false
          }
        }
      }
    },
    'removeStyleElement'
  ]
};
