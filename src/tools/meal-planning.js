/**
 * Meal planning calendar event tools.
 * CRUD operations for meal planning calendar events.
 */

const { getClient } = require('../lib/anylist-client.js');
const { validateEventInput, validateEventUpdateInput, validateRequiredString } = require('../lib/validators.js');
const { formatEventForResponse, successResponse, errorResponse } = require('../lib/formatters.js');
const { parseDate, isWithinRange } = require('../lib/date-utils.js');

const toolDefinitions = [
  {
    name: 'anylist_get_meal_planning_events',
    description: 'Get meal planning calendar events. Optionally filter by date range.',
    inputSchema: {
      type: 'object',
      properties: {
        startDate: {
          type: 'string',
          description: 'Start date filter (YYYY-MM-DD). Events on or after this date.',
        },
        endDate: {
          type: 'string',
          description: 'End date filter (YYYY-MM-DD). Events on or before this date.',
        },
      },
    },
  },
  {
    name: 'anylist_create_meal_planning_event',
    description: 'Create a new meal planning calendar event. Use this to add meals to the calendar.',
    inputSchema: {
      type: 'object',
      properties: {
        date: {
          type: 'string',
          description: 'Event date (YYYY-MM-DD)',
        },
        title: {
          type: 'string',
          description: 'Event title (e.g., meal name)',
        },
        details: {
          type: 'string',
          description: 'Additional notes or details',
        },
        labelId: {
          type: 'string',
          description: 'ID of a calendar label to apply (e.g., Breakfast, Lunch, Dinner)',
        },
        recipeId: {
          type: 'string',
          description: 'ID of a linked recipe',
        },
      },
      required: ['date', 'title'],
    },
  },
  {
    name: 'anylist_update_meal_planning_event',
    description: 'Update an existing meal planning calendar event.',
    inputSchema: {
      type: 'object',
      properties: {
        eventId: {
          type: 'string',
          description: 'ID of the event to update',
        },
        date: {
          type: 'string',
          description: 'New date (YYYY-MM-DD)',
        },
        title: {
          type: 'string',
          description: 'Updated title',
        },
        details: {
          type: 'string',
          description: 'Updated details',
        },
        labelId: {
          type: 'string',
          description: 'Updated label ID',
        },
        recipeId: {
          type: 'string',
          description: 'Updated recipe ID',
        },
      },
      required: ['eventId'],
    },
  },
  {
    name: 'anylist_delete_meal_planning_event',
    description: 'Delete a meal planning calendar event.',
    inputSchema: {
      type: 'object',
      properties: {
        eventId: {
          type: 'string',
          description: 'ID of the event to delete',
        },
      },
      required: ['eventId'],
    },
  },
];

/**
 * Get meal planning events with optional date filtering.
 */
async function handleGetMealPlanningEvents(params) {
  try {
    const client = await getClient();
    const events = await client.getMealPlanningCalendarEvents();

    let filtered = events;

    // Apply date filters if provided
    const startDate = params.startDate ? parseDate(params.startDate) : null;
    const endDate = params.endDate ? parseDate(params.endDate) : null;

    if (startDate || endDate) {
      filtered = events.filter(event => {
        const eventDate = event.date instanceof Date ? event.date : parseDate(event.date);
        if (!eventDate) return false;

        if (startDate && endDate) {
          return isWithinRange(eventDate, startDate, endDate);
        }

        if (startDate) {
          return eventDate >= startDate;
        }

        if (endDate) {
          return eventDate <= endDate;
        }

        return true;
      });
    }

    const formatted = filtered.map(formatEventForResponse);
    return successResponse({
      count: formatted.length,
      events: formatted,
    });
  } catch (error) {
    console.error('Error getting meal planning events:', error);
    return errorResponse(`Failed to get events: ${error.message}`);
  }
}

/**
 * Create a new meal planning event.
 */
async function handleCreateMealPlanningEvent(params) {
  const validation = validateEventInput(params);
  if (!validation.valid) {
    return errorResponse(validation.error);
  }

  try {
    const client = await getClient();

    const eventData = {
      date: parseDate(params.date),
      title: params.title,
    };

    if (params.details) {
      eventData.details = params.details;
    }

    if (params.labelId) {
      eventData.labelId = params.labelId;
    }

    if (params.recipeId) {
      eventData.recipeId = params.recipeId;
    }

    const event = await client.createEvent(eventData);
    await event.save();

    return successResponse({
      success: true,
      message: 'Event created successfully',
      event: formatEventForResponse(event),
    });
  } catch (error) {
    console.error('Error creating meal planning event:', error);
    return errorResponse(`Failed to create event: ${error.message}`);
  }
}

/**
 * Update an existing meal planning event.
 */
async function handleUpdateMealPlanningEvent(params) {
  const validation = validateEventUpdateInput(params);
  if (!validation.valid) {
    return errorResponse(validation.error);
  }

  try {
    const client = await getClient();
    const events = await client.getMealPlanningCalendarEvents();
    const event = events.find(e => e.identifier === params.eventId);

    if (!event) {
      return errorResponse(`Event not found: ${params.eventId}`);
    }

    // Apply updates
    if (params.date) {
      event.date = parseDate(params.date);
    }

    if (params.title !== undefined) {
      event.title = params.title;
    }

    if (params.details !== undefined) {
      event.details = params.details;
    }

    if (params.labelId !== undefined) {
      event.labelId = params.labelId;
    }

    if (params.recipeId !== undefined) {
      event.recipeId = params.recipeId;
    }

    await event.save();

    return successResponse({
      success: true,
      message: 'Event updated successfully',
      event: formatEventForResponse(event),
    });
  } catch (error) {
    console.error('Error updating meal planning event:', error);
    return errorResponse(`Failed to update event: ${error.message}`);
  }
}

/**
 * Delete a meal planning event.
 */
async function handleDeleteMealPlanningEvent(params) {
  const validation = validateRequiredString(params.eventId, 'Event ID');
  if (!validation.valid) {
    return errorResponse(validation.error);
  }

  try {
    const client = await getClient();
    const events = await client.getMealPlanningCalendarEvents();
    const event = events.find(e => e.identifier === params.eventId);

    if (!event) {
      return errorResponse(`Event not found: ${params.eventId}`);
    }

    await event.delete();

    return successResponse({
      success: true,
      message: 'Event deleted successfully',
      eventId: params.eventId,
    });
  } catch (error) {
    console.error('Error deleting meal planning event:', error);
    return errorResponse(`Failed to delete event: ${error.message}`);
  }
}

const handlers = {
  anylist_get_meal_planning_events: handleGetMealPlanningEvents,
  anylist_create_meal_planning_event: handleCreateMealPlanningEvent,
  anylist_update_meal_planning_event: handleUpdateMealPlanningEvent,
  anylist_delete_meal_planning_event: handleDeleteMealPlanningEvent,
};

module.exports = { toolDefinitions, handlers };
