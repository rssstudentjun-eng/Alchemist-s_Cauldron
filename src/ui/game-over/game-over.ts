import { state } from '../../state/game-state';

export function createGameOver(onPlayAgain: () => void): HTMLElement {
  const screen = document.createElement('div');
  screen.classList.add('gameOverScreen');
  const title = document.createElement('h1');
  title.textContent = 'Game Over';
  const reason = document.createElement('p');
  reason.textContent = state.gameOverReason;
  const score = document.createElement('p');
  score.textContent = `Final score: ${state.score}`;
  const button = document.createElement('button');
  button.type = 'button';
  button.classList.add('newGameButton');
  button.textContent = 'Play again';
  button.addEventListener('click', onPlayAgain);
  screen.append(title, reason, score, button);
  return screen;
}
