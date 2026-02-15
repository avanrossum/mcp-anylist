/**
 * Recipe tools.
 * Read-only access to recipes and recipe collections.
 */

const { getClient } = require('../lib/anylist-client.js');
const { formatRecipeForResponse, formatRecipeCollectionForResponse, successResponse, errorResponse } = require('../lib/formatters.js');

const toolDefinitions = [
  {
    name: 'anylist_get_recipes',
    description: 'Get all recipes. Optionally filter by name search or collection.',
    inputSchema: {
      type: 'object',
      properties: {
        search: {
          type: 'string',
          description: 'Search term to filter recipes by name (case-insensitive)',
        },
        collectionId: {
          type: 'string',
          description: 'Filter by recipe collection ID',
        },
      },
    },
  },
  {
    name: 'anylist_get_recipe_collections',
    description: 'Get all recipe collections.',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
];

/**
 * Get recipes with optional filtering.
 */
async function handleGetRecipes(params) {
  try {
    const client = await getClient();
    const recipes = await client.getRecipes();

    let filtered = recipes;

    // Filter by search term
    if (params.search) {
      const searchLower = params.search.toLowerCase();
      filtered = filtered.filter(recipe =>
        recipe.name && recipe.name.toLowerCase().includes(searchLower)
      );
    }

    // Filter by collection
    if (params.collectionId) {
      const collections = await client.getRecipeCollections();
      const collection = collections.find(c => c.identifier === params.collectionId);

      if (!collection) {
        return errorResponse(`Collection not found: ${params.collectionId}`);
      }

      const recipeIds = new Set(collection.recipeIds || []);
      filtered = filtered.filter(recipe => recipeIds.has(recipe.identifier));
    }

    const formatted = filtered.map(formatRecipeForResponse);
    return successResponse({
      count: formatted.length,
      recipes: formatted,
    });
  } catch (error) {
    console.error('Error getting recipes:', error);
    return errorResponse(`Failed to get recipes: ${error.message}`);
  }
}

/**
 * Get all recipe collections.
 */
async function handleGetRecipeCollections() {
  try {
    const client = await getClient();
    const collections = await client.getRecipeCollections();

    const formatted = collections.map(formatRecipeCollectionForResponse);
    return successResponse({
      count: formatted.length,
      collections: formatted,
    });
  } catch (error) {
    console.error('Error getting recipe collections:', error);
    return errorResponse(`Failed to get collections: ${error.message}`);
  }
}

const handlers = {
  anylist_get_recipes: handleGetRecipes,
  anylist_get_recipe_collections: handleGetRecipeCollections,
};

module.exports = { toolDefinitions, handlers };
