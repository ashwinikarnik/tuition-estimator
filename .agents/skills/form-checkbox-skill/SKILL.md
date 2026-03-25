---
name: form-checkbox-skill
description: Reusable workflow for implementing and validating @rds-vue-ui/form-checkbox from the private npm registry, including theme wiring, v-model behavior, demos, and verification gates.
---

# Skill: FormCheckbox (Reusable)

## When To Use
Use this skill when implementing checkbox UI with `@rds-vue-ui/form-checkbox` in a Vue 3 project.

## Success Criteria
- Component renders with base theme styles.
- `v-model` and `changed` behavior work correctly.
- Disabled and indeterminate states are validated.
- Demo route/page exists.
- Build passes.

## Inputs
- Framework: `Vue 3`
- Package manager: `yarn` (or npm/pnpm equivalent)
- Private registry (required): `https://npm.edpl.us`
- Storybook URL: `https://rds-vue-ui.edpl.us/?path=/story/components-forms-formcheckbox--primary`
- Target files:
  - `<APP_ENTRY>`
  - `<ROUTER_FILE>`
  - `<DEMO_PAGE_FILE>`
  - `<DEMOS_INDEX_FILE>`

## Dependencies
- `@rds-vue-ui/form-checkbox`
- `@rds-vue-ui/rds-theme-base`
- `sass-embedded` (if SCSS preprocessing is required)

## Registry Configuration (Required)
1. Add/update `.npmrc`:
   - `@rds-vue-ui:registry=https://npm.edpl.us/`
2. Validate package resolution:
   - `npm view @rds-vue-ui/form-checkbox version --registry=https://npm.edpl.us/`

## Component Contract (Source-Aligned)
- Props (key set):
  - `id` (required)
  - `name`, `label`, `size`, `modelValue`, `checked`, `required`, `disabled`
  - `iconPosition`, `bounded`, `variant`, `tickColor`, `indeterminate`
  - style variants: `checkedVariant`, `uncheckedVariant`, `focusedVariant`, `boundedActiveVariant`, `boundedActiveTextVariant`, `boundedVariant`, `labelVariant`, `labelWeight`, `labelSize`, `checkboxBgVariant`
- Events:
  - `update:modelValue`
  - `changed`
- Slot:
  - `default`
- Storybook IDs:
  - Docs: `components-forms-formcheckbox--docs`
  - Stories: `components-forms-formcheckbox--primary`, `components-forms-formcheckbox--examples`

## Implementation Steps
1. Configure `.npmrc` for the `@rds-vue-ui` scope.
2. Install packages from private registry.
3. Import base theme once in app entry:
   - `import '@rds-vue-ui/rds-theme-base/dist/css/rds-theme-base.css';`
4. Add demo implementation:
   - default checkbox
   - `v-model` bound checkbox
   - disabled checkbox
   - indeterminate example
5. Register route and add demos index link.
6. Build and resolve dependency/style issues.

## Verification Checklist
- [ ] `.npmrc` contains `@rds-vue-ui:registry=https://npm.edpl.us/`.
- [ ] `@rds-vue-ui/form-checkbox` resolves from private registry.
- [ ] Theme CSS imported exactly once.
- [ ] `v-model` updates value both directions.
- [ ] `changed` event fires on interaction.
- [ ] Disabled checkbox blocks interaction.
- [ ] Build passes.

## Failure Handling
- Registry/auth failure:
  - verify `.npmrc` scope + access to `https://npm.edpl.us`
  - retry `npm view @rds-vue-ui/form-checkbox version --registry=https://npm.edpl.us/`
- SCSS failure:
  - install `sass-embedded` and rebuild
