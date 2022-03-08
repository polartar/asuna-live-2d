const fs = require('fs')
const path = require('path')

module.exports = {
  mode: 'production',
  target: ['web', 'es5'],
  context: __dirname,
  entry: './src/index.ts',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'app.[hash].min.js',
    publicPath: '/dist/',
    clean: true
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
    {
      apply: function (compiler) {
        compiler.hooks.done.tap('SaveHashPlugin', stats => {
          fs.writeFileSync(
            path.join(__dirname, './dist', 'stats.json'),
            JSON.stringify({ hash: stats.hash })
          )
        })
      }
    }
  ],
  devtool: 'inline-source-map'
}
