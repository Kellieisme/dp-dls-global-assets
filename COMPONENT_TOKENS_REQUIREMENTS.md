# dls-global-assets Library Enhancement Requirements

**Date:** December 17, 2025  
**Requestor:** dp-dls-global-angular team  
**Status:** ✅ IMPLEMENTATION COMPLETE - All 24 Components Ready for Review & Testing in branch "feature/component-tokens-phase1"
**Scope:** All 24 component token generation mixins implemented and tested

---

## Feedback Requested

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
- [ ] **Approve scope** (All 24 components complete and tested)
- [ ] **Approve deployment plan** (when to release to consuming applications)
- [ ] **Approve testing requirements** (build verification + integration testing)

**Sign-off required from:**
- [ ] Design System Lead
- [ ] Tokens Library Maintainers
- [ ] Angular Library Developers
- [ ] Design Representative

---

## Overview

This document outlines the requirements for enhancing the `@jeppesen-foreflight/dls-global-assets` library to generate CSS custom properties for component-level tokens. This will enable consuming applications to use semantic component tokens while maintaining runtime theme switching capability.

### Component Tokens Architecture Decision

**Component tokens are maintained in dls-global-assets** (this repository), not in dp-dls-global-tokens. Here's why:

1. **Web-Specific Implementation** - Component tokens are a convenience layer for web frameworks (Angular, React), not universal design tokens
2. **CSS Custom Properties** - The generation mixins produce browser-specific outputs
3. **Platform Separation** - iOS/Android use foundation tokens directly; they don't need component-level mappings
4. **Single Source** - Simplifies maintenance without complex sync processes between repos
5. **Current Reality** - Component token files already exist here without external generation

**Foundation tokens** (e.g., `--color-primary-500`, `--spacing-md`) continue to come from dp-dls-global-tokens as the design source of truth.

**Component tokens** (e.g., `$component-button-*`) are web framework semantic aliases maintained in this repo.

---

## Current State

### What Exists
- ✅ Component token SCSS files with variables (e.g., `_vars-commonbutton.scss`)
- ✅ Foundation color tokens with CSS custom property generation via `generateColorThemeVariables()`
- ✅ 24 component token files covering all UI components
- ✅ Component tokens maintained directly in dls-global-assets
- ✅ CSS custom property generation mixins for all 24 components
- ✅ Unified component token import/generation mechanism (`_component.scss`)
- ✅ All implementations tested and compiling successfully

### What's Next
- ⏸️ Team review and approval of implementation approach
- ⏸️ Integration testing with consuming applications (dp-dls-global-angular)
- ⏸️ Version bump and release planning
- ⏸️ Documentation updates for consuming teams
- ⏸️ Migration guide for teams using foundation tokens directly

---

## Requirements

### 1. Add Component Variable Generation Mixins

Each component token file should include a mixin to generate CSS custom properties.

#### Example Implementation

**File:** `src/scss/base/external-tokens/component/_vars-commonbutton.scss`

```scss
// Component token SCSS variables (maintained in dls-global-assets)
$component-button-outlined-primary-enabled-textandicon: $button-outlined-primary-enabled-textandicon;
$component-button-outlined-primary-enabled-border-color: $button-outlined-primary-enabled-border-color;
// ... all existing variables ...

// ===========================
// CSS CUSTOM PROPERTY GENERATION
// ===========================
@mixin generateComponentButtonVariables() {
  :root {
    --component-button-outlined-primary-enabled-textandicon: #{$component-button-outlined-primary-enabled-textandicon};
    --component-button-outlined-primary-enabled-border-color: #{$component-button-outlined-primary-enabled-border-color};
    --component-button-outlined-primary-hovered-textandicon: #{$component-button-outlined-primary-hovered-textandicon};
    --component-button-outlined-primary-hovered-border-color: #{$component-button-outlined-primary-hovered-border-color};
    --component-button-outlined-primary-pressed-textandicon: #{$component-button-outlined-primary-pressed-textandicon};
    --component-button-outlined-primary-pressed-border-color: #{$component-button-outlined-primary-pressed-border-color};
    --component-button-outlined-primary-disabled-textandicon: #{$component-button-outlined-primary-disabled-textandicon};
    --component-button-outlined-primary-disabled-border-color: #{$component-button-outlined-primary-disabled-border-color};
    
    --component-button-outlined-accent-enabled-textandicon: #{$component-button-outlined-accent-enabled-textandicon};
    --component-button-outlined-accent-enabled-border-color: #{$component-button-outlined-accent-enabled-border-color};
    --component-button-outlined-accent-hovered-textandicon: #{$component-button-outlined-accent-hovered-textandicon};
    --component-button-outlined-accent-hovered-border-color: #{$component-button-outlined-accent-hovered-border-color};
    
    --component-button-filled-accent-enabled-background: #{$component-button-filled-accent-enabled-background};
    --component-button-filled-accent-enabled-textandicon: #{$component-button-filled-accent-enabled-textandicon};
    --component-button-filled-accent-disabled-background: #{$component-button-filled-accent-disabled-background};
    --component-button-filled-accent-disabled-textandicon: #{$component-button-filled-accent-disabled-textandicon};
    
    --component-button-text-primary-enabled-textandicon: #{$component-button-text-primary-enabled-textandicon};
    --component-button-text-primary-hovered-textandicon: #{$component-button-text-primary-hovered-textandicon};
    --component-button-text-accent-enabled-textandicon: #{$component-button-text-accent-enabled-textandicon};
    
    --component-button-tonal-primary-enabled-background: #{$component-button-tonal-primary-enabled-background};
    --component-button-tonal-primary-enabled-textandicon: #{$component-button-tonal-primary-enabled-textandicon};
    
    --component-button-height: #{$component-button-height};
    --component-button-icon-size: #{$component-button-icon-size};
    --component-button-corner-radius: #{$component-button-corner-radius};
    --component-button-outlined-border-width: #{$component-button-outlined-border-width};
    // ... etc for all ~60 button tokens
  }
}
```

### 2. Component Token Mixins - ✅ ALL COMPLETE (24/24 = 100%)

**Implementation organized in 4 batches:**

| File | Mixin Name | Tokens | Status |
|------|-----------|--------|--------|
| **Batch 1: Core Interactive Components** ||||
| `_vars-commonbutton.scss` | `generateComponentButtonVariables()` | 70 | ✅ Complete |
| `_vars-textfield.scss` | `generateComponentTextfieldVariables()` | 24 | ✅ Complete |
| `_vars-iconbutton.scss` | `generateComponentIconButtonVariables()` | 18 | ✅ Complete |
| `_vars-menu.scss` | `generateComponentMenuVariables()` | 22 | ✅ Complete |
| `_vars-checkbox.scss` | `generateComponentCheckboxVariables()` | 34 | ✅ Complete |
| `_vars-radiobutton.scss` | `generateComponentRadioVariables()` | 19 | ✅ Complete |
| `_vars-select.scss` | `generateComponentSelectVariables()` | 64 | ✅ Complete |
| `_vars-switch.scss` | `generateComponentSwitchVariables()` | 29 | ✅ Complete |
| **Batch 2: Lists & Content Components** ||||
| `_vars-list.scss` | `generateComponentListVariables()` | 40 | ✅ Complete |
| `_vars-chip.scss` | `generateComponentChipVariables()` | 153 | ✅ Complete |
| `_vars-badge.scss` | `generateComponentBadgeVariables()` | 8 | ✅ Complete |
| `_vars-card.scss` | `generateComponentCardVariables()` | 14 | ✅ Complete |
| **Batch 3: Containers & Layout Components** ||||
| `_vars-dialog.scss` | `generateComponentDialogVariables()` | 19 | ✅ Complete |
| `_vars-divider.scss` | `generateComponentDividerVariables()` | 6 | ✅ Complete |
| `_vars-navigation.scss` | `generateComponentNavigationVariables()` | 37 | ✅ Complete |
| `_vars-table.scss` | `generateComponentTableVariables()` | 21 | ✅ Complete |
| **Batch 4: Navigation & Feedback Components** ||||
| `_vars-tabs.scss` | `generateComponentTabsVariables()` | 12 | ✅ Complete |
| `_vars-tooltip.scss` | `generateComponentTooltipVariables()` | 10 | ✅ Complete |
| `_vars-snackbar.scss` | `generateComponentSnackbarVariables()` | 8 | ✅ Complete |
| `_vars-topappbar.scss` | `generateComponentTopappbarVariables()` | 24 | ✅ Complete |
| `_vars-breadcrumb.scss` | `generateComponentBreadcrumbVariables()` | 8 | ✅ Complete |
| `_vars-profile.scss` | `generateComponentProfileVariables()` | 7 | ✅ Complete |
| `_vars-sidesheet.scss` | `generateComponentSidesheetVariables()` | 19 | ✅ Complete |
| `_vars-date picker.scss` | `generateComponentDatePickerVariables()` | 103 | ✅ Complete |

**Total:** 24 components, ~750+ CSS custom properties generated

### 3. Create Unified Component Import File

**Status:** ✅ Created

**File:** `src/scss/base/external-tokens/_component.scss`

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

## Usage in Consuming Applications

### Setup (One-Time)

**1. Install the package:**
```bash
npm install @jeppesen-foreflight/dls-global-assets
```

**2. Import foundation tokens and initialize themes:**
```scss
// In your global styles file (e.g., styles.scss)
@import '@jeppesen-foreflight/dls-global-assets/dist/scss/base/external-tokens';
@include dls-init-themes();
```

**3. Import and generate component tokens:**
```scss
// Import component tokens
@use '@jeppesen-foreflight/dls-global-assets/dist/scss/base/external-tokens/component' as component;

// Generate CSS custom properties
@include component.generateComponentVariables();
```

### Usage in Component Styles

**Before (using foundation tokens directly):**
```scss
.mat-mdc-button.mat-primary .mat-icon {
  color: var(--color-interactive-primary-textandicon-primary-default);
}
```

**After (using component tokens - more semantic!):**
```scss
.mat-mdc-button.mat-primary .mat-icon {
  color: var(--component-button-outlined-primary-enabled-textandicon);
}
```

### Theme Switching (Angular Example)

Component tokens automatically respond to theme changes:

```typescript
// Toggle between light/dark themes
this.themeToggle.setTheme('dark');

// Toggle density
this.themeToggle.setDensityTheme('relaxed');
```

### Available Scripts

| Script | Purpose |
|--------|---------|
| `npm run build` | Build the assets library (SCSS → CSS) |
| `npm run dev` | Run development server with hot reload |
| `npm run tokens:sync` | Sync foundation tokens from external tokens repo (if submodule configured) |

### Troubleshooting

| Issue | Fix |
|-------|-----|
| CSS custom properties not updating with theme | Ensure `@include component.generateComponentVariables()` is called |
| Variables undefined | Check that `@include dls-init-themes()` is called before using tokens |
| Build errors | Run `npm run build` to verify SCSS compilation |
| Component tokens not available | Verify package version includes component token mixins |
```

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

**Before Team Review:**
- [x] Build the project (`npm run build`) and verify no errors
- [x] Inspect generated CSS in `dist/` to confirm custom properties are created
- [x] Test import in a sample SCSS file

**Test Results (December 17, 2025):**
- ✅ Build completed successfully with no errors (exit code: 0)
- ✅ All 24 component token mixins generate CSS custom properties correctly
- ✅ Total: ~770 CSS custom properties generated across all components
- ✅ Verified compilation in 4 batches:
  - Batch 1: Button, Textfield, IconButton, Menu, Checkbox, Radio, Select, Switch (280 tokens)
  - Batch 2: List, Chip, Badge, Card (215 tokens)
  - Batch 3: Dialog, Divider, Navigation, Table (83 tokens)
  - Batch 4: Tabs, Tooltip, Snackbar, Topappbar, Breadcrumb, Profile, Sidesheet, DatePicker (191 tokens)
- ✅ Only 1 pre-existing warning (deprecated map-get in _utils.scss, not related to this work)
- ✅ All SCSS variable interpolation using #{$variable} syntax verified
- ✅ Master _component.scss correctly imports and calls all 24 generation mixins

**Before Publishing:**
- [ ] Test in consuming application (dp-dls-global-angular)
- [ ] Verify light/dark theme switching works
- [ ] Confirm density switching still functions
- [ ] Validate all component states (enabled, hovered, disabled, etc.)
- [ ] Visual regression testing (compare before/after)

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

**IMPORTANT:** A working prototype was created for testing.

**Files to Review in this Repository:**

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

**Status:** ✅ Phase 1 implementation complete, ready for team review and testing

**Next Actions:**
1. **Build & Test:** Run `npm run build` to verify implementation
2. **Team Review:** Get approval on approach and Phase 1 implementation
3. **Decide:** Phase 2 scope and timeline (remaining 20+ components)

---

## Review Process

### Step 1: Initial Review
- Review this document
- Add comments/questions inline (create PR or GitHub issue)
- Flag any concerns

### Step 2: Team Discussion
- Optional: Schedule 30-min review meeting
- Resolve open questions
- Make go/no-go decision

### Questions & Discussion
**Post questions here or in:** [Slack channel / GitHub Discussion / Teams]

**Specific questions to address:**
- _"Should we automate generation or manually create mixins?"_
- _"Any concerns about the 600-700 CSS custom properties impact on bundle size?"_
- _"Do we need accessibility/a11y review before implementation?"_
- _"Should we coordinate this release with any other design system updates?"_

---

## Next Steps

**IMMEDIATE (Before Team Review):**
- [x] Run `npm run build` to compile SCSS and verify no errors ✅ Complete
- [x] Inspect `dist/scss/base/external-tokens/_component.scss` output ✅ Complete
- [x] Verify CSS custom properties are generated correctly ✅ Complete
- [x] Create simple test file to confirm mixin works ✅ Complete

**Ready for Team Review** - All pre-review testing complete!

**After Team Approval:**

1. **Assets Library Team:**
   - [ ] Approve Phase 1 implementation
   - [ ] Decide on Phase 2 scope (remaining components)
   - [ ] Allocate development time for Phase 2 (if approved)

2. **Phase 2 Implementation (if approved):**
   - [ ] Create generation mixins for remaining 20+ component files
   - [ ] Update master mixin to include all components
   - [ ] Write comprehensive tests

3. **Publishing:**
   - [ ] Update version (minor bump: 4.0.2 → 4.1.0)
   - [ ] Update CHANGELOG.md
   - [ ] Publish to npm registry
   - [ ] Notify consuming teams

4. **Adoption:**
   - [ ] dp-dls-global-angular team tests and provides feedback
   - [ ] Document migration path
   - [ ] Other consuming teams can adopt gradually

---

## Questions & Contact

**For questions about this requirement:**
- dp-dls-global-angular team

**For implementation questions:**
- Review the implementation in `src/scss/base/external-tokens/_component.scss`
- Review individual component files in `src/scss/base/external-tokens/component/`
- The Angular repo prototype was for testing only and will be replaced with this library implementation

---

**Document Version:** 1.1  
**Status:** Ready for Assets Library Team Review  
**Priority:** Medium (enables better design system adoption)  
**Last Updated:** December 17, 2025
