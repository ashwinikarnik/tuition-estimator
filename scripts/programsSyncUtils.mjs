const LEVEL_ALIASES = {
  ug: 'ug',
  undergraduate: 'ug',
  undergrad: 'ug',
  ugrad: 'ug',
  grad: 'grad',
  graduate: 'grad',
  masters: 'grad',
  master: 'grad'
};

const ACAD_CAREER_BY_LEVEL = {
  ug: 'UGRD',
  grad: 'GRAD'
};

function normalizeWhitespace(value) {
  return String(value ?? '')
    .replace(/\s+/g, ' ')
    .trim();
}

export function normalizeLevel(value) {
  const normalized = normalizeWhitespace(value).toLowerCase();
  return LEVEL_ALIASES[normalized] ?? null;
}

export function slugifyProgramId(value) {
  return normalizeWhitespace(value)
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '');
}

export function deriveAcadProg(code) {
  const normalizedCode = normalizeWhitespace(code);
  if (!normalizedCode) return '';
  return normalizedCode.split('-')[0].trim();
}

export function deriveAcadCareer(level) {
  return ACAD_CAREER_BY_LEVEL[level] ?? '';
}

export function parseProgramsPayload(payload) {
  if (Array.isArray(payload)) return payload;
  if (payload && Array.isArray(payload.items)) return payload.items;
  if (payload && Array.isArray(payload.programs)) return payload.programs;
  return [];
}

function pickFirstValue(record, fields) {
  for (const field of fields) {
    if (record?.[field] !== undefined && record?.[field] !== null && String(record[field]).trim() !== '') {
      return record[field];
    }
  }
  return '';
}

export function normalizePrograms(records) {
  const seen = new Set();
  const normalized = [];

  for (const record of records) {
    const categoryTitle = normalizeWhitespace(record?.category?.title);
    const level = normalizeLevel(
      categoryTitle || pickFirstValue(record, ['level', 'studentLevel', 'degreeLevel', 'career', 'programLevel'])
    );
    const label = normalizeWhitespace(
      pickFirstValue(record, ['label', 'name', 'title', 'displayName', 'programName'])
    );
    const code = normalizeWhitespace(pickFirstValue(record, ['code', 'programCode', 'acadCode']));
    const idCandidate = pickFirstValue(record, ['id', 'programId', 'code', 'programCode', 'slug']);
    const id = slugifyProgramId(idCandidate || label);
    const acad_prog = deriveAcadProg(code);
    const acad_career = deriveAcadCareer(level);

    if (!level || !label || !id) continue;

    const dedupeKey = `${level}:${id}`;
    if (seen.has(dedupeKey)) continue;
    seen.add(dedupeKey);

    normalized.push({
      id,
      label,
      level,
      code,
      title: label,
      acad_prog,
      acad_career
    });
  }

  return normalized.sort((a, b) => {
    if (a.level !== b.level) return a.level.localeCompare(b.level);
    return a.label.localeCompare(b.label);
  });
}
