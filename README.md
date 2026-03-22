# Tuition Estimator Landing Page

Vue implementation of a tuition and federal student loan estimator landing page with:
- Header
- Hero
- Loan estimator
- Footer

## Scripts

- `yarn install`
- `yarn dev`
- `yarn test`
- `yarn build`

## Architecture

- Estimator copy, policy limits, degree options, and tuition tables live in:
  - `src/config/estimatorConfig.js`
- Calculation logic is isolated in:
  - `src/composables/useLoanEstimator.js`
- UI sections live in:
  - `src/components/SiteHeader.vue`
  - `src/components/HeroSection.vue`
  - `src/components/LoanEstimator.vue`
  - `src/components/SiteFooter.vue`

## Notes

- The implementation recreates functionality from the provided estimator example with clean-room code.
- Unit tests validate loan proration, allocation, and permutation totals.
