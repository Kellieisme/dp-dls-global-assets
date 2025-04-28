import { customTransformLiterals, customTransformGroupLiterals } from '../definitions.js';

export const customWebTransformGroups = {
  css: {
    name: customTransformGroupLiterals.customWebCss,
    transforms: [
      'attribute/cti',
      'name/cti/kebab',
      'size/px',
      'color/css',
      customTransformLiterals.customWebResponsiveType,
      customTransformLiterals.customWebFontFamily,
      customTransformLiterals.customWebElevation,
      customTransformLiterals.customWebBorderPosition,
      customTransformLiterals.customWebColorOpacity,
      customTransformLiterals.customWebRgba
    ]
  },
  // scss: {
  //   name: customTransformGroupLiterals.customWebScss,
  //   transforms: [
  //     'attribute/cti',
  //     'name/cti/kebab',
  //     'size/px',
  //     'color/css',
  //     customTransformLiterals.customWebResponsiveType,
  //     customTransformLiterals.customWebFontFamily,
  //     customTransformLiterals.customWebElevation,
  //     customTransformLiterals.customWebBorderPosition,
  //     customTransformLiterals.customWebColorOpacity,
  //     customTransformLiterals.customWebRgba
  //   ]
  // },
  js: {
    name: customTransformGroupLiterals.customWebJs,
    transforms: [
      'attribute/cti', 
      'name/cti/camel',
      'size/px',
      'color/css',
      customTransformLiterals.customWebResponsiveType,
      customTransformLiterals.customWebFontFamily,
      customTransformLiterals.customWebElevation,
      customTransformLiterals.customWebBorderPosition,
      customTransformLiterals.customWebColorOpacity,
      customTransformLiterals.customWebRgba
    ]
  },
  json: {
    name: customTransformGroupLiterals.customWebJson,
    transforms: [
      'attribute/cti',
      'name/cti/kebab',
      'size/px',
      'color/css',
      customTransformLiterals.customWebResponsiveType,
      customTransformLiterals.customWebFontFamily,
      customTransformLiterals.customWebElevation,
      customTransformLiterals.customWebBorderPosition,
      customTransformLiterals.customWebColorOpacity,
      customTransformLiterals.customWebRgba
    ]
  }
}