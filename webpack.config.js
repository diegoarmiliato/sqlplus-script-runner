/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path');

const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
  context: path.resolve(__dirname, 'src'),
  entry: './App.ts',
  node: {
    __dirname: true
  },
  output: {
    filename: 'App.js',
    libraryTarget: 'this'
  },
  target: 'node',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'ts-loader',
        options: {
          transpileOnly: true
        }
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
      }
    ]
  },
  resolve: {
    extensions: [ '.ts', '.tsx', '.js' ]
  },
  plugins: [
    new CleanWebpackPlugin({
      verbose: true
    })
  ]
};