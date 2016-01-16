var path = require('path');

module.exports = {
  entry: './src/main.js',
  output: { path: path.join(__dirname, 'lib'), filename: 'bundle.js' },
  module: {
    loaders: [
      {
        test: /.js?$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        query: {
          presets: ['es2015']
        }
      }
    ]
  },
};