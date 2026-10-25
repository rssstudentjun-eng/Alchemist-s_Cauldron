import './cauldron.scss';
import { INGREDIENTS } from '../../data/ingredients';
import { getSettings, state } from '../../state/game-state';
import { brewCheck } from '../../logic/brew-check';
import { addIngredient } from '../../logic/add-ingredient';
import { pourOut } from '../../logic/pour-out';
import { showBrewResult } from './brew-animation';

export function createCauldron(onChange: () => void): HTMLElement {
  const cauldron = document.createElement('div');
  cauldron.classList.add('cauldron');

  const cauldronTitle = document.createElement('h2');
  cauldronTitle.classList.add('cauldronTitle');
  cauldronTitle.textContent = 'Cauldron';

  const cauldronList = document.createElement('ul');
  cauldronList.classList.add('cauldronList');

  if (!state.isStarted) {
    cauldron.append(cauldronTitle, cauldronList);
    return cauldron;
  }

  cauldron.addEventListener('dragover', (event) => {
    if (
      !event.dataTransfer?.types.includes('application/x-alchemist-ingredient') ||
      !state.isStarted ||
      state.isPaused ||
      state.cauldronIngredients.length >= getSettings().capacity
    ) {
      cauldron.classList.remove('isDragOver');
      return;
    }
    event.preventDefault();
    event.dataTransfer.dropEffect = 'copy';
    cauldron.classList.add('isDragOver');
  });

  cauldron.addEventListener('dragleave', (event) => {
    if (event.relatedTarget instanceof Node && cauldron.contains(event.relatedTarget)) return;
    cauldron.classList.remove('isDragOver');
  });

  cauldron.addEventListener('drop', (event) => {
    event.preventDefault();
    cauldron.classList.remove('isDragOver');
    if (!event.dataTransfer?.types.includes('application/x-alchemist-ingredient')) return;
    const id = event.dataTransfer.getData('application/x-alchemist-ingredient');
    if (addIngredient(id)) onChange();
  });

  state.cauldronIngredients.forEach((id) => {
    const ingredient = INGREDIENTS.find((item) => item.id === id);
    if (!ingredient) return;
    const li = document.createElement('li');
    const icon = document.createElement('img');
    icon.classList.add('floatingIngredient');
    icon.src = ingredient.image;
    icon.alt = ingredient.name;
    icon.draggable = false;
    li.append(icon);
    cauldronList.appendChild(li);
  });

  const cleanButton = document.createElement('button');
  cleanButton.type = 'button';
  cleanButton.dataset.action = 'pour-out';
  cleanButton.setAttribute('aria-keyshortcuts', 'o');
  cleanButton.disabled = state.isPaused || state.cauldronIngredients.length === 0;
  cleanButton.classList.add('cauldronButton');
  cleanButton.textContent = 'Pour Out';
  cleanButton.addEventListener('click', () => {
    pourOut();
    onChange();
  });

  const brewButton = document.createElement('button');
  brewButton.type = 'button';
  brewButton.dataset.action = 'brew';
  brewButton.setAttribute('aria-keyshortcuts', 'b');
  brewButton.disabled = !state.isStarted || state.cauldronIngredients.length === 0;
  brewButton.classList.add('cauldronButton');
  brewButton.textContent = 'Brew';
  brewButton.addEventListener('click', () => {
    const success = brewCheck();
    onChange();
    if (success !== null) showBrewResult(success);
  });

  cauldron.append(cauldronTitle, cleanButton, brewButton, cauldronList);
  return cauldron;
}
