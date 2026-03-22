# Repository Guidelines

## Project Structure & Module Organization
This is a Vue 3 + Vite single-page app for tuition and federal loan estimation.
- `src/main.js` boots the app and global styles.
- `src/App.vue` composes page sections.
- `src/components/` contains UI sections (`SiteHeader.vue`, `HeroSection.vue`, `LoanEstimator.vue`, `SiteFooter.vue`).
- `src/composables/useLoanEstimator.js` contains core estimation logic; keep business rules here, not in templates.
- `src/config/estimatorConfig.js` stores copy, policy constants, semester metadata, and tuition tables.
- `src/styles/tokens.css` defines shared design tokens and global styles.
- `tests/` holds Vitest specs (currently `useLoanEstimator.spec.js`).

## Build, Test, and Development Commands
Use Yarn (lockfile is `yarn.lock`).
- `yarn install`: install dependencies.
- `yarn dev`: run Vite dev server.
- `yarn build`: create production build in `dist/`.
- `yarn preview`: serve built output locally.
- `yarn test`: run unit tests via Vitest.

## Coding Style & Naming Conventions
- Follow existing style: 2-space indentation, semicolons in JS, and single quotes.
- Vue components use PascalCase filenames (for example, `LoanEstimator.vue`).
- Composables use `use*.js` naming (for example, `useLoanEstimator.js`).
- Keep exported constants in `UPPER_SNAKE_CASE` (`POLICY`, `SEMESTERS`), and internal helpers in `camelCase`.
- Prefer small computed properties and pure functions over inline template logic.

## Testing Guidelines
- Framework: Vitest (`vitest run`) with unit tests focused on estimation math.
- Place tests under `tests/` and name files `*.spec.js`.
- Add/adjust tests when changing loan caps, proration behavior, tuition lookup tables, or semester allocation logic.
- Keep tests deterministic and table-driven when validating multiple permutations.

## Commit & Pull Request Guidelines
Git history currently starts with a single concise commit (`first commit`), so use short, imperative commit subjects.
- Example: `Adjust graduate loan cap proration for part-time enrollment`.
- Keep commits scoped to one concern (UI, config, or estimator logic).

For PRs, include:
- What changed and why.
- Linked issue/ticket (if applicable).
- Test evidence (`yarn test`, plus `yarn build` for release-facing changes).
- Screenshots for UI changes in `src/components/` or `src/styles/tokens.css`.
