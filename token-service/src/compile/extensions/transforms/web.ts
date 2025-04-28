import { customTransformLiterals } from '../definitions.js';
import { formatRgba } from '../../../fetch/parsers/utils.js';

export const customWebTransforms = {

  // Color / RGBA
  [customTransformLiterals.customWebRgba]: {
    name: customTransformLiterals.customWebRgba,
    type: 'value' as const,
    // "transitive: true" allows modification of value after alias token is replaced
    transitive: true,
    matcher: (prop) => {
      return prop.attributes.category === 'color';
    },
    transformer: (prop) => {
      return formatRgba(prop.value);
    },
  },

  // Typography / Responsive Sizes
  [customTransformLiterals.customWebResponsiveType]: {
    name: customTransformLiterals.customWebResponsiveType,
    type: 'value' as const,
    matcher: (prop) => {
      return prop.attributes.category === 'responsive-type';
    },
    transformer: (prop) => {
      return `${prop.value}px`;
    },
  },
  
  // Typography / Font Family
  [customTransformLiterals.customWebFontFamily]: {
    name: customTransformLiterals.customWebFontFamily,
    type: 'value' as const,
    matcher: (prop) => {
      return prop.attributes.category === 'content' && prop.attributes.item === 'font-family';
    },
    transformer: (prop) => {
      return `"${prop.value.replace(/['"|'|“|”]/g, '')}"`;
    },
  },

  // Typography / Font Weight
  [customTransformLiterals.customWebFontWeight]: {
    name: customTransformLiterals.customWebFontWeight,
    type: 'value' as const,
    matcher: (prop) => {
      return prop.attributes.category === 'content' && prop.attributes.item === 'font-weight';
    },
    transformer: (prop) => {
      /* Font weight conversions
        300	Light
        400	Normal
        500	Medium
        600	Semi Bold (Demi Bold)
        700	Bold
        800	Extra Bold (Ultra Bold)
        900	Black (Heavy)
      */
      function getCssFontWeightProperty(value) {
        switch (value) {
          case 'Light':
            return 300;
          case 'Regular':
            return 400;
          case 'Medium':
            return 500;
          case 'Bold':
            return 700;
          case 'Black':
            return 900;
          default:
            return 400;
        }
      }

      return getCssFontWeightProperty(prop.value);
    },
  },

  // Typography / Text Decoration
  [customTransformLiterals.customWebTextDecoration]: {
    name: customTransformLiterals.customWebTextDecoration,
    type: 'value' as const,
    matcher: (prop) => {
      return prop.attributes.category === 'content' && prop.attributes.item === 'text-decoration';
    },
    transformer: (prop) => {
      function getCssTextDecorationProperty(figmaLiteral: TextDecoration) {
        switch (figmaLiteral) {
          case 'NONE':
            return 'none';
          case 'STRIKETHROUGH':
            return 'line-through';
          case 'UNDERLINE':
            return 'underline';
          default:
            return 'none';
        }
      }

      return getCssTextDecorationProperty(prop.value as TextDecoration);
    },
  },

  // Opacity
  [customTransformLiterals.customWebColorOpacity]: {
    name: customTransformLiterals.customWebColorOpacity,
    type: 'value' as const,
    // "transitive: true" allows modification of value after alias token is replaced
    transitive: true,
    matcher: (prop) => {
      return prop.attributes.category === 'color' && 
        prop.$extensions && prop.$extensions['studio.tokens'] &&
        prop.$extensions['studio.tokens'].modify?.type === 'alpha';
    },
    transformer: (prop) => {
      const opacity = prop.$extensions['studio.tokens'].modify.value;
      let hexAlpha = (Math.round(opacity * 255)).toString(16);
      if (hexAlpha.length < 2) {
          hexAlpha = `0${hexAlpha}`;
      }
      return `${prop.value}${hexAlpha}`;
    },
  },

  // Elevation
  [customTransformLiterals.customWebElevation]: {
    name: customTransformLiterals.customWebElevation,
    type: 'value' as const,
    // "transitive: true" allows modification of value after alias token is replaced
    transitive: true,
    matcher: (prop) => {
      return prop.attributes.category === 'boxShadow';
    },
    transformer: (prop) => {
      let values = Array.isArray(prop.value) ? prop.value : [prop.value];
      return values.map(({ x, y, blur, spread, color }) => `${x}px ${y}px ${blur}px ${spread && parseInt(spread) > 0 ? spread`px ` : ``}${color}`).join(', ').replaceAll('pxpx', 'px');
    },
  },

  // Border position
  [customTransformLiterals.customWebBorderPosition]: {
    name: customTransformLiterals.customWebBorderPosition,
    type: 'value' as const,
    matcher: (prop) => {
      return prop.attributes.category === 'content' && prop.attributes.item === 'border-position';
    },
    transformer: (prop) => {
      function getBorderPositionProperty(value) {
        switch (value) {
          case 'inside':
            return `border-box`;
          case 'outside':
            return `content-box`;
          default:
            return `content-box`;
        }
      }
      return getBorderPositionProperty(prop.value);
    },
  },
  
};
