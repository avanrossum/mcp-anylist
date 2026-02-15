import { describe, it, expect } from 'vitest';
import {
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
} from '../../src/lib/formatters.js';

describe('formatEventForResponse', () => {
  it('formats event with all fields', () => {
    const event = {
      identifier: 'evt_123',
      date: new Date(2024, 2, 15),
      title: 'Dinner',
      details: 'Make pasta',
      labelId: 'lbl_1',
      label: { identifier: 'lbl_1', name: 'Dinner', hexColor: '#FF0000' },
      recipeId: 'rec_1',
      recipe: { identifier: 'rec_1', name: 'Spaghetti' },
    };

    const result = formatEventForResponse(event);

    expect(result.id).toBe('evt_123');
    expect(result.date).toBe('2024-03-15');
    expect(result.title).toBe('Dinner');
    expect(result.details).toBe('Make pasta');
    expect(result.labelId).toBe('lbl_1');
    expect(result.label.name).toBe('Dinner');
    expect(result.recipeId).toBe('rec_1');
    expect(result.recipe.name).toBe('Spaghetti');
  });

  it('handles events without optional fields', () => {
    const event = {
      identifier: 'evt_123',
      date: '2024-03-15',
      title: 'Quick meal',
    };

    const result = formatEventForResponse(event);

    expect(result.id).toBe('evt_123');
    expect(result.title).toBe('Quick meal');
    expect(result.details).toBe('');
    expect(result.label).toBeNull();
    expect(result.recipe).toBeNull();
  });
});

describe('formatLabelForResponse', () => {
  it('formats label with all fields', () => {
    const label = {
      identifier: 'lbl_1',
      name: 'Breakfast',
      hexColor: '#FFD700',
      sortIndex: 0,
    };

    const result = formatLabelForResponse(label);

    expect(result.id).toBe('lbl_1');
    expect(result.name).toBe('Breakfast');
    expect(result.hexColor).toBe('#FFD700');
    expect(result.sortIndex).toBe(0);
  });

  it('handles missing optional fields', () => {
    const label = { identifier: 'lbl_1' };

    const result = formatLabelForResponse(label);

    expect(result.name).toBe('');
    expect(result.hexColor).toBeNull();
    expect(result.sortIndex).toBe(0);
  });
});

describe('formatRecipeSummary', () => {
  it('formats recipe summary', () => {
    const recipe = {
      identifier: 'rec_1',
      name: 'Pasta Carbonara',
    };

    const result = formatRecipeSummary(recipe);

    expect(result.id).toBe('rec_1');
    expect(result.name).toBe('Pasta Carbonara');
  });
});

describe('formatRecipeForResponse', () => {
  it('formats full recipe', () => {
    const recipe = {
      identifier: 'rec_1',
      name: 'Pasta Carbonara',
      note: 'Family favorite',
      sourceName: 'Mom',
      sourceUrl: 'https://example.com',
      prepTime: 15,
      cookTime: 20,
      servings: '4',
      rating: 5,
      ingredients: [
        { rawIngredient: '200g pasta', name: 'pasta', quantity: '200g' },
      ],
      preparationSteps: ['Boil pasta', 'Make sauce'],
    };

    const result = formatRecipeForResponse(recipe);

    expect(result.id).toBe('rec_1');
    expect(result.name).toBe('Pasta Carbonara');
    expect(result.note).toBe('Family favorite');
    expect(result.prepTime).toBe(15);
    expect(result.cookTime).toBe(20);
    expect(result.servings).toBe('4');
    expect(result.rating).toBe(5);
    expect(result.ingredients).toHaveLength(1);
    expect(result.preparationSteps).toHaveLength(2);
  });

  it('handles missing optional fields', () => {
    const recipe = { identifier: 'rec_1' };

    const result = formatRecipeForResponse(recipe);

    expect(result.name).toBe('');
    expect(result.prepTime).toBeNull();
    expect(result.ingredients).toEqual([]);
    expect(result.preparationSteps).toEqual([]);
  });
});

describe('formatIngredient', () => {
  it('formats ingredient with all fields', () => {
    const ingredient = {
      rawIngredient: '2 cups flour',
      name: 'flour',
      quantity: '2 cups',
      note: 'sifted',
    };

    const result = formatIngredient(ingredient);

    expect(result.raw).toBe('2 cups flour');
    expect(result.name).toBe('flour');
    expect(result.quantity).toBe('2 cups');
    expect(result.note).toBe('sifted');
  });
});

describe('formatRecipeCollectionForResponse', () => {
  it('formats collection with recipes', () => {
    const collection = {
      identifier: 'col_1',
      name: 'Italian',
      recipeIds: ['rec_1', 'rec_2', 'rec_3'],
    };

    const result = formatRecipeCollectionForResponse(collection);

    expect(result.id).toBe('col_1');
    expect(result.name).toBe('Italian');
    expect(result.recipeIds).toHaveLength(3);
    expect(result.recipeCount).toBe(3);
  });
});

describe('formatListForResponse', () => {
  it('formats list with item count', () => {
    const list = {
      identifier: 'list_1',
      name: 'Groceries',
      items: [{}, {}, {}],
    };

    const result = formatListForResponse(list);

    expect(result.id).toBe('list_1');
    expect(result.name).toBe('Groceries');
    expect(result.itemCount).toBe(3);
  });
});

describe('formatListWithItems', () => {
  it('includes unchecked items by default', () => {
    const list = {
      identifier: 'list_1',
      name: 'Groceries',
      items: [
        { identifier: 'item_1', name: 'Milk', checked: false },
        { identifier: 'item_2', name: 'Bread', checked: true },
        { identifier: 'item_3', name: 'Eggs', checked: false },
      ],
    };

    const result = formatListWithItems(list, false);

    expect(result.items).toHaveLength(2);
    expect(result.items.map(i => i.name)).toEqual(['Milk', 'Eggs']);
  });

  it('includes checked items when requested', () => {
    const list = {
      identifier: 'list_1',
      name: 'Groceries',
      items: [
        { identifier: 'item_1', name: 'Milk', checked: false },
        { identifier: 'item_2', name: 'Bread', checked: true },
      ],
    };

    const result = formatListWithItems(list, true);

    expect(result.items).toHaveLength(2);
  });
});

describe('formatItemForResponse', () => {
  it('formats item with all fields', () => {
    const item = {
      identifier: 'item_1',
      name: 'Milk',
      quantity: '1 gallon',
      details: 'Whole milk',
      checked: false,
    };

    const result = formatItemForResponse(item);

    expect(result.id).toBe('item_1');
    expect(result.name).toBe('Milk');
    expect(result.quantity).toBe('1 gallon');
    expect(result.details).toBe('Whole milk');
    expect(result.checked).toBe(false);
  });
});

describe('formatDateValue', () => {
  it('formats Date objects', () => {
    const date = new Date(2024, 2, 15);
    expect(formatDateValue(date)).toBe('2024-03-15');
  });

  it('passes through strings', () => {
    expect(formatDateValue('2024-03-15')).toBe('2024-03-15');
  });

  it('returns empty string for null/undefined', () => {
    expect(formatDateValue(null)).toBe('');
    expect(formatDateValue(undefined)).toBe('');
  });
});

describe('successResponse', () => {
  it('creates success response with JSON content', () => {
    const data = { message: 'Success', count: 5 };
    const result = successResponse(data);

    expect(result.content).toHaveLength(1);
    expect(result.content[0].type).toBe('text');
    expect(JSON.parse(result.content[0].text)).toEqual(data);
  });
});

describe('errorResponse', () => {
  it('creates error response', () => {
    const result = errorResponse('Something went wrong');

    expect(result.isError).toBe(true);
    expect(result.content).toHaveLength(1);
    expect(result.content[0].type).toBe('text');
    expect(result.content[0].text).toBe('Something went wrong');
  });
});
