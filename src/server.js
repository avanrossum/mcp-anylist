/**
 * MCP Server setup for AnyList.
 * Registers all tools and handles protocol communication.
 */

const { Server } = require('@modelcontextprotocol/sdk/server/index.js');
const { CallToolRequestSchema, ListToolsRequestSchema } = require('@modelcontextprotocol/sdk/types.js');
const { getAllTools, getHandler } = require('./tools/index.js');
const { disconnect } = require('./lib/anylist-client.js');

/**
 * Create and configure the MCP server.
 * @returns {Server}
 */
function createServer() {
  const server = new Server(
    {
      name: 'mcp-anylist',
      version: '0.1.0',
    },
    {
      capabilities: {
        tools: {},
      },
    }
  );

  // Handle tool listing
  server.setRequestHandler(ListToolsRequestSchema, async () => {
    return {
      tools: getAllTools(),
    };
  });

  // Handle tool execution
  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;
    const handler = getHandler(name);

    if (!handler) {
      return {
        isError: true,
        content: [{
          type: 'text',
          text: `Unknown tool: ${name}`,
        }],
      };
    }

    try {
      return await handler(args || {});
    } catch (error) {
      console.error(`Error in tool ${name}:`, error);
      return {
        isError: true,
        content: [{
          type: 'text',
          text: `Tool error: ${error.message}`,
        }],
      };
    }
  });

  // Cleanup on close
  server.onclose = () => {
    disconnect();
  };

  return server;
}

module.exports = { createServer };
