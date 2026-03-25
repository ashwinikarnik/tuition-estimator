import { buildTuitionRequestUrl, parseTuitionPayload, TUITION_SYNC_CONSTANTS } from '../scripts/tuitionSyncUtils.mjs';

function buildSemester({ tuitionPerCredit, fee }) {
  const tuition = { descr: 'Resident Online Tuition' };
  const fees = { descr: 'Student Initiated Fees' };
  const total = { descr: 'Total Tuition & Fees' };

  for (let credit = 1; credit <= 18; credit += 1) {
    tuition[String(credit)] = String(tuitionPerCredit * credit);
    fees[String(credit)] = String(fee);
    total[String(credit)] = tuitionPerCredit * credit + fee;
  }

  return {
    URO001: tuition,
    FS0005: fees,
    total
  };
}

describe('tuition sync utils', () => {
  it('parses semester tuition, fees and total by credit', () => {
    const payload = {
      breakdown: {
        fall: buildSemester({ tuitionPerCredit: 100, fee: 50 }),
        spring: buildSemester({ tuitionPerCredit: 120, fee: 40 }),
        summer: buildSemester({ tuitionPerCredit: 90, fee: 30 })
      }
    };

    const parsed = parseTuitionPayload(payload, 'sample');

    expect(parsed.fall.tuitionByCredit['7']).toBe(700);
    expect(parsed.fall.feesByCredit['7']).toBe(50);
    expect(parsed.fall.totalByCredit['7']).toBe(750);

    expect(parsed.spring.tuitionByCredit['2']).toBe(240);
    expect(parsed.spring.feesByCredit['2']).toBe(40);
    expect(parsed.spring.totalByCredit['2']).toBe(280);

    expect(parsed.summer.tuitionByCredit['1']).toBe(90);
    expect(parsed.summer.feesByCredit['1']).toBe(30);
    expect(parsed.summer.totalByCredit['1']).toBe(120);
  });

  it('throws when api returns false', () => {
    expect(() => parseTuitionPayload(false, 'sample')).toThrow('API returned false');
  });

  it('builds request urls with required query params', () => {
    const url = buildTuitionRequestUrl({
      endpoint: TUITION_SYNC_CONSTANTS.endpoint,
      program: { acad_career: 'UGRD', acad_prog: 'UGBA' },
      acadYear: '2026',
      residency: 'RES'
    });

    const parsed = new URL(url);

    expect(parsed.searchParams.get('acad_career')).toBe('UGRD');
    expect(parsed.searchParams.get('acad_prog')).toBe('UGBA');
    expect(parsed.searchParams.get('acad_year')).toBe('2026');
    expect(parsed.searchParams.get('credit_hr')).toBe('');
    expect(parsed.searchParams.get('residency')).toBe('RES');
  });
});
