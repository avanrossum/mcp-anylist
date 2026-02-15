/**
 * Calendar label tools.
 * CRUD operations for meal planning calendar labels (e.g., Breakfast, Lunch, Dinner).
 */

const { getClient } = require('../lib/anylist-client.js');
const { validateLabelInput, validateLabelUpdateInput, validateRequiredString } = require('../lib/validators.js');
const { formatLabelForResponse, successResponse, errorResponse } = require('../lib/formatters.js');

const toolDefinitions = [
  {
    name: 'anylist_get_labels',
    description: 'Get all meal planning calendar labels (e.g., Breakfast, Lunch, Dinner).',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'anylist_create_label',
    description: 'Create a new calendar label for categorizing meals.',
    inputSchema: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
          description: 'Label name (e.g., "Breakfast", "Dinner", "Snack")',
        },
        hexColor: {
          type: 'string',
          description: 'Hex color code (e.g., "#FF5733")',
        },
      },
      required: ['name'],
    },
  },
  {
    name: 'anylist_update_label',
    description: 'Update an existing calendar label.',
    inputSchema: {
      type: 'object',
      properties: {
        labelId: {
          type: 'string',
          description: 'ID of the label to update',
        },
        name: {
          type: 'string',
          description: 'Updated name',
        },
        hexColor: {
          type: 'string',
          description: 'Updated hex color (e.g., "#FF5733")',
        },
      },
      required: ['labelId'],
    },
  },
  {
    name: 'anylist_delete_label',
    description: 'Delete a calendar label.',
    inputSchema: {
      type: 'object',
      properties: {
        labelId: {
          type: 'string',
          description: 'ID of the label to delete',
        },
      },
      required: ['labelId'],
    },
  },
];

/**
 * Get all calendar labels.
 */
async function handleGetLabels() {
  try {
    const client = await getClient();

    // Labels are loaded with calendar events
    await client.getMealPlanningCalendarEvents();
    const labels = client.mealPlanningCalendarEventLabels || [];

    const formatted = labels.map(formatLabelForResponse);
    return successResponse({
      count: formatted.length,
      labels: formatted,
    });
  } catch (error) {
    console.error('Error getting labels:', error);
    return errorResponse(`Failed to get labels: ${error.message}`);
  }
}

/**
 * Create a new calendar label.
 */
async function handleCreateLabel(params) {
  const validation = validateLabelInput(params);
  if (!validation.valid) {
    return errorResponse(validation.error);
  }

  try {
    const client = await getClient();

    const labelData = {
      name: params.name,
    };

    if (params.hexColor) {
      labelData.hexColor = params.hexColor;
    }

    const label = await client.createLabel(labelData);
    await label.save();

    return successResponse({
      success: true,
      message: 'Label created successfully',
      label: formatLabelForResponse(label),
    });
  } catch (error) {
    console.error('Error creating label:', error);
    return errorResponse(`Failed to create label: ${error.message}`);
  }
}

/**
 * Update an existing calendar label.
 */
async function handleUpdateLabel(params) {
  const validation = validateLabelUpdateInput(params);
  if (!validation.valid) {
    return errorResponse(validation.error);
  }

  try {
    const client = await getClient();

    // Load labels
    await client.getMealPlanningCalendarEvents();
    const labels = client.mealPlanningCalendarEventLabels || [];
    const label = labels.find(l => l.identifier === params.labelId);

    if (!label) {
      return errorResponse(`Label not found: ${params.labelId}`);
    }

    // Apply updates
    if (params.name !== undefined) {
      label.name = params.name;
    }

    if (params.hexColor !== undefined) {
      label.hexColor = params.hexColor;
    }

    await label.save();

    return successResponse({
      success: true,
      message: 'Label updated successfully',
      label: formatLabelForResponse(label),
    });
  } catch (error) {
    console.error('Error updating label:', error);
    return errorResponse(`Failed to update label: ${error.message}`);
  }
}

/**
 * Delete a calendar label.
 */
async function handleDeleteLabel(params) {
  const validation = validateRequiredString(params.labelId, 'Label ID');
  if (!validation.valid) {
    return errorResponse(validation.error);
  }

  try {
    const client = await getClient();

    // Load labels
    await client.getMealPlanningCalendarEvents();
    const labels = client.mealPlanningCalendarEventLabels || [];
    const label = labels.find(l => l.identifier === params.labelId);

    if (!label) {
      return errorResponse(`Label not found: ${params.labelId}`);
    }

    await label.delete();

    return successResponse({
      success: true,
      message: 'Label deleted successfully',
      labelId: params.labelId,
    });
  } catch (error) {
    console.error('Error deleting label:', error);
    return errorResponse(`Failed to delete label: ${error.message}`);
  }
}

const handlers = {
  anylist_get_labels: handleGetLabels,
  anylist_create_label: handleCreateLabel,
  anylist_update_label: handleUpdateLabel,
  anylist_delete_label: handleDeleteLabel,
};

module.exports = { toolDefinitions, handlers };
