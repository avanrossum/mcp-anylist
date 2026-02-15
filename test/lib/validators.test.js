import { describe, it, expect } from 'vitest';
import {
  validateDate,
  validateHexColor,
  validateRequiredString,
  validateEventInput,
  validateEventUpdateInput,
  validateLabelInput,
  validateLabelUpdateInput,
  validateListItemInput,
} from '../../src/lib/validators.js';

describe('validateDate', () => {
  it('accepts valid YYYY-MM-DD format', () => {
    expect(validateDate('2024-03-15')).toEqual({ valid: true });
    expect(validateDate('2024-01-01')).toEqual({ valid: true });
    expect(validateDate('2024-12-31')).toEqual({ valid: true });
  });

  it('rejects missing date', () => {
    const result = validateDate(null);
    expect(result.valid).toBe(false);
    expect(result.error).toContain('required');
  });

  it('rejects non-string date', () => {
    const result = validateDate(123);
    expect(result.valid).toBe(false);
    expect(result.error).toContain('string');
  });

  it('rejects invalid format', () => {
    const result = validateDate('03/15/2024');
    expect(result.valid).toBe(false);
    expect(result.error).toContain('YYYY-MM-DD');
  });
});

describe('validateHexColor', () => {
  it('accepts valid hex colors', () => {
    expect(validateHexColor('#FF5733')).toEqual({ valid: true });
    expect(validateHexColor('#ffffff')).toEqual({ valid: true });
    expect(validateHexColor('#000000')).toEqual({ valid: true });
  });

  it('accepts null/undefined (optional field)', () => {
    expect(validateHexColor(null)).toEqual({ valid: true });
    expect(validateHexColor(undefined)).toEqual({ valid: true });
  });

  it('rejects invalid formats', () => {
    expect(validateHexColor('#fff').valid).toBe(false); // Too short
    expect(validateHexColor('FF5733').valid).toBe(false); // Missing #
    expect(validateHexColor('#GGGGGG').valid).toBe(false); // Invalid chars
    expect(validateHexColor('#FF57333').valid).toBe(false); // Too long
  });

  it('rejects non-string input', () => {
    const result = validateHexColor(123);
    expect(result.valid).toBe(false);
    expect(result.error).toContain('string');
  });
});

describe('validateRequiredString', () => {
  it('accepts valid strings', () => {
    expect(validateRequiredString('hello', 'Field')).toEqual({ valid: true });
    expect(validateRequiredString('  hello  ', 'Field')).toEqual({ valid: true });
  });

  it('rejects missing values', () => {
    const result = validateRequiredString(null, 'Field');
    expect(result.valid).toBe(false);
    expect(result.error).toContain('Field');
    expect(result.error).toContain('required');
  });

  it('rejects empty strings', () => {
    const result = validateRequiredString('   ', 'Field');
    expect(result.valid).toBe(false);
    expect(result.error).toContain('empty');
  });

  it('rejects non-string values', () => {
    const result = validateRequiredString(123, 'Field');
    expect(result.valid).toBe(false);
    expect(result.error).toContain('string');
  });
});

describe('validateEventInput', () => {
  it('accepts valid event input', () => {
    const result = validateEventInput({
      date: '2024-03-15',
      title: 'Dinner',
    });
    expect(result).toEqual({ valid: true });
  });

  it('accepts event with optional fields', () => {
    const result = validateEventInput({
      date: '2024-03-15',
      title: 'Dinner',
      details: 'Make pasta',
      labelId: 'label123',
      recipeId: 'recipe456',
    });
    expect(result).toEqual({ valid: true });
  });

  it('rejects missing date', () => {
    const result = validateEventInput({ title: 'Dinner' });
    expect(result.valid).toBe(false);
    expect(result.error).toContain('Date');
  });

  it('rejects missing title', () => {
    const result = validateEventInput({ date: '2024-03-15' });
    expect(result.valid).toBe(false);
    expect(result.error).toContain('Title');
  });

  it('rejects invalid date format', () => {
    const result = validateEventInput({
      date: 'invalid',
      title: 'Dinner',
    });
    expect(result.valid).toBe(false);
    expect(result.error).toContain('YYYY-MM-DD');
  });
});

describe('validateEventUpdateInput', () => {
  it('accepts valid update input', () => {
    const result = validateEventUpdateInput({
      eventId: 'event123',
      title: 'Updated Title',
    });
    expect(result).toEqual({ valid: true });
  });

  it('accepts eventId only', () => {
    const result = validateEventUpdateInput({ eventId: 'event123' });
    expect(result).toEqual({ valid: true });
  });

  it('rejects missing eventId', () => {
    const result = validateEventUpdateInput({ title: 'Updated' });
    expect(result.valid).toBe(false);
    expect(result.error).toContain('Event ID');
  });

  it('validates date if provided', () => {
    const result = validateEventUpdateInput({
      eventId: 'event123',
      date: 'invalid',
    });
    expect(result.valid).toBe(false);
    expect(result.error).toContain('YYYY-MM-DD');
  });
});

describe('validateLabelInput', () => {
  it('accepts valid label input', () => {
    const result = validateLabelInput({ name: 'Breakfast' });
    expect(result).toEqual({ valid: true });
  });

  it('accepts label with color', () => {
    const result = validateLabelInput({
      name: 'Breakfast',
      hexColor: '#FF5733',
    });
    expect(result).toEqual({ valid: true });
  });

  it('rejects missing name', () => {
    const result = validateLabelInput({});
    expect(result.valid).toBe(false);
    expect(result.error).toContain('Name');
  });

  it('rejects invalid color format', () => {
    const result = validateLabelInput({
      name: 'Breakfast',
      hexColor: 'red',
    });
    expect(result.valid).toBe(false);
    expect(result.error).toContain('hex');
  });
});

describe('validateLabelUpdateInput', () => {
  it('accepts valid update input', () => {
    const result = validateLabelUpdateInput({
      labelId: 'label123',
      name: 'Updated Name',
    });
    expect(result).toEqual({ valid: true });
  });

  it('rejects missing labelId', () => {
    const result = validateLabelUpdateInput({ name: 'Updated' });
    expect(result.valid).toBe(false);
    expect(result.error).toContain('Label ID');
  });

  it('validates hexColor if provided', () => {
    const result = validateLabelUpdateInput({
      labelId: 'label123',
      hexColor: 'invalid',
    });
    expect(result.valid).toBe(false);
    expect(result.error).toContain('hex');
  });
});

describe('validateListItemInput', () => {
  it('accepts valid item input', () => {
    const result = validateListItemInput({
      listId: 'list123',
      name: 'Milk',
    });
    expect(result).toEqual({ valid: true });
  });

  it('rejects missing listId', () => {
    const result = validateListItemInput({ name: 'Milk' });
    expect(result.valid).toBe(false);
    expect(result.error).toContain('List ID');
  });

  it('rejects missing name', () => {
    const result = validateListItemInput({ listId: 'list123' });
    expect(result.valid).toBe(false);
    expect(result.error).toContain('Item name');
  });
});
