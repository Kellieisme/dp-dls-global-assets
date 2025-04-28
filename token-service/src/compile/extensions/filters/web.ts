import { customFilterLiterals } from '../definitions.js';

export const customWebFilters = {
  // Typography
  [customFilterLiterals.customWebTypography]: {
    name: customFilterLiterals.customWebTypography,
    matcher: (prop) => {
      return prop.attributes.category === 'typography';
    },
  },
  // Composition
  [customFilterLiterals.customWebComposition]: {
    name: customFilterLiterals.customWebComposition,
    matcher: (prop) => {
      return prop.attributes.category === 'composition';
    },
  },
  // Not Base, Typography or Composition
  [customFilterLiterals.customWebTokens]: {
    name: customFilterLiterals.customWebTokens,
    matcher: (prop) => {
      return prop.attributes.type !== 'base' && prop.attributes.category !== 'typography' && prop.attributes.category !== 'composition';
    },
  },
  // Base Tokens
  [customFilterLiterals.customWebTokensBase]: {
    name: customFilterLiterals.customWebTokensBase,
    matcher: (prop) => {
      return prop.attributes.type === 'base';
    },
  },
}
