#!/usr/bin/env node

/**
 * MCP server entry point for AnyList.
 * Connects via STDIO transport for Claude Desktop integration.
 *
 * Usage:
 *   npx mcp-anylist          # Run MCP server
 *   npx mcp-anylist --setup  # Configure credentials interactively
 */

const { StdioServerTransport } = require('@modelcontextprotocol/sdk/server/stdio.js');
const { createServer } = require('./server.js');

async function main() {
  const args = process.argv.slice(2);

  // Handle --setup flag
  if (args.includes('--setup') || args.includes('-s')) {
    const { runSetup } = require('./setup.js');
    await runSetup();
    return;
  }

  // Handle --help flag
  if (args.includes('--help') || args.includes('-h')) {
    console.log('');
    console.log('mcp-anylist - MCP server for AnyList meal planning');
    console.log('');
    console.log('Usage:');
    console.log('  npx mcp-anylist          Run the MCP server');
    console.log('  npx mcp-anylist --setup  Configure AnyList credentials');
    console.log('  npx mcp-anylist --help   Show this help message');
    console.log('');
    return;
  }

  // Run MCP server
  const server = createServer();
  const transport = new StdioServerTransport();

  await server.connect(transport);

  // Log to stderr (stdout is reserved for MCP protocol)
  console.error('mcp-anylist server started');
}

main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
