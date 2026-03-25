# Implementation Details

## Tuition Snapshot Integration

The estimator now reads tuition data from a generated snapshot file instead of synthetic rate generation.

### Stored data

- File: `src/config/tuitionRates.json`
- Shape: `rates[acadYear][programId][residency][semester]`
- Supported values:
  - `acadYear`: `2026`, `2027`
  - `residency`: `RES`, `NONRES`
  - `semester`: `fall`, `spring`, `summer`
- Each semester stores:
  - `tuitionByCredit` (`1..18`)
  - `feesByCredit` (`1..18`)
  - `totalByCredit` (`1..18`)

### Runtime estimator behavior

- `Estimated tuition` summary uses `tuitionByCredit`.
- Results table `Tuition & fees` uses `totalByCredit`.
- `Remaining cost` is computed from `tuition & fees - loan`.
- Semester academic-year mapping:
  - `fall -> 2026`
  - `spring -> 2027`
  - `summer -> 2027`

## Tuition Sync Script

- Script: `scripts/syncTuition.mjs`
- Command: `yarn sync:tuition`
- Endpoint: `https://tuitionasu-dev-asufactory1.acquia.asu.edu/tuition/js/get-results`
- Request combinations per program:
  - `acad_year` in `2026`, `2027`
  - `residency` in `RES`, `NONRES`
- Fixed query params:
  - `campus=ONLNE`
  - `credit_hr=`
  - `honors=0`
  - `include_summer=0`
  - `admit_level=`
  - `admit_term=`
  - `program_fee=`

If the endpoint returns an invalid payload (including literal `false`), sync fails with context so data issues are caught during refresh.
