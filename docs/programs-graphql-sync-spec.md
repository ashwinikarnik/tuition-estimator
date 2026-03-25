# Programs Sync Specification (GraphQL -> JSON -> Degree Dropdown)

## 1. Objective
Replace hardcoded degree options with data sourced from the GraphQL endpoint:

- Endpoint: `https://ofz7d3n43je73a6lxqalxt4d6y.appsync-api.us-west-2.amazonaws.com/graphql`
- Query: `allPrograms`
- Auth: API key

The fetched programs must be normalized and written to a JSON file in `src/config/`, then consumed by the frontend Degree dropdown.

## 2. Scope
In scope:
- Add a secure API-key input mechanism for local/dev use.
- Add a sync script that calls GraphQL `allPrograms`.
- Persist sanitized program data into `src/config/programs.json`.
- Load degree options from `programs.json` (not hardcoded in JS constants).
- Keep Undergraduate and Graduate dropdown behavior equivalent to current UX.

Out of scope:
- Runtime client-side GraphQL fetching from the browser.
- Server-side key vault integration.
- Changes to tuition-calculation rules.

## 3. Current Baseline
- Degree dropdown currently reads from `DEGREE_OPTIONS` in `src/config/estimatorConfig.js`.
- Estimator logic is already separated in `src/composables/useLoanEstimator.js`.
- App is Vite + Vue 3 + Yarn.

## 4. Security Requirements for API Key
### 4.1 Primary key input method
Use environment variable `PROGRAMS_API_KEY` sourced from `.env.local` (never committed).

Required updates:
- Add `.env.example` with:
  - `PROGRAMS_API_KEY=`
- Ensure `.gitignore` includes:
  - `.env.local`
  - `.env.*.local`

### 4.2 Script behavior
`scripts/syncPrograms.mjs` must:
- Read key from `process.env.PROGRAMS_API_KEY`.
- Fail fast with clear error if missing.
- Never print full key in logs (mask as `abcd...wxyz` when needed).
- Send key only in `x-api-key` header.

Optional fallback (nice-to-have):
- If key is missing and running in interactive terminal, prompt for key without echo.
- Do not persist prompted value.

## 5. Data Flow and Architecture
1. Developer runs `yarn sync:programs`.
2. Script sends GraphQL POST request to endpoint with `allPrograms`.
3. Script validates response and normalizes records.
4. Script writes canonical JSON to `src/config/programs.json`.
5. Frontend imports JSON and builds degree options by level.
6. Degree dropdown uses imported options; no hardcoded degree list.

## 6. GraphQL Contract
### 6.1 Request
HTTP POST:
- URL: endpoint above
- Headers:
  - `content-type: application/json`
  - `x-api-key: <PROGRAMS_API_KEY>`
- Body:

```json
{
  "query": "query allPrograms { allPrograms { ...fieldsNeededForDropdown } }"
}
```

### 6.2 Response handling
Script must support common AppSync list shapes:
- `data.allPrograms` is an array, OR
- `data.allPrograms.items` is an array.

If GraphQL returns `errors`, script exits non-zero and reports summarized messages.

## 7. Normalization Rules
Output file: `src/config/programs.json`

Canonical schema:

```json
{
  "generatedAt": "2026-03-22T00:00:00.000Z",
  "source": "allPrograms",
  "programs": [
    {
      "id": "comm_ba",
      "label": "Communication BA",
      "level": "ug"
    }
  ]
}
```

Normalization requirements:
- `level` must be normalized to `ug` or `grad`.
  - Accept likely variants (`undergraduate`, `graduate`, `UG`, `GRAD`, etc.).
- `id` must be stable and slug-safe:
  - Prefer API id/code if available.
  - Fallback to slugified label.
- `label` must be user-facing display text.
- Remove invalid rows (missing label or unrecognized level).
- Deduplicate by `(level, id)`; keep first occurrence.
- Sort output by level then label for deterministic diffs.

## 8. Frontend Integration Requirements
### 8.1 Config updates
- Remove hardcoded `DEGREE_OPTIONS` definition from `src/config/estimatorConfig.js`.
- Replace with a helper built from imported JSON:
  - `import programsData from './programs.json';`
  - export `DEGREE_OPTIONS = { ug: [...], grad: [...] }`.

Target shape for existing UI compatibility:

```js
{
  ug: [{ value: 'comm_ba', label: 'Communication BA' }],
  grad: [{ value: 'mba', label: 'MBA' }]
}
```

### 8.2 Dropdown behavior parity
- Existing `LoanEstimator.vue` computed `degreeOptions` continues to work unchanged or with minimal edits.
- Changing student level still resets invalid degree selection.
- No behavior regressions for form validation.

## 9. Tooling and Scripts
Add script command:
- `sync:programs`: `node scripts/syncPrograms.mjs`

Implementation notes:
- Use built-in `fetch` in Node 18+.
- Use `fs/promises` for writing JSON.
- Write JSON with 2-space indentation and trailing newline.

## 10. Error Handling
Script exits with code `1` when:
- API key missing.
- Network failure / non-2xx response.
- GraphQL `errors` present.
- Parsed dataset contains zero valid programs.

Logs must be concise and actionable:
- Include endpoint host and failure reason.
- Do not include raw key.

## 11. Testing Strategy
### 11.1 Unit tests (recommended)
Create `tests/programsSync.spec.js` to validate:
- Level normalization mapping.
- List-shape parsing (`array` vs `items`).
- Deduplication + sorting.
- Invalid row filtering.

### 11.2 Frontend regression test updates
No estimator math changes required.
If dropdown loading path changes significantly, add a lightweight component test to verify level-specific degree options.

## 12. Acceptance Criteria
1. Running `PROGRAMS_API_KEY=*** yarn sync:programs` generates `src/config/programs.json`.
2. `programs.json` contains only valid `ug`/`grad` records with stable `id` and `label`.
3. Degree dropdown displays UG programs for Undergraduate and GRAD programs for Graduate.
4. `yarn test` passes existing estimator tests.
5. API key is not committed, not hardcoded, and not logged in plaintext.

## 13. Rollout Plan
1. Add script + env handling + JSON schema.
2. Generate initial `programs.json`.
3. Wire estimator config to JSON.
4. Verify dropdown behavior manually in `yarn dev`.
5. Run `yarn test` and `yarn build`.

## 14. Open Questions (to resolve before implementation)
1. Exact `allPrograms` field names for id/title/level in this API.
2. Whether API includes inactive/archived programs and desired filtering flag.
3. Whether JSON should be committed to repo or generated in CI only.
