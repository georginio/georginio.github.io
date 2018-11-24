const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  entry: path.join(__dirname, 'index.js'),
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'bundle.js',  
    publicPath: "/dist/",
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: "styles.css",
    })
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(noode_modules)/,
        use: ['babel-loader']
      },
      {
        test: /.*\.(gif|png|jpe?g|svg)$/i,
        loaders: [
          'file-loader',
          {
            loader: 'image-webpack-loader',
          }
        ]
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          {
            loader: MiniCssExtractPlugin.loader,
          },
          'css-loader',
          'postcss-loader'
        ]
      }
    ]
  }
}
