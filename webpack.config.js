/**
 * Webpack main configuration file
 */
const path = require('path');
const fs = require('fs');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HTMLWebpackPlugin = require('html-webpack-plugin');
//const ImageMinimizerPlugin = require('image-minimizer-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const RemoveEmptyScriptsPlugin = require('webpack-remove-empty-scripts');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

const environment = require('./configuration/environment');

const templateFiles = fs
  .readdirSync(environment.paths.source)
  .concat(
    fs.readdirSync(path.resolve(environment.paths.source, 'pages')).map(file => `pages/${file}`)
  )
  .filter((file) => ['.html', '.ejs'].includes(path.extname(file).toLowerCase()))
  .map((filename) => {
    const outputPath = filename.startsWith('pages/') ? filename.replace('pages/', '') : filename;
    return {
      input: path.join(environment.paths.source, filename),
      output: outputPath.replace(/\.ejs$/, '.html'),
    };
  });

const htmlPluginEntries = templateFiles.map(
  (template) =>
    new HTMLWebpackPlugin({
      inject: true,
      hash: false,
      filename: template.output,
      template: path.resolve(environment.paths.source, template.input),
      favicon: path.resolve(environment.paths.source, 'images', 'favicon.ico'),
    })
);

module.exports = {
  entry: {
    fonts: [path.resolve(environment.paths.source, 'scss', 'fonts.scss')],
    global: [path.resolve(environment.paths.source, 'js', 'global.js'), path.resolve(environment.paths.source, 'scss', 'global.scss')],
    demo: [path.resolve(environment.paths.source, 'js', 'demo.js'), path.resolve(environment.paths.source, 'scss', 'demo.scss')],
  },
  output: {
    filename: 'js/[name].js',
    path: environment.paths.output,
  },
  module: {
    rules: [
      {
        test: /\.((c|sa|sc)ss)$/i,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader', 'sass-loader'],
      },
      {
        test: /\.(png|gif|jpe?g|svg)$/i,
        type: 'asset',
        parser: {
          dataUrlCondition: {
            maxSize: environment.limits.images,
          },
        },
        generator: {
          filename: 'images/design/[name][ext]',
        },
      },
      {
        test: /\.(eot|ttf|woff|woff2)$/,
        type: 'asset',
        parser: {
          dataUrlCondition: {
            maxSize: environment.limits.images,
          },
        },
        generator: {
          filename: 'fonts/[name][ext]',
        },
      },
    ],
  },
  // optimization: {
  //   minimizer: [
  //     '...',
  //     new ImageMinimizerPlugin({
  //       minimizer: {
  //         implementation: ImageMinimizerPlugin.imageminMinify,
  //         options: {
  //           // Lossless optimization with custom option
  //           // Feel free to experiment with options for better result for you
  //           plugins: [
  //             ['gifsicle', { interlaced: true }],
  //             ['jpegtran', { progressive: true }],
  //             ['optipng', { optimizationLevel: 5 }],
  //             // Svgo configuration here https://github.com/svg/svgo#configuration
  //             [
  //               'svgo',
  //               {
  //                 plugins: [
  //                   {
  //                     name: 'removeViewBox',
  //                     active: false,
  //                   },
  //                 ],
  //               },
  //             ],
  //           ],
  //         },
  //       },
  //     }),
  //   ],
  // },
  plugins: [
    new RemoveEmptyScriptsPlugin(),
    new MiniCssExtractPlugin({
      filename: 'css/[name].css',
    }),
    new CleanWebpackPlugin({
      verbose: true,
      cleanOnceBeforeBuildPatterns: ['**/*', '!stats.json'],
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: path.resolve(environment.paths.source, 'scss'),
          to: path.resolve(environment.paths.output, 'scss'),
          toType: 'dir',
          globOptions: {
            ignore: ['**/fonts.scss', '**/demo.scss'],
          },
        },
        {
          from: path.resolve(environment.paths.source, 'images', 'content'),
          to: path.resolve(environment.paths.output, 'images', 'content'),
          toType: 'dir',
          globOptions: {
            ignore: ['*.DS_Store', 'Thumbs.db'],
          },
        },
        {
          from: path.resolve(environment.paths.source, 'images', 'icons'),
          to: path.resolve(environment.paths.output, 'images', 'icons'),
          toType: 'dir',
          globOptions: {
            ignore: ['*.DS_Store', 'Thumbs.db'],
          },
        },
        {
          from: path.resolve(environment.paths.source, 'js', 'variables.js'),
          to: path.resolve(environment.paths.output, 'js', 'variables.js'),
          toType: 'file',
        },
        {
          from: path.resolve(environment.paths.source, 'js', 'variables.module.js'),
          to: path.resolve(environment.paths.output, 'js', 'variables.module.js'),
          toType: 'file',
        },
        {
          from: path.resolve(environment.paths.source, 'json', 'variables.json'),
          to: path.resolve(environment.paths.output, 'json', 'variables.json'),
          toType: 'file',
        },
        {
          from: path.resolve('package.json'),
          to: path.resolve(environment.paths.output, 'package.json'),
          toType: 'file',
        },
        {
          from: path.resolve('README.md'),
          to: path.resolve(environment.paths.output, 'README.md'),
          toType: 'file',
        },
      ],
    }),
  ].concat(htmlPluginEntries),
  target: 'web',
};
