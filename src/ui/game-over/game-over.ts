import { state } from '../../state/game-state';
import { isTopScore, readLeaderboard, saveResult } from '../../storage/leaderboard';
import { createLeaderboardButton } from '../leaderboard/leaderboard';

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
  screen.append(title, reason, score);

  const { entries, error } = readLeaderboard();
  const feedback = document.createElement('p');
  feedback.setAttribute('role', 'status');
  feedback.textContent = error;

  if (!state.resultSaved && isTopScore(entries, state.score, state.gameOverDate)) {
    const form = document.createElement('form');
    form.classList.add('leaderboardForm');
    form.noValidate = true;
    const label = document.createElement('label');
    label.htmlFor = 'playerName';
    label.textContent = 'Top-10! Enter your name (2–15 characters):';
    const input = document.createElement('input');
    input.id = 'playerName';
    input.name = 'playerName';
    input.setAttribute('autocomplete', 'nickname');
    input.setAttribute('aria-describedby', 'nameFeedback');
    feedback.id = 'nameFeedback';
    const submit = document.createElement('button');
    submit.type = 'submit';
    submit.textContent = 'Save result';
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      if (state.resultSaved) return;
      const saveError = saveResult(input.value, state.score, state.gameOverDate);
      feedback.textContent = saveError || 'Result saved!';
      input.setAttribute('aria-invalid', String(!!saveError));
      if (!saveError) {
        state.resultSaved = true;
        input.disabled = true;
        submit.disabled = true;
      }
    });
    form.append(label, input, submit);
    screen.append(form);
  }

  screen.append(feedback, button, createLeaderboardButton());
  return screen;
}
