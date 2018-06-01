const webpack = require('webpack');
const CleanPlugin = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const PATH = require('./path');
const path = require('path');
const fs = require('fs');
const entryFiles = fs.readdirSync(PATH.ENTRY_PATH);

process.env.BABEL_ENV = 'development';
process.env.NODE_ENV = 'development';

const files = [];
const entries = {};

entryFiles
  .filter(file =>
    file.split('.')[0] && file.split('.').slice(-1)[0] === 'js'
  )
  .forEach(file => {
    const filename = file.split('.')[0];
    const filepath = path.join(PATH.ENTRY_PATH, file)
    entries[filename] = filepath;
});

module.exports = {
  entry: entries,
  output: {
    filename: '[name].bundle.js',
    path: path.join(PATH.BUILD_PATH, './js')
  },
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: /(node_modules)/,
        loader: ["babel-loader"],
        query: {
          presets: ["es2015", "react-app"]
        }
      }
    ],
  },
  resolve: {
    extensions: ['', '.js', '.jsx'],
  },
  plugins: [
    new CleanPlugin(PATH.BUILD_PATH, {
      root: PATH.ROOT_PATH,
      verbose: true
    }),
    new CopyWebpackPlugin([{
      from: path.join(PATH.SOURCE_PATH),
      to: path.join(PATH.BUILD_PATH),
      ignore: [ '*.DS_Store', 'js/*.js' ]
    }])
  ],
  debug: true,
  displayErrorDetails: true,
  outputPathinfo: true,
  devtool: "cheap-module-eval-source-map"
};
