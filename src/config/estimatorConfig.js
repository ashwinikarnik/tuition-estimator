import programsData from './programs.json';

export const APP_COPY = {
  eyebrow: '2026-27 academic year • Online Students',
  title: 'Tuition and student loan estimator',
  subtitle:
    'Determine how much you can borrow in federal student loans and your tuition costs using our estimator.',
  alert: 'New federal Direct Loan rules take effect July 1, 2026.',
  sectionIntro:
    'Provide some information to get estimates for your tuition costs, federal loan eligibility and any remaining costs.'
};

export const STUDENT_LEVELS = [
  { value: 'ug', label: 'Undergraduate' },
  { value: 'grad', label: 'Graduate' }
];

export const RESIDENCIES = [
  { value: 'az', label: 'Arizona resident' },
  { value: 'nonaz', label: 'Out-of-state resident' }
];

export const COMPLETED_CREDIT_BANDS = [
  { value: 1, label: '0-24 credits (first year)' },
  { value: 2, label: '25-55 credits (second year)' },
  { value: 3, label: '56+ credits (third or fourth year)' }
];

export const SEMESTERS = [
  { id: 'fall', label: 'Fall 2026' },
  { id: 'spring', label: 'Spring 2027' },
  { id: 'summer', label: 'Summer 2027' }
];

export const POLICY = {
  minCreditsToBorrow: 6,
  fullTimeCredits: {
    ug: 12,
    grad: 9
  },
  annualLoanLimits: {
    ug: {
      dependent: { 1: 5500, 2: 6500, 3: 7500 },
      independent: { 1: 9500, 2: 10500, 3: 12500 }
    },
    grad: 20500
  },
  maxPellGrant: 7395
};

const PROGRAMS = Array.isArray(programsData?.programs) ? programsData.programs : [];

export const DEGREE_OPTIONS = PROGRAMS.reduce(
  (accumulator, program) => {
    if (!program?.id || !program?.label || !['ug', 'grad'].includes(program?.level)) {
      return accumulator;
    }

    accumulator[program.level].push({
      value: program.id,
      label: program.label
    });

    return accumulator;
  },
  { ug: [], grad: [] }
);

function buildTuitionBracket({ perCredit, cappedCredit }) {
  const table = {};

  for (let credits = 1; credits <= 18; credits += 1) {
    const billableCredits = Math.min(credits, cappedCredit);
    table[credits] = Math.round(billableCredits * perCredit);
  }

  return table;
}

function buildProgramRate(program, indexWithinLevel) {
  const level = program.level;
  const levelOffset = indexWithinLevel % 12;

  const baseAzPerCredit = level === 'ug' ? 640 + levelOffset * 14 : 560 + levelOffset * 18;
  const baseNonAzPerCredit = level === 'ug' ? 920 + levelOffset * 24 : 760 + levelOffset * 28;

  return {
    az: buildTuitionBracket({ perCredit: baseAzPerCredit, cappedCredit: 12 }),
    nonaz: buildTuitionBracket({ perCredit: baseNonAzPerCredit, cappedCredit: 12 })
  };
}

export const TUITION_RATES = (() => {
  const groupedCounts = { ug: 0, grad: 0 };

  return PROGRAMS.reduce((accumulator, program) => {
    if (!program?.id || !['ug', 'grad'].includes(program?.level)) {
      return accumulator;
    }

    const indexWithinLevel = groupedCounts[program.level];
    groupedCounts[program.level] += 1;
    accumulator[program.id] = buildProgramRate(program, indexWithinLevel);

    return accumulator;
  }, {});
})();
