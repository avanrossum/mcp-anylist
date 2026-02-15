import { describe, it, expect } from 'vitest';
import { parseDate, toISODateString, isWithinRange, today, addDays } from '../../src/lib/date-utils.js';

describe('parseDate', () => {
  it('parses valid YYYY-MM-DD strings', () => {
    const date = parseDate('2024-03-15');
    expect(date).toBeInstanceOf(Date);
    expect(date.getFullYear()).toBe(2024);
    expect(date.getMonth()).toBe(2); // 0-indexed
    expect(date.getDate()).toBe(15);
  });

  it('returns null for invalid format', () => {
    expect(parseDate('03/15/2024')).toBeNull();
    expect(parseDate('March 15, 2024')).toBeNull();
    expect(parseDate('2024-3-15')).toBeNull();
    expect(parseDate('2024-03-5')).toBeNull();
  });

  it('returns null for invalid dates', () => {
    expect(parseDate('2024-02-30')).toBeNull(); // Feb 30 doesn't exist
    expect(parseDate('2024-13-01')).toBeNull(); // Month 13 doesn't exist
    expect(parseDate('2024-00-01')).toBeNull(); // Month 0 doesn't exist
  });

  it('handles null and undefined', () => {
    expect(parseDate(null)).toBeNull();
    expect(parseDate(undefined)).toBeNull();
    expect(parseDate('')).toBeNull();
  });

  it('handles non-string input', () => {
    expect(parseDate(123)).toBeNull();
    expect(parseDate({})).toBeNull();
    expect(parseDate([])).toBeNull();
  });
});

describe('toISODateString', () => {
  it('formats Date objects correctly', () => {
    const date = new Date(2024, 2, 15); // March 15, 2024
    expect(toISODateString(date)).toBe('2024-03-15');
  });

  it('pads single-digit months and days', () => {
    const date = new Date(2024, 0, 5); // Jan 5, 2024
    expect(toISODateString(date)).toBe('2024-01-05');
  });

  it('returns empty string for invalid input', () => {
    expect(toISODateString(null)).toBe('');
    expect(toISODateString(undefined)).toBe('');
    expect(toISODateString('not a date')).toBe('');
    expect(toISODateString(new Date('invalid'))).toBe('');
  });
});

describe('isWithinRange', () => {
  const start = new Date(2024, 2, 1);  // March 1
  const end = new Date(2024, 2, 31);   // March 31

  it('returns true when date is within range', () => {
    const date = new Date(2024, 2, 15);
    expect(isWithinRange(date, start, end)).toBe(true);
  });

  it('includes boundary dates', () => {
    expect(isWithinRange(start, start, end)).toBe(true);
    expect(isWithinRange(end, start, end)).toBe(true);
  });

  it('returns false when date is outside range', () => {
    const before = new Date(2024, 1, 28); // Feb 28
    const after = new Date(2024, 3, 1);   // April 1
    expect(isWithinRange(before, start, end)).toBe(false);
    expect(isWithinRange(after, start, end)).toBe(false);
  });

  it('returns false for null inputs', () => {
    expect(isWithinRange(null, start, end)).toBe(false);
    expect(isWithinRange(start, null, end)).toBe(false);
    expect(isWithinRange(start, start, null)).toBe(false);
  });
});

describe('today', () => {
  it('returns a Date object at midnight', () => {
    const result = today();
    expect(result).toBeInstanceOf(Date);
    expect(result.getHours()).toBe(0);
    expect(result.getMinutes()).toBe(0);
    expect(result.getSeconds()).toBe(0);
  });
});

describe('addDays', () => {
  it('adds positive days', () => {
    const date = new Date(2024, 2, 15);
    const result = addDays(date, 5);
    expect(result.getDate()).toBe(20);
  });

  it('subtracts with negative days', () => {
    const date = new Date(2024, 2, 15);
    const result = addDays(date, -5);
    expect(result.getDate()).toBe(10);
  });

  it('handles month boundaries', () => {
    const date = new Date(2024, 2, 30); // March 30
    const result = addDays(date, 5);
    expect(result.getMonth()).toBe(3); // April
    expect(result.getDate()).toBe(4);
  });

  it('does not modify original date', () => {
    const date = new Date(2024, 2, 15);
    const original = date.getTime();
    addDays(date, 5);
    expect(date.getTime()).toBe(original);
  });
});
