/**
 * Input validation functions for MCP tool parameters.
 * All validators return { valid: boolean, error?: string }
 */

const { parseDate } = require('./date-utils');

/**
 * Validate a date string in YYYY-MM-DD format.
 * @param {string} dateString
 * @returns {{ valid: boolean, error?: string }}
 */
function validateDate(dateString) {
  if (!dateString) {
    return { valid: false, error: 'Date is required' };
  }

  if (typeof dateString !== 'string') {
    return { valid: false, error: 'Date must be a string' };
  }

  const date = parseDate(dateString);
  if (!date) {
    return { valid: false, error: 'Invalid date format. Use YYYY-MM-DD' };
  }

  return { valid: true };
}

/**
 * Validate a hex color string (#RRGGBB).
 * @param {string} hexColor
 * @returns {{ valid: boolean, error?: string }}
 */
function validateHexColor(hexColor) {
  if (!hexColor) {
    return { valid: true }; // Optional field
  }

  if (typeof hexColor !== 'string') {
    return { valid: false, error: 'Hex color must be a string' };
  }

  if (!/^#[0-9A-Fa-f]{6}$/.test(hexColor)) {
    return { valid: false, error: 'Invalid hex color. Use #RRGGBB format' };
  }

  return { valid: true };
}

/**
 * Validate a required string field.
 * @param {string} value
 * @param {string} fieldName
 * @returns {{ valid: boolean, error?: string }}
 */
function validateRequiredString(value, fieldName) {
  if (!value) {
    return { valid: false, error: `${fieldName} is required` };
  }

  if (typeof value !== 'string') {
    return { valid: false, error: `${fieldName} must be a string` };
  }

  if (value.trim().length === 0) {
    return { valid: false, error: `${fieldName} cannot be empty` };
  }

  return { valid: true };
}

/**
 * Validate meal planning event creation input.
 * @param {object} params
 * @returns {{ valid: boolean, error?: string }}
 */
function validateEventInput(params) {
  const dateValidation = validateDate(params.date);
  if (!dateValidation.valid) {
    return dateValidation;
  }

  const titleValidation = validateRequiredString(params.title, 'Title');
  if (!titleValidation.valid) {
    return titleValidation;
  }

  return { valid: true };
}

/**
 * Validate meal planning event update input.
 * @param {object} params
 * @returns {{ valid: boolean, error?: string }}
 */
function validateEventUpdateInput(params) {
  const idValidation = validateRequiredString(params.eventId, 'Event ID');
  if (!idValidation.valid) {
    return idValidation;
  }

  // If date is provided, validate it
  if (params.date) {
    const dateValidation = validateDate(params.date);
    if (!dateValidation.valid) {
      return dateValidation;
    }
  }

  return { valid: true };
}

/**
 * Validate label creation input.
 * @param {object} params
 * @returns {{ valid: boolean, error?: string }}
 */
function validateLabelInput(params) {
  const nameValidation = validateRequiredString(params.name, 'Name');
  if (!nameValidation.valid) {
    return nameValidation;
  }

  const colorValidation = validateHexColor(params.hexColor);
  if (!colorValidation.valid) {
    return colorValidation;
  }

  return { valid: true };
}

/**
 * Validate label update input.
 * @param {object} params
 * @returns {{ valid: boolean, error?: string }}
 */
function validateLabelUpdateInput(params) {
  const idValidation = validateRequiredString(params.labelId, 'Label ID');
  if (!idValidation.valid) {
    return idValidation;
  }

  if (params.hexColor) {
    const colorValidation = validateHexColor(params.hexColor);
    if (!colorValidation.valid) {
      return colorValidation;
    }
  }

  return { valid: true };
}

/**
 * Validate shopping list item input.
 * @param {object} params
 * @returns {{ valid: boolean, error?: string }}
 */
function validateListItemInput(params) {
  const listIdValidation = validateRequiredString(params.listId, 'List ID');
  if (!listIdValidation.valid) {
    return listIdValidation;
  }

  const nameValidation = validateRequiredString(params.name, 'Item name');
  if (!nameValidation.valid) {
    return nameValidation;
  }

  return { valid: true };
}

module.exports = {
  validateDate,
  validateHexColor,
  validateRequiredString,
  validateEventInput,
  validateEventUpdateInput,
  validateLabelInput,
  validateLabelUpdateInput,
  validateListItemInput,
};
