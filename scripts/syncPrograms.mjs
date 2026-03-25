import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  normalizePrograms,
  parseProgramsPayload,
} from "./programsSyncUtils.mjs";

const ENDPOINT =
  "https://ofz7d3n43je73a6lxqalxt4d6y.appsync-api.us-west-2.amazonaws.com/graphql";
const QUERY = `
  query {
    allPrograms(limit: 100) {
      items {
        id
        code
        title
        next_start_date
        category {
          id
          title
        }
      }
    }
  }
`;
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outputPath = path.resolve(__dirname, "../src/config/programs.json");
const envLocalPath = path.resolve(__dirname, "../.env.local");
const shouldRefresh = process.argv.includes("--refresh");

function maskSecret(secret) {
  if (!secret || secret.length < 8) return "***";
  return `${secret.slice(0, 4)}...${secret.slice(-4)}`;
}

function parseEnvFile(content) {
  const entries = {};

  for (const rawLine of content.split("\n")) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) continue;

    const separatorIndex = line.indexOf("=");
    if (separatorIndex === -1) continue;

    const key = line.slice(0, separatorIndex).trim();
    let value = line.slice(separatorIndex + 1).trim();

    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    entries[key] = value;
  }

  return entries;
}

async function loadApiKey() {
  if (process.env.PROGRAMS_API_KEY) {
    return process.env.PROGRAMS_API_KEY.trim();
  }

  try {
    const envLocalContent = await fs.readFile(envLocalPath, "utf8");
    const parsed = parseEnvFile(envLocalContent);
    return parsed.PROGRAMS_API_KEY?.trim() || "";
  } catch {
    return "";
  }
}

async function readExistingPrograms() {
  try {
    const content = await fs.readFile(outputPath, "utf8");
    const parsed = JSON.parse(content);
    return Array.isArray(parsed.programs) ? parsed.programs : [];
  } catch {
    return [];
  }
}

async function fetchAllPrograms(apiKey) {
  const response = await fetch(ENDPOINT, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-api-key": apiKey,
    },
    body: JSON.stringify({ query: QUERY }),
  });

  if (!response.ok) {
    throw new Error(`GraphQL request failed with status ${response.status}.`);
  }

  const payload = await response.json();

  if (Array.isArray(payload.errors) && payload.errors.length > 0) {
    const summary = payload.errors
      .map((error) => error.message)
      .filter(Boolean)
      .join("; ");
    throw new Error(
      `GraphQL returned errors: ${summary || "Unknown GraphQL error."}`,
    );
  }

  return parseProgramsPayload(payload?.data?.allPrograms);
}

async function writeProgramsFile(programs) {
  const output = {
    generatedAt: new Date().toISOString(),
    source: "allPrograms",
    programs,
  };

  await fs.writeFile(
    outputPath,
    `${JSON.stringify(output, null, 2)}\n`,
    "utf8",
  );
}

async function run() {
  const existingPrograms = await readExistingPrograms();
  if (existingPrograms.length > 0 && !shouldRefresh) {
    console.log(
      `Skipping fetch. ${path.relative(process.cwd(), outputPath)} already has ${existingPrograms.length} programs.`,
    );
    return;
  }

  const apiKey = await loadApiKey();
  if (!apiKey) {
    throw new Error(
      "Missing PROGRAMS_API_KEY. Add it to .env.local or run PROGRAMS_API_KEY=<key> yarn sync:programs.",
    );
  }

  console.log(
    `Fetching programs from AppSync using key ${maskSecret(apiKey)}.`,
  );
  const records = await fetchAllPrograms(apiKey);
  const programs = normalizePrograms(records);

  if (programs.length === 0) {
    throw new Error(
      "No valid undergraduate/graduate programs were returned by allPrograms.",
    );
  }

  await writeProgramsFile(programs);
  console.log(
    `Wrote ${programs.length} programs to ${path.relative(process.cwd(), outputPath)}.`,
  );
}

run().catch((error) => {
  console.error(`Program sync failed: ${error.message}`);
  process.exitCode = 1;
});
