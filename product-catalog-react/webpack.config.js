const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { ModuleFederationPlugin } = require('webpack').container;

module.exports = {
  entry: './src/index.js',
  mode: 'development',
  devServer: {
    port: 3001,
    static: path.join(__dirname, 'public'),
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
  },
  output: {
    publicPath: 'http://localhost:3001/',
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: 'babel-loader',
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.jsx'],
  },
  plugins: [
    new ModuleFederationPlugin({
      name: 'productCatalog',
      filename: 'remoteEntry.js',
      exposes: {
        './ProductList': './src/ProductList',
      },
      shared: {
        react: { singleton: true, requiredVersion: false },
        'react-dom': { singleton: true, requiredVersion: false },
      },
    }),
    new HtmlWebpackPlugin({
      template: './public/index.html',
    }),
  ],
};
