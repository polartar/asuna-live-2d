const fs = require('fs')
const path = require('path')

const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const tailwind = require('tailwindcss')
const autoprefixer = require('autoprefixer')
const cssnano = require('cssnano')

const cssvar = require('./src/styles/variables')

module.exports = {
  mode: 'production',
  target: ['web', 'es5'],
  context: __dirname,
  entry: {
    './js/app': './src/index.tsx',
    './css/style': './src/styles/style.scss'
  },
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: '[name].[hash].min.js',
    publicPath: '/dist/',
    clean: true
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        loader: 'ts-loader'
      },
      {
        test: /\.scss$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                plugins: [
                  tailwind,
                  autoprefixer,
                  cssnano
                ]
              }
            },
          },
          {
            loader: 'sass-loader',
            options: {
              additionalData: Object.keys(cssvar).map(k => `$${k}:${cssvar[k]};`).join('')
            }
          }
        ],
      }
    ]
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js']
  },
  optimization: {
    minimize: true
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: '[name].[hash].min.css',
    }),
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
