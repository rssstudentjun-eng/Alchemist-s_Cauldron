import { shelfItem } from './shelf-Item/shelf-item';
import './shelf.scss';
import { actualIngredients, MAX_CAULDRON_ITEMS, state } from '../../state/game-state';
import { addIngredient } from '../../logic/add-ingredient';

export function createShelf(onChange: () => void): HTMLElement {
  const shelfIngredients = document.createElement('div');
  shelfIngredients.classList.add('shelf');

  const shelfTitle = document.createElement('h2');
  shelfTitle.classList.add('shelfTitle');
  shelfTitle.textContent = 'Shelf';

  const isCauldronFull = state.cauldronIngredients.length >= MAX_CAULDRON_ITEMS;
  const shelfItems = actualIngredients.map((ingredient) => {
    const quantity = state.shelfStock[ingredient.id] ?? 0;
    const item = shelfItem(ingredient, quantity, isCauldronFull);
    const button = item.querySelector<HTMLButtonElement>('.shelfItemButton');

    button?.addEventListener('click', () => {
      if (addIngredient(ingredient.id)) {
        onChange();
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
