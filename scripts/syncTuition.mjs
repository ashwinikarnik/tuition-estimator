import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildTuitionRequestUrl, parseTuitionPayload, TUITION_SYNC_CONSTANTS } from './tuitionSyncUtils.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const programsPath = path.resolve(__dirname, '../src/config/programs.json');
const outputPath = path.resolve(__dirname, '../src/config/tuitionRates.json');

async function readPrograms() {
  const content = await fs.readFile(programsPath, 'utf8');
  const parsed = JSON.parse(content);
  const programs = Array.isArray(parsed?.programs) ? parsed.programs : [];

  return programs.filter((program) => {
    return Boolean(program?.id && program?.acad_career && program?.acad_prog);
  });
}

async function fetchJson(url) {
  const response = await fetch(url, {
    headers: {
      accept: 'application/json'
    }
  });

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}.`);
  }

  const text = await response.text();
  if (text.trim() === 'false') {
    return false;
  }

  try {
    return JSON.parse(text);
  } catch {
    throw new Error('Response was not valid JSON.');
  }
}

async function run() {
  const programs = await readPrograms();

  if (!programs.length) {
    throw new Error('No programs found with id/acad_career/acad_prog in programs.json.');
  }

  const rates = {};

  for (const acadYear of TUITION_SYNC_CONSTANTS.acadYears) {
    rates[acadYear] = {};

    for (const program of programs) {
      rates[acadYear][program.id] = {};

      for (const residency of TUITION_SYNC_CONSTANTS.residencies) {
        const context = `program=${program.id} acad_prog=${program.acad_prog} acad_career=${program.acad_career} year=${acadYear} residency=${residency}`;
        const url = buildTuitionRequestUrl({
          endpoint: TUITION_SYNC_CONSTANTS.endpoint,
          program,
          acadYear,
          residency
        });

        const payload = await fetchJson(url);
        const parsedRates = parseTuitionPayload(payload, context);

        rates[acadYear][program.id][residency] = parsedRates;
        console.log(`Synced ${context}`);
      }
    }
  }

  const output = {
    generatedAt: new Date().toISOString(),
    source: TUITION_SYNC_CONSTANTS.endpoint,
    acadYears: TUITION_SYNC_CONSTANTS.acadYears,
    residencies: TUITION_SYNC_CONSTANTS.residencies,
    semesters: TUITION_SYNC_CONSTANTS.semesters,
    creditHours: TUITION_SYNC_CONSTANTS.creditHours,
    rates
  };

  await fs.writeFile(outputPath, `${JSON.stringify(output, null, 2)}\n`, 'utf8');
  console.log(`Wrote tuition data to ${path.relative(process.cwd(), outputPath)}.`);
}

run().catch((error) => {
  console.error(`Tuition sync failed: ${error.message}`);
  process.exitCode = 1;
});
