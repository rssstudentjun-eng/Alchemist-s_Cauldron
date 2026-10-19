import './bars.scss';
import { calculateCauldron } from '../../logic/calculate-cauldron';

import { state } from '../../state/game-state';
import { createBarItem } from './bar-item/bar-item';

export interface BarItemValue {
  title: string;
  id: string;
  barValue: number;
  targetMin: number;
  targetMax: number;
}

function getBarValues(): BarItemValue[] {
  const { temperature, density, magicPower } = calculateCauldron(state.cauldronIngredients);
  const recipe = state.recipe;
  if (!recipe) return [];

  return [
    {
      title: 'Temperature',
      id: 'temperature',
      barValue: temperature,
      targetMin: recipe.temperature.min,
      targetMax: recipe.temperature.max,
    },
    {
      title: 'Density',
      id: 'density',
      barValue: density,
      targetMin: recipe.density.min,
      targetMax: recipe.density.max,
    },
    {
      title: 'Magic Power',
      id: 'magicPower',
      barValue: magicPower,
      targetMin: recipe.magicPower.min,
      targetMax: recipe.magicPower.max,
    },
  ];
}

function toPercent(value: number): number {
  return Math.max(0, Math.min(100, ((value + 100) / 200) * 100));
}

export function createBars(): HTMLElement {
  const bars = document.createElement('div');
  bars.classList.add('bars');

  getBarValues().forEach((value) => {
    bars.append(createBarItem(value));
  });

  return bars;
}

export function updateBars(): void {
  getBarValues().forEach((value) => {
    const bar = document.getElementById(`bar-${value.id}`);
    if (!bar) return;

    const number = bar.querySelector<HTMLElement>('.barValue');
    const target = bar.querySelector<HTMLElement>('.barTarget');
    const marker = bar.querySelector<HTMLElement>('.barMarker');
    if (!number || !target || !marker) return;

    number.textContent = `${value.barValue} | Target: ${value.targetMin} to ${value.targetMax}`;
    target.style.left = `${toPercent(value.targetMin)}%`;
    target.style.width = `${toPercent(value.targetMax) - toPercent(value.targetMin)}%`;
    marker.style.left = `${toPercent(value.barValue)}%`;

    const isInRange = value.barValue >= value.targetMin && value.barValue <= value.targetMax;
    bar.classList.toggle('isInRange', isInRange);
  });
}
