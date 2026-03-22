import { POLICY, SEMESTERS, TUITION_RATES } from '../config/estimatorConfig';

export function formatCurrency(value) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(
    Math.round(Math.abs(value))
  );
}

export function getAnnualLoanCap(level, dependencyStatus, completedCreditBand) {
  if (level === 'grad') return POLICY.annualLoanLimits.grad;

  const capsByDependency = POLICY.annualLoanLimits.ug[dependencyStatus];
  if (!capsByDependency) return 0;

  return capsByDependency[completedCreditBand] ?? 0;
}

export function getFullTimeThreshold(level) {
  return POLICY.fullTimeCredits[level] ?? POLICY.fullTimeCredits.ug;
}

export function computePerSemesterLoan({ creditsPerSemester, annualCap, fullTimeThreshold }) {
  if (creditsPerSemester < POLICY.minCreditsToBorrow) {
    return {
      enrollmentRatio: 0,
      perSemesterLoan: 0
    };
  }

  const enrollmentRatio = Math.min(creditsPerSemester / fullTimeThreshold, 1);
  const perSemesterLoan = Math.round((annualCap / 2) * enrollmentRatio);

  return {
    enrollmentRatio,
    perSemesterLoan
  };
}

export function computeTuitionPerSemester({ degree, residency, creditsPerSemester }) {
  return TUITION_RATES[degree]?.[residency]?.[creditsPerSemester] ?? null;
}

export function allocateLoanAcrossSemesters({ selectedSemesterIds, perSemesterLoan, annualCap }) {
  const nonSummer = selectedSemesterIds.filter((id) => id !== 'summer');
  const hasSummer = selectedSemesterIds.includes('summer');

  const fallLoan = nonSummer.length >= 1 ? perSemesterLoan : 0;
  const springLoan = nonSummer.length >= 2 ? perSemesterLoan : 0;
  const usedBeforeSummer = fallLoan + springLoan;
  const summerLoan = hasSummer ? Math.max(0, Math.min(annualCap - usedBeforeSummer, perSemesterLoan)) : 0;

  return {
    fall: fallLoan,
    spring: springLoan,
    summer: summerLoan
  };
}

export function runEstimate({
  level,
  degree,
  residency,
  dependencyStatus,
  completedCreditBand,
  selectedSemesterIds,
  creditsPerSemester
}) {
  const billableSemesterIds = selectedSemesterIds.filter(Boolean);
  if (!billableSemesterIds.length || creditsPerSemester <= 0) {
    return null;
  }

  const annualCap = getAnnualLoanCap(level, dependencyStatus, completedCreditBand);
  const fullTimeThreshold = getFullTimeThreshold(level);
  const tuitionPerSemester = computeTuitionPerSemester({ degree, residency, creditsPerSemester });
  if (tuitionPerSemester === null) return null;

  const { enrollmentRatio, perSemesterLoan } = computePerSemesterLoan({
    creditsPerSemester,
    annualCap,
    fullTimeThreshold
  });

  const semesterLoanMap = allocateLoanAcrossSemesters({
    selectedSemesterIds: billableSemesterIds,
    perSemesterLoan,
    annualCap
  });

  const rows = SEMESTERS.filter((semester) => billableSemesterIds.includes(semester.id)).map((semester) => {
    const tuition = tuitionPerSemester;
    const loan = semesterLoanMap[semester.id] ?? 0;
    const remainingCost = Math.max(0, tuition - loan);

    return {
      id: semester.id,
      semester: semester.label,
      credits: creditsPerSemester,
      tuition,
      loan,
      remainingCost
    };
  });

  const totalTuition = rows.reduce((sum, row) => sum + row.tuition, 0);
  const totalLoan = rows.reduce((sum, row) => sum + row.loan, 0);
  const totalRemainingCost = rows.reduce((sum, row) => sum + row.remainingCost, 0);

  return {
    annualCap,
    enrollmentRatio,
    fullTimeThreshold,
    totalCredits: rows.reduce((sum, row) => sum + row.credits, 0),
    totalTuition,
    totalLoan,
    totalRemainingCost,
    rows
  };
}
