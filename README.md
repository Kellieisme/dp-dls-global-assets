# Boeing DLS Global Asset Library

# Table of Contents

- [Intro](#intro)
  - [Features](#features)
  - [Requirements](#requirements)
- [Setup](#setup)
  - [Installation](#installation)
- [Configuration](#configuration)
  - [Environment Configuration](#environment-configuration)
- [Development](#development)
  - [Assets Source](#assets-source)
  - [Build Assets](#build-assets)
    - [Build assets for development](#build-assets-for-development)
    - [Start a development server](#start-a-development-server---reloading-automatically-after-each-file-change)
- [Production](#production)
  - [Build Assets](#build-assets-1)
  - [Get Built Assets](#get-built-assets)
- [Run Code Style Linters](#run-code-style-linters)
  - [SASS](#sass)
  - [JavaScript](#javascript)
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
  - [`babel-preset-env`](https://babeljs.io/docs/en/babel-preset-env) - smart preset that allows you to use the latest JavaScript without needing to micromanage which syntax transforms (_and optionally, browser polyfills_) are needed by your target environment(s).
- Support for **assets optimization** for production environment with ability to configure:
  - **Code Minification** of _JavaScript_ and _CSS_ processed files.
  - **Optimize Assets Loading** - inline and embed **images** / **fonts** files having file size below a _configurable_ threshold value.
  - **Image Optimization** - optimize `jpeg`, `jpg`, `png`, `gif`, `svg` filesize and loading type via [`imagemin`](https://github.com/imagemin/imagemin). Plugin and Loader for webpack to optimize (_compress_) all images using `imagemin`. Do not worry about size of images, now they are always optimized/compressed.
- Support for **source code syntax style and formatting linters** that analyze source code to flag any programming errors, bugs, stylistic errors or suspicious constructs:
  - **SASS/PostCSS syntax checker** - you can change or add additional rules in `.sasslintrc` file. Configuration options can be found on [`sass-lint`](https://github.com/sasstools/sass-lint/blob/master/lib/config/sass-lint.yml) documentation.
  - **JavaScript syntax checker** - following the `airbnb` style, you can review and configure the rules in `.eslintrc` file. Configuration options can be found on [`eslint`](https://eslint.org/docs/user-guide/configuring) documentation.
- Latest [Webpack 5](https://github.com/webpack/webpack) - _JavaScript_ module bundler.
- Latest [SASS/PostCSS](https://github.com/sass/sass) compiler based on Dart `sass`.
- Latest [Babel 7](https://github.com/babel/babel) (`@babel/core`) - JavaScript compiler - _Use next generation JavaScript, today._
- Configured and ready to use **Webpack Dev Server** plugin for faster local development - [`webpack-dev-server`](https://webpack.js.org/configuration/dev-server/)
- Integration with [Webpack Bundle Analyzer](https://www.npmjs.com/package/webpack-bundle-analyzer) - _Visualize size of webpack output files with an interactive zoomable treemap._

## Requirements

- `node` : `>=18.12.0`
- `npm`

# Setup

## Create an .npmrc

Public NPM packages will be installed from the private NPM packages (`@jeppesen-foreflight/dls-global-assets`) will be downloaded from the Boeing Github package registry. To enable this, create a new filed named `.npmrc` in the project root. The content should be:

```
@jeppesen-foreflight:registry=https://git.web.boeing.com/api/v4/packages/npm/
//git.web.boeing.com/api/v4/packages/npm/:_authToken=GITHUB_AUTH_TOKEN
```

Replace the folowing values:
- GITHUB_AUTH_TOKEN: Create a [Github Personal Access Token](https://github.com/settings/tokens) with all permissions. Save in a safe place. Use that string as the GITHUB_AUTH_TOKEN.


## Installation

1. Clone the repository
2. Install all dependencies using `npm` _install_ command.

```sh
$ npm install
```

> If npm install fails because it can't connect to Artifactory, it may help to first run `npm config set strict-ssl false`

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
- **JavaScript** files with support of latest ECMAScript _ES6 / ECMAScript 2016(ES7)/ etc_ files are located under `src/js/`
- **Image** files are located under `src/images/`
- **Font** files are located under `src/fonts/`
- **HTML** files are located under `src/`
  - It will **automatically** build **all HTML files** placed under `src/` directory.

## Build Assets

### Working with Design Tokens

This project uses design tokens from two sources:

#### 1. External Tokens (Primary) - dp-dls-global-tokens

The main design tokens are maintained in the [dp-dls-global-tokens](https://git.web.boeing.com/jeppesen-foreflight/dp-dls-global-tokens) repository and included as a git submodule at `token-service/external-tokens/`.

**When to Update External Tokens:**
- New token values are published in dp-dls-global-tokens
- Design system colors, typography, spacing, or components change

**External Tokens Update Workflow:**

1. **Build tokens in external repo** (usually done by tokens team):
   ```bash
   cd /path/to/dp-dls-global-tokens/packages/tokens
   npm install
   npm run compile
   ```

2. **Sync compiled tokens to this repo**:
   ```bash
   cd token-service
   npm run tokens:sync
   ```
   
   This script copies the compiled SCSS from `external-tokens/packages/tokens/dist/scss/` to `src/scss/base/external-tokens/` and generates an aggregator file.

3. **Update the submodule reference** (optional - to track the external repo version):
   ```bash
   cd token-service/external-tokens
   git pull origin develop
   cd ../..
   git add token-service/external-tokens
   git commit -m "Update external-tokens submodule"
   ```

**External token outputs:**
- SCSS partials in `src/scss/base/external-tokens/`
- Aggregator file: `src/scss/base/external-tokens/_external-tokens.scss`
- Import in your SCSS: `@import 'base/external-tokens';`

#### 2. Legacy Token Service (Figma-based)

The token-service generates tokens from Figma API for backward compatibility.

**Run the token service** (before building for the first time):
```bash
cd token-service
npm install
npm run ts
```

This generates:
- `src/css/variables.css` and `src/css/variablesBase.css`
- `src/js/variables.js` and `src/js/variables.module.js`
- `src/json/variables.json`

See [token-service/README.md](token-service/README.md) for full documentation.


### Build assets for development

```sh
$ npm run build
```

### Start a development server

```sh
$ npm run start
```

# Production

## Build Assets

Optimize assets for production by:

```sh
$ npm run release
```

## Get Built Assets

- _CSS_ files are located under `/dist/css/`
- _JavaScript_ files with support of _ES6 / ECMAScript 2016(ES7)_ files are located under `/dist/js/`
- _Images_ are located under `/dist/images/`
  - Images part of the _design_ (_usually referenced in the CSS_) are located under `/dist/images/design/`
  - Images part of the _content_ (_usually referenced via `<img>` tags_) are located under `/dist/images/content/`
  - Icons (_usually referenced via `<svg>` tags with a CSS class_) are located under `/dist/images/icons/`

- _Fonts_ are located under `/dist/fonts/`
- _HTML_ files are located under `/dist/`

# Run Code Style Linters

## SASS

```sh
$ npm run lint:sass
```

## JavaScript

```sh
$ npm run lint:js
```

# Additional Tools

## Run Assets Bundle Analyzer

```sh
$ npm run stats
```

> This will open the visualisation on the default configuraiton URL `localhost:8888`, you can change this URL or port following the [webpack-bundle-analyzer](https://github.com/webpack-contrib/webpack-bundle-analyzer#options-for-cli) documentation.
