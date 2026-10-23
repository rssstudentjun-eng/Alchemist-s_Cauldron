import { state } from '../state/game-state';
import { clearCauldron } from './clear-cauldron';
import { checkGameOver } from './end-game';
import { updateTime } from './timer';

export function pourOut(): boolean {
  if (!state.isStarted || state.isPaused || state.cauldronIngredients.length === 0) return false;
  updateTime();
  if (!state.isStarted) return false;

  clearCauldron();
  state.endTime -= 10 * 1000;
  updateTime();
  checkGameOver();
  return true;
}
