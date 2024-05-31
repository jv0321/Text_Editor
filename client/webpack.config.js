const HtmlWebpackPlugin = require('html-webpack-plugin');
const WebpackPwaManifest = require('webpack-pwa-manifest');
const path = require('path');
const { InjectManifest } = require('workbox-webpack-plugin');

// TODO: Add and configure workbox plugins for a service worker and manifest file.
// TODO: Add CSS loaders and babel to webpack.

module.exports = (env, argv) => {
  const isProduction = argv.mode === 'production'
  const plugins = [
    new HtmlWebpackPlugin({
      template: './index.html',
      filename: 'index.html'
    }),

    new WebpackPwaManifest({
      fingerprints: false,
      name: 'Just Another Text Editor',
      short_name: 'JATE',
      description: 'PWA Text Editor',
      background_color: '#414141',
      theme_color: '#fff',
      publicPath: '/',
      crossorigin: 'use-credentials', //can be null, use-credentials or anonymous
      icons: [
        {
          src: path.resolve('./src/images/logo.png'),
          sizes: [96, 128, 192, 256, 384, 512], // multiple sizes
          destination: path.join('assets', 'icons')
        },
      ]
    }),
  ]

  if (isProduction) {
    plugins.push(
      new InjectManifest({
        swSrc: './src-sw.js', // Path to your service worker file
      }),
    )
  }

  return {
    mode: 'development',
    entry: {
      main: './src/js/index.js',
      install: './src/js/install.js'
    },
    output: {
      filename: '[name].bundle.js',
      path: path.resolve(__dirname, 'dist'),
      clean: true,
    },
    plugins: plugins,

    module: {
      // Tell webpack how to read different file types
      rules: [
        {//Tells webpack to run css files thruw the css loader
          test: /\.css$/i,
          use: ['style-loader', 'css-loader'],
        },
        {
          test: /\.m?js$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env'],
              plugins: ['@babel/plugin-proposal-object-rest-spread', '@babel/transform-runtime'],
            },
          },
        },
      ],
    },
  };
};