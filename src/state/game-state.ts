import { INGREDIENTS } from '../data/ingredients';
import { DIFFICULTY_SETTINGS, type DifficultySettings } from '../data/difficulty';
import { createStock } from '../logic/stock';
import { type Difficulty, type IRecipe, recipes } from '../data/recipes';
import { getRecipe } from '../logic/recipe-generator';

export interface GameState {
  cauldronIngredients: string[];
  shelfStock: Record<string, number>;
  recipe: IRecipe | null;
  difficulty: Difficulty;
  isStarted: boolean;
  isPaused: boolean;
  score: number;
  lives: number;
  timeLeft: number;
  endTime: number;
  gameOverReason: string;
  gameOverDate: number;
  resultSaved: boolean;
  message: string;
}

export const state: GameState = {
  cauldronIngredients: [],
  shelfStock: {},
  recipe: null,
  difficulty: 'medium',
  isStarted: false,
  isPaused: false,
  score: 0,
  lives: 0,
  timeLeft: 0,
  endTime: 0,
  gameOverReason: '',
  gameOverDate: 0,
  resultSaved: false,
  message: '',
};

export function startNewGame(): void {
  const settings = DIFFICULTY_SETTINGS[state.difficulty];
  if (!settings) return;
  state.cauldronIngredients = [];
  state.shelfStock = createStock(getActualIngredients());
  state.recipe = getRecipe(recipes, state.difficulty);
  state.isStarted = true;
  state.isPaused = false;
  state.score = 0;
  state.lives = settings.initialLives;
  state.timeLeft = settings.initialTime;
  state.endTime = Date.now() + state.timeLeft * 1000;
  state.gameOverReason = '';
  state.gameOverDate = 0;
  state.resultSaved = false;
  state.message = '';
}

export function getSettings(): DifficultySettings {
  const settings = DIFFICULTY_SETTINGS[state.difficulty];
  if (!settings) throw new Error('Difficulty settings are missing');
  return settings;
}

export function getActualIngredients() {
  return INGREDIENTS.slice(0, getSettings().shelfSize);
}

export function selectDifficulty(difficulty: Difficulty): boolean {
  if (state.isStarted || !DIFFICULTY_SETTINGS[difficulty]) return false;
  state.difficulty = difficulty;
  return true;
}
