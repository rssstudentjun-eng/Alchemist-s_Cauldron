import { INGREDIENTS } from '../data/ingredients';
import { LEVEL_ONE } from '../data/difficulty';
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
  message: string;
}

export const state: GameState = {
  cauldronIngredients: [],
  shelfStock: {},
  recipe: null,
  difficulty: 'easy',
  isStarted: false,
  isPaused: false,
  score: 0,
  lives: LEVEL_ONE.initialLives,
  timeLeft: LEVEL_ONE.initialTime,
  endTime: 0,
  gameOverReason: '',
  message: '',
};

export function startNewGame(): void {
  state.cauldronIngredients = [];
  state.shelfStock = createStock(actualIngredients);
  state.difficulty = 'easy';
  state.recipe = getRecipe(recipes, state.difficulty);
  state.isStarted = true;
  state.isPaused = false;
  state.score = 0;
  state.lives = LEVEL_ONE.initialLives;
  state.timeLeft = LEVEL_ONE.initialTime;
  state.endTime = Date.now() + state.timeLeft * 1000;
  state.gameOverReason = '';
  state.message = '';
}
