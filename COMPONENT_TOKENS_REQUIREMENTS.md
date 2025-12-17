# dls-global-assets Library Enhancement Requirements

**Date:** December 17, 2025  
**Requestor:** dp-dls-global-angular team  
**Status:** ✅ Implementation Complete - Ready for Testing

---

## Feedback Requested

**Review Deadline:** December 27, 2025

**Please provide input on:**

1. **Approach Validation**
   - Does the mixin-based generation approach align with our design system architecture?
   - Any concerns about the pattern we're establishing?

2. **Naming Conventions**
   - Approve the `generateComponent[Name]Variables()` naming pattern
   - Should component CSS custom properties use `--component-*` prefix?

3. **Breaking Changes Review**
   - Confirm this is truly non-breaking
   - Any backward compatibility concerns?

**How to provide feedback:**
- [ ] Comment directly on this document (create PR with comments)
- [ ] Schedule review meeting
- [ ] Async feedback via Slack/Teams/GitHub Discussion

---

## Decision Points Requiring Team Approval

### ✅ Approved | ⏸️ Needs Discussion | ❌ Rejected

- [ ] **Approve overall approach** (mixin pattern for CSS custom property generation)
- [ ] **Approve version bump** (minor version increase)
- [ ] **Approve scope** (all components)
- [ ] **Approve automation plan** (manual vs scripted generation)
- [ ] **Approve testing requirements** (unit + integration + visual regression)

**Sign-off required from:**
- [ ] Design System Lead
- [ ] Tokens Library Maintainers
- [ ] Angular Library Developers
- [ ] Design Representative

---

## Overview

This document outlines the requirements for enhancing the `@jeppesen-foreflight/dls-global-assets` library to generate CSS custom properties for component-level tokens. This will enable consuming applications to use semantic component tokens while maintaining runtime theme switching capability.

---

## Current State

### What Exists
- ✅ Component token files with SCSS variables (e.g., `_vars-commonbutton.scss`)
- ✅ Foundation color tokens with CSS custom property generation via `generateColorThemeVariables()`
- ✅ 24 component token files covering buttons, textfields, menus, etc.

### What's Missing
- ❌ CSS custom property generation for component tokens
- ❌ Mixins to expose component tokens at runtime
- ❌ Unified component token import/generation mechanism

---

## Requirements

### 1. Add Component Variable Generation Mixins

Each component token file should include a mixin to generate CSS custom properties.

#### Example Implementation

**File:** `dist/scss/base/external-tokens/component/_vars-commonbutton.scss`

```scss
// Existing SCSS variables remain unchanged
$component-button-outlined-primary-enabled-textandicon: $foundation-interactive-primary-textandicon-primary-default;
$component-button-outlined-primary-enabled-border-color: $foundation-interactive-primary-border-enabled;
// ... all existing variables ...

// NEW: Add generation mixin
@mixin generateComponentButtonVariables() {
  :root {
    --component-button-outlined-primary-enabled-textandicon: var(--foundation-interactive-primary-textandicon-primary-default);
    --component-button-outlined-primary-enabled-border-color: var(--foundation-interactive-primary-border-enabled);
    --component-button-outlined-primary-hovered-textandicon: var(--foundation-interactive-primary-textandicon-selected);
    --component-button-outlined-primary-hovered-border-color: var(--foundation-interactive-primary-border-hovered-flat);
    --component-button-outlined-primary-pressed-textandicon: var(--foundation-interactive-primary-textandicon-selected);
    --component-button-outlined-primary-pressed-border-color: var(--foundation-interactive-primary-border-selected);
    --component-button-outlined-primary-disabled-textandicon: var(--foundation-interactive-primary-textandicon-disabled);
    --component-button-outlined-primary-disabled-border-color: var(--foundation-interactive-primary-border-disabled);
    
    --component-button-outlined-accent-enabled-textandicon: var(--foundation-interactive-accent-textandicon-default);
    --component-button-outlined-accent-enabled-border-color: var(--foundation-interactive-accent-border-enabled);
    --component-button-outlined-accent-hovered-textandicon: var(--foundation-interactive-accent-textandicon-selected);
    --component-button-outlined-accent-hovered-border-color: var(--foundation-interactive-accent-border-hovered);
    
    --component-button-filled-accent-enabled-background: var(--foundation-interactive-accent-background-enabled-filled);
    --component-button-filled-accent-enabled-textandicon: var(--foundation-interactive-accent-textandicon-inverse);
    --component-button-filled-accent-disabled-background: var(--foundation-interactive-primary-background-disabled);
    --component-button-filled-accent-disabled-textandicon: var(--foundation-interactive-primary-textandicon-disabled);
    
    --component-button-text-primary-enabled-textandicon: var(--foundation-interactive-primary-textandicon-primary-default);
    --component-button-text-primary-hovered-textandicon: var(--foundation-interactive-primary-textandicon-selected);
    --component-button-text-accent-enabled-textandicon: var(--foundation-interactive-accent-textandicon-default);
    
    --component-button-tonal-primary-enabled-background: var(--foundation-interactive-primary-background-enabled-tonal);
    --component-button-tonal-primary-enabled-textandicon: var(--foundation-interactive-primary-textandicon-primary-default);
    
    --component-button-height: var(--foundation-sizing-3xl);
    --component-button-icon-size: var(--foundation-icon-xs);
    --component-button-corner-radius: var(--foundation-radius-full);
    --component-button-outlined-border-width: var(--foundation-border-regular-width);
    // ... etc for all ~60 button tokens
  }
}
```

### 2. Required Component Token Mixins

Each of these files needs a corresponding generation mixin:

| File | Mixin Name | Estimated Tokens |
|------|-----------|------------------|
| `_vars-commonbutton.scss` | `generateComponentButtonVariables()` | ~60 |
| `_vars-textfield.scss` | `generateComponentTextfieldVariables()` | ~40 |
| `_vars-iconbutton.scss` | `generateComponentIconButtonVariables()` | ~10 |
| `_vars-menu.scss` | `generateComponentMenuVariables()` | ~30 |
| `_vars-list.scss` | `generateComponentListVariables()` | ~25 |
| `_vars-checkbox.scss` | `generateComponentCheckboxVariables()` | ~20 |
| `_vars-radiobutton.scss` | `generateComponentRadioVariables()` | ~20 |
| `_vars-select.scss` | `generateComponentSelectVariables()` | ~35 |
| `_vars-switch.scss` | `generateComponentSwitchVariables()` | ~25 |
| `_vars-chip.scss` | `generateComponentChipVariables()` | ~30 |
| `_vars-badge.scss` | `generateComponentBadgeVariables()` | ~15 |
| `_vars-card.scss` | `generateComponentCardVariables()` | ~20 |
| `_vars-dialog.scss` | `generateComponentDialogVariables()` | ~25 |
| `_vars-divider.scss` | `generateComponentDividerVariables()` | ~10 |
| `_vars-navigation.scss` | `generateComponentNavigationVariables()` | ~40 |
| `_vars-table.scss` | `generateComponentTableVariables()` | ~35 |
| `_vars-tabs.scss` | `generateComponentTabsVariables()` | ~30 |
| `_vars-tooltip.scss` | `generateComponentTooltipVariables()` | ~15 |
| `_vars-snackbar.scss` | `generateComponentSnackbarVariables()` | ~20 |
| `_vars-topappbar.scss` | `generateComponentTopappbarVariables()` | ~25 |
| **Others** | Various | ~100 |
| **TOTAL** | **20+ mixins** | **~600-700 tokens** |

### 3. Create Unified Component Import File

**New File:** `dist/scss/base/external-tokens/_component.scss`

```scss
// Forward all component token files
@forward './component/vars-commonbutton';
@forward './component/vars-textfield';
@forward './component/vars-iconbutton';
@forward './component/vars-menu';
@forward './component/vars-list';
@forward './component/vars-checkbox';
@forward './component/vars-radiobutton';
@forward './component/vars-select';
@forward './component/vars-switch';
@forward './component/vars-chip';
@forward './component/vars-badge';
@forward './component/vars-card';
@forward './component/vars-dialog';
@forward './component/vars-divider';
@forward './component/vars-navigation';
@forward './component/vars-table';
@forward './component/vars-tabs';
@forward './component/vars-tooltip';
@forward './component/vars-snackbar';
@forward './component/vars-topappbar';
// ... forward all component files

// Use all component token files
@use './component/vars-commonbutton' as button;
@use './component/vars-textfield' as textfield;
@use './component/vars-iconbutton' as iconbutton;
@use './component/vars-menu' as menu;
@use './component/vars-list' as list;
@use './component/vars-checkbox' as checkbox;
@use './component/vars-radiobutton' as radio;
@use './component/vars-select' as select;
@use './component/vars-switch' as switch;
@use './component/vars-chip' as chip;
@use './component/vars-badge' as badge;
@use './component/vars-card' as card;
@use './component/vars-dialog' as dialog;
@use './component/vars-divider' as divider;
@use './component/vars-navigation' as navigation;
@use './component/vars-table' as table;
@use './component/vars-tabs' as tabs;
@use './component/vars-tooltip' as tooltip;
@use './component/vars-snackbar' as snackbar;
@use './component/vars-topappbar' as topappbar;
// ... use all component files

// Master mixin to generate all component CSS custom properties
@mixin generateComponentVariables() {
  @include button.generateComponentButtonVariables();
  @include textfield.generateComponentTextfieldVariables();
  @include iconbutton.generateComponentIconButtonVariables();
  @include menu.generateComponentMenuVariables();
  @include list.generateComponentListVariables();
  @include checkbox.generateComponentCheckboxVariables();
  @include radio.generateComponentRadioVariables();
  @include select.generateComponentSelectVariables();
  @include switch.generateComponentSwitchVariables();
  @include chip.generateComponentChipVariables();
  @include badge.generateComponentBadgeVariables();
  @include card.generateComponentCardVariables();
  @include dialog.generateComponentDialogVariables();
  @include divider.generateComponentDividerVariables();
  @include navigation.generateComponentNavigationVariables();
  @include table.generateComponentTableVariables();
  @include tabs.generateComponentTabsVariables();
  @include tooltip.generateComponentTooltipVariables();
  @include snackbar.generateComponentSnackbarVariables();
  @include topappbar.generateComponentTopappbarVariables();
  // ... include all generation mixins
}
```

---

## Alternatives Considered

### Option 1: Full Implementation (Recommended)
- **Pros:** Complete solution, all components ready at once
- **Cons:** 5-6 day timeline, larger initial change
- **Team Input Needed:** Is this timeline acceptable?

### Option 2: Phased Rollout
- **Pros:** Smaller incremental changes, test with high-priority components first
- **Cons:** Longer overall timeline, partial feature availability
- **Team Input Needed:** Which components should be in Phase 1?

**Suggested Phase 1 Components (if phased approach chosen):**
- Buttons (commonbutton, iconbutton)
- Form fields (textfield, select, checkbox, radiobutton, switch)
- Navigation (menu, tabs, topappbar)

### Option 3: Automated Generation
- **Pros:** Faster execution, consistent output, easier maintenance
- **Cons:** Requires script development upfront, may need validation
- **Team Input Needed:** Should we invest in automation?

**Please indicate your preference:** _______________

---

## Usage in Consuming Applications

Once implemented, consuming applications will use it like this:

```scss
// Import component tokens
@use '@jeppesen-foreflight/dls-global-assets/dist/scss/base/external-tokens/component' as component;

// Generate CSS custom properties
@include component.generateComponentVariables();
```

Then in component styles:

```scss
// Before (foundation tokens)
.mat-mdc-button.mat-primary .mat-icon {
  color: var(--foundation-interactive-primary-textandicon-primary-default);
}

// After (component tokens - more semantic!)
.mat-mdc-button.mat-primary .mat-icon {
  color: var(--component-button-outlined-primary-enabled-textandicon);
}
```

---

## Benefits

### For Design System
- ✅ Better semantic alignment between Figma and code
- ✅ Component-level tokens match design specs exactly
- ✅ Easier to maintain and update component-specific styling
- ✅ Clear separation between foundation and component layers

### For Developers
- ✅ More descriptive token names (context is clear)
- ✅ Better autocomplete in IDEs
- ✅ Easier to understand which token to use
- ✅ Maintains runtime theme switching capability

### For Applications
- ✅ Can customize component tokens without touching foundation
- ✅ Clearer override points for branded themes
- ✅ Better code maintainability
- ✅ Aligns with design system best practices

---

## Implementation Effort

### Estimated Timeline
- **Component mixin creation:** 2-3 days (20+ files × ~1-2 hours each)
- **Testing and validation:** 1 day
- **Documentation updates:** 1 day
- **Code review and refinement:** 1 day
- **Total:** ~5-6 days

### Automation Opportunities
Since tokens are auto-generated, could automate mixin generation:

```javascript
// Pseudocode for generation script
const componentTokens = readTokensFromFile('_vars-commonbutton.scss');
const cssCustomProperties = componentTokens.map(token => {
  return `--${token.name}: var(--${token.foundationReference});`;
});
generateMixin('generateComponentButtonVariables', cssCustomProperties);
```

---

## Breaking Changes

**None!** This is purely additive:
- ✅ Existing SCSS variables unchanged
- ✅ Foundation tokens still work
- ✅ Backward compatible
- ✅ Optional adoption (apps can migrate gradually)

---

## Testing Requirements

### Unit Tests
- [ ] Verify all component mixins generate expected CSS
- [ ] Confirm CSS custom properties resolve to foundation tokens
- [ ] Test that SCSS variables still work as before

### Integration Tests
- [ ] Test in consuming application (dp-dls-global-angular)
- [ ] Verify light/dark theme switching works
- [ ] Confirm density switching still functions
- [ ] Validate all component states (enabled, hovered, disabled, etc.)

### Visual Regression
- [ ] Compare rendered components before/after
- [ ] Verify no visual changes (should be identical)
- [ ] Test in both light and dark themes

---

## Acceptance Criteria

Before marking this as "Approved," the following must be true:

- [ ] Approach reviewed and approved by Assets Library maintainer
- [ ] Timeline confirmed as feasible by implementation team
- [ ] No blocking concerns raised by consuming teams
- [ ] Testing strategy approved by QA/testing lead
- [ ] Documentation plan approved
- [ ] Version bump strategy confirmed
- [ ] Migration path validated by at least one consuming application

**Approved by:**
- Assets Team: _________________ (Date: ______)
- Angular Team: ________________ (Date: ______)
- Design Lead: _________________ (Date: ______)

---

## Documentation Updates

### README.md
Add section on component token usage:
```markdown
## Component Tokens

Component tokens provide semantic naming for component-specific styling:

\```scss
@use '@jeppesen-foreflight/dls-global-assets/dist/scss/base/external-tokens/component' as component;
@include component.generateComponentVariables();
\```

Use component tokens in your styles:
\```scss
.my-button {
  color: var(--component-button-outlined-primary-enabled-textandicon);
}
\```
```

### CHANGELOG.md
```markdown
## [1.x.0] - 2025-12-XX

### Added
- Component token CSS custom property generation mixins
- `generateComponentVariables()` master mixin
- New `_component.scss` unified import file
- Support for runtime component token usage

### Features
- All 20+ component token files now support CSS custom properties
- ~600-700 component-level CSS custom properties
- Maintains backward compatibility with SCSS variables
```

### Migration Guide
Create `COMPONENT_TOKENS_MIGRATION.md` with:
- How to import component tokens
- Token naming conventions
- Migration examples
- Best practices

---

## Reference Implementation

## ✅ Implementation Complete

**IMPORTANT:** A working prototype was initially created in `dp-dls-global-angular` for testing. The implementation has now been migrated to this repository (dls-global-assets) where it belongs.

**Files to Review in THIS Repository:**

1. **Master Component Import File:**
   - `src/scss/base/external-tokens/_component.scss`
   - Contains `generateComponentVariables()` mixin

2. **Individual Component Token Files:**
   - `src/scss/base/external-tokens/component/_vars-commonbutton.scss`
   - `src/scss/base/external-tokens/component/_vars-textfield.scss`
   - `src/scss/base/external-tokens/component/_vars-iconbutton.scss`

Each component file includes:
- Existing SCSS variables (unchanged)
- New `generateComponent[Name]Variables()` mixin
- Uses SCSS variable interpolation (not CSS variable chaining)

**Status:** ✅ Implementation complete, ready for team review and testing

---

## Review Process

### Step 1: Initial Review (by Dec 27, 2025)
- Review this document
- Add comments/questions inline (create PR or GitHub issue)
- Flag any concerns

### Step 2: Team Discussion (by Dec 30, 2025)
- Optional: Schedule 30-min review meeting
- Resolve open questions
- Make go/no-go decision

### Step 3: Formal Approval (by Jan 3, 2026)
- Sign-off from key stakeholders
- Finalize timeline and resource allocation
- Create implementation tickets

### Questions & Discussion
**Post questions here or in:** [Slack channel / GitHub Discussion / Teams]

**Specific questions to address:**
- _"Do we have capacity for a 1-week project this month?"_
- _"Should we automate generation or manually create mixins?"_
- _"Any concerns about the 600-700 CSS custom properties impact on bundle size?"_
- _"Do we need accessibility/a11y review before implementation?"_
- _"Should we coordinate this release with any other design system updates?"_

**For urgent clarifications:**
Contact: dp-dls-global-angular team via [communication method]

---

## Next Steps

1. **Assets Library Team:**
   - Review this requirements document
   - Approve the approach
   - Allocate development time (~1 week)
   - Assign developer(s)

2. **Implementation:**
   - Create generation mixins for all component files
   - Add unified `_component.scss` file
   - Update build process if needed
   - Write tests

3. **Publishing:**
   - Update version (minor bump: 1.x.0 → 1.y.0)
   - Update changelog
   - Publish to npm registry
   - Notify consuming teams

4. **Adoption:**
   - dp-dls-global-angular team begins full migration
   - Other consuming teams can adopt gradually
   - Document lessons learned

---

## Questions & Contact

**For questions about this requirement:**
- dp-dls-global-angular team
- Design System governance

**For implementation questions:**
- Review the implementation in `src/scss/base/external-tokens/_component.scss`
- Review individual component files in `src/scss/base/external-tokens/component/`
- The Angular repo prototype was for testing only and will be replaced with this library implementation

---

**Document Version:** 1.1  
**Status:** Ready for Assets Library Team Review  
**Priority:** Medium (enables better design system adoption)  
**Last Updated:** December 17, 2025
