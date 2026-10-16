import './styles/styles.scss';
import { createShelf } from './ui/shelf/shelf';
import { createCauldron } from './ui/cauldron/cauldron';
import { startNewGame } from './state/game-state';
import { createBars, updateBars } from './ui/bars/bars';
import { createRecipePanel } from './ui/recipe-panel/recipe-panel';

const app = document.querySelector<HTMLDivElement>('#app');
const gameContent = document.createElement('div');
const barsContainer = document.createElement('div');
app?.append(gameContent, barsContainer);

function renderGame(): void {
  if (!app) return;

  const title = document.createElement('h1');
  title.textContent = "Alchemist's Cauldron";

  const newGameButton = document.createElement('button');
  newGameButton.type = 'button';
  newGameButton.textContent = 'New Game';
  newGameButton.addEventListener('click', () => {
    startNewGame();
    renderGame();
  });

  gameContent.replaceChildren(
    title,
    newGameButton,
    createShelf(renderGame),
    createCauldron(renderGame),
    createRecipePanel(),
  );
  updateBars();
}

startNewGame();
barsContainer.append(createBars());
renderGame();
