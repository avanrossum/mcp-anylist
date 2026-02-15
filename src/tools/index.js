/**
 * Tool aggregation module.
 * Combines all tool definitions and handlers from domain modules.
 */

const mealPlanning = require('./meal-planning.js');
const labels = require('./labels.js');
const recipes = require('./recipes.js');
const shoppingLists = require('./shopping-lists.js');

// Combine all tool definitions
const allToolDefinitions = [
  ...mealPlanning.toolDefinitions,
  ...labels.toolDefinitions,
  ...recipes.toolDefinitions,
  ...shoppingLists.toolDefinitions,
];

// Combine all handlers
const allHandlers = {
  ...mealPlanning.handlers,
  ...labels.handlers,
  ...recipes.handlers,
  ...shoppingLists.handlers,
};

/**
 * Get all tool definitions for MCP registration.
 * @returns {Array}
 */
function getAllTools() {
  return allToolDefinitions;
}

/**
 * Get a handler function by tool name.
 * @param {string} name - Tool name
 * @returns {Function|undefined}
 */
function getHandler(name) {
  return allHandlers[name];
}

module.exports = { getAllTools, getHandler };
