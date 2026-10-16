import { INGREDIENTS } from '../data/ingredients';
import { createStock } from '../logic/stock';
import { type IRecipe, recipes } from '../data/recipes';
import { getRecipe } from '../logic/recipe-generator';

export const actualIngredients = INGREDIENTS.slice(0, 6);
export const MAX_CAULDRON_ITEMS = 4;

interface GameState {
  cauldronIngredients: string[];
  shelfStock: Record<string, number>;
  recipe: IRecipe | null;
}

export const state: GameState = {
  cauldronIngredients: [],
  shelfStock: {},
  recipe: getRecipe(recipes),
};

export function startNewGame(): void {
  state.cauldronIngredients = [];
  state.shelfStock = createStock(actualIngredients);
  state.recipe = getRecipe(recipes);
}
