# Implementation Details

## TUITION_RATES Migration to Program IDs

Updated `src/config/estimatorConfig.js` to generate `TUITION_RATES` dynamically from `src/config/programs.json`.

### What changed

1. `TUITION_RATES` is now generated for every program in `programs.json`.
2. Each program's `id` is used as the key in `TUITION_RATES`.
3. `DEGREE_OPTIONS` continues to use `program.id` as dropdown value, so estimator selection and tuition lookup now use the same identifier.

### Generation approach

- For each valid program (`level` in `ug`/`grad`), rate tables are generated for:
  - `az` residency
  - `nonaz` residency
- Credit keys are generated from `1` to `18`.
- A capped billable-credit model is used (`cappedCredit: 12`) to keep tuition schedules bounded and deterministic.
- Per-credit base values vary by level (`ug` vs `grad`) and index within level so all programs receive stable but distinct tuition profiles.

### Outcome

- The estimator no longer depends on legacy hardcoded degree keys (for example, `comm_ba`, `eng_ms`) to find tuition.
- Any program present in `programs.json` now has a corresponding tuition entry in `TUITION_RATES`.
