import './recipe-panel.scss';
import { getSettings, state } from '../../state/game-state';

export function createRecipePanel(): HTMLElement {
  const recipe = state.recipe;

  const recipePanel = document.createElement('div');
  recipePanel.classList.add('recipePanel');

  const recipeName = document.createElement('h2');
  recipeName.classList.add('recipeName');
  recipeName.textContent = `Recipe: ${state.recipe?.name ?? 'No recipe'}`;

  const counter = document.createElement('p');
  counter.classList.add('ingredientCounter');
  counter.setAttribute('aria-live', 'polite');
  counter.textContent = `Added: ${state.cauldronIngredients.length} / ${getSettings().capacity}`;
  counter.classList.toggle('isFull', state.cauldronIngredients.length >= getSettings().capacity);
  if (state.cauldronIngredients.length >= getSettings().capacity) {
    counter.textContent += '- Cauldron full';
  }

  if (!recipe) {
    recipePanel.append(recipeName, counter);
    return recipePanel;
  }

  const targetRangersBlock = document.createElement('div');
  targetRangersBlock.classList.add('targetRangersBlock');

  const rangerFirstBlock = document.createElement('div');
  rangerFirstBlock.classList.add('rangerBlock');
  const rangerFirstBlockTitle = document.createElement('p');
  rangerFirstBlockTitle.textContent = 'Temperature:';
  const rangerFirstInfoBlock = document.createElement('p');
  rangerFirstInfoBlock.textContent = `${recipe?.temperature.min}...${recipe?.temperature.max}`;
  rangerFirstBlock.append(rangerFirstBlockTitle, rangerFirstInfoBlock);

  const rangerSecondBlock = document.createElement('div');
  rangerSecondBlock.classList.add('rangerBlock');
  const rangerSecondBlockTitle = document.createElement('p');
  rangerSecondBlockTitle.textContent = 'Density:';
  const rangerSecondInfoBlock = document.createElement('p');
  rangerSecondInfoBlock.textContent = `${recipe?.density.min}...${recipe?.density.max}`;
  rangerSecondBlock.append(rangerSecondBlockTitle, rangerSecondInfoBlock);

  const rangerThirdBlock = document.createElement('div');
  rangerThirdBlock.classList.add('rangerBlock');
  const rangerThirdBlockTitle = document.createElement('p');
  rangerThirdBlockTitle.textContent = 'Magic Power:';
  const rangerThirdInfoBlock = document.createElement('p');
  rangerThirdInfoBlock.textContent = `${recipe?.magicPower.min}...${recipe?.magicPower.max}`;
  rangerThirdBlock.append(rangerThirdBlockTitle, rangerThirdInfoBlock);

  targetRangersBlock.append(rangerFirstBlock, rangerSecondBlock, rangerThirdBlock);

  recipePanel.append(recipeName, counter, targetRangersBlock);

  return recipePanel;
}
