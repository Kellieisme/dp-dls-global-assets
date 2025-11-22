# Token Service

Welcome! The token service repository contains the node.js service/application that fetches design tokens directly from the design tools that define our design language system.  It then transpiles them into platform specific constants code. This allows product design and engineering to always reference the same variables for design specifications, and ultimately enforces the consistency between design and code across all platforms, as well as giving the agility in the product development process.

## Usage 

### Prerequisites

- Make sure that you have an Figma account, and generate Personal Access Token following [the documentation](https://www.figma.com/developers/api#access-tokens).

- In order to leverage the Figma REST API through CLI commands below, you will need to have API key: `FIGMA_API_KEY` and token related Figma file ID `FIGMA_ICONS_FILE_KEY`. 

- Reference [Atmosphere Icons Library 1.0](https://www.figma.com/file/aEF6NeIfFACLIXJ7srSvax/Atmosphere-Icons-Library-1.0) for the design file keys.

### Quick Start

1. Clone this repo
2. Run `npm install` to install dependencies.
3. Create `.env` with the following keys: FIGMA_API_KEY and FIGMA_ICONS_FILE_KEY.
4. Run `npm run icons` to generate icons!
4. Run `npm run ts` to generate tokens!

## Software Architecture

The gist of the flow from Figma to downstream code is:

1. Design tokens articulate design specifications, such as colors, typography, spacing, etc., all of which are defined as Figma objects in Base token / UI kit alias token file. 
1. Base tokens are descriptive variable definition (e.g., gray-07: #262626) and alias tokens are prescriptive use case definition inherited from base tokens (e.g., color-text-primary: gray-07). For more details, please review our zeroheight documentation [link to be added]. 
1. The token service points to these files with design tokens, and parses all defined design tokens, and generate abstracted json representations.
1. The parsed json representations gets transpiled into platform specific const outputs.
1. Each UI Kit or FE will consume these const files, and implement components and screens using these token representations.

## What are Design Tokens? 

Design Tokens are the visual design atoms for a design language system. Tokens represent design foundation specifications such as color, typography, size units, or visual effects (e.g., border radius, animation duration, etc.). Tokens are defined in the Figma files (See sections below) to bring consistency across the platform over the entire product development lifecycle.

In design, tokens are used as Figma styles. Tokens can be referenced by both design and engineering and enables a smoother design to development hand-off.

In engineering, tokens are compiled into platform-specific constants. Token usage is standardized across design and engineering — they are named, versioned, and applied consistently in both design and development, making them more standardized than hand-coded values.

Amazon Style Dictionary, a dependency for our token service, has an explanatory video that describes the concept of design tokens and how it turns design variable specifications to platform-specific code. You can read the article [here](https://css-tricks.com/what-are-design-tokens/) and view a short clip [here](https://www.youtube.com/watch?v=1HREvonfqhY#action=share).

### Base Tokens and Alias Tokens

Borrowing from the common concept of inheritance model, our design tokens are differentiated by hierarchy into base tokens (level 1) and alias tokens (level 2). Establishing this hierarchy ensures consistency across design and engineering implementations. Since alias tokens are defined prescriptively to use cases, linking alias tokens to base tokens provides a level of separation that allows for updating base definitions without also needing to update the linked alias implementation. 

For example, base tokens / alias tokens may look like below: 

```css
/* From imports */
:root {
  /* Base Token Example */
  --color-base-solids-gray-08: #0c0c0c;

  /* Alias Token Example */
  --light-fill-cta-primary-default: #0c0c0c;
}

/* Usage Example */
.cta-primary {
  /* ALWAYS DEFAULT TO USE ALIAS TOKEN! */
  background-color: var(--light-fill-cta-primary-default);
}
```

Base tokens and alias tokens have different standards for property naming. The design token naming convention has two intentions:
1. To ensure that the Token Service is able to parse design tokens amongst other elements in the Figma file; and
2. To encourage consistent use of tokens by implicitly indicating the function in the name.

Alias tokens are prescriptive definitions of how base tokens are used. Aliases convey the intended purpose of a token, and are effective when a value with a single intent will appear in multiple places. Alias tokens are prefixed by the token category followed by a sub- property to group into more specific use cases, such as `fill`, `text` , or `border`. Descriptions after the slash include a descriptive intent of the function (such as `cta-primary` ) and the style,size or status of that group (ex. `default`).

### Major Dev Dependencies

* This project sources [Amazon Style Dictionary](https://amzn.github.io/style-dictionary/#/), which is a open source project that provides a series of APIs to compile design token representations, deep merge base & alias token relationship, and customize output formats. The detailed documentation on how we utilize these Style Dictionary APIs is available in the section below.

* We leverage the [Tokens Studio](https://www.figma.com/developers/api) Github sync as a way to parse design tokens.

* We leverage the [Figma REST API](https://www.figma.com/developers/api) as a way to parse icons defined in the Icons Library file.

## Development & Maintenance

Token Service's major operation breaks down to two parts:

1. Parsers from the Figma file API response to abstracted design token json representations.
2. Generates platform specific files with Style Dictionary APIs.

### Parser Module

Token Service fetches parses `token-service\figma-data\tokens-studio.json` to build tokens JSON ready for Style Dictionary.

Token Service fetches [Atmosphere Icons Library 1.0](https://www.figma.com/file/aEF6NeIfFACLIXJ7srSvax/Atmosphere-Icons-Library-1.0) using Figma REST API.

### Generator Module

Leveraging [Style Dictionary APIs](https://amzn.github.io/style-dictionary/#/api), Token Service transpiles aggregated token representations in json into different file formats. Currently we support these file formats:

* .css
* .scss
* .js (ES module)
* .json

To optimize outputs for each format, Style Dictionary modules are used.

#### Transforms

Lives under `./src/compile/extensions/transforms`, this module defines custom property interpretations for specific type of values. For each output format, there are generally preferred units shown in the table below.

| | Web |
| ------------- | ------------- |
| Colors | Hex (#000000) |
| Gradients | linear-gradient property |
| Integers | Integer number |
| Float | Float number |
| Px | px |
| Font weight | Integer number
| Letter Spacing | px |
| Media Queries | px |
| Drop Shadow | box-shadow property |
| Duration | s |
| Bezier Curve | bezier-curve property |

#### Transform-groups

Lives under `./src/compile/extensions/transform-groups`, this module defines the group of transforms that are used in each file conversion format. When creating a new custom transform, make sure to register them for formats that leverage it.

#### Formats

Lives under `./src/compile/extensions/formats`, this module defines the output file format. Any modifications needed to be made related to Web outputs are handled here, including ES6 module, .json for web, and .scss variables.

### Icons Module

Leveraging [Iconify Tools - importFromFigma](https://iconify.design/docs/libraries/tools/examples/import-figma.html), Token Service transpiles the icons from the Figma page in a json file in the figma-data directory.

Each icon id follows the standard format: `id="icon-key-in-kebab-case"`. E.g. if the Figma icon has its key `key="view_list"`, the id will be `id="icon-view-list"`.

Consequentially, the icons are directly parsed and saved in an `svgSet.svg` file, which contains all the icons as `symbols` with their own `id`, plus individual svg files for each icon, with their `id` as file name. 

### Maintenance Tips

Requirements of token service code updates are case by case, but there are a few general tips to keep in mind while considering the update.

* In most cases the token service throws an error upon addition of alias tokens, or for base tokens where a category already exists, there's likely a naming convention infringement in Tokens Studio.
* When adding a new base token type, make sure to check in with engineering representatives from all platforms to align how the tokens will be consumed and the desired formats.

## External Tokens & Angular Integration (Migration Guide)

This repository can consume design tokens from the external repo `dp-dls-global-tokens` (added as a git submodule under `token-service/external-tokens`) instead of (or in addition to) the local `figma-data/tokens-studio.json` flow.

### 1. Add Submodules

```bash
git submodule add https://github.com/jeppesen-foreflight/dp-dls-global-tokens token-service/external-tokens
git submodule add https://github.com/jeppesen-foreflight/dp-dls-global-angular angular
```

### 2. Build External Tokens

From the external tokens package:

```bash
cd token-service/external-tokens/packages/tokens
npm install
npm run compile   # or npm run compile_ts_all depending on version
```

If you see a Style Dictionary API error, verify the `style-dictionary` version and the use of `StyleDictionary.extend(config)` in `src/compile/index.ts`. (Current error indicates a mismatch between library version and invocation.)

### 3. Sync SCSS Artifacts Locally

Copies built SCSS into `src/scss/base/external-tokens/` and creates an aggregator partial.

```bash
cd token-service
npm run tokens:sync
```

Generated aggregator: `src/scss/base/_external-tokens.scss` exposes mixins and forwards the external token modules.

### 4. Import in Global Styles (Non-Angular)

```scss
@import 'base/external-tokens';
@include dls-init-themes(); // Initializes theme variable sets
```

### 5. Angular Project Integration

In `angular` (submodule or installed package):

Add to `angular.json` `styles` array (if consuming compiled package versions):

```jsonc
"styles": [
  "./node_modules/@jeppesen-foreflight/dp-dls-global-angular/styles/fonts.scss",
  "./node_modules/@jeppesen-foreflight/dp-dls-global-angular/styles/global.scss",
  "src/styles.scss"
]
```

If using submodule directly, adjust paths to point to `angular/projects/design/dp-dls-global-angular/styles/*`.

### 6. Theme Switching

The Angular `ThemeToggleService` toggles classes like `theme-relaxed` / `theme-condensed` on `<body>`. External SCSS exports mixins generating corresponding CSS custom properties. Ensure initialization mixin runs once globally.

### 7. Component Token Usage Examples

Alias token based SCSS (prefer alias over base):

```scss
.atm-button-primary {
  @include foundation-typography-body-medium-default; // external mixin
  background: var(--color-light-interactive-accent-background-enabled-filled);
  color: var(--color-light-interactive-accent-textandicon-inverse);
  box-shadow: var(--box-shadow-light-elevation-2);
  padding: var(--size-relaxed-spacing-s) var(--size-relaxed-spacing-m);
  border-radius: var(--size-relaxed-radius-s);
}
```

Runtime theme toggle (Angular component TS):

```typescript
constructor(private themeToggle: ThemeToggleService) {}

switchDensity(density: 'relaxed' | 'condensed') {
  this.themeToggle.setDensityTheme(density); // Implementation sets body class
}
```

### 8. Unified Build Script (Optional)

Add to `token-service/package.json` (example):

```jsonc
"scripts": {
  "tokens:build:external": "cd external-tokens/packages/tokens && npm run compile && cd - && npm run tokens:sync && npm run ts"
}
```

### 9. Deprecating `figma-data/tokens-studio.json`

Once external tokens fully replace the parsing flow, you can remove the `generateTokensStudioStyleDictionaryTokens` step and rely solely on external builds. Keep the fallback until parity is confirmed.

### 10. Troubleshooting

| Symptom | Likely Cause | Resolution |
|---------|--------------|------------|
| Style Dictionary config load error | Version/API mismatch | Ensure `style-dictionary` version matches code; use `StyleDictionary.extend(config)` |
| Missing SCSS mixins | Build not run or sync skipped | Re-run external compile then `npm run tokens:sync` |
| Variable undefined at runtime | Global init mixin not included | Confirm `@include dls-init-themes();` in global stylesheet |
| Icons not rendering | `svgSet.svg` not copied/declared in assets | Update `angular.json` assets to include icons set |

### 11. Recommended Next Enhancements

1. CI job to run external tokens build and sync before publishing.
2. Add a semantic version bump script tying token changes to release notes.
3. Create an Angular schematic to auto-add styles and assets configuration.

