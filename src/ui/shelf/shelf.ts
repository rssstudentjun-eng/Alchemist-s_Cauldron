import { shelfItem } from './shelf-Item/shelf-item';
import './shelf.scss';
import { getActualIngredients, getSettings, state } from '../../state/game-state';
import { addIngredient } from '../../logic/add-ingredient';

export function createShelf(onChange: () => void): HTMLElement {
  const shelfIngredients = document.createElement('div');
  shelfIngredients.classList.add('shelf');

  const shelfTitle = document.createElement('h2');
  shelfTitle.classList.add('shelfTitle');
  shelfTitle.textContent = 'Shelf';

  const isCauldronFull = state.cauldronIngredients.length >= getSettings().capacity;
  const ingredients = state.isStarted ? getActualIngredients() : [];
  const shelfItems = ingredients.map((ingredient) => {
    const quantity = state.shelfStock[ingredient.id] ?? 0;
    const item = shelfItem(ingredient, quantity, isCauldronFull);
    const button = item.querySelector<HTMLButtonElement>('.shelfItemButton');

    item.draggable = quantity > 0 && !isCauldronFull && !state.isPaused;
    item.addEventListener('dragstart', (event) => {
      if (
        !event.dataTransfer ||
        !state.isStarted ||
        state.isPaused ||
        (state.shelfStock[ingredient.id] ?? 0) <= 0 ||
        state.cauldronIngredients.length >= getSettings().capacity
      ) {
        event.preventDefault();
        return;
      }
      event.dataTransfer.setData('text/plain', ingredient.id);
      event.dataTransfer.setData('application/x-alchemist-ingredient', ingredient.id);
      event.dataTransfer.effectAllowed = 'copy';
    });
    item.addEventListener('dragend', () => {
      document.querySelector('.cauldron')?.classList.remove('isDragOver');
    });

    button?.addEventListener('click', () => {
      const hadFocus = document.activeElement === button;
      if (addIngredient(ingredient.id)) {
        onChange();
        if (hadFocus) {
          const nextButton =
            document
              .getElementById(ingredient.id)
              ?.querySelector<HTMLButtonElement>('button:not(:disabled)') ??
            document.querySelector<HTMLButtonElement>('.shelfItemButton:not(:disabled)') ??
            document.querySelector<HTMLButtonElement>(
              'button[data-action="brew"]:not(:disabled)',
            ) ??
            document.querySelector<HTMLButtonElement>('.gameOverScreen button');
          nextButton?.focus({ preventScroll: true });
        }
      }
    });
    return item;
  });

  const shelfList = document.createElement('ul');
  shelfList.classList.add('shelfList');
  shelfList.append(...shelfItems);
  shelfIngredients.append(shelfTitle, shelfList);
  return shelfIngredients;
}
