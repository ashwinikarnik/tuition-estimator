# Tuition Rates Requirements

## Purpose

This document defines the required behavior for pulling tuition data and using it in the tuition estimator.

## Data Source

- Endpoint:
  - `https://tuitionasu-dev-asufactory1.acquia.asu.edu/tuition/js/get-results`
- Pull is performed by:
  - `yarn sync:tuition`
  - Script: `scripts/syncTuition.mjs`

## Required Pull Dimensions

Tuition data must be pulled for every valid program in `src/config/programs.json` across:

- Academic years:
  - `2026`
  - `2027`
- Residency values:
  - `RES`
  - `NONRES`

## Required Query Parameters

For each request, the script must send:

- `acad_career` = program `acad_career` (for example `UGRD`, `GRAD`)
- `acad_prog` = program `acad_prog` (for example `UGBA`, `GRBA`)
- `acad_year` = `2026` or `2027`
- `residency` = `RES` or `NONRES`
- `campus=ONLNE`
- `credit_hr=` (empty)
- `honors=0`
- `include_summer=0`
- `admit_level=` (empty)
- `admit_term=` (empty)
- `program_fee=` (empty)

## Required Storage Format

Output file:

- `src/config/tuitionRates.json`

Required shape:

- `rates[acadYear][programId][residency][semester]`
- `semester` is one of `fall`, `spring`, `summer`
- Each semester contains:
  - `tuitionByCredit` with keys `"1".."18"`
  - `feesByCredit` with keys `"1".."18"`
  - `totalByCredit` with keys `"1".."18"`

Top-level metadata must include:

- `generatedAt`
- `source`
- `acadYears`
- `residencies`
- `semesters`
- `creditHours`

## Estimator Usage Requirements

Runtime calculation must read from stored tuition snapshot (`src/config/tuitionRates.json`) via `TUITION_RATES`.

Semester to academic-year mapping:

- `fall -> 2026`
- `spring -> 2027`
- `summer -> 2027`

Calculation rules:

- Summary card `Estimated tuition` uses `tuitionByCredit`.
- Results table column `Tuition & fees` uses `totalByCredit`.
- `Remaining cost` is calculated from `tuition & fees - federal loan`.

## Validation and Failure Rules

- A response of literal `false` is invalid and must fail the sync.
- Missing `breakdown` / missing semester / non-numeric credit values must fail the sync.
- Missing runtime lookup for selected year/program/residency/semester/credits must return no estimate and show estimator validation messaging.
- No silent fallback to synthetic or guessed tuition values.

## Operational Notes

- Run tuition sync whenever tuition source data changes:
  - `yarn sync:tuition`
- Run tests after sync or estimator logic updates:
  - `yarn test`
