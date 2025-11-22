# Boeing DLS Global Asset Library

# Table of Contents

- [Intro](#intro)
  - [Features](#features)
  - [Requirements](#requirements)
- [Setup](#setup)
  - [Create an .npmrc](#create-an-npmrc)
  - [Installation](#installation)
- [Configuration](#configuration)
  - [Environment Configuration](#environment-configuration)
- [Development](#development)
  - [Assets Source](#assets-source)
  - [Working with Design Tokens](#working-with-design-tokens)
  - [Build Assets](#build-assets)
- [Production](#production)
  - [Build Assets](#build-assets-1)
  - [Publishing to GitHub Packages](#publishing-to-github-packages)
  - [Get Built Assets](#get-built-assets)
- [Additional Tools](#additional-tools)
  - [Run Assets Bundle Analyzer](#run-assets-bundle-analyzer)

# Intro

## Features

- Configuration per **environment**
  - `development` - [`sourcemaps`](https://webpack.js.org/configuration/devtool/), [`browser synced developmentment server`](https://webpack.js.org/configuration/dev-server/)
  - `production` - [`minification`](https://webpack.js.org/plugins/terser-webpack-plugin/), [`sourcemaps`](https://webpack.js.org/configuration/devtool/)
- Configurable **browsers versions support**. It uses [`browserslist`](https://github.com/browserslist/browserslist#full-list) - just specify the browsers you want to support in the `package.json` file for `browserslist`:

```js
"browserslist": [
    "last 2 versions",
    "> 5%"
]
```

- The built CSS / JavaScript files will respect the **configured supported browser versions** using the following tools:
  - [`autoprefixer`](https://github.com/postcss/autoprefixer) - automatically adds vendor prefixes to CSS rules
- Support for **assets optimization** for production environment with ability to configure:
  - **Code Minification** of _JavaScript_ and _CSS_ processed files.
  - **Optimize Assets Loading** - inline and embed **images** / **fonts** files having file size below a _configurable_ threshold value.
  - **Image Optimization** - optimize `jpeg`, `jpg`, `png`, `gif`, `svg` filesize and loading type via [`imagemin`](https://github.com/imagemin/imagemin). Plugin and Loader for webpack to optimize (_compress_) all images using `imagemin`. Do not worry about size of images, now they are always optimized/compressed.
- Latest [Webpack 5](https://github.com/webpack/webpack) - _JavaScript_ module bundler.
- Latest [SASS/PostCSS](https://github.com/sass/sass) compiler based on Dart `sass`.
- Configured and ready to use **Webpack Dev Server** plugin for faster local development - [`webpack-dev-server`](https://webpack.js.org/configuration/dev-server/)
- Integration with [Webpack Bundle Analyzer](https://www.npmjs.com/package/webpack-bundle-analyzer) - _Visualize size of webpack output files with an interactive zoomable treemap._

## Requirements

- `node` : `>=20.0.0`
- `npm`

# Setup

## Create an .npmrc

Public NPM packages will be installed from npmjs.com. Private NPM packages (`@jeppesen-foreflight/dls-global-assets`) will be downloaded from the GitHub Package Registry. To enable this, create a new file named `.npmrc` in your project root. The content should be:

```
@jeppesen-foreflight:registry=https://npm.pkg.github.com/
//npm.pkg.github.com/:_authToken=GITHUB_AUTH_TOKEN
```

Replace the following values:
- `GITHUB_AUTH_TOKEN`: Create a [GitHub Personal Access Token](https://github.com/settings/tokens) with `read:packages` permission. Save it in a safe place and use that string as the GITHUB_AUTH_TOKEN.


## Installation

1. Clone the repository
2. Install all dependencies using `npm` _install_ command.

```sh
$ npm install
```

> If npm install fails, it may help to first run `npm config set strict-ssl false`

# Configuration

## Environment Configuration

- Edit the [`configuration/environment.js`](configuration/environment.js) if you want to specify:
  - **`server`**: configure development server, specify `host`, `port`. Refer to the full development server configuration options for [`webpack-dev-server`](https://webpack.js.org/configuration/dev-server/).
  - **`limits`**: configure file size thresholds for assets optimizations.
    - Image/Font files size in bytes. Below this value the image file will be served as Data URL (_inline base64_).
  - **`paths`**: `src` or `dist` directories names and file system location.

# Development

## Assets Source

- **SASS/PostCSS** files are located under `src/scss/`
- **JavaScript** files with support of latest ECMAScript _ES6+_ are located under `src/js/`
- **Image** files are located under `src/images/`
- **Font** files are located under `src/fonts/`
- **HTML** files are located under `src/`
  - It will **automatically** build **all HTML files** placed under `src/` directory.

## Working with Design Tokens

This project uses design tokens from two sources that work together to provide a complete design system.

### 1. External Tokens (Primary Design System)

The primary design tokens are maintained in the separate [dp-dls-global-tokens](https://github.com/jeppesen-foreflight/dp-dls-global-tokens) repository. Compiled SCSS tokens from that repository are committed directly to this project at:

```
src/scss/base/external-tokens/
```

These tokens include:
- Foundation tokens (colors, typography, spacing, borders, shadows)
- Breakpoint definitions
- Density and sizing tokens
- Component-specific tokens
- Theme switching variables

**To use external tokens in your SCSS:**
```scss
@import 'base/external-tokens';
```

**Updating External Tokens:**

When the tokens team publishes new token updates:

1. Obtain the compiled SCSS files from the tokens team
2. Copy them to `src/scss/base/external-tokens/`
3. Commit the changes
4. Build and test

### 2. Legacy Token Service (Figma Integration)

The token-service generates additional tokens from Figma for backward compatibility and supplementary design values. This service must be run before building the assets.

**Generate token files** (required before first build):
```bash
cd token-service
npm install
npm run ts
```

This generates:
- `src/css/variables.css` and `src/css/variablesBase.css`
- `src/js/variables.js` and `src/js/variables.module.js`  
- `src/json/variables.json` and `src/json/variablesBase.json`

**Prerequisites for token service:**
- Figma Personal Access Token (see [token-service/README.md](token-service/README.md))
- Environment variables: `FIGMA_API_KEY` and `FIGMA_ICONS_FILE_KEY`

See [token-service/README.md](token-service/README.md) for full documentation.

## Build Assets

```sh
$ npm run build
```

### Start a development server

```sh
$ npm run start
```

This starts a webpack dev server with hot module replacement for rapid development.

# Production

## Build Assets

Optimize assets for production:

```sh
$ npm run release
```

This command:
1. Runs the token service to generate design tokens
2. Compiles and minifies SCSS to CSS
3. Optimizes and copies JavaScript files
4. Optimizes images and fonts
5. Generates production-ready HTML
6. Outputs everything to the `dist/` directory

## Publishing to GitHub Packages

This package is automatically published to GitHub Packages via CI/CD when changes are pushed to the `main` branch.

**Manual Publishing:**

1. Ensure you're on the `main` branch
2. Update the version in `package.json`
3. Commit and push changes
4. The CI/CD pipeline will automatically:
   - Generate tokens from Figma
   - Build production assets
   - Publish to GitHub Packages

**CI/CD Pipeline:**

The GitHub Actions workflow (`.github/workflows/ci-cd.yml`) runs on every push and:
1. Installs dependencies
2. Generates design tokens from Figma
3. Builds production assets
4. Publishes to GitHub Packages (on main branch only)

## Get Built Assets

- _CSS_ files are located under `/dist/css/`
- _JavaScript_ files with support of _ES6 / ECMAScript 2016(ES7)_ files are located under `/dist/js/`
- _Images_ are located under `/dist/images/`
  - Images part of the _design_ (_usually referenced in the CSS_) are located under `/dist/images/design/`
  - Images part of the _content_ (_usually referenced via `<img>` tags_) are located under `/dist/images/content/`
  - Icons (_usually referenced via `<svg>` tags with a CSS class_) are located under `/dist/images/icons/`

- _Fonts_ are located under `/dist/fonts/`
- _HTML_ files are located under `/dist/`

# Additional Tools

## Run Assets Bundle Analyzer

```sh
$ npm run stats
```

> This will open the visualisation on the default configuraiton URL `localhost:8888`, you can change this URL or port following the [webpack-bundle-analyzer](https://github.com/webpack-contrib/webpack-bundle-analyzer#options-for-cli) documentation.
