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

export const DEGREE_OPTIONS = {
  ug: [
    { value: 'comm_ba', label: 'Communication BA' },
    { value: 'business_ba', label: 'Business BA' },
    { value: 'cs_bs', label: 'Computer Science BS' },
    { value: 'nursing_bsn', label: 'Nursing BSN' }
  ],
  grad: [
    { value: 'eled_med', label: 'Elementary Education MEd' },
    { value: 'mba', label: 'MBA' },
    { value: 'sw_msw', label: 'Social Work MSW' },
    { value: 'eng_ms', label: 'Engineering MS' }
  ]
};

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

export const TUITION_RATES = {
  comm_ba: {
    az: { 1: 671, 2: 1295, 3: 1919, 4: 2543, 5: 3167, 6: 3791, 7: 4444, 8: 5068, 9: 5692, 10: 6316, 11: 6471, 12: 6515, 13: 6559, 14: 6603, 15: 6647, 16: 6691, 17: 6735, 18: 6779 },
    nonaz: { 1: 832, 2: 1664, 3: 2496, 4: 3328, 5: 4160, 6: 4992, 7: 4992, 8: 4992, 9: 4992, 10: 4992, 11: 4992, 12: 4992, 13: 4992, 14: 4992, 15: 4992, 16: 4992, 17: 4992, 18: 4992 }
  },
  business_ba: {
    az: { 1: 680, 2: 1360, 3: 2040, 4: 2720, 5: 3400, 6: 4080, 7: 4080, 8: 4080, 9: 4080, 10: 4080, 11: 4080, 12: 4080, 13: 4080, 14: 4080, 15: 4080, 16: 4080, 17: 4080, 18: 4080 },
    nonaz: { 1: 1600, 2: 3200, 3: 4800, 4: 6400, 5: 8000, 6: 9600, 7: 9600, 8: 9600, 9: 9600, 10: 9600, 11: 9600, 12: 9600, 13: 9600, 14: 9600, 15: 9600, 16: 9600, 17: 9600, 18: 9600 }
  },
  cs_bs: {
    az: { 1: 700, 2: 1400, 3: 2100, 4: 2800, 5: 3500, 6: 4200, 7: 4200, 8: 4200, 9: 4200, 10: 4200, 11: 4200, 12: 4200, 13: 4200, 14: 4200, 15: 4200, 16: 4200, 17: 4200, 18: 4200 },
    nonaz: { 1: 1640, 2: 3280, 3: 4920, 4: 6560, 5: 8200, 6: 9840, 7: 9840, 8: 9840, 9: 9840, 10: 9840, 11: 9840, 12: 9840, 13: 9840, 14: 9840, 15: 9840, 16: 9840, 17: 9840, 18: 9840 }
  },
  nursing_bsn: {
    az: { 1: 760, 2: 1520, 3: 2280, 4: 3040, 5: 3800, 6: 4560, 7: 4560, 8: 4560, 9: 4560, 10: 4560, 11: 4560, 12: 4560, 13: 4560, 14: 4560, 15: 4560, 16: 4560, 17: 4560, 18: 4560 },
    nonaz: { 1: 1720, 2: 3440, 3: 5160, 4: 6880, 5: 8600, 6: 10320, 7: 10320, 8: 10320, 9: 10320, 10: 10320, 11: 10320, 12: 10320, 13: 10320, 14: 10320, 15: 10320, 16: 10320, 17: 10320, 18: 10320 }
  },
  eled_med: {
    az: { 1: 550, 2: 1100, 3: 1650, 4: 2200, 5: 2750, 6: 3300, 7: 3850, 8: 4400, 9: 4950, 10: 5500, 11: 6050, 12: 6050, 13: 6050, 14: 6050, 15: 6050, 16: 6050, 17: 6050, 18: 6050 },
    nonaz: { 1: 700, 2: 1400, 3: 2100, 4: 2800, 5: 3500, 6: 4200, 7: 4900, 8: 5600, 9: 6300, 10: 7000, 11: 7700, 12: 7700, 13: 7700, 14: 7700, 15: 7700, 16: 7700, 17: 7700, 18: 7700 }
  },
  mba: {
    az: { 1: 690, 2: 1380, 3: 2070, 4: 2760, 5: 3450, 6: 4140, 7: 4830, 8: 5520, 9: 6210, 10: 6900, 11: 7590, 12: 7590, 13: 7590, 14: 7590, 15: 7590, 16: 7590, 17: 7590, 18: 7590 },
    nonaz: { 1: 860, 2: 1720, 3: 2580, 4: 3440, 5: 4300, 6: 5160, 7: 6020, 8: 6880, 9: 7740, 10: 8600, 11: 9460, 12: 9460, 13: 9460, 14: 9460, 15: 9460, 16: 9460, 17: 9460, 18: 9460 }
  },
  sw_msw: {
    az: { 1: 480, 2: 960, 3: 1440, 4: 1920, 5: 2400, 6: 2880, 7: 3360, 8: 3840, 9: 4320, 10: 4800, 11: 5280, 12: 5280, 13: 5280, 14: 5280, 15: 5280, 16: 5280, 17: 5280, 18: 5280 },
    nonaz: { 1: 640, 2: 1280, 3: 1920, 4: 2560, 5: 3200, 6: 3840, 7: 4480, 8: 5120, 9: 5760, 10: 6400, 11: 7040, 12: 7040, 13: 7040, 14: 7040, 15: 7040, 16: 7040, 17: 7040, 18: 7040 }
  },
  eng_ms: {
    az: { 1: 620, 2: 1240, 3: 1860, 4: 2480, 5: 3100, 6: 3720, 7: 4340, 8: 4960, 9: 5580, 10: 6200, 11: 6820, 12: 6820, 13: 6820, 14: 6820, 15: 6820, 16: 6820, 17: 6820, 18: 6820 },
    nonaz: { 1: 420, 2: 840, 3: 1260, 4: 1680, 5: 2100, 6: 2520, 7: 2940, 8: 3360, 9: 3780, 10: 4200, 11: 4620, 12: 4620, 13: 4620, 14: 4620, 15: 4620, 16: 4620, 17: 4620, 18: 4620 }
  }
};
