import * as changeCase from "change-case";
import { customFormatLiterals } from '../definitions.js';
import { formatRgba } from "../../../fetch/parsers/utils.js";

export const customWebFormats = {
  // SCSS Typography Mixins
  [customFormatLiterals.customWebTypographyMixins]: {
    name: customFormatLiterals.customWebTypographyMixins,
    formatter: function ({ dictionary }) {
      let mixins = '';

      function formatValue(styleKey, value) {
        switch (styleKey) {
          case 'fontFamily':
            return `"${value.replace(/['"|'|“|”]/g, '')}"`;
          default:
            return value;
        }
      }

      function parseTokens(obj: any, path: string[]) {
        Object.keys(obj).forEach(key => {
          const newPath = [...path, key];
          if (key === 'value' && typeof obj[key] === 'object') {
            if (!newPath.slice(0, -1).includes('original')) {
              const mixinName = newPath.slice(0, -1).join('-');
              mixins += `@mixin ${mixinName} {\n`;
              Object.keys(obj[key]).forEach(styleKey => {
                if (styleKey === 'paragraphSpacing' || styleKey === 'paragraphIndent') {
                  // skip
                }
                else {
                  const effectiveKey = styleKey === 'textCase' ? 'textTransform' : styleKey;
                  const value = obj[key][styleKey];
                  mixins += `  ${changeCase.kebabCase(effectiveKey)}: ${formatValue(styleKey, value)};\n`;
                }
              });
              mixins += `}\n\n`;
            }
          } else if (typeof obj[key] === 'object') {
            parseTokens(obj[key], newPath);
          }
        });
      };

      parseTokens(dictionary.tokens, []);
      return mixins.trim();
    }
  },

  // SCSS Composition Mixins
  [customFormatLiterals.customWebCompositionMixins]: {
    name: customFormatLiterals.customWebCompositionMixins,
    formatter: function ({ dictionary }) {
      let mixins = '';

      function formatStyleKey(styleKey) {
        switch (styleKey) {
          case 'fill':
            return 'background';
          case 'border':
            return 'border-image-source';
          case 'text':
            return 'mix-blend-mode';
          case 'backgroundBlur':
            return 'backdrop-filter';
          default:
            return styleKey;
        }
      }

      function formatValue(styleKey, styleObj) {
        function cleanGradients(value) {
          return value.replaceAll('linear-gradient ', 'linear-gradient')
            .replaceAll('#ffffff', '255, 255, 255')
            .replaceAll('\n', '');
        }
        let value = styleObj[styleKey];
        value = formatRgba(value);
        switch (styleKey) {
          case 'backgroundBlur':
            return `blur(${value})`;
          case 'fill':
            if (styleObj['opacity']) {
              let hexAlpha = (Math.round(styleObj['opacity'] * 255)).toString(16);
              if (hexAlpha.length < 2) {
                  hexAlpha = `0${hexAlpha}`;
              }
              return `${value}${hexAlpha}`;
            }
            return cleanGradients(value);
          default:
            return cleanGradients(value);
        }
      }

      function parseTokens(obj: any, path: string[]) {
        Object.keys(obj).forEach(key => {
          const newPath = [...path, key];
          if (key === 'value' && typeof obj[key] === 'object') {
            if (!newPath.slice(0, -1).includes('original')) {
              const mixinName = newPath.slice(0, -1).join('-');
              mixins += `@mixin ${mixinName} {\n`;
              Object.keys(obj[key]).forEach(styleKey => {
                // Opacity gets applied to the background color, so remove opacity property
                if (styleKey !== 'opacity') {
                  mixins += `  ${changeCase.kebabCase(formatStyleKey(styleKey))}: ${formatValue(styleKey, obj[key])};\n`;
                }
              });
              mixins += `}\n\n`;
            }
          } else if (typeof obj[key] === 'object') {
            parseTokens(obj[key], newPath);
          }
        });
      };

      parseTokens(dictionary.tokens, []);
      return mixins.trim();
    }
  },

  // SCSS Theme Mixins
  [customFormatLiterals.customWebThemeMixins]: {
    name: customFormatLiterals.customWebThemeMixins,
    formatter: function ({ dictionary }) {
      
      let mixins = '';

      function buildCustomProperty(obj: any, path: string[] = []) {
        for (const key in obj) {
          if (key === 'value') {
            const customPropertyName = path.filter((_, index) => index !== 1).join('-');
            mixins += `  --${changeCase.kebabCase(customPropertyName)}: ${obj[key]};\n`;
          } else if (key === 'original' || key === '$extensions') {
            continue;
          } else if (typeof obj[key] === 'object' && obj[key] !== null) {
            buildCustomProperty(obj[key], [...path, key]);
          }
        }
      }

      function parseTokens(obj: any) {
        for (const category in obj) {
          if (category === 'color' || category === 'size' || category === 'boxShadow') {
            for (const type in obj[category]) {
              mixins += `@mixin theme-${type}-${changeCase.kebabCase(category)} {\n`;
              buildCustomProperty(obj[category][type], [category, type]);
              mixins += `}\n\n`;
            }
          }
        }
      }

      parseTokens(dictionary.tokens);
      return mixins.trim();
    }
  }
}