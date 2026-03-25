# Programs MCP Server

This repository now includes an MCP server for pulling program data from AppSync `allPrograms`.

## Server Entry

- [mcp/programs-mcp-server.mjs](/Users/akarnikr/agentic-engg/tuition-estimator-codex/mcp/programs-mcp-server.mjs)
- Start command: `yarn mcp:programs`

## Authentication (secure input)

Set API key via environment variable (recommended):

1. Copy `.env.example` to `.env.local`
2. Add:
   - `PROGRAMS_API_KEY=<your_key>`
3. Start MCP server from a shell where `PROGRAMS_API_KEY` is available.

The server never prints the key and only sends it in `x-api-key` header to AppSync.

## Available MCP Tool

### `pull_programs`

Fetches programs from:
- `https://ofz7d3n43je73a6lxqalxt4d6y.appsync-api.us-west-2.amazonaws.com/graphql`

Using query:
- `allPrograms(limit: <limit>) { items { id code title next_start_date category { id title } } }`

Input:
- `limit` (integer, default `100`, max `500`) page size per GraphQL request
- `persist` (boolean, default `true`) writes normalized output to `src/config/programs-mcp.json`
- `includeRawCount` (boolean, default `false`)

Output:
- `structuredContent` with normalized `programs` containing:
  - `code`
  - `title`
  - `acad_prog` (first segment of `code` before `-`)
  - `acad_career` (`UGRD` for Undergraduate, `GRAD` for Graduate)
- Summary text in `content`

## Example MCP Client Config (stdio)

```json
{
  "mcpServers": {
    "tuition-programs": {
      "command": "yarn",
      "args": ["mcp:programs"],
      "env": {
        "PROGRAMS_API_KEY": "REPLACE_ME"
      }
    }
  }
}
```

## Notes

- The MCP server auto-paginates over `allPrograms.nextToken` and returns the full set on each `pull_programs` call.
- `acad_career` is derived from `category.title` first, then falls back to `title` text matching.
- Records missing `code`, `title`, `acad_prog`, or `acad_career` are filtered out.
