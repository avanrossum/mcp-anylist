/**
 * Date parsing and formatting utilities.
 * All dates use YYYY-MM-DD format for consistency with AnyList API.
 */

/**
 * Parse a YYYY-MM-DD string into a Date object.
 * Returns null for invalid input.
 * @param {string} dateString - Date in YYYY-MM-DD format
 * @returns {Date|null}
 */
function parseDate(dateString) {
  if (!dateString || typeof dateString !== 'string') {
    return null;
  }

  const match = dateString.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) {
    return null;
  }

  const [, year, month, day] = match;
  const date = new Date(Number(year), Number(month) - 1, Number(day));

  // Validate the date is real (e.g., not Feb 30)
  if (
    date.getFullYear() !== Number(year) ||
    date.getMonth() !== Number(month) - 1 ||
    date.getDate() !== Number(day)
  ) {
    return null;
  }

  return date;
}

/**
 * Convert a Date object to YYYY-MM-DD string.
 * @param {Date} date
 * @returns {string}
 */
function toISODateString(date) {
  if (!(date instanceof Date) || Number.isNaN(date.getTime())) {
    return '';
  }

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Check if a date falls within a range (inclusive).
 * @param {Date} date - Date to check
 * @param {Date} start - Range start
 * @param {Date} end - Range end
 * @returns {boolean}
 */
function isWithinRange(date, start, end) {
  if (!date || !start || !end) {
    return false;
  }

  const time = date.getTime();
  return time >= start.getTime() && time <= end.getTime();
}

/**
 * Get today's date as a Date object (midnight local time).
 * @returns {Date}
 */
function today() {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
}

/**
 * Add days to a date.
 * @param {Date} date - Starting date
 * @param {number} days - Number of days to add (can be negative)
 * @returns {Date}
 */
function addDays(date, days) {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

module.exports = {
  parseDate,
  toISODateString,
  isWithinRange,
  today,
  addDays,
};
