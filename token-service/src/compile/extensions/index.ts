// Filters
import { customWebFilters } from './filters/web.js';

// Transforms
import { customWebTransforms } from './transforms/web.js';

// Transform Groups
import { customWebTransformGroups } from './transformGroups/web.js';

// Formats
import { customWebFormats } from './formats/web.js';

// Exports
export const customFilters = {
  ...customWebFilters,
}

export const customTransforms = {
  ...customWebTransforms,
}

export const customTransformGroups = {
  ...customWebTransformGroups,
}

export const customFormats = {
  ...customWebFormats,
}