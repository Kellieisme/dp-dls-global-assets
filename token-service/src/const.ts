export const Const = {
  // Fetch
  identifier: {
    page: {
      prefix: '$',
      directory: {
        typography: {
          pageName: '$Typography',
          prefix: '.$typography'
        },
        effects: {
          pageName: '$Effects',
          prefix: {
            base: '.$base',
            alias: '$'
          }
        },
        grid: {
          pageName: '$Grids and Spacing',
        },
        motions: {
          pageName: '$Motion',
          prefix: '$'
        }
      }
    },
  },
  collections: {
    primitives: 'Primitives',
    semantic: 'Semantic',
    color: 'Color'
  },
  tokenTypes: {
    typography: 'typography',
    dropShadow: 'drop-shadow'
  },
  tokenProperties: {
    typography: {
      fontFamily: { literal: 'font-family', alternatives: { web: 'font-family' } },
      fontWeight: { literal: 'font-weight', alternatives: { web: 'font-weight' } },
      fontSize: { literal: 'font-size', alternatives: { web: 'font-size' } },
      lineHeight: { literal: 'line-height', alternatives: { web: 'line-height' } },
      letterSpacing: { literal: 'letter-spacing', alternatives: { web: 'letter-spacing' } },
      textDecoration: { literal: 'text-decoration', alternatives: { web: 'text-decoration' } },
      textCase: { literal: 'text-case', alternatives: { web: 'text-transform' } },
      italic: { literal: 'italic', alternatives: { web: 'font-style' } }
    },
    dropShadow: {
      color: 'color',
      offsetX: 'x',
      offsetY: 'y',
      radius: 'blur',
      spread: 'spread',
    }
  },
  dataPaths: {
    dir: 'figma-data',
    data: {
      baseVariables: 'figma-data/baseVariables.json',
      variables: 'figma-data/variables.json',
      elements: 'figma-data/elements.json',
      styles: 'figma-data/styles.json',
      icons: 'figma-data/icons.json',
      tokensStudio: 'figma-data/tokens-studio.json',
    }
  },
  srcPaths: {
    dir: {
      icons: '../src/images/icons',
    },
    file: {
      set: 'svgSet.svg'
    }
  },
  tokenPaths: {
    dir: {
      color: 'tokens/color',
      size: 'tokens/size',
      content: 'tokens/content',
      typography: 'tokens/typography',
      effects: 'tokens/effects',
      gradients: 'tokens/gradients'
    },
    file: {
      base: 'base.json',
      alias: 'alias.json',
    }
  },
  tokensStudioPaths: {
    dir: {
      all: "tokens/tokens-studio/all",
      color: 'tokens/tokens-studio/color',
      size: 'tokens/tokens-studio/size',
      content: 'tokens/tokens-studio/content',
      typography: 'tokens/tokens-studio/typography',
      effects: 'tokens/tokens-studio/effects',
      gradients: 'tokens/tokens-studio/gradients'
    },
    file: {
      base: 'base.json',
      alias: 'alias.json',
    }
  },
  customAttribute: {
    category: {
      fontName: 'custom/attribute/category/font-name',
      textDecoration: 'custom/attribute/category/text-decoration',
      textCase: 'custom/attribute/category/text-case',
      italic: 'custom/attribute/category/italic',
    }
  },
  figmaStyle: {
    effect: 'EFFECT',
    text: 'TEXT',
    fill: 'FILL',
    grid: 'GRID',
  },
  figmaStyleMap: {
    dropShadow: 'DROP_SHADOW',
    boxShadow: 'BOX_SHADOW',
    fill: 'FILL',
  },
}