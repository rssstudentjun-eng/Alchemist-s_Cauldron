import { INGREDIENTS } from '../data/ingredients';
import { shelfItem } from './shelfItem/shelf-item';
import './shelf.scss';

export function createShelf(): HTMLElement {
  const shelfIngredients = document.createElement('div');
  shelfIngredients.classList.add('shelf');

  const shelfTitle = document.createElement('h2');
  shelfTitle.classList.add('shelfTitle');
  shelfTitle.textContent = 'shelf';

  const shelfItems = INGREDIENTS.map((ingredient) => {
    return shelfItem(ingredient);
  });

  const shelfList = document.createElement('ul');
  shelfList.classList.add('shelfList');

  shelfIngredients.append(shelfTitle, shelfList);
  shelfList.append(...shelfItems);

  return shelfIngredients;
}
