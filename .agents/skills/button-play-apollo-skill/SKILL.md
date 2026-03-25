---
name: button-play-apollo-skill
description: Reusable workflow for implementing and validating @rds-vue-ui/button-play-apollo across projects, including registry setup, theme wiring, demo integration, and verification gates.
---

# Skill: ButtonPlayApollo (Reusable)

## When To Use
Use this skill when implementing a play/video CTA with `@rds-vue-ui/button-play-apollo` in a Vue 3 project.

## Success Criteria
- Component renders using base theme styles.
- `ctaClick` is wired and tested.
- Disabled state is validated.
- Demo route/page is available.
- Build passes.

## Inputs
- Framework: `Vue 3`
- Package manager: `yarn` (or npm/pnpm equivalent)
- Private registry (required): `https://npm.edpl.us`
- Storybook docs URL:
  `https://rds-vue-ui.edpl.us/?path=/docs/components-button-buttonplayapollo--docs`
- Target files (project-specific):
  - `<APP_ENTRY>` (example: `src/main.ts`)
  - `<ROUTER_FILE>` (example: `src/router.ts`)
  - `<DEMO_PAGE_FILE>` (example: `src/pages/demos/ButtonPlayApolloDemoPage.vue`)
  - `<DEMOS_INDEX_FILE>` (example: `src/pages/AllDemosPage.vue`)

## Dependencies
- `@rds-vue-ui/button-play-apollo`
- `@rds-vue-ui/rds-theme-base`
- `sass-embedded` (required if package styles include `lang="scss"`)

## Registry Configuration (Required)
1. Add/update project `.npmrc`:
   - `@rds-vue-ui:registry=https://npm.edpl.us/`
2. Validate package resolution:
   - `npm view @rds-vue-ui/button-play-apollo version --registry=https://npm.edpl.us/`

## Component Contract (Source-Aligned)
- Props:
  - `buttonText?: string`
  - `buttonTextSize?: "small" | "medium" | "large" | "xl"`
  - `buttonTextVariant?: string`
  - `backgroundVariant?: string` (default: `dark-1`)
  - `disabled?: boolean` (default: `false`)
- Events:
  - `ctaClick` (`void`)
- Docs IDs:
  - Docs: `components-button-buttonplayapollo--docs`
  - Story: `components-button-buttonplayapollo--primary`

## Implementation Steps
1. Configure scoped registry:
   - Add/update `.npmrc` with `@rds-vue-ui:registry=https://npm.edpl.us/`.
2. Install packages from private registry:
   - `yarn add @rds-vue-ui/rds-theme-base @rds-vue-ui/button-play-apollo`
   - `yarn add -D sass-embedded` (if build fails on SCSS preprocessing).
3. Import base theme once in `<APP_ENTRY>`:
   - `import '@rds-vue-ui/rds-theme-base/dist/css/rds-theme-base.css';`
4. Implement demo page `<DEMO_PAGE_FILE>`:
   - Import `ButtonPlayApollo`.
   - Add one enabled and one disabled example.
   - Wire `@ctaClick` to a visible state change or console log.
5. Register route in `<ROUTER_FILE>`.
6. Add card/link entry in `<DEMOS_INDEX_FILE>`.
7. Build and resolve any dependency/style issues.

## Verification Checklist
- [ ] `.npmrc` contains `@rds-vue-ui:registry=https://npm.edpl.us/`.
- [ ] `@rds-vue-ui/button-play-apollo` resolves from private registry.
- [ ] Theme CSS imported exactly once in app entry.
- [ ] Enabled button emits `ctaClick`.
- [ ] Disabled button does not emit interaction behavior.
- [ ] No hardcoded palette overrides when base theme is required.
- [ ] Demo route is navigable from the demos index.
- [ ] `yarn build` completes successfully.

## Failure Handling
- Registry/auth failure:
  - Verify `.npmrc` scope is set to `@rds-vue-ui:registry=https://npm.edpl.us/`.
  - Retry `npm view @rds-vue-ui/button-play-apollo version --registry=https://npm.edpl.us/`.
  - If still blocked, confirm VPN/SSO/token requirements for private registry access.
- SCSS preprocessor failure:
  - Install `sass-embedded` and rebuild.
- Color mismatch:
  - Confirm base theme CSS import order and remove local button color overrides.

## Outputs
- `README.md` (usage + install)
- `spec/component-spec.md` (confirmed API and behavior)
- `examples/*` (minimal integration pattern)
- `checklists/qa.md` (testable completion criteria)
