import './bars.scss';
import { INGREDIENTS } from '../../data/ingredients';
import { state } from '../../state/game-state';
import { createBarItem } from './bar-item/bar-item';

export interface BarItemValue {
  title: string;
  id: string;
  barValue: number;
}

export function createBars(): HTMLElement {
  const bars = document.createElement('div');
  bars.classList.add('bars');

  let temperature = 0;
  let density = 0;
  let magicPower = 0;

  console.log('state.cauldronIngredients', state.cauldronIngredients);

  state.cauldronIngredients.forEach((id) => {
    const ingredient = INGREDIENTS.find((item) => item.id === id);

    if (!ingredient) return;

    temperature += ingredient.temperature;
    density += ingredient.density;
    magicPower += ingredient.magicPower;
  });
  const values: BarItemValue[] = [
    { title: 'Temperature', id: 'temperature', barValue: temperature },
    { title: 'Density', id: 'density', barValue: density },
    { title: 'Magic Power', id: 'magicPower', barValue: magicPower },
  ];

  values.forEach((value) => {
    bars.append(createBarItem(value));
  });

  return bars;
}
