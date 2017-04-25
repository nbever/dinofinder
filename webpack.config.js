require( 'webpack' );
const path = require( 'path' );
const HtmlWebpackPlugin = require('html-webpack-plugin');

const ExtractTextPlugin = require("extract-text-webpack-plugin");

const extractSass = new ExtractTextPlugin("dinostyle.css");

var build_dir = path.resolve( __dirname, 'build');
var app_dir = path.resolve( __dirname, 'src' );

var config = {
  entry: app_dir + '/main.js',
  devtool: "source-map",
  output: {
    path: build_dir,
    filename: 'dinofinder.js'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        include: app_dir,
        use: { 
          loader: 'babel-loader',
          options: {
            "presets": ["es2016", "react", "stage-1"],
            "plugins": ["transform-decorators-legacy"]
          }
        }
      },
      {
        test: /\.scss$/,
        include: app_dir,
        use: extractSass.extract({
            use: [{
                loader: "css-loader"
              }, 
              {
                loader: "sass-loader"
              }
            ],
            // use style-loader in development
            fallback: "style-loader"
        })
      },
      {
        test: /\.(eot|svg|ttf|woff|woff2)$/,
        loader: 'file-loader?name=fonts/[name].[ext]'
      },
      {
        test: /\.(jpg|png|svg|gif)$/,
        include: app_dir + '/images',
        loader: 'file-loader?name=images/[name].[ext]'
      }        
    ]
  },
  devServer: {
    contentBase: build_dir,
    compress: true,
    port: 9010,
    watchContentBase: true
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: "DinoFinder",
      template: app_dir + '/index.html.ejs'
    }),
    extractSass
  ]
}

module.exports = config;
