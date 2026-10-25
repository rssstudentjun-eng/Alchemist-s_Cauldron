import { selectDifficulty, state } from '../../state/game-state';
import { DIFFICULTY_SETTINGS } from '../../data/difficulty';
import type { Difficulty } from '../../data/recipes';
import { createLeaderboardButton } from '../leaderboard/leaderboard';
import { reactions } from '../../data/reactions';
import { loadGame } from '../../storage/save';
import { createShelf } from '../shelf/shelf';
import { createCauldron } from '../cauldron/cauldron';
import { createRecipePanel } from '../recipe-panel/recipe-panel';
import './start-screen.scss';

interface ScreenActions {
  onStart: () => void;
  onChange: () => void;
  onContinue: () => void;
  onPause: () => void;
}

function openHelp(): void {
  const dialog = document.createElement('dialog');
  dialog.classList.add('helpDialog');
  dialog.setAttribute('aria-label', 'Game rules');
  const title = document.createElement('h2');
  title.textContent = 'How to play:';
  const settings = DIFFICULTY_SETTINGS[state.difficulty];

  const rules = document.createElement('ul');

  rules.classList.add('rulesList');

  [
    `You start with ${settings.initialTime} seconds and ${settings.initialLives} lives.`,
    `You can add up to ${settings.capacity} ingredients to the cauldron. Each ingredient can be used 2 to 15 times.`,
    'Ingredients are not returned after brewing or emptying the cauldron.',
    'Pour Out clears the cauldron and takes 10 seconds, but you keep your lives.',
    `To brew a potion, you need to match all three recipe ranges. A difference of +/-${settings.tolerance} is allowed.`,
    `A successful potion gives you ${settings.scoreReward} points and ${settings.timeReward} extra seconds. The timer cannot go above ${settings.maximumTime} seconds.`,
    'If you fail, you lose one life. The cauldron is emptied after every attempt.',
    'The game is over when you run out of time or lives, or when there are no ingredients left on the shelf or in the cauldron.',
    'You can pause the game at any time. It also pauses when you switch to another tab.',
    'Press B to brew your potion.',
    'Press O to empty the cauldron. This costs 10 seconds.',
    'Press P to pause the game.',
    'Use Tab to switch between buttons. Press Enter or Space to select a button or resume the game.',
    'B, O and P only work while playing. They will not work when typing or when a dialog is open. Make sure your keyboard is set to English.',
  ].forEach((text) => {
    const rule = document.createElement('li');
    rule.textContent = text;
    rules.append(rule);
  });

  reactions.slice(0, settings.reactionCount).forEach((reaction) => {
    const rule = document.createElement('li');
    rule.textContent = `${reaction.name}: ${reaction.description}`;
    rules.append(rule);
  });
  const reactionRule = document.createElement('li');
  reactionRule.textContent =
    settings.reactionCount === 0
      ? 'Easy has no reactions.'
      : 'Reaction penalties apply once when the combination becomes active. Clearing or brewing lets it trigger again.';
  rules.append(reactionRule);
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
    button.textContent = `${settings.title}: ${settings.shelfSize} ingredients, ${settings.capacity} slots, ${settings.initialTime}s, ${settings.initialLives} lives, +/-${settings.tolerance}, +${settings.scoreReward} points, +${settings.timeReward}s, ${settings.reactionCount} reactions`;
    button.setAttribute('aria-pressed', String(state.difficulty === difficulty));
    button.addEventListener('click', () => {
      if (state.isStarted) return;
      if (!selectDifficulty(difficulty)) return;
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

export function createGameScreen(
  actions: ScreenActions,
  stats: HTMLElement,
  timer: HTMLElement,
): HTMLElement {
  const screen = document.createElement('div');
  screen.classList.add('startScreen');
  const title = document.createElement('h1');
  title.classList.add('title');
  title.textContent = "Alchemist's Cauldron";
  stats.classList.add('stats');
  const difficulty = document.createElement('p');
  difficulty.textContent = `Difficulty: ${DIFFICULTY_SETTINGS[state.difficulty]?.title ?? ''}`;
  const controls = document.createElement('div');
  controls.classList.add('startControls');
  const help = document.createElement('button');
  help.type = 'button';
  help.textContent = 'Help';
  help.addEventListener('click', openHelp);
  controls.append(help);
  if (state.isStarted) {
    const newGame = document.createElement('button');
    newGame.type = 'button';
    newGame.textContent = 'New Game';
    newGame.addEventListener('click', actions.onStart);
    const pause = document.createElement('button');
    pause.type = 'button';
    pause.dataset.action = 'pause';
    pause.setAttribute('aria-keyshortcuts', 'p');
    pause.textContent = 'Pause';
    pause.addEventListener('click', actions.onPause);
    controls.append(newGame, pause);
  } else {
    const settings = document.createElement('button');
    settings.type = 'button';
    settings.textContent = 'Settings';
    settings.addEventListener('click', () => openSettings(actions.onChange));
    controls.append(settings, createLeaderboardButton());
    if (loadGame()) {
      const continueButton = document.createElement('button');
      continueButton.type = 'button';
      continueButton.textContent = 'Continue Game';
      continueButton.addEventListener('click', actions.onContinue);
      controls.append(continueButton);
    }
  }
  const field = document.createElement('div');
  field.classList.add('startField');
  field.append(createShelf(actions.onChange), createCauldron(actions.onChange));
  if (!state.isStarted) {
    const start = document.createElement('button');
    start.type = 'button';
    start.classList.add('newGameButton', 'startGameButton');
    start.textContent = 'Start Game';
    start.addEventListener('click', actions.onStart);
    field.append(start);
  }
  const header = document.createElement('div');
  header.classList.add('gameHeader');
  const info = document.createElement('div');
  info.classList.add('gameInfo');
  info.append(stats, timer, controls);
  header.append(info);
  if (state.isStarted) header.append(createRecipePanel());

  screen.append(title, difficulty, header);
  if (state.isStarted) {
    const message = document.createElement('p');
    message.classList.add('gameMessage');
    message.setAttribute('role', 'status');
    message.textContent = state.message;
    screen.append(message);
  }
  screen.append(field);
  return screen;
}
