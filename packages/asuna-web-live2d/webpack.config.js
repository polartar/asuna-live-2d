const path = require('path')
const { StatsWriterPlugin } = require("webpack-stats-plugin")

module.exports = {
  mode: 'production',
  target: 'web',
  context: __dirname,
  entry: './src/index.ts',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'app.[hash].min.js',
    publicPath: '/dist/'
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        loader: 'ts-loader'
      }
    ]
  },
  resolve: {
    extensions: ['.ts', '.js']
  },
  optimization: {
    minimize: true
  },
  plugins: [
    new StatsWriterPlugin({
      stats: {
        all: false,
        hash: true
      }
    })
  ],
  devtool: 'inline-source-map'
}
