import { state } from '../state/game-state';
import { stopTimer, updateTime } from './timer';

export function pauseGame(): void {
  if (!state.isStarted || state.isPaused) return;
  updateTime();
  if (!state.isStarted) return;
  state.isPaused = true;
  stopTimer();
}

export function resumeGame(): void {
  if (!state.isStarted || !state.isPaused) return;
  state.endTime = Date.now() + state.timeLeft * 1000;
  state.isPaused = false;
}

export function exitToMenu(): void {
  stopTimer();
  state.isStarted = false;
  state.isPaused = false;
  state.gameOverReason = '';
  state.message = '';
  state.cauldronIngredients = [];
  state.shelfStock = {};
  state.recipe = null;
  state.endTime = 0;
}
