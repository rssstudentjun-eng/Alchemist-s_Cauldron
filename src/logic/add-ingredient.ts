import { getActualIngredients, getSettings, state } from '../state/game-state';
import { updateTime } from './timer';
import { getActiveReactions } from '../data/reactions';
import { checkGameOver } from './end-game';

export function addIngredient(id: string): boolean {
  if (state.isPaused) return false;
  updateTime();
  const quantity = state.shelfStock[id] ?? 0;

  if (
    !state.isStarted ||
    !getActualIngredients().some((ingredient) => ingredient.id === id) ||
    quantity <= 0 ||
    state.cauldronIngredients.length >= getSettings().capacity
  ) {
    return false;
  }

  const previousReactions = getActiveReactions(state.cauldronIngredients, state.difficulty);
  state.shelfStock[id] = quantity - 1;
  state.cauldronIngredients.push(id);
  const firedNow = getActiveReactions(state.cauldronIngredients, state.difficulty).filter(
    (reaction) => !previousReactions.some((previous) => previous.id === reaction.id),
  );
  firedNow.forEach((reaction) => {
    state.endTime -= reaction.timePenalty * 1000;
    state.lives = Math.max(0, state.lives - reaction.lifePenalty);
    if (reaction.clearsCauldron) state.cauldronIngredients = [];
  });
  state.message = firedNow.map((reaction) => reaction.name).join(', ');
  updateTime();
  checkGameOver();
  return true;
}
