import './styles/styles.scss';
import { createShelf } from './ui/shelf/shelf';
import { createCauldron } from './ui/cauldron/cauldron';
import { startNewGame, state } from './state/game-state';
import { createBars, updateBars } from './ui/bars/bars';
import { createRecipePanel } from './ui/recipe-panel/recipe-panel';
import { startTimer, stopTimer, updateTime, formatTime } from './logic/timer';
import { LEVEL_ONE } from './data/difficulty';
import { checkGameOver } from './logic/end-game';
import { createGameOver } from './ui/game-over/game-over';
import { loadGame, saveGame } from './storage/save';

const app = document.querySelector<HTMLDivElement>('#app');
const gameContent = document.createElement('div');
const barsContainer = document.createElement('div');
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
app?.append(gameContent, barsContainer);

function updateStats(): void {
  gameStats.textContent = `Score: ${state.score} | Lives: ${state.lives}`;
  timerLabel.textContent = formatTime(state.timeLeft);
  timerFill.style.width = `${(state.timeLeft / LEVEL_ONE.initialTime) * 100}%`;
  timerBlock.classList.toggle('isUrgent', state.isStarted && state.timeLeft < 15);
}

function beginGame(): void {
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

function renderGame(): void {
  if (!app) return;
  updateTime();
  checkGameOver();

  const title = document.createElement('h1');
  title.textContent = "Alchemist's Cauldron";
  const newGameButton = document.createElement('button');
  newGameButton.type = 'button';
  newGameButton.classList.add('newGameButton');
  newGameButton.textContent = state.isStarted ? 'New Game' : 'Start Game';
  newGameButton.addEventListener('click', beginGame);

  if (!state.isStarted) {
    stopTimer();
    if (state.gameOverReason) {
      gameContent.replaceChildren(createGameOver(beginGame));
      barsContainer.replaceChildren();
      saveGame();
      return;
    }
    const startScreen = document.createElement('div');
    startScreen.classList.add('startScreen');
    const message = document.createElement('p');
    message.textContent = state.message
      ? `${state.message} Final score: ${state.score}`
      : 'Brew your first potion!';
    startScreen.append(title, message, newGameButton);
    gameContent.replaceChildren(startScreen);
    barsContainer.replaceChildren();
    saveGame();
    return;
  }

  const message = document.createElement('p');
  message.classList.add('gameMessage');
  message.setAttribute('role', 'status');
  message.textContent = state.message;
  updateStats();
  gameContent.replaceChildren(
    title,
    newGameButton,
    gameStats,
    timerBlock,
    message,
    createRecipePanel(),
    createShelf(renderGame),
    createCauldron(renderGame),
  );
  updateBars();
  saveGame();
}

if (loadGame()) {
  barsContainer.append(createBars());
  startTimer(handleTick);
}
renderGame();

document.addEventListener('visibilitychange', () => {
  if (!document.hidden && state.isStarted) {
    updateTime();
    handleTick();
  }
});
