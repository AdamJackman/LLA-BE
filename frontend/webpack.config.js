module.exports = {
  entry: "./src/js/main.js",
  output: {
    path: './dist',
    filename: "bundle.js",
    publicPath: '/'
  },
  devServer: {
    inline: true,
    contentBase: './dist'
  },
  module: {
    loaders: [
      //Bundle js
      {
        test: /\.jsx?$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel',
        query: {
          presets: ['es2015', 'react']
        }
      },
      //Bundle CSS
      {
        test: /\.css$/,
        loader: "style!css"
      }
    ]
  }
};