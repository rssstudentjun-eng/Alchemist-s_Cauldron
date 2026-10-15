import './styles/styles.scss';
import { createShelf } from './ui/shelf';
import { createCauldron } from './ui/cauldron';
import { MAX_CAULDRON_ITEMS, startNewGame, state } from './state/game-state';
import { recipes } from './data/recipes';

const app = document.querySelector<HTMLDivElement>('#app');

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

  const recipePanel = document.createElement('section');
  recipePanel.classList.add('recipePanel');
  const recipeTitle = document.createElement('h2');
  recipeTitle.textContent = recipes[0]?.name ?? 'Recipe';
  const counter = document.createElement('p');
  counter.classList.add('ingredientCounter');
  counter.setAttribute('aria-live', 'polite');
  counter.textContent = `Added: ${state.cauldronIngredients.length} / ${MAX_CAULDRON_ITEMS}`;
  recipePanel.append(recipeTitle, counter);

  app.replaceChildren(
    title,
    newGameButton,
    recipePanel,
    createShelf(renderGame),
    createCauldron(renderGame),
  );
}

startNewGame();
renderGame();
