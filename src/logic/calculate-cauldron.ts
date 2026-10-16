import { INGREDIENTS } from '../data/ingredients';

export function calculateCauldron(ids: string[]) {
  const totals = { temperature: 0, density: 0, magicPower: 0 };
  ids.forEach((id) => {
    const ingredient = INGREDIENTS.find((item) => item.id === id);
    if (!ingredient) return;
    totals.temperature += ingredient.temperature;
    totals.density += ingredient.density;
    totals.magicPower += ingredient.magicPower;
  });
  return totals;
}
