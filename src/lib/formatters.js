/**
 * Response formatting functions for MCP tool results.
 * Transforms AnyList objects into clean JSON structures.
 */

const { toISODateString } = require('./date-utils');

/**
 * Format a meal planning event for response.
 * @param {object} event - MealPlanningCalendarEvent instance
 * @returns {object}
 */
function formatEventForResponse(event) {
  return {
    id: event.identifier,
    date: formatDateValue(event.date),
    title: event.title || '',
    details: event.details || '',
    labelId: event.labelId || null,
    label: event.label ? formatLabelForResponse(event.label) : null,
    recipeId: event.recipeId || null,
    recipe: event.recipe ? formatRecipeSummary(event.recipe) : null,
  };
}

/**
 * Format a calendar label for response.
 * @param {object} label - MealPlanningCalendarEventLabel instance
 * @returns {object}
 */
function formatLabelForResponse(label) {
  return {
    id: label.identifier,
    name: label.name || '',
    hexColor: label.hexColor || null,
    sortIndex: label.sortIndex ?? 0,
  };
}

/**
 * Format a recipe summary (minimal info for event responses).
 * @param {object} recipe - Recipe instance
 * @returns {object}
 */
function formatRecipeSummary(recipe) {
  return {
    id: recipe.identifier,
    name: recipe.name || '',
  };
}

/**
 * Format a full recipe for response.
 * @param {object} recipe - Recipe instance
 * @returns {object}
 */
function formatRecipeForResponse(recipe) {
  return {
    id: recipe.identifier,
    name: recipe.name || '',
    note: recipe.note || '',
    sourceName: recipe.sourceName || '',
    sourceUrl: recipe.sourceUrl || '',
    prepTime: recipe.prepTime || null,
    cookTime: recipe.cookTime || null,
    servings: recipe.servings || '',
    rating: recipe.rating || null,
    ingredients: (recipe.ingredients || []).map(formatIngredient),
    preparationSteps: recipe.preparationSteps || [],
  };
}

/**
 * Format a recipe ingredient.
 * @param {object} ingredient
 * @returns {object}
 */
function formatIngredient(ingredient) {
  return {
    raw: ingredient.rawIngredient || '',
    name: ingredient.name || '',
    quantity: ingredient.quantity || '',
    note: ingredient.note || '',
  };
}

/**
 * Format a recipe collection for response.
 * @param {object} collection - RecipeCollection instance
 * @returns {object}
 */
function formatRecipeCollectionForResponse(collection) {
  return {
    id: collection.identifier,
    name: collection.name || '',
    recipeIds: collection.recipeIds || [],
    recipeCount: (collection.recipeIds || []).length,
  };
}

/**
 * Format a shopping list for response.
 * @param {object} list - List instance
 * @returns {object}
 */
function formatListForResponse(list) {
  return {
    id: list.identifier,
    name: list.name || '',
    itemCount: (list.items || []).length,
  };
}

/**
 * Format a shopping list with items.
 * @param {object} list - List instance
 * @param {boolean} includeChecked - Include checked items
 * @returns {object}
 */
function formatListWithItems(list, includeChecked = false) {
  let items = list.items || [];
  if (!includeChecked) {
    items = items.filter(item => !item.checked);
  }

  return {
    id: list.identifier,
    name: list.name || '',
    items: items.map(formatItemForResponse),
  };
}

/**
 * Format a shopping list item for response.
 * @param {object} item - Item instance
 * @returns {object}
 */
function formatItemForResponse(item) {
  return {
    id: item.identifier,
    name: item.name || '',
    quantity: item.quantity || '',
    details: item.details || '',
    checked: item.checked || false,
  };
}

/**
 * Format a date value (handles Date objects and strings).
 * @param {Date|string} date
 * @returns {string}
 */
function formatDateValue(date) {
  if (!date) {
    return '';
  }

  if (date instanceof Date) {
    return toISODateString(date);
  }

  if (typeof date === 'string') {
    return date;
  }

  return '';
}

/**
 * Create a success response for MCP tools.
 * @param {object} data
 * @returns {object}
 */
function successResponse(data) {
  return {
    content: [{
      type: 'text',
      text: JSON.stringify(data, null, 2),
    }],
  };
}

/**
 * Create an error response for MCP tools.
 * @param {string} message
 * @returns {object}
 */
function errorResponse(message) {
  return {
    isError: true,
    content: [{
      type: 'text',
      text: message,
    }],
  };
}

module.exports = {
  formatEventForResponse,
  formatLabelForResponse,
  formatRecipeSummary,
  formatRecipeForResponse,
  formatIngredient,
  formatRecipeCollectionForResponse,
  formatListForResponse,
  formatListWithItems,
  formatItemForResponse,
  formatDateValue,
  successResponse,
  errorResponse,
};
