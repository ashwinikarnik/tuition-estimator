import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseProgramsPayload } from '../scripts/programsSyncUtils.mjs';

const SERVER_NAME = 'tuition-programs-mcp';
const SERVER_VERSION = '1.1.0';
const ENDPOINT = 'https://ofz7d3n43je73a6lxqalxt4d6y.appsync-api.us-west-2.amazonaws.com/graphql';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const programsOutputPath = path.resolve(__dirname, '../src/config/programs-mcp.json');

let inputBuffer = Buffer.alloc(0);

function sendMessage(message) {
  const body = Buffer.from(JSON.stringify(message), 'utf8');
  const header = Buffer.from(`Content-Length: ${body.length}\r\n\r\n`, 'utf8');
  process.stdout.write(Buffer.concat([header, body]));
}

function sendResult(id, result) {
  sendMessage({ jsonrpc: '2.0', id, result });
}

function sendError(id, code, message, data) {
  sendMessage({
    jsonrpc: '2.0',
    id,
    error: {
      code,
      message,
      ...(data ? { data } : {})
    }
  });
}

function asBoolean(value, defaultValue) {
  if (value === undefined) return defaultValue;
  return Boolean(value);
}

function asInteger(value, defaultValue) {
  if (value === undefined || value === null || value === '') return defaultValue;
  const parsed = Number.parseInt(value, 10);
  if (!Number.isFinite(parsed) || parsed <= 0) return defaultValue;
  return parsed;
}

function buildQuery() {
  return `
    query PullPrograms($limit: Int!, $nextToken: String) {
      allPrograms(limit: $limit, nextToken: $nextToken) {
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
        nextToken
      }
    }
  `;
}

async function fetchPrograms({ limit }) {
  const apiKey = process.env.PROGRAMS_API_KEY?.trim();
  if (!apiKey) {
    throw new Error('Missing PROGRAMS_API_KEY environment variable.');
  }

  const allRecords = [];
  let nextToken = null;
  let page = 0;

  do {
    page += 1;
    if (page > 100) {
      throw new Error('Pagination safety limit reached while fetching allPrograms.');
    }

    const response = await fetch(ENDPOINT, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-api-key': apiKey
      },
      body: JSON.stringify({
        query: buildQuery(),
        variables: {
          limit,
          nextToken
        }
      })
    });

    if (!response.ok) {
      throw new Error(`GraphQL request failed with status ${response.status}.`);
    }

    const payload = await response.json();
    if (Array.isArray(payload.errors) && payload.errors.length > 0) {
      const summary = payload.errors
        .map((entry) => entry?.message)
        .filter(Boolean)
        .join('; ');
      throw new Error(`GraphQL errors: ${summary || 'Unknown error.'}`);
    }

    const pageData = payload?.data?.allPrograms;
    const pageRecords = parseProgramsPayload(pageData);
    allRecords.push(...pageRecords);
    nextToken = pageData?.nextToken ?? null;
  } while (nextToken);

  const records = allRecords;
  const programs = normalizeProgramsForMcp(records);

  return {
    rawCount: records.length,
    programs
  };
}

function toAcadCareer(record) {
  const categoryTitle = String(record?.category?.title ?? '').trim().toLowerCase();
  const title = String(record?.title ?? '').trim().toLowerCase();
  const combined = `${categoryTitle} ${title}`;

  if (combined.includes('undergraduate')) return 'UGRD';
  if (combined.includes('graduate')) return 'GRAD';
  return '';
}

function toAcadProg(code) {
  const normalizedCode = String(code ?? '').trim();
  if (!normalizedCode) return '';
  return normalizedCode.split('-')[0].trim();
}

function normalizeProgramsForMcp(records) {
  const seen = new Set();
  const programs = [];

  for (const record of records) {
    const code = String(record?.code ?? '').trim();
    const title = String(record?.title ?? '').trim();
    const acad_prog = toAcadProg(code);
    const acad_career = toAcadCareer(record);

    if (!code || !title || !acad_prog || !acad_career) {
      continue;
    }

    const dedupeKey = `${code}|${title}`;
    if (seen.has(dedupeKey)) continue;
    seen.add(dedupeKey);

    programs.push({
      code,
      title,
      acad_prog,
      acad_career
    });
  }

  return programs.sort((a, b) => a.code.localeCompare(b.code));
}

async function persistPrograms(programs) {
  const output = {
    generatedAt: new Date().toISOString(),
    source: 'allPrograms',
    programs
  };
  await fs.writeFile(programsOutputPath, `${JSON.stringify(output, null, 2)}\n`, 'utf8');
}

async function handleToolCall(id, params) {
  const name = params?.name;
  const args = params?.arguments ?? {};

  if (name !== 'pull_programs') {
    sendError(id, -32602, `Unknown tool: ${name}`);
    return;
  }

  try {
    const limit = Math.min(asInteger(args.limit, 100), 500);
    const persist = asBoolean(args.persist, true);
    const includeRawCount = asBoolean(args.includeRawCount, false);

    const { rawCount, programs } = await fetchPrograms({ limit });
    if (programs.length === 0) {
      throw new Error('No valid undergraduate/graduate programs were returned.');
    }

    if (persist) {
      await persistPrograms(programs);
    }

    const resultPayload = {
      fetchedAt: new Date().toISOString(),
      count: programs.length,
      ...(includeRawCount ? { rawCount } : {}),
      persisted: persist,
      persistedPath: persist ? 'src/config/programs-mcp.json' : null,
      programs
    };

    sendResult(id, {
      content: [
        {
          type: 'text',
          text: `Fetched ${programs.length} programs from allPrograms${persist ? ' and updated src/config/programs-mcp.json' : ''}.`
        }
      ],
      structuredContent: resultPayload
    });
  } catch (error) {
    sendError(id, -32000, error.message);
  }
}

function listTools() {
  return [
    {
      name: 'pull_programs',
      description:
        'Fetch programs from AppSync allPrograms with code/title/acad_prog/acad_career and optionally persist to src/config/programs-mcp.json.',
      inputSchema: {
        type: 'object',
        properties: {
          limit: {
            type: 'integer',
            minimum: 1,
            maximum: 500,
            description: 'Max number of programs to request from allPrograms. Default: 100.'
          },
          persist: {
            type: 'boolean',
            description: 'Write normalized results to src/config/programs.json. Default: true.'
          },
          includeRawCount: {
            type: 'boolean',
            description: 'Include pre-normalization record count in structured output. Default: false.'
          }
        },
        additionalProperties: false
      }
    }
  ];
}

function handleMessage(message) {
  const { id, method, params } = message;

  if (method === 'initialize') {
    sendResult(id, {
      protocolVersion: '2024-11-05',
      serverInfo: {
        name: SERVER_NAME,
        version: SERVER_VERSION
      },
      capabilities: {
        tools: {}
      }
    });
    return;
  }

  if (method === 'notifications/initialized') {
    return;
  }

  if (method === 'tools/list') {
    sendResult(id, { tools: listTools() });
    return;
  }

  if (method === 'tools/call') {
    handleToolCall(id, params);
    return;
  }

  if (id !== undefined && id !== null) {
    sendError(id, -32601, `Method not found: ${method}`);
  }
}

function findHeaderSeparator(buffer) {
  const crlfIndex = buffer.indexOf('\r\n\r\n');
  if (crlfIndex !== -1) {
    return { index: crlfIndex, length: 4, headerDelimiter: '\r\n' };
  }

  const lfIndex = buffer.indexOf('\n\n');
  if (lfIndex !== -1) {
    return { index: lfIndex, length: 2, headerDelimiter: '\n' };
  }

  return null;
}

function tryParseMessages() {
  while (true) {
    const separatorInfo = findHeaderSeparator(inputBuffer);
    if (!separatorInfo) return;

    const { index, length, headerDelimiter } = separatorInfo;
    const headerText = inputBuffer.slice(0, index).toString('utf8');
    const lengthHeader = headerText
      .split(headerDelimiter)
      .find((line) => line.toLowerCase().startsWith('content-length:'));
    if (!lengthHeader) {
      inputBuffer = inputBuffer.slice(index + length);
      continue;
    }

    const contentLength = Number.parseInt(lengthHeader.split(':')[1].trim(), 10);
    const totalLength = index + length + contentLength;
    if (inputBuffer.length < totalLength) return;

    const body = inputBuffer.slice(index + length, totalLength).toString('utf8');
    inputBuffer = inputBuffer.slice(totalLength);

    try {
      const message = JSON.parse(body);
      handleMessage(message);
    } catch (error) {
      if (process.env.DEBUG) {
        console.error(`Failed to parse MCP message: ${error.message}`);
      }
    }
  }
}

process.stdin.on('data', (chunk) => {
  inputBuffer = Buffer.concat([inputBuffer, chunk]);
  tryParseMessages();
});

process.stdin.on('end', () => {
  process.exit(0);
});
