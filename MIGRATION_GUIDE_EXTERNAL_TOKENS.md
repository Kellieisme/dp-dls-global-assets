# External Tokens & Angular Integration Quick Reference

This condensed guide summarizes the migration steps documented in `token-service/README.md`.

## Steps
1. Add submodules
```bash
git submodule add https://github.com/jeppesen-foreflight/dp-dls-global-tokens token-service/external-tokens
git submodule add https://github.com/jeppesen-foreflight/dp-dls-global-angular angular
```
2. Build external tokens
```bash
cd token-service/external-tokens/packages/tokens
npm install
npm run compile   # or compile_ts_all
```
3. Sync SCSS artifacts
```bash
cd token-service
npm run tokens:sync
```
4. Import into global styles
```scss
@import 'base/external-tokens';
@include dls-init-themes();
```
5. Configure Angular `angular.json` styles & assets if using packages.
6. Use alias tokens in components and theme toggle service.

## Usage Examples
SCSS:
```scss
.nav-rail {
  background: var(--color-light-ui-background-low);
  color: var(--color-light-ui-textandicon-high);
}
```
Angular Theme Toggle:
```typescript
this.themeToggle.setDensityTheme('relaxed');
```

## Troubleshooting
| Issue | Fix |
|-------|-----|
| Style Dictionary error | Verify version & use `StyleDictionary.extend(config)` |
| Missing mixins | Rebuild & re-sync external tokens |
| Variables undefined | Ensure init mixin included once |
| Icons missing | Add `svgSet.svg` asset mapping in `angular.json` |

## Next
Consider adding a unified build script: `tokens:build:external` and CI automation.
