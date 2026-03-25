import {
  deriveAcadCareer,
  deriveAcadProg,
  normalizeLevel,
  normalizePrograms,
  parseProgramsPayload,
  slugifyProgramId
} from '../scripts/programsSyncUtils.mjs';

describe('program sync utilities', () => {
  it('parses list payload from array or items shape', () => {
    expect(parseProgramsPayload([{ id: 'a' }])).toEqual([{ id: 'a' }]);
    expect(parseProgramsPayload({ items: [{ id: 'b' }] })).toEqual([{ id: 'b' }]);
    expect(parseProgramsPayload({ programs: [{ id: 'c' }] })).toEqual([{ id: 'c' }]);
    expect(parseProgramsPayload({})).toEqual([]);
  });

  it('normalizes level aliases', () => {
    expect(normalizeLevel('Undergraduate')).toBe('ug');
    expect(normalizeLevel('GRAD')).toBe('grad');
    expect(normalizeLevel('unknown')).toBeNull();
  });

  it('slugifies stable program ids', () => {
    expect(slugifyProgramId('Computer Science BS')).toBe('computer_science_bs');
    expect(slugifyProgramId('M.S. Engineering')).toBe('m_s_engineering');
  });

  it('derives acad fields from level and code', () => {
    expect(deriveAcadCareer('ug')).toBe('UGRD');
    expect(deriveAcadCareer('grad')).toBe('GRAD');
    expect(deriveAcadProg('ABC-123')).toBe('ABC');
  });

  it('normalizes, deduplicates, and sorts programs for dropdown use', () => {
    const records = [
      { id: 'MBA', name: 'MBA', category: { title: 'Graduate' } },
      { id: 'comm_ba', title: 'Communication BA', studentLevel: 'undergraduate' },
      { id: 'comm_ba', name: 'Communication BA duplicate', level: 'UG' },
      { id: '', label: 'No Level Program', level: '' },
      { id: 'eng_ms', displayName: 'Engineering MS', category: { title: 'Graduate' } }
    ];

    expect(normalizePrograms(records)).toEqual([
      {
        id: 'eng_ms',
        label: 'Engineering MS',
        level: 'grad',
        code: '',
        title: 'Engineering MS',
        acad_prog: '',
        acad_career: 'GRAD'
      },
      {
        id: 'mba',
        label: 'MBA',
        level: 'grad',
        code: '',
        title: 'MBA',
        acad_prog: '',
        acad_career: 'GRAD'
      },
      {
        id: 'comm_ba',
        label: 'Communication BA',
        level: 'ug',
        code: '',
        title: 'Communication BA',
        acad_prog: '',
        acad_career: 'UGRD'
      }
    ]);
  });
});
