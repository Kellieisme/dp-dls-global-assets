# Component Tokens Migration Guide

**Version:** 2.0  
**Last Updated:** December 17, 2025  
**Library Version:** 4.1.0+

---

## Overview

This guide helps teams migrate from using foundation tokens directly to using semantic component tokens. Component tokens provide better abstraction, clearer intent, and easier theming capabilities.

### Prerequisites

**Foundation tokens must be set up first.** Component tokens are built on top of foundation tokens (colors, spacing, typography, etc.) from the `dp-dls-global-tokens` repository.

If you need to set up foundation tokens (compile, install, sync):
- Refer to the `dp-dls-global-tokens` repository documentation
- See the token-service setup guide for compiling tokens from Figma
- Ensure foundation token CSS custom properties are available before using component tokens

This guide assumes foundation tokens are already configured and focuses on **adding component token support** to your application.

---

## What Changed?

### Before (Foundation Tokens Direct Usage)
```scss
.mat-mdc-button.mat-primary .mat-icon {
  color: var(--color-interactive-primary-textandicon-primary-default);
}
```

### After (Component Tokens)
```scss
.mat-mdc-button.mat-primary .mat-icon {
  color: var(--component-button-outlined-primary-enabled-textandicon);
}
```

**Benefits:**
- ✅ More semantic and self-documenting
- ✅ Component-level abstraction
- ✅ Easier to understand component relationships
- ✅ Better alignment with design system structure

---

## How to Import Component Tokens

### Step 1: Import Foundation Tokens and Initialize Themes

```scss
// Import foundation tokens (these provide the base values)
@use '@coned-nmp/dp-dls-global-tokens/dist/scss/base/external-tokens/colors' as colors;
@use '@coned-nmp/dp-dls-global-tokens/dist/scss/base/external-tokens/spacing' as spacing;
@use '@coned-nmp/dp-dls-global-tokens/dist/scss/base/external-tokens/typography' as typography;

// Generate foundation CSS custom properties (required first!)
@include colors.generateColorThemeVariables();
@include spacing.generateSpacingVariables();
@include typography.generateTypographyVariables();
```

### Step 2: Import Component Tokens from dls-global-assets

```scss
// Import component token generation mixin
@use '@coned-nmp/dp-dls-global-assets/src/scss/base/external-tokens/component' as component;

// Generate all component CSS custom properties
@include component.generateComponentVariables();
```

### Step 3: Use in Your Components

```scss
// Now use component tokens in your component styles
.my-button {
  background: var(--component-button-filled-primary-enabled-background);
  color: var(--component-button-filled-primary-enabled-textandicon);
  border-radius: var(--component-button-corner-radius);
  height: var(--component-button-height);
  
  &:hover {
    background: var(--component-button-filled-primary-hovered-background);
  }
  
  &:disabled {
    background: var(--component-button-filled-primary-disabled-background);
    color: var(--component-button-filled-primary-disabled-textandicon);
  }
}
```

---

## Token Naming Conventions

### Component Token Pattern
```
--component-{component}-{variant}-{color}-{state}-{property}
```

**Examples:**
- `--component-button-outlined-primary-enabled-textandicon`
- `--component-button-filled-accent-hovered-background`
- `--component-chip-elevated-enabled-label-text`
- `--component-textfield-filled-enabled-input-text`

### Breaking Down the Pattern

| Segment | Description | Examples |
|---------|-------------|----------|
| `component` | Prefix (always) | `component` |
| `{component}` | Component name | `button`, `textfield`, `chip`, `menu` |
| `{variant}` | Component variant | `outlined`, `filled`, `elevated`, `text`, `tonal` |
| `{color}` | Color theme | `primary`, `accent`, `neutral`, `error`, `success` |
| `{state}` | Interaction state | `enabled`, `hovered`, `pressed`, `disabled`, `focused` |
| `{property}` | CSS property type | `background`, `textandicon`, `border-color`, `label-text` |

---

## Migration Examples by Component

### Button Component

#### Outlined Button
```scss
// ❌ Old (foundation tokens)
.button-outlined {
  color: var(--color-interactive-primary-textandicon-primary-default);
  border: 1px solid var(--color-interactive-primary-textandicon-primary-default);
  
  &:hover {
    color: var(--color-interactive-primary-textandicon-primary-hovered);
    border-color: var(--color-interactive-primary-textandicon-primary-hovered);
  }
}

// ✅ New (component tokens)
.button-outlined {
  color: var(--component-button-outlined-primary-enabled-textandicon);
  border: var(--component-button-outlined-border-width) solid var(--component-button-outlined-primary-enabled-border-color);
  
  &:hover {
    color: var(--component-button-outlined-primary-hovered-textandicon);
    border-color: var(--component-button-outlined-primary-hovered-border-color);
  }
}
```

#### Filled Button
```scss
// ❌ Old
.button-filled {
  background: var(--color-interactive-primary-surface-primary-default);
  color: var(--color-interactive-primary-textandicon-on-primary-default);
}

// ✅ New
.button-filled {
  background: var(--component-button-filled-primary-enabled-background);
  color: var(--component-button-filled-primary-enabled-textandicon);
}
```

### Textfield Component

```scss
// ❌ Old
.textfield-input {
  color: var(--color-surface-on-surface-high-emphasis);
  border-bottom: 1px solid var(--color-surface-outline);
}

// ✅ New
.textfield-input {
  color: var(--component-textfield-filled-enabled-input-text);
  border-bottom: var(--component-textfield-filled-active-indicator-height) solid var(--component-textfield-filled-enabled-active-indicator);
}
```

### Chip Component

```scss
// ❌ Old
.chip-elevated {
  background: var(--color-surface-surface-container-low);
  color: var(--color-surface-on-surface-high-emphasis);
}

// ✅ New
.chip-elevated {
  background: var(--component-chip-elevated-enabled-container);
  color: var(--component-chip-elevated-enabled-label-text);
}
```

### Checkbox Component

```scss
// ❌ Old
.checkbox-selected {
  background: var(--color-interactive-primary-surface-primary-default);
  border-color: var(--color-interactive-primary-surface-primary-default);
}

// ✅ New
.checkbox-selected {
  background: var(--component-checkbox-selected-enabled-container);
  border-color: var(--component-checkbox-selected-enabled-container);
}
```

---

## Available Component Tokens

### All 24 Components (~770 tokens)

1. **Button** (`commonbutton`) - 70 tokens
2. **Textfield** - 24 tokens
3. **Icon Button** - 18 tokens
4. **Menu** - 22 tokens
5. **Checkbox** - 34 tokens
6. **Radio Button** - 19 tokens
7. **Select** - 64 tokens
8. **Switch** - 29 tokens
9. **List** - 40 tokens
10. **Chip** - 153 tokens
11. **Badge** - 8 tokens
12. **Card** - 14 tokens
13. **Dialog** - 19 tokens
14. **Divider** - 6 tokens
15. **Navigation** - 37 tokens
16. **Table** - 21 tokens
17. **Tabs** - 12 tokens
18. **Tooltip** - 10 tokens
19. **Snackbar** - 8 tokens
20. **Top App Bar** - 24 tokens
21. **Breadcrumb** - 8 tokens
22. **Profile** - 7 tokens
23. **Sidesheet** - 19 tokens
24. **Date Picker** - 103 tokens

---

## Best Practices

### 1. Always Generate Component Tokens After Foundation Tokens

```scss
// ✅ Correct order
@include colors.generateColorThemeVariables();
@include spacing.generateSpacingVariables();
@include component.generateComponentVariables(); // After foundation

// ❌ Wrong - component tokens won't have foundation values
@include component.generateComponentVariables();
@include colors.generateColorThemeVariables(); // Too late!
```

### 2. Use Semantic Component Tokens Instead of Foundation Tokens

```scss
// ❌ Avoid - too generic, unclear intent
.custom-button {
  color: var(--color-interactive-primary-textandicon-primary-default);
}

// ✅ Preferred - semantic, component-specific
.custom-button {
  color: var(--component-button-outlined-primary-enabled-textandicon);
}
```

### 3. Leverage All State Variants

```scss
.interactive-element {
  // Default state
  color: var(--component-button-text-primary-enabled-textandicon);
  
  // Hover state
  &:hover {
    color: var(--component-button-text-primary-hovered-textandicon);
  }
  
  // Pressed/active state
  &:active {
    color: var(--component-button-text-primary-pressed-textandicon);
  }
  
  // Disabled state
  &:disabled {
    color: var(--component-button-text-primary-disabled-textandicon);
  }
}
```

### 4. Theme Switching Still Works

Component tokens automatically inherit theme changes:

```scss
// Light theme (default)
:root {
  @include colors.generateColorThemeVariables();
  @include component.generateComponentVariables();
}

// Dark theme
[data-theme="dark"] {
  @include colors.generateColorThemeVariables($theme: 'dark');
  @include component.generateComponentVariables();
}
```

### 5. Check Available Tokens

Review the component token files to see all available tokens:
- `src/scss/base/external-tokens/component/_vars-{component}.scss`

---

## Backward Compatibility

### SCSS Variables Still Work

If you're using SCSS variables directly, they continue to work:

```scss
// Still supported (SCSS compilation time)
.legacy-component {
  color: $component-button-outlined-primary-enabled-textandicon;
}
```

### CSS Custom Properties are Additive

```scss
// Both work simultaneously
.component-a {
  color: $component-button-text-primary-enabled-textandicon; // SCSS variable
}

.component-b {
  color: var(--component-button-text-primary-enabled-textandicon); // CSS custom property
}
```

---

## Migration Checklist

- [ ] Update `package.json` to use `@coned-nmp/dp-dls-global-assets@^4.1.0`
- [ ] Import foundation token generation mixins
- [ ] Call foundation token generation mixins first
- [ ] Import component token generation mixin
- [ ] Call `component.generateComponentVariables()`
- [ ] Update component styles to use `var(--component-*)` tokens
- [ ] Test light/dark theme switching
- [ ] Test all component states (enabled, hovered, pressed, disabled)
- [ ] Verify no visual regressions
- [ ] Update internal documentation

---

## Troubleshooting

### Component Tokens Not Applying?

**Check:**
1. Did you generate foundation tokens first?
2. Did you call `@include component.generateComponentVariables()`?
3. Are you using `var(--component-*)` syntax (not just `$component-*`)?

### Wrong Colors in Dark Theme?

**Check:**
1. Are you regenerating component tokens in your theme switcher?
2. Is the theme mixin called before component token generation?

### Token Not Found?

**Check:**
1. Verify token exists in `src/scss/base/external-tokens/component/_vars-{component}.scss`
2. Check spelling and format: `--component-{component}-{variant}-{color}-{state}-{property}`

---

## Support & Questions

**For migration questions:**
- Review component token files in `src/scss/base/external-tokens/component/`
- Check the main requirements doc: `COMPONENT_TOKENS_REQUIREMENTS.md`
- Contact the dp-dls-global-assets team

**For component-specific token questions:**
- Each component file has complete token listings
- Token naming follows consistent patterns across all components

---

**Document Version:** 1.0  
**Compatibility:** dp-dls-global-assets 4.1.0+  
**Last Updated:** December 17, 2025
