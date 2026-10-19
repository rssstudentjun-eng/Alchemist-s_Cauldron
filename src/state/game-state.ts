import { INGREDIENTS } from '../data/ingredients';
import { DIFFICULTY_SETTINGS, LEVEL_ONE } from '../data/difficulty';
import { createStock } from '../logic/stock';
import { type Difficulty, type IRecipe, recipes } from '../data/recipes';
import { getRecipe } from '../logic/recipe-generator';

export const actualIngredients = INGREDIENTS.slice(0, 6);
export const MAX_CAULDRON_ITEMS = LEVEL_ONE.capacity;

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
  state.shelfStock = createStock(actualIngredients);
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
