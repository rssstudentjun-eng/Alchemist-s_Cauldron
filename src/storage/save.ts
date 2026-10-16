import { actualIngredients, MAX_CAULDRON_ITEMS, state } from '../state/game-state';
import { recipes } from '../data/recipes';
import { LEVEL_ONE } from '../data/difficulty';

const SAVE_KEY = 'alchemist-save';

export function saveGame(): void {
  try {
    if (state.isStarted) {
      localStorage.setItem(SAVE_KEY, JSON.stringify(state));
    } else {
      localStorage.removeItem(SAVE_KEY);
    }
  } catch {
    // The game remains playable when browser storage is unavailable.
  }
}

export function loadGame(): boolean {
  try {
    const saved: unknown = JSON.parse(localStorage.getItem(SAVE_KEY) ?? 'null');
    if (!saved || typeof saved !== 'object') return false;
    if (!('difficulty' in saved) || saved.difficulty !== 'easy') return false;
    if (!('isStarted' in saved) || saved.isStarted !== true) return false;
    if (
      !('recipe' in saved) ||
      !saved.recipe ||
      typeof saved.recipe !== 'object' ||
      !('id' in saved.recipe)
    )
      return false;
    const recipeId = saved.recipe.id;
    const recipe = recipes.find((item) => item.id === recipeId && item.difficulty === 'easy');
    if (!recipe) return false;
    if (!('cauldronIngredients' in saved) || !Array.isArray(saved.cauldronIngredients))
      return false;
    const ids: unknown[] = saved.cauldronIngredients;
    if (ids.length > MAX_CAULDRON_ITEMS) return false;
    const cauldron: string[] = [];
    for (const id of ids) {
      if (typeof id !== 'string' || !actualIngredients.some((item) => item.id === id)) return false;
      cauldron.push(id);
    }
    if (!('shelfStock' in saved) || !saved.shelfStock || typeof saved.shelfStock !== 'object')
      return false;
    const stock: Record<string, number> = {};
    for (const ingredient of actualIngredients) {
      const quantity: unknown = Reflect.get(saved.shelfStock, ingredient.id);
      if (
        typeof quantity !== 'number' ||
        !Number.isInteger(quantity) ||
        quantity < 0 ||
        quantity > 15
      )
        return false;
      stock[ingredient.id] = quantity;
    }
    if (
      !('score' in saved) ||
      typeof saved.score !== 'number' ||
      !Number.isInteger(saved.score) ||
      saved.score < 0
    )
      return false;
    if (
      !('lives' in saved) ||
      typeof saved.lives !== 'number' ||
      !Number.isInteger(saved.lives) ||
      saved.lives < 1 ||
      saved.lives > LEVEL_ONE.initialLives
    )
      return false;
    if (
      !('timeLeft' in saved) ||
      typeof saved.timeLeft !== 'number' ||
      !Number.isInteger(saved.timeLeft) ||
      saved.timeLeft < 1 ||
      saved.timeLeft > LEVEL_ONE.maximumTime
    )
      return false;
    state.cauldronIngredients = cauldron;
    state.shelfStock = stock;
    state.recipe = recipe;
    state.difficulty = 'easy';
    state.score = saved.score;
    state.lives = saved.lives;
    state.timeLeft = saved.timeLeft;
    state.isStarted = true;
    state.message = 'Saved game restored.';
    return true;
  } catch {
    return false;
  }
}
