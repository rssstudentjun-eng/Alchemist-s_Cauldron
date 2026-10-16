import './cauldron.scss';
import { INGREDIENTS } from '../../data/ingredients';
import { state } from '../../state/game-state';
import { brewCheck } from '../../logic/brew-check';

export function createCauldron(onChange: () => void): HTMLElement {
  const cauldron = document.createElement('div');
  cauldron.classList.add('cauldron');

  const cauldronTitle = document.createElement('h2');
  cauldronTitle.classList.add('cauldronTitle');
  cauldronTitle.textContent = 'Cauldron';

  const cauldronList = document.createElement('ul');
  cauldronList.classList.add('cauldronList');

  state.cauldronIngredients.forEach((id) => {
    const li = document.createElement('li');
    li.textContent = INGREDIENTS.find((ingredient) => ingredient.id === id)?.name ?? id;
    cauldronList.appendChild(li);
  });
  // ========
  const cleanButton = document.createElement('button');
  cleanButton.type = 'button';
  cleanButton.classList.add('cauldronButton');
  cleanButton.textContent = 'Clean Cauldron';
  cleanButton.addEventListener('click', () => {
    state.cauldronIngredients = [];
    onChange();
  });

  const brewButton = document.createElement('button');
  brewButton.type = 'button';
  brewButton.classList.add('cauldronButton');
  brewButton.textContent = 'Brew';
  brewButton.addEventListener('click', () => {
    console.log('Brew');
    brewCheck();
    // state.cauldronIngredients = [];
    // onChange();
  });
  // ========

  cauldron.append(cauldronTitle, cleanButton, brewButton, cauldronList);
  return cauldron;
}
