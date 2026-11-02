import { state } from '../state/game-state';
import { clearSave } from '../storage/save';
import { playerStats, savePlayerStats } from '../storage/player-stats';

export function endGame(reason: string): void {
  if (!state.isStarted) return;
  state.isStarted = false;
  state.gameOverReason = reason;
  state.gameOverDate = Date.now();
  state.resultSaved = false;
  playerStats.bestScore = Math.max(playerStats.bestScore, state.score);
  savePlayerStats();
  clearSave();
}

export function checkGameOver(): void {
  if (!state.isStarted) return;
  if (state.timeLeft <= 0) {
    endGame('Time is up!');
  } else if (state.lives <= 0) {
    endGame('No lives left!');
  } else if (
    state.cauldronIngredients.length === 0 &&
    !Object.values(state.shelfStock).some((quantity) => quantity > 0)
  ) {
    endGame('Out of ingredients!');
  }
}
