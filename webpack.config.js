module.exports = {
  entry: './index.js',
  output: {
    path: 'dist',
    filename: 'bundle.js',  
    publicPath: "./dist/",
  },

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
        use: ['style-loader', 'css-loader', { 
          loader: 'postcss-loader',
          options: {
            plugins: function () {
              return [
                require('autoprefixer')
              ];
            }
          }
        }],
      },
    ]
  }
}