const path = require('path');

// Export a function. Accept the base config as the only param.
module.exports = async ({ config, mode }) => {
  // `mode` has a value of 'DEVELOPMENT' or 'PRODUCTION'
  // You can change the configuration based on that.
  // 'PRODUCTION' is used when building the static version of storybook.

  // Make whatever fine-grained changes you need
  config.module.rules.push({
    test: /\.scss$/,
    use: ['style-loader', 'css-loader', 'sass-loader'],
    include: path.resolve(__dirname, '../'),
  });

  config.module.rules.push(
    {
      resourceQuery: /module/,
      use: [
        {
          loader: 'vue-style-loader',
          options: {
            sourceMap: false,
            shadowMode: false
          }
        },
        {
          loader: 'css-loader',
          options: {
            sourceMap: false,
            importLoaders: 2,
            modules: true,
            localIdentName: '[name]_[local]_[hash:base64:5]'
          }
        },
        {
          loader: 'postcss-loader',
          options: {
            sourceMap: false
          }
        },
        {
          loader: 'sass-loader',
          options: {
            sourceMap: false,
            indentedSyntax: true,
            data: `@import "../src/styles/theme/primary.scss";`
          }
        }
      ]
    }
  );

  Object.assign(config.resolve.alias,{
    '@': path.resolve(__dirname, '../src')
  })
  // Return the altered config
  return config;
};