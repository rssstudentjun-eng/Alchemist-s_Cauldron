import { recipes, type IRecipeRange } from '../data/recipes';
import { getSettings, state } from '../state/game-state';
import { calculateCauldron } from './calculate-cauldron';
import { getRecipe } from './recipe-generator';
import { addTimeBonus, updateTime } from './timer';
import { checkGameOver } from './end-game';

function isInRange(value: number, range: IRecipeRange): boolean {
  return (
    value >= range.min - getSettings().tolerance && value <= range.max + getSettings().tolerance
  );
}

export function brewCheck(): boolean | null {
  if (state.isPaused) return null;
  updateTime();
  if (!state.isStarted || !state.recipe || state.cauldronIngredients.length === 0) return null;

  const totals = calculateCauldron(state.cauldronIngredients, state.difficulty);
  const success =
    isInRange(totals.temperature, state.recipe.temperature) &&
    isInRange(totals.density, state.recipe.density) &&
    isInRange(totals.magicPower, state.recipe.magicPower);

  if (success) {
    state.score += getSettings().scoreReward;
    addTimeBonus();
    state.recipe = getRecipe(recipes, state.difficulty);
    state.message = `Potion brewed! +${getSettings().scoreReward} points, +${getSettings().timeReward} seconds (maximum ${getSettings().maximumTime}).`;
  } else {
    state.lives = Math.max(0, state.lives - 1);
    state.message = 'The potion failed. You lost 1 life.';
  }
  state.cauldronIngredients = [];
  checkGameOver();
  return success;
}
