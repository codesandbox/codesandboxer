const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  entry: {
    'babel-polyfill': 'babel-polyfill',
    'deploy-file': './src/pages/deploy-file/index.js',
    'select-file': './src/pages/select-file/index.js',
    'home': './src/pages/home/index.js',
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
      template: './src/pages/home/index.html',
      filename: './index.html',
      chunks: ['home']
    }),
    new HtmlWebpackPlugin({
      template: './src/pages/deploy-file/index.html',
      filename: './deploy-file/index.html',
      chunks: ['deploy-file']
    }),
    new HtmlWebpackPlugin({
      template: './src/pages/select-file/index.html',
      filename: './select-file/index.html',
      chunks: ['select-file']
    }),
    new CopyWebpackPlugin([{
      from: 'src/atlassian-connect.json',
      to: 'atlassian-connect.json'
    }]),
    new MiniCssExtractPlugin({
      filename: '[name]/styles.css',
      chunkFilename: '[id].css'
    })
  ]
};
