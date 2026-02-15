/**
 * Shopping list tools.
 * Operations for shopping lists and items.
 */

const { getClient } = require('../lib/anylist-client.js');
const { validateRequiredString, validateListItemInput } = require('../lib/validators.js');
const { formatListForResponse, formatListWithItems, formatItemForResponse, successResponse, errorResponse } = require('../lib/formatters.js');

const toolDefinitions = [
  {
    name: 'anylist_get_lists',
    description: 'Get all shopping lists.',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'anylist_get_list_items',
    description: 'Get items from a specific shopping list.',
    inputSchema: {
      type: 'object',
      properties: {
        listId: {
          type: 'string',
          description: 'ID of the shopping list',
        },
        includeChecked: {
          type: 'boolean',
          description: 'Include checked-off items (default: false)',
        },
      },
      required: ['listId'],
    },
  },
  {
    name: 'anylist_add_list_item',
    description: 'Add an item to a shopping list.',
    inputSchema: {
      type: 'object',
      properties: {
        listId: {
          type: 'string',
          description: 'ID of the target shopping list',
        },
        name: {
          type: 'string',
          description: 'Item name',
        },
        quantity: {
          type: 'string',
          description: 'Quantity (e.g., "2 lbs", "1 dozen")',
        },
        details: {
          type: 'string',
          description: 'Additional notes',
        },
      },
      required: ['listId', 'name'],
    },
  },
  {
    name: 'anylist_remove_list_item',
    description: 'Remove an item from a shopping list.',
    inputSchema: {
      type: 'object',
      properties: {
        listId: {
          type: 'string',
          description: 'ID of the shopping list',
        },
        itemId: {
          type: 'string',
          description: 'ID of the item to remove',
        },
      },
      required: ['listId', 'itemId'],
    },
  },
];

/**
 * Get all shopping lists.
 */
async function handleGetLists() {
  try {
    const client = await getClient();
    const lists = await client.getLists();

    const formatted = lists.map(formatListForResponse);
    return successResponse({
      count: formatted.length,
      lists: formatted,
    });
  } catch (error) {
    console.error('Error getting lists:', error);
    return errorResponse(`Failed to get lists: ${error.message}`);
  }
}

/**
 * Get items from a specific shopping list.
 */
async function handleGetListItems(params) {
  const validation = validateRequiredString(params.listId, 'List ID');
  if (!validation.valid) {
    return errorResponse(validation.error);
  }

  try {
    const client = await getClient();
    const lists = await client.getLists();
    const list = lists.find(l => l.identifier === params.listId);

    if (!list) {
      return errorResponse(`List not found: ${params.listId}`);
    }

    const includeChecked = params.includeChecked === true;
    const formatted = formatListWithItems(list, includeChecked);

    return successResponse(formatted);
  } catch (error) {
    console.error('Error getting list items:', error);
    return errorResponse(`Failed to get list items: ${error.message}`);
  }
}

/**
 * Add an item to a shopping list.
 */
async function handleAddListItem(params) {
  const validation = validateListItemInput(params);
  if (!validation.valid) {
    return errorResponse(validation.error);
  }

  try {
    const client = await getClient();
    const lists = await client.getLists();
    const list = lists.find(l => l.identifier === params.listId);

    if (!list) {
      return errorResponse(`List not found: ${params.listId}`);
    }

    const itemData = {
      name: params.name,
    };

    if (params.quantity) {
      itemData.quantity = params.quantity;
    }

    if (params.details) {
      itemData.details = params.details;
    }

    const item = client.createItem(itemData);
    await list.addItem(item);

    return successResponse({
      success: true,
      message: 'Item added successfully',
      item: formatItemForResponse(item),
    });
  } catch (error) {
    console.error('Error adding list item:', error);
    return errorResponse(`Failed to add item: ${error.message}`);
  }
}

/**
 * Remove an item from a shopping list.
 */
async function handleRemoveListItem(params) {
  const listIdValidation = validateRequiredString(params.listId, 'List ID');
  if (!listIdValidation.valid) {
    return errorResponse(listIdValidation.error);
  }

  const itemIdValidation = validateRequiredString(params.itemId, 'Item ID');
  if (!itemIdValidation.valid) {
    return errorResponse(itemIdValidation.error);
  }

  try {
    const client = await getClient();
    const lists = await client.getLists();
    const list = lists.find(l => l.identifier === params.listId);

    if (!list) {
      return errorResponse(`List not found: ${params.listId}`);
    }

    const item = list.getItemById(params.itemId);
    if (!item) {
      return errorResponse(`Item not found: ${params.itemId}`);
    }

    await list.removeItem(item);

    return successResponse({
      success: true,
      message: 'Item removed successfully',
      itemId: params.itemId,
    });
  } catch (error) {
    console.error('Error removing list item:', error);
    return errorResponse(`Failed to remove item: ${error.message}`);
  }
}

const handlers = {
  anylist_get_lists: handleGetLists,
  anylist_get_list_items: handleGetListItems,
  anylist_add_list_item: handleAddListItem,
  anylist_remove_list_item: handleRemoveListItem,
};

module.exports = { toolDefinitions, handlers };
