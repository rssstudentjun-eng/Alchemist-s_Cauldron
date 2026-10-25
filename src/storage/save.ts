import { state } from '../state/game-state';
import { recipes, type Difficulty, type IRecipe } from '../data/recipes';
import { DIFFICULTY_SETTINGS } from '../data/difficulty';
import { INGREDIENTS } from '../data/ingredients';

const SAVE_KEY = 'alchemist-save';

interface GameSave {
  difficulty: Difficulty;
  score: number;
  timeLeft: number;
  lives: number;
  activeRecipe: IRecipe;
  cauldronIngredients: string[];
  shelfStock: Record<string, number>;
  status: 'playing' | 'paused';
}

export function isValidSave(data: unknown): data is GameSave {
  if (!data || typeof data !== 'object') return false;
  if (
    !('difficulty' in data) ||
    (data.difficulty !== 'easy' && data.difficulty !== 'medium' && data.difficulty !== 'hard')
  )
    return false;
  const settings = DIFFICULTY_SETTINGS[data.difficulty];
  if (!('status' in data) || (data.status !== 'playing' && data.status !== 'paused')) return false;
  if (
    !('score' in data) ||
    typeof data.score !== 'number' ||
    !Number.isInteger(data.score) ||
    data.score < 0
  )
    return false;
  if (
    !('lives' in data) ||
    typeof data.lives !== 'number' ||
    !Number.isInteger(data.lives) ||
    data.lives < 1 ||
    data.lives > settings.initialLives
  )
    return false;
  if (
    !('timeLeft' in data) ||
    typeof data.timeLeft !== 'number' ||
    !Number.isFinite(data.timeLeft) ||
    data.timeLeft <= 0 ||
    data.timeLeft > settings.maximumTime
  )
    return false;

  if (
    !('activeRecipe' in data) ||
    !data.activeRecipe ||
    typeof data.activeRecipe !== 'object' ||
    !('id' in data.activeRecipe)
  )
    return false;
  const savedRecipe = data.activeRecipe;
  const recipe = recipes.find(
    (item) => item.id === savedRecipe.id && item.difficulty === data.difficulty,
  );
  if (
    !recipe ||
    !('name' in savedRecipe) ||
    savedRecipe.name !== recipe.name ||
    !('difficulty' in savedRecipe) ||
    savedRecipe.difficulty !== data.difficulty
  )
    return false;
  for (const key of ['temperature', 'density', 'magicPower'] as const) {
    const range: unknown = Reflect.get(savedRecipe, key);
    if (
      !range ||
      typeof range !== 'object' ||
      !('min' in range) ||
      !('max' in range) ||
      range.min !== recipe[key].min ||
      range.max !== recipe[key].max
    )
      return false;
  }

  const ingredients = INGREDIENTS.slice(0, settings.shelfSize);
  if (
    !('cauldronIngredients' in data) ||
    !Array.isArray(data.cauldronIngredients) ||
    data.cauldronIngredients.length > settings.capacity
  )
    return false;
  const ids: unknown[] = data.cauldronIngredients;
  if (!ids.every((id) => typeof id === 'string' && ingredients.some((item) => item.id === id)))
    return false;
  if (
    !('shelfStock' in data) ||
    !data.shelfStock ||
    typeof data.shelfStock !== 'object' ||
    Array.isArray(data.shelfStock)
  )
    return false;
  if (Object.keys(data.shelfStock).length !== ingredients.length) return false;
  let hasStock = false;
  for (const ingredient of ingredients) {
    const quantity: unknown = Reflect.get(data.shelfStock, ingredient.id);
    if (
      typeof quantity !== 'number' ||
      !Number.isInteger(quantity) ||
      quantity < 0 ||
      quantity > 15
    )
      return false;
    if (quantity > 0) hasStock = true;
    const inCauldron = ids.filter((id) => id === ingredient.id).length;
    if (quantity + inCauldron > 15) return false;
  }
  return hasStock || ids.length > 0;
}

export function clearSave(): void {
  try {
    localStorage.removeItem(SAVE_KEY);
  } catch {
    return;
  }
}

export function saveGame(): void {
  if (!state.isStarted || !state.recipe || state.timeLeft <= 0 || state.lives <= 0) {
    clearSave();
    return;
  }
  const saved: GameSave = {
    difficulty: state.difficulty,
    score: state.score,
    timeLeft: state.timeLeft,
    lives: state.lives,
    activeRecipe: state.recipe,
    cauldronIngredients: state.cauldronIngredients,
    shelfStock: state.shelfStock,
    status: state.isPaused ? 'paused' : 'playing',
  };
  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify(saved));
  } catch {
    return;
  }
}

export function loadGame(): GameSave | null {
  try {
    const saved: unknown = JSON.parse(localStorage.getItem(SAVE_KEY) ?? 'null');
    if (isValidSave(saved)) return saved;
  } catch {
    // Invalid JSON and unavailable storage are handled like a missing save.
  }
  clearSave();
  return null;
}
