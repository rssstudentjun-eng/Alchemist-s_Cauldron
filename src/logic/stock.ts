import type { Ingredient } from '../data/ingredients';

export function createStock(ingredients: Ingredient[]): Record<string, number> {
  const stock: Record<string, number> = {};

  ingredients.forEach((ingredient) => {
    stock[ingredient.id] = Math.floor(Math.random() * 14) + 2;
  });

  return stock;
}
