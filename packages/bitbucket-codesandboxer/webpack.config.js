const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  entry: {
    'babel-polyfill': 'babel-polyfill',
    'index': './src/index.js',
    'select-file': './src/select-file.js'
  },
  output: {
    publicPath: '/',
    filename: '[name]/bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader'
        }
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader']
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html',
      filename: './index.html',
      chunks: ['index']
    }),
    new HtmlWebpackPlugin({
      template: './src/select-file.html',
      filename: './select-file.html',
      chunks: ['select-file']
    }),
    new CopyWebpackPlugin([{
      from: 'src/atlassian-connect.json',
      to: 'atlassian-connect.json'
    }]),
    new MiniCssExtractPlugin({
      filename: '[name].css',
      chunkFilename: '[id].css'
    })
  ]
};
