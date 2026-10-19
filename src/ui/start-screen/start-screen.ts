import { state } from '../../state/game-state';
import { DIFFICULTY_SETTINGS } from '../../data/difficulty';
import type { Difficulty } from '../../data/recipes';
import { createLeaderboardButton } from '../leaderboard/leaderboard';

function openHelp(): void {
  const dialog = document.createElement('dialog');
  dialog.classList.add('helpDialog');
  dialog.setAttribute('aria-label', 'Game rules');
  const title = document.createElement('h2');
  title.textContent = 'How to play';
  const settings = DIFFICULTY_SETTINGS[state.difficulty];
  if (!settings) return;
  const rules = document.createElement('ul');
  [
    `Start with ${settings.initialTime} seconds and ${settings.initialLives} lives.`,
    `Add up to ${settings.capacity} ingredients to the cauldron. Each ingredient has 2-15 uses.`,
    'Used ingredients are not returned when you clear or brew the cauldron.',
    `Match all three recipe ranges. Brewing allows a tolerance of +/-${settings.tolerance}.`,
    `A successful brew gives ${settings.scoreReward} points and ${settings.timeReward} seconds, up to ${settings.initialTime}.`,
    'A failed brew costs one life. Both results empty the cauldron.',
    'The game ends when time or lives run out, or when both the shelf and cauldron are empty.',
    'Pause freezes the game. Switching tabs pauses automatically.',
  ].forEach((text) => {
    const rule = document.createElement('li');
    rule.textContent = text;
    rules.append(rule);
  });
  const close = document.createElement('button');
  close.type = 'button';
  close.textContent = 'Close';
  close.addEventListener('click', () => dialog.close());
  dialog.addEventListener('close', () => dialog.remove());
  dialog.append(title, rules, close);
  document.body.append(dialog);
  dialog.showModal();
}

function openSettings(onChange: () => void): void {
  if (state.isStarted) return;
  const dialog = document.createElement('dialog');
  dialog.classList.add('settingsDialog');
  dialog.setAttribute('aria-label', 'Difficulty settings');
  const title = document.createElement('h2');
  title.textContent = 'Choose difficulty';
  dialog.append(title);
  const difficulties: Difficulty[] = ['easy', 'medium', 'hard'];
  difficulties.forEach((difficulty) => {
    const settings = DIFFICULTY_SETTINGS[difficulty];
    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = settings
      ? `${settings.title}: ${settings.shelfSize} ingredients, ${settings.capacity} slots`
      : `${difficulty === 'easy' ? 'Easy' : 'Hard'} (unavailable)`;
    button.disabled = !settings;
    button.setAttribute('aria-pressed', String(state.difficulty === difficulty));
    button.addEventListener('click', () => {
      if (state.isStarted || !settings) return;
      state.difficulty = difficulty;
      dialog.close();
      onChange();
    });
    dialog.append(button);
  });
  const close = document.createElement('button');
  close.type = 'button';
  close.textContent = 'Close';
  close.addEventListener('click', () => dialog.close());
  dialog.addEventListener('close', () => dialog.remove());
  dialog.append(close);
  document.body.append(dialog);
  dialog.showModal();
}

export function createStartScreen(onStart: () => void, onChange: () => void): HTMLElement {
  const screen = document.createElement('div');
  screen.classList.add('startScreen');
  const title = document.createElement('h1');
  title.textContent = "Alchemist's Cauldron";
  const stats = document.createElement('p');
  stats.textContent = 'Score: 0 | Time: 00:00';
  const difficulty = document.createElement('p');
  difficulty.textContent = `Difficulty: ${DIFFICULTY_SETTINGS[state.difficulty]?.title ?? ''}`;
  const controls = document.createElement('div');
  controls.classList.add('startControls');
  const help = document.createElement('button');
  help.type = 'button';
  help.textContent = 'Help';
  help.addEventListener('click', openHelp);
  const settings = document.createElement('button');
  settings.type = 'button';
  settings.textContent = 'Settings';
  settings.addEventListener('click', () => openSettings(onChange));
  controls.append(help, settings, createLeaderboardButton());
  const field = document.createElement('div');
  field.classList.add('startField');
  const shelf = document.createElement('section');
  shelf.classList.add('shelf');
  const shelfTitle = document.createElement('h2');
  shelfTitle.textContent = 'Shelf';
  const shelfList = document.createElement('ul');
  shelfList.classList.add('shelfList');
  shelf.append(shelfTitle, shelfList);
  const cauldron = document.createElement('section');
  cauldron.classList.add('cauldron');
  const cauldronTitle = document.createElement('h2');
  cauldronTitle.textContent = 'Cauldron';
  const cauldronList = document.createElement('ul');
  cauldronList.classList.add('cauldronList');
  cauldron.append(cauldronTitle, cauldronList);
  const start = document.createElement('button');
  start.type = 'button';
  start.classList.add('newGameButton', 'startGameButton');
  start.textContent = 'Start Game';
  start.addEventListener('click', onStart);
  field.append(shelf, cauldron, start);
  screen.append(title, stats, difficulty, controls, field);
  return screen;
}
