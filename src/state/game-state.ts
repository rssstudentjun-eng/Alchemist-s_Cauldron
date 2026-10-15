import { INGREDIENTS } from '../data/ingredients';
import { createStock } from '../logic/stock';

export const actualIngredients = INGREDIENTS.slice(0, 6);
export const MAX_CAULDRON_ITEMS = 4;

interface GameState {
  cauldronIngredients: string[];
  shelfStock: Record<string, number>;
}

export const state: GameState = {
  cauldronIngredients: [],
  shelfStock: {},
};

export function startNewGame(): void {
  state.cauldronIngredients = [];
  state.shelfStock = createStock(actualIngredients);
}
