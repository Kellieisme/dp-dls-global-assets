# Token Workflow Guide

## Overview

This repo uses **external tokens** from the `dp-dls-global-tokens` package. The token-service in this repo is for **Figma-based token generation only** (legacy).

## Working with Tokens

### 1. Update Tokens in the External Repo

```bash
# Navigate to standalone tokens repo
cd /Users/kellieverne/Documents/jeppffy/dp-dls-global-tokens/packages/tokens

# Make your changes to token definitions in tokens/ folder

# Compile tokens
npm run compile

# Commit and push
git add .
git commit -m "Update tokens"
git push origin develop
```

### 2. Sync Tokens to Main Assets Repo

```bash
# Copy compiled SCSS from external tokens to assets repo
rsync -av --delete \
  /Users/kellieverne/Documents/jeppffy/dp-dls-global-tokens/packages/tokens/dist/scss/ \
  /Users/kellieverne/Documents/jeppffy/dp-dls-global-assets/src/scss/base/external-tokens/

# Build the main assets
cd /Users/kellieverne/Documents/jeppffy/dp-dls-global-assets
npm run build
```

### 3. Update Submodule Reference (Optional)

If you want to update the submodule pointer:

```bash
cd /Users/kellieverne/Documents/jeppffy/dp-dls-global-assets/token-service/external-tokens
git fetch origin
git checkout origin/develop
cd ../..
git add token-service/external-tokens
git commit -m "Update external-tokens submodule"
```

## File Locations

### External Tokens Repo
- **Source**: `/Users/kellieverne/Documents/jeppffy/dp-dls-global-tokens/packages/tokens/tokens/`
- **Output**: `/Users/kellieverne/Documents/jeppffy/dp-dls-global-tokens/packages/tokens/dist/`
- **Style Dictionary**: v4.4.0

### Main Assets Repo
- **External Tokens (synced)**: `src/scss/base/external-tokens/`
- **Aggregator**: `src/scss/base/external-tokens/_external-tokens.scss`
- **Token Service (Figma)**: `token-service/` (uses Style Dictionary v3.9.2)

## Quick Commands

```bash
# Compile external tokens
cd ~/Documents/jeppffy/dp-dls-global-tokens/packages/tokens && npm run compile

# Sync to assets
rsync -av --delete ~/Documents/jeppffy/dp-dls-global-tokens/packages/tokens/dist/scss/ \
  ~/Documents/jeppffy/dp-dls-global-assets/src/scss/base/external-tokens/

# Build assets
cd ~/Documents/jeppffy/dp-dls-global-assets && npm run build

# Compile Figma tokens (legacy)
cd ~/Documents/jeppffy/dp-dls-global-assets/token-service && npm run ts
```

## Dependencies

### External Tokens Package
- Node: >=18.12.0
- Style Dictionary: ^4.4.0
- TypeScript: ^5.8.3

### Main Assets Package
- Node: >=18.12.0
- Webpack: ^5.97.1
- Style Dictionary (token-service only): ^3.9.2

## Troubleshooting

### Issue: External tokens not showing up
**Solution**: Make sure you've compiled in the external repo AND synced to main assets repo

### Issue: Build errors after token sync
**Solution**: Check that `_external-tokens.scss` aggregator imports match the files in `external-tokens/`

### Issue: Token-service build fails
**Solution**: The token-service uses SD v3.9.2. Don't mix with external tokens SD v4.4.0

### Issue: Submodule conflicts
**Solution**: Work in the standalone external tokens repo, not the submodule. Sync compiled files manually.
