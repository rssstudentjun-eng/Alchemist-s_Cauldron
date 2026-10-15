import { INGREDIENTS } from '../data/ingredients';
import { shelfItem } from './shelfItem/shelf-item';
import './shelf.scss';
import { cauldronItemsMass, updateCauldron } from './cauldron';

export function updateItemQuantity(ingredientID: string, newQuantity: number): void {
  const item = document.getElementById(ingredientID);
  const quantityElement = item?.querySelector('.shelfItemQuantity');

  if (!quantityElement) return;

  quantityElement.textContent = `Quantity: ${newQuantity}`;
}

export function createShelf(): HTMLElement {
  const shelfIngredients = document.createElement('div');
  shelfIngredients.classList.add('shelf');

  const shelfTitle = document.createElement('h2');
  shelfTitle.classList.add('shelfTitle');
  shelfTitle.textContent = 'shelf';

  const shelfItems = INGREDIENTS.map((ingredient) => {
    let randomQuantity = Math.floor(Math.random() * 14) + 2;

    const item = shelfItem(ingredient, randomQuantity);

    const button = item.querySelector<HTMLButtonElement>('.shelfItemButton');
    if (!button) {
      return item;
    }

    item.addEventListener('click', () => {
      updateItemQuantity(ingredient.id, randomQuantity);
      console.log(`Clicked on ${ingredient.name}`);

      randomQuantity -= 1;
      updateItemQuantity(ingredient.id, randomQuantity);

      cauldronItemsMass.push(ingredient.name);
      updateCauldron();

      button.disabled = randomQuantity === 0;
    });
    return item;
  });
  const shelfList = document.createElement('ul');
  shelfList.classList.add('shelfList');

  shelfIngredients.append(shelfTitle, shelfList);
  shelfList.append(...shelfItems);

  return shelfIngredients;
}
