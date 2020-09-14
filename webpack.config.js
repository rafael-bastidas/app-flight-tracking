const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin');

module.exports = {
 mode: 'production',
 entry: {
   app: './frontend/index.js',
 },
 devtool: 'inline-source-map',
 devServer: {
    contentBase: './backend/public',
 },
 module: {
    rules: [
      {
        test: /\.css/,
        use: [MiniCssExtractPlugin.loader, 'css-loader'],
      },
      {
        test: /\.vue/,
        loader: 'vue-loader'
      },
      {
        test: /\.js/,
        loader: 'babel-loader', exclude: path.resolve(__dirname, 'node_modules/')
      },
      {
        test: /\.(png|svg|jpg|gif)/,
        loader: 'file-loader',
        options: {
          name: 'img/[name].[ext]',
        },
      }
    ],
  },
 plugins: [
    new VueLoaderPlugin(),
    new MiniCssExtractPlugin(
        {filename: 'css/bundle.css'}
    ),
    new HtmlWebpackPlugin({
      title: 'Flight Tracking',
      filename: 'index.html',
      template: './frontend/index.html',
      minify: {
        collapseWhitespace: true,
        removeComments: true,
        removeRedundantAttributes: true,
        removeScriptTypeAttributes: true,
        removeStyleLinkTypeAttributes: true,
        useShortDoctype: true
      }
    }),
  ],
  output: {
   filename: 'js/[name].bundle.min.js',
    path: path.resolve(__dirname, 'backend/public'),
  },
};