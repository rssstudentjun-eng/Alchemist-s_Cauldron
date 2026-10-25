import './styles/styles.scss';
import { getSettings, startNewGame, state } from './state/game-state';
import { createBars, updateBars } from './ui/bars/bars';
import { startTimer, stopTimer, updateTime, formatTime } from './logic/timer';

import { checkGameOver } from './logic/end-game';
import { createGameOver } from './ui/game-over/game-over';
import { loadGame, saveGame } from './storage/save';
import { pauseGame, resumeGame, exitToMenu } from './logic/pause-game';
import { createPauseDialog } from './ui/dialogs/pause-dialog';
import { createGameScreen } from './ui/start-screen/start-screen';

const app = document.querySelector<HTMLDivElement>('#app');
const gameContent = document.createElement('div');
const barsContainer = document.createElement('div');
const dialogContainer = document.createElement('div');
const gameStats = document.createElement('p');
gameStats.classList.add('gameStats');
const timerBlock = document.createElement('div');
timerBlock.classList.add('timerBlock');
const timerLabel = document.createElement('p');
const timerTrack = document.createElement('div');
timerTrack.classList.add('timerTrack');
const timerFill = document.createElement('div');
timerFill.classList.add('timerFill');
timerTrack.append(timerFill);
timerBlock.append(timerLabel, timerTrack);
app?.append(gameContent, barsContainer, dialogContainer);

function openPause(): void {
  if (!state.isStarted || dialogContainer.childElementCount > 0) return;
  pauseGame();
  if (!state.isStarted) {
    renderGame();
    return;
  }

  gameContent.classList.add('isPaused');
  barsContainer.classList.add('isPaused');
  saveGame();

  const dialog = createPauseDialog(
    () => {
      if (document.hidden) return;
      closePause();
      resumeGame();
      renderGame();
      startTimer(handleTick);
    },
    () => {
      closePause();
      exitToMenu();
      saveGame();
      renderGame();
    },
  );

  function closePause(): void {
    dialog.close();
    dialogContainer.replaceChildren();
    gameContent.classList.remove('isPaused');
    barsContainer.classList.remove('isPaused');
  }

  dialogContainer.replaceChildren(dialog);
  dialog.showModal();
}

function updateStats(): void {
  gameStats.textContent = state.isStarted
    ? `Score: ${state.score} | Lives: ${state.lives}`
    : 'Score: 0';
  timerLabel.textContent = state.isStarted ? formatTime(state.timeLeft) : '00:00';
  timerFill.style.width = `${(state.timeLeft / getSettings().initialTime) * 100}%`;
  timerBlock.classList.toggle('isUrgent', state.isStarted && state.timeLeft < 15);
}

function beginGame(): void {
  if (state.isPaused) return;
  startNewGame();
  barsContainer.replaceChildren(createBars());
  renderGame();
  startTimer(handleTick);
}

function handleTick(): void {
  updateStats();
  saveGame();
  if (!state.isStarted) renderGame();
}

function continueGame(): void {
  const saved = loadGame();
  if (!saved) {
    renderGame();
    return;
  }
  state.difficulty = saved.difficulty;
  state.score = saved.score;
  state.timeLeft = saved.timeLeft;
  state.lives = saved.lives;
  state.recipe = saved.activeRecipe;
  state.cauldronIngredients = saved.cauldronIngredients;
  state.shelfStock = saved.shelfStock;
  state.isStarted = true;
  state.isPaused = true;
  state.endTime = 0;
  state.gameOverReason = '';
  state.gameOverDate = 0;
  state.resultSaved = false;
  state.message = 'Saved game restored.';
  barsContainer.replaceChildren(createBars());
  renderGame();
  openPause();
}

function renderGame(): void {
  if (!app) return;
  updateTime();
  checkGameOver();

  if (!state.isStarted) {
    stopTimer();
    if (state.gameOverReason) {
      gameContent.replaceChildren(
        createGameOver(beginGame, () => {
          exitToMenu();
          renderGame();
        }),
      );
      barsContainer.replaceChildren();
      saveGame();
      return;
    }
    barsContainer.replaceChildren();
  }
  updateStats();
  gameContent.replaceChildren(
    createGameScreen(
      { onStart: beginGame, onChange: renderGame, onContinue: continueGame, onPause: openPause },
      gameStats,
      timerBlock,
    ),
  );
  updateBars();
  if (state.isStarted) saveGame();
}

renderGame();

const shortcuts: Record<string, string> = {
  b: 'brew',
  o: 'pour-out',
  p: 'pause',
};

document.addEventListener('keydown', (event) => {
  if (!state.isStarted || state.isPaused || state.gameOverReason) return;
  if (
    event.defaultPrevented ||
    event.repeat ||
    event.isComposing ||
    event.ctrlKey ||
    event.altKey ||
    event.metaKey
  )
    return;

  const target = event.target;
  if (
    target instanceof HTMLElement &&
    (target.closest('input, textarea, select') || target.isContentEditable)
  )
    return;
  if (document.querySelector('dialog[open]')) return;

  const action = shortcuts[event.key.toLowerCase()];
  if (!action) return;
  const button = gameContent.querySelector<HTMLButtonElement>(`button[data-action="${action}"]`);
  if (!button || button.disabled) return;

  event.preventDefault();
  button.click();
});

document.addEventListener('visibilitychange', () => {
  if (document.hidden && state.isStarted && !state.isPaused) {
    openPause();
  }
});

if (document.hidden && state.isStarted) openPause();

window.addEventListener('pagehide', () => {
  if (!state.isStarted) return;
  pauseGame();
  saveGame();
});

window.addEventListener('pageshow', () => {
  if (state.isStarted && state.isPaused) openPause();
});
