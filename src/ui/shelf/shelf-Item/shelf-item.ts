import type { Ingredient } from '../../../data/ingredients';
import { state } from '../../../state/game-state';
import './shelf-item.scss';

function formatValue(value: number): string {
  if (value > 0) return `+${value}`;
  if (value < 0) return `\u2212${Math.abs(value)}`;
  return '0';
}

export function shelfItem(
  ingredient: Ingredient,
  quantity: number,
  isCauldronFull: boolean,
): HTMLLIElement {
  const shelfItem = document.createElement('li');
  shelfItem.classList.add('shelfItem');
  shelfItem.classList.toggle('isEmpty', quantity === 0);
  shelfItem.id = ingredient.id;
  const shelfItemImage = document.createElement('img');

  const shelButton = document.createElement('button');
  shelButton.type = 'button';
  shelButton.disabled = quantity === 0 || isCauldronFull;
  shelButton.classList.add('shelfItemButton');

  shelfItemImage.classList.add('shelfItemImage');
  shelfItemImage.src = ingredient.image;
  shelfItemImage.alt = ingredient.name;
  shelfItemImage.draggable = false;
  shelButton.append(shelfItemImage);

  const shelfItemName = document.createElement('p');
  shelfItemName.classList.add('shelfItemName');
  shelfItemName.textContent = ingredient.name;
  shelButton.append(shelfItemName);

  const shelfItemQuantity = document.createElement('p');
  shelfItemQuantity.classList.add('shelfItemQuantity');

  shelfItemQuantity.textContent = `Quantity: ${quantity}`;
  shelfItemQuantity.classList.toggle('quantityZero', quantity === 0);
  shelButton.append(shelfItemQuantity);

  const temperature = document.createElement('p');
  temperature.classList.add('shelfItemTemperature');
  temperature.textContent = `Temperature: ${formatValue(ingredient.temperature)}°C`;

  const density = document.createElement('p');
  density.classList.add('shelfItemDensity');
  density.textContent = `Density: ${formatValue(ingredient.density)}`;

  const magicPower = document.createElement('p');
  magicPower.classList.add('shelfItemMagicPower');
  magicPower.textContent = `Magic Power: ${formatValue(ingredient.magicPower)}`;

  const tooltip = document.createElement('div');
  tooltip.classList.add('ingredientTooltip');
  tooltip.id = `tooltip-${ingredient.id}`;
  tooltip.setAttribute('role', 'tooltip');
  tooltip.hidden = true;
  tooltip.append(temperature, density, magicPower);
  shelButton.setAttribute('aria-describedby', tooltip.id);

  function showTooltip(): void {
    if (!state.isStarted || state.isPaused || quantity === 0) return;
    tooltip.hidden = false;
    const card = shelfItem.getBoundingClientRect();
    const width = tooltip.offsetWidth;
    const height = tooltip.offsetHeight;
    const openLeft = card.right + width + 8 > document.documentElement.clientWidth;
    const openUp = card.top + height > document.documentElement.clientHeight - 8;
    const left = openLeft ? card.left - width - 8 : card.right + 8;
    const top = openUp ? card.top - height - 8 : card.top;
    tooltip.style.left = `${Math.max(8, Math.min(left, document.documentElement.clientWidth - width - 8))}px`;
    tooltip.style.top = `${Math.max(8, Math.min(top, document.documentElement.clientHeight - height - 8))}px`;
    window.addEventListener('scroll', hideTooltip, true);
    window.addEventListener('resize', hideTooltip);
  }

  function hideTooltip(): void {
    tooltip.hidden = true;
    window.removeEventListener('scroll', hideTooltip, true);
    window.removeEventListener('resize', hideTooltip);
  }

  shelfItem.addEventListener('mouseenter', showTooltip);
  shelfItem.addEventListener('mouseleave', hideTooltip);
  shelButton.addEventListener('focus', showTooltip);
  shelButton.addEventListener('blur', hideTooltip);
  shelButton.addEventListener('click', hideTooltip);
  shelfItem.addEventListener('dragstart', hideTooltip);
  shelfItem.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') hideTooltip();
  });

  shelfItem.append(shelButton, tooltip);
  return shelfItem;
}
