import type { Ingredient } from '../../data/ingredients';
import './shelf-item.scss';

export function shelfItem(ingredient: Ingredient) {
  const shelfItem = document.createElement('li');
  shelfItem.classList.add('shelfItem');
  const shelfItemImage = document.createElement('img');

  const shelButton = document.createElement('button');
  shelButton.classList.add('shelfItemButton');

  shelfItemImage.classList.add('shelfItemImage');
  shelfItemImage.src = ingredient.image;
  shelfItemImage.alt = ingredient.name;
  shelButton.append(shelfItemImage);

  const shelfItemName = document.createElement('p');
  shelfItemName.classList.add('shelfItemName');
  shelfItemName.textContent = ingredient.name;
  shelButton.append(shelfItemName);

  const temperature = document.createElement('p');
  temperature.classList.add('shelfItemTemperature');
  temperature.textContent = `Temperature: ${ingredient.temperature}°C`;

  const density = document.createElement('p');
  density.classList.add('shelfItemTemperature');
  density.textContent = `Density: ${ingredient.density}`;

  const magicPower = document.createElement('p');
  magicPower.classList.add('shelfItemTemperature');
  magicPower.textContent = `Magic Power: ${ingredient.magicPower}`;

  shelButton.append(temperature, density, magicPower);

  shelfItem.append(shelButton);
  return shelfItem;
}
