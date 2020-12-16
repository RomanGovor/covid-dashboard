const webpack = require('webpack');
const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');

const ASSET_PATH = process.env.ASSET_PATH || './';

module.exports = (env, options) => {
  const isProduction = options.mode === 'production';
  const devtool = isProduction ? false : 'source-map';

  const jsLoaders = () => {
    const loaders = [{
      loader: 'babel-loader',
      options: {
        presets: ['@babel/preset-env'],
      },
    }];

    if (!isProduction) {
      loaders.push('eslint-loader');
    }
    return loaders;
  };

  const config = {
    mode: isProduction ? 'production' : 'development',
    devtool,
    watch: !isProduction,
    entry: ['./src/index.js', './src/sass/style.scss'],
    output: {
      // publicPath: ASSET_PATH,
      publicPath: '',
      path: path.join(__dirname, '/dist'),
      filename: 'script.js',
    },

    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,

          use: jsLoaders(),
        },
        {
          test: /\.scss$/,
          use: [
            MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader',
          ],
        },
        {
          test: /\.css$/,
          use: ['style-loader', 'css-loader'],
        },
        {
          test: /\.(png|svg|jpe?g|gif)$/,
          use: [
            {
              loader: 'file-loader',
              options: {
                name: 'assets/images/[name].[ext]',
              },
            },
          ],
        },
        {
          test: /.(ogg|mp3|wav|mpe?g)$/,
          use: [
            {
              loader: 'file-loader',
              options: {
                name: 'assets/audio/[hash][query].[ext]',
              },
            },
          ],
        },
        // {
        //   test: /\.html$/,
        //   loader: 'html-loader',
        // },
      ],
    },

    devServer: {
      compress: true,
      port: 8081,
      overlay: true,
      hot: !isProduction,
      // open: 'chrome',
    },

    plugins: [
      new webpack.DefinePlugin({
        'process.env.ASSET_PATH': JSON.stringify(ASSET_PATH),
      }),
      // new CopyPlugin({
      //     patterns: [
      //         { from: 'src/assets', to: 'assets' },
      //     ],
      //     options: {
      //         concurrency: 100,
      //     },
      // }),
      new CleanWebpackPlugin(),
      new HtmlWebpackPlugin({
        template: './index.html',
      }),
      new MiniCssExtractPlugin({
        filename: 'style.css',
      }),
    ],

    performance: {
      maxEntrypointSize: 5512000,
      maxAssetSize: 5512000,
    },
    resolve: {
      alias: {
        './images/layers.png$': path.resolve(
          __dirname,
          './node_modules/leaflet/dist/images/layers.png',
        ),
        './images/layers-2x.png$': path.resolve(
          __dirname,
          './node_modules/leaflet/dist/images/layers-2x.png',
        ),
        './images/marker-icon.png$': path.resolve(
          __dirname,
          './node_modules/leaflet/dist/images/marker-icon.png',
        ),
        './images/marker-icon-2x.png$': path.resolve(
          __dirname,
          './node_modules/leaflet/dist/images/marker-icon-2x.png',
        ),
        './images/marker-shadow.png$': path.resolve(
          __dirname,
          './node_modules/leaflet/dist/images/marker-shadow.png',
        ),
      },
    },
  };
  return config;
};
