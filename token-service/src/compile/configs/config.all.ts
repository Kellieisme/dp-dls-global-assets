import { customTransformGroupLiterals, customFilterLiterals } from '../extensions/definitions.js';
//customFormatLiterals  imports removed

export const config = {
  source: [],
  platforms: {
    css: {
      transformGroup: customTransformGroupLiterals.customWebCss,
      buildPath: '../src/css/',
      files: [
        {
          destination: 'variables.css',
          format: 'css/variables',
          filter: customFilterLiterals.customWebTokens
        },
        {
          destination: 'variablesBase.css',
          format: 'css/variables',
          filter: customFilterLiterals.customWebTokensBase
        }
      ]
    },
    // scss: {
    //   transformGroup: customTransformGroupLiterals.customWebScss,
    //   buildPath: '../src/scss/base/',
    //   files: [
    //     {
    //       destination: '_variables.scss',
    //       format: 'scss/variables',
    //       filter: customFilterLiterals.customWebTokens,
    //     },
    //     {
    //       destination: '_variablesBase.scss',
    //       format: 'scss/variables',
    //       filter: customFilterLiterals.customWebTokensBase,
    //     },
    //     {
    //       destination: '_typographyMixins.scss',
    //       format: customFormatLiterals.customWebTypographyMixins,
    //       filter: customFilterLiterals.customWebTypography,
    //     },
    //     {
    //       destination: '_compositionMixins.scss',
    //       format: customFormatLiterals.customWebCompositionMixins,
    //       filter: customFilterLiterals.customWebComposition,
    //     },
    //     {
    //       destination: '_themeMixins.scss',
    //       format: customFormatLiterals.customWebThemeMixins,
    //       filter: customFilterLiterals.customWebTokens,
    //     }
    //   ]
    // },
    js: {
      transformGroup: customTransformGroupLiterals.customWebJs,
      buildPath: '../src/js/',
      files: [
        {
          destination: 'variables.js',
          format: 'javascript/es6',
          filter: customFilterLiterals.customWebTokens,
        },
        {
          destination: 'variablesBase.js',
          format: 'javascript/es6',
          filter: customFilterLiterals.customWebTokensBase,
        },
        {
          destination: 'variables.module.js',
          format: 'javascript/module',
          filter: customFilterLiterals.customWebTokens,
        },
        {
          destination: 'variablesBase.module.js',
          format: 'javascript/module',
          filter: customFilterLiterals.customWebTokensBase,
        }
      ]
    },
    json: {
      transformGroup: customTransformGroupLiterals.customWebJson,
      buildPath: '../src/json/',
      files: [
        {
          destination: 'variables.json',
          format: 'json/nested',
          filter: customFilterLiterals.customWebTokens,
        },
        {
          destination: 'variablesBase.json',
          format: 'json/nested',
          filter: customFilterLiterals.customWebTokensBase,
        }
      ]
    },
  }
}