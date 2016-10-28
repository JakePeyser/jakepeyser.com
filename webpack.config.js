/* eslint-disable no-unused-vars*/

const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const FaviconsWebpackPlugin = require('favicons-webpack-plugin');
const merge = require('webpack-merge');
const validate = require('webpack-validator');
const tools = require('./libs/webpack.tools');
const pkg = require('./package.json');

// Init common paths used by config
const path = require('path');
const PATHS = {
  app: path.join(__dirname, 'browser/react'),
  build: path.join(__dirname, 'browser/build'),
  favicon: path.join(__dirname, 'browser/src/favicon.ico'),
  stylesheets: path.join(__dirname, 'browser/src/stylesheets', 'style.css'),
  logo: path.join(__dirname, 'browser/src/images/logo.png'),
  html_template: path.join(__dirname, 'browser/src/index.html')
};

// Generate image file locations in an array
const IMAGE_PATHS = [ PATHS.logo ];
const projects = ['capital-weather', 'parachute-teachers', 'real-time-tone-analysis', 'runkeeper-hashmatch'];
const imageTypes = ['banner', 'icon', 'screenshot', 'mobile'];
for (let i = 0; i < imageTypes.length; i++) {
  for (let j = 0; j < projects.length; j++) {
    IMAGE_PATHS.push(path.join(__dirname, `browser/src/images/${projects[j]}/${imageTypes[i]}.png`))
  }
}

// Vendor dependencies, isolated for chunking
const vendorDependencies = [
  'axios',
  'react', 'react-dom', 'react-helmet', 'react-router',
  'redux', 'react-redux', 'redux-logger', 'redux-thunk'
]

// index.html template
let htmlTemplate = {
  title: 'Jake Peyser',
  meta: {
    description: 'The personal website of Jake Peyser, software engineer and international adventurer extraordinaire',
    author: 'Jake Peyser',
    keywords: 'software,developer,web,freelance,nodejs,react'
  },
  template: PATHS.html_template
}

// Standard build artifacts for all envs
const common = {
  entry: {
    app: PATHS.app,
    style: PATHS.stylesheets,
    images: IMAGE_PATHS
  },
  output: {
    path: PATHS.build,
    sourceMapFilename: '[file].map',
    filename: '[name].js'
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development')
    })
  ],
  module: {
    loaders: [
      {
        test: /jsx?$/,
        exclude: /node_modules/,
        loader: 'babel',
        query: {
          presets: ['react', 'es2015']
        }
      }
    ]
  }
}

// Detect how npm is run and switch based on this
let config;
switch (process.env.npm_lifecycle_event) {
  case 'start':
    config = merge(
      common,
      {
        devtool: 'source-map',
        output: Object.assign(common.output, {
          filename: '[name].[chunkhash].js',
          chunkFilename: '[chunkhash].js'
        }),
        plugins: [
          ...common.plugins,
          new FaviconsWebpackPlugin({
            logo: PATHS.logo,
            emitStats: false
          }),
          new HtmlWebpackPlugin(htmlTemplate)
        ]
      },
      tools.extractBundle({
        name: 'vendor',
        entries: vendorDependencies
      }),
      tools.clean(PATHS.build),
      tools.extractCSS(PATHS.stylesheets),
      tools.extractImages(PATHS.images),
      tools.minify()
    );
    break;
  case 'dev':
    htmlTemplate.favicon = PATHS.favicon;
    config = merge(
      common,
      {
        devtool: 'eval',
        plugins: [
          ...common.plugins,
          new HtmlWebpackPlugin(htmlTemplate)
        ]
      },
      tools.clean(PATHS.build),
      tools.extractCSS(PATHS.stylesheets),
      tools.extractImages(PATHS.images)
      // tools.devServer({
      //   port: 3000
      // })
    );
    break;
  default:
    console.log('No Webpack config specified')
    config = merge(common)
}

module.exports = validate(config);
