import {
  allocateLoanAcrossSemesters,
  computePerSemesterLoan,
  computeTuitionPerSemester,
  getAnnualLoanCap,
  runEstimate
} from '../src/composables/useLoanEstimator';

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
    const tuition = computeTuitionPerSemester({
      degree: 'comm_ba',
      residency: 'az',
      creditsPerSemester: 6
    });

    expect(tuition).toBe(3791);
  });

  it('matches key permutation for UG estimate totals', () => {
    const estimate = runEstimate({
      level: 'ug',
      degree: 'comm_ba',
      residency: 'az',
      dependencyStatus: 'independent',
      completedCreditBand: 3,
      selectedSemesterIds: ['fall', 'spring'],
      creditsPerSemester: 6
    });

    expect(estimate.totalLoan).toBe(6250);
    expect(estimate.totalTuition).toBe(7582);
    expect(estimate.totalRemainingCost).toBe(1332);
  });

  it('matches key permutation for GRAD estimate totals', () => {
    const estimate = runEstimate({
      level: 'grad',
      degree: 'eng_ms',
      residency: 'nonaz',
      dependencyStatus: '',
      completedCreditBand: 0,
      selectedSemesterIds: ['fall', 'spring'],
      creditsPerSemester: 8
    });

    expect(estimate.totalLoan).toBe(18222);
    expect(estimate.totalTuition).toBe(6720);
    expect(estimate.totalRemainingCost).toBe(0);
  });
});
