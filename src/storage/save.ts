import { state } from '../state/game-state';
import { recipes } from '../data/recipes';
import { DIFFICULTY_SETTINGS } from '../data/difficulty';
import { INGREDIENTS } from '../data/ingredients';

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
    if (
      !('difficulty' in saved) ||
      (saved.difficulty !== 'easy' && saved.difficulty !== 'medium' && saved.difficulty !== 'hard')
    )
      return false;
    const difficulty = saved.difficulty;
    const settings = DIFFICULTY_SETTINGS[difficulty];
    if (!settings) return false;
    const actualIngredients = INGREDIENTS.slice(0, settings.shelfSize);
    if (!('isStarted' in saved) || saved.isStarted !== true) return false;
    if (
      !('recipe' in saved) ||
      !saved.recipe ||
      typeof saved.recipe !== 'object' ||
      !('id' in saved.recipe)
    )
      return false;
    const recipeId = saved.recipe.id;
    const recipe = recipes.find((item) => item.id === recipeId && item.difficulty === difficulty);
    if (!recipe) return false;
    if (!('cauldronIngredients' in saved) || !Array.isArray(saved.cauldronIngredients))
      return false;
    const ids: unknown[] = saved.cauldronIngredients;
    if (ids.length > settings.capacity) return false;
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
      saved.lives > settings.initialLives
    )
      return false;
    if (
      !('timeLeft' in saved) ||
      typeof saved.timeLeft !== 'number' ||
      !Number.isFinite(saved.timeLeft) ||
      saved.timeLeft <= 0 ||
      saved.timeLeft > settings.maximumTime
    )
      return false;
    state.cauldronIngredients = cauldron;
    state.shelfStock = stock;
    state.recipe = recipe;
    state.difficulty = difficulty;
    state.score = saved.score;
    state.lives = saved.lives;
    state.timeLeft = saved.timeLeft;
    state.endTime = Date.now() + state.timeLeft * 1000;
    state.gameOverReason = '';
    state.gameOverDate = 0;
    state.resultSaved = false;
    state.isStarted = true;
    state.isPaused = false;
    state.message = 'Saved game restored.';
    return true;
  } catch {
    return false;
  }
}
