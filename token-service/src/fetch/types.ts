// Type definitions for Figma API - leveraging plugin typings, while REST API typings are not yet officially supported
import '@figma/plugin-typings/plugin-api';

// Custom
export type StylesData = []

// Custom
export type IconsData = {
  iconSet: IconSet;
}

interface IconEntry {
  type: string;
  body: string;
}

interface IconSet {
  entries: {
      [key: string]: IconEntry;
  };
}

