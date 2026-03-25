import {
  allocateLoanAcrossSemesters,
  computePerSemesterLoan,
  computeTuitionAndFeesPerSemester,
  computeTuitionPerSemester,
  getAnnualLoanCap,
  runEstimate
} from '../src/composables/useLoanEstimator';
import programsData from '../src/config/programs.json';

const PROGRAMS = Array.isArray(programsData?.programs) ? programsData.programs : [];
const FIRST_UG_PROGRAM_ID = PROGRAMS.find((program) => program.level === 'ug')?.id;
const FIRST_GRAD_PROGRAM_ID = PROGRAMS.find((program) => program.level === 'grad')?.id;
const FIRST_BAS_UG_PROGRAM_ID = PROGRAMS.find(
  (program) => program.level === 'ug' && program.label?.includes('(BAS)')
)?.id;

describe('loan estimator math', () => {
  it('returns no loan below half-time enrollment', () => {
    const result = computePerSemesterLoan({
      creditsPerSemester: 3,
      annualCap: 12500,
      fullTimeThreshold: 12
    });

    expect(result.enrollmentRatio).toBe(0);
    expect(result.perSemesterLoan).toBe(0);
  });

  it('prorates undergraduate annual cap at 6 credits', () => {
    const cap = getAnnualLoanCap('ug', 'independent', 3);
    const result = computePerSemesterLoan({
      creditsPerSemester: 6,
      annualCap: cap,
      fullTimeThreshold: 12
    });

    expect(cap).toBe(12500);
    expect(result.enrollmentRatio).toBe(0.5);
    expect(result.perSemesterLoan).toBe(3125);
  });

  it('caps graduate annual total when all three semesters are selected', () => {
    const allocations = allocateLoanAcrossSemesters({
      selectedSemesterIds: ['fall', 'spring', 'summer'],
      perSemesterLoan: 10250,
      annualCap: 20500
    });

    expect(allocations.fall).toBe(10250);
    expect(allocations.spring).toBe(10250);
    expect(allocations.summer).toBe(0);
  });

  it('computes tuition from the lookup table', () => {
    expect(FIRST_UG_PROGRAM_ID).toBeTruthy();

    const tuition = computeTuitionPerSemester({
      degree: FIRST_UG_PROGRAM_ID,
      residency: 'RES',
      creditsPerSemester: 6
    });

    expect(tuition).toBeTypeOf('number');
    expect(tuition).toBeGreaterThan(0);
  });

  it('matches key permutation for UG estimate totals', () => {
    expect(FIRST_UG_PROGRAM_ID).toBeTruthy();

    const tuitionPerSemester = computeTuitionPerSemester({
      degree: FIRST_UG_PROGRAM_ID,
      residency: 'RES',
      creditsPerSemester: 6
    });
    const tuitionAndFeesPerSemester = computeTuitionAndFeesPerSemester({
      degree: FIRST_UG_PROGRAM_ID,
      residency: 'RES',
      creditsPerSemester: 6
    });

    const estimate = runEstimate({
      level: 'ug',
      degree: FIRST_UG_PROGRAM_ID,
      residency: 'RES',
      dependencyStatus: 'independent',
      completedCreditBand: 3,
      selectedSemesterIds: ['fall', 'spring'],
      creditsPerSemester: 6
    });

    expect(estimate.totalLoan).toBe(6250);
    expect(estimate.totalTuition).toBe(tuitionPerSemester * 2);
    expect(estimate.totalTuitionAndFees).toBe(tuitionAndFeesPerSemester * 2);
    expect(estimate.totalRemainingCost).toBe(Math.max(0, estimate.totalTuitionAndFees - estimate.totalLoan));
  });

  it('matches key permutation for GRAD estimate totals', () => {
    expect(FIRST_GRAD_PROGRAM_ID).toBeTruthy();

    const tuitionPerSemester = computeTuitionPerSemester({
      degree: FIRST_GRAD_PROGRAM_ID,
      residency: 'NONRES',
      creditsPerSemester: 8
    });
    const tuitionAndFeesPerSemester = computeTuitionAndFeesPerSemester({
      degree: FIRST_GRAD_PROGRAM_ID,
      residency: 'NONRES',
      creditsPerSemester: 8
    });

    const estimate = runEstimate({
      level: 'grad',
      degree: FIRST_GRAD_PROGRAM_ID,
      residency: 'NONRES',
      dependencyStatus: '',
      completedCreditBand: 0,
      selectedSemesterIds: ['fall', 'spring'],
      creditsPerSemester: 8
    });

    expect(estimate.totalLoan).toBe(18222);
    expect(estimate.totalTuition).toBe(tuitionPerSemester * 2);
    expect(estimate.totalTuitionAndFees).toBe(tuitionAndFeesPerSemester * 2);
    expect(estimate.totalRemainingCost).toBe(Math.max(0, estimate.totalTuitionAndFees - estimate.totalLoan));
  });

  it('returns non-zero federal loan for BAS undergraduate program', () => {
    expect(FIRST_BAS_UG_PROGRAM_ID).toBeTruthy();

    const estimate = runEstimate({
      level: 'ug',
      degree: FIRST_BAS_UG_PROGRAM_ID,
      residency: 'RES',
      dependencyStatus: 'independent',
      completedCreditBand: 3,
      selectedSemesterIds: ['fall', 'spring'],
      creditsPerSemester: 6
    });

    expect(estimate).toBeTruthy();
    expect(estimate.totalLoan).toBeGreaterThan(0);
  });
});
