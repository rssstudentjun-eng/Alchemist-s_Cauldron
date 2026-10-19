import { LEVEL_ONE } from '../data/difficulty';
import { recipes, type IRecipeRange } from '../data/recipes';
import { state } from '../state/game-state';
import { calculateCauldron } from './calculate-cauldron';
import { getRecipe } from './recipe-generator';
import { addTimeBonus, updateTime } from './timer';
import { checkGameOver } from './end-game';

function isInRange(value: number, range: IRecipeRange): boolean {
  return value >= range.min - LEVEL_ONE.tolerance && value <= range.max + LEVEL_ONE.tolerance;
}

export function brewCheck(): boolean | null {
  if (state.isPaused) return null;
  updateTime();
  if (!state.isStarted || !state.recipe || state.cauldronIngredients.length === 0) return null;

  const totals = calculateCauldron(state.cauldronIngredients);
  const success =
    isInRange(totals.temperature, state.recipe.temperature) &&
    isInRange(totals.density, state.recipe.density) &&
    isInRange(totals.magicPower, state.recipe.magicPower);

  if (success) {
    state.score += LEVEL_ONE.scoreReward;
    addTimeBonus();
    state.recipe = getRecipe(recipes, state.difficulty);
    state.message = `Potion brewed! +200 points, +10 seconds (maximum ${LEVEL_ONE.maximumTime}).`;
  } else {
    state.lives = Math.max(0, state.lives - 1);
    state.message = 'The potion failed. You lost 1 life.';
  }
  state.cauldronIngredients = [];
  checkGameOver();
  return success;
}
