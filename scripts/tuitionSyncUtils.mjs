const SEMESTERS = ['fall', 'spring', 'summer'];
const CREDIT_HOURS = Array.from({ length: 18 }, (_, index) => String(index + 1));

function toNumber(value) {
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  if (typeof value === 'string') {
    const normalized = value.replace(/,/g, '').trim();
    if (normalized === '') return NaN;
    const parsed = Number(normalized);
    return Number.isFinite(parsed) ? parsed : NaN;
  }
  return NaN;
}

function readCreditValue(table, credit) {
  return toNumber(table?.[credit]);
}

function deriveTuitionByCredit(semesterBreakdown) {
  const tuitionTables = Object.entries(semesterBreakdown || {})
    .filter(([key]) => key !== 'total')
    .map(([, entry]) => entry)
    .filter((entry) => {
      return (
        entry &&
        typeof entry === 'object' &&
        typeof entry.descr === 'string' &&
        entry.descr.toLowerCase().includes('tuition')
      );
    });

  const tuitionByCredit = {};

  for (const credit of CREDIT_HOURS) {
    const tuition = tuitionTables.reduce((sum, table) => {
      const value = readCreditValue(table, credit);
      return Number.isFinite(value) ? sum + value : sum;
    }, 0);

    tuitionByCredit[credit] = Math.round(tuition);
  }

  return tuitionByCredit;
}

function deriveTotalByCredit(semesterBreakdown) {
  const totalTable = semesterBreakdown?.total;
  const totalByCredit = {};

  for (const credit of CREDIT_HOURS) {
    const value = readCreditValue(totalTable, credit);
    totalByCredit[credit] = Number.isFinite(value) ? Math.round(value) : NaN;
  }

  return totalByCredit;
}

function validateRateMap(rateMap, context) {
  for (const credit of CREDIT_HOURS) {
    if (!Number.isFinite(rateMap[credit])) {
      throw new Error(`Missing numeric value for credit ${credit} (${context}).`);
    }
  }
}

function normalizeSemester(semesterBreakdown, context) {
  if (!semesterBreakdown || typeof semesterBreakdown !== 'object') {
    throw new Error(`Missing semester breakdown (${context}).`);
  }

  const tuitionByCredit = deriveTuitionByCredit(semesterBreakdown);
  const totalByCredit = deriveTotalByCredit(semesterBreakdown);
  const feesByCredit = {};

  for (const credit of CREDIT_HOURS) {
    feesByCredit[credit] = Math.max(0, totalByCredit[credit] - tuitionByCredit[credit]);
  }

  validateRateMap(tuitionByCredit, `${context} tuition`);
  validateRateMap(totalByCredit, `${context} total`);

  return {
    tuitionByCredit,
    feesByCredit,
    totalByCredit
  };
}

export function parseTuitionPayload(payload, context) {
  if (payload === false) {
    throw new Error(`API returned false (${context}).`);
  }

  if (!payload || typeof payload !== 'object') {
    throw new Error(`Invalid JSON payload (${context}).`);
  }

  const ratesBySemester = {};

  for (const semester of SEMESTERS) {
    ratesBySemester[semester] = normalizeSemester(payload?.breakdown?.[semester], `${context} ${semester}`);
  }

  return ratesBySemester;
}

export function buildTuitionRequestUrl({ endpoint, program, acadYear, residency }) {
  const params = new URLSearchParams({
    acad_career: String(program.acad_career ?? ''),
    acad_prog: String(program.acad_prog ?? ''),
    acad_year: String(acadYear),
    admit_level: '',
    admit_term: '',
    campus: 'ONLNE',
    credit_hr: '',
    honors: '0',
    include_summer: '0',
    program_fee: '',
    residency: String(residency)
  });

  return `${endpoint}?${params.toString()}`;
}

export const TUITION_SYNC_CONSTANTS = {
  endpoint: 'https://tuitionasu-dev-asufactory1.acquia.asu.edu/tuition/js/get-results',
  acadYears: ['2026', '2027'],
  residencies: ['RES', 'NONRES'],
  semesters: SEMESTERS,
  creditHours: CREDIT_HOURS
};
