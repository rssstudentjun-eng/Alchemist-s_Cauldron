import { INGREDIENTS } from '../data/ingredients';
import type { Difficulty } from '../data/recipes';
import { getActiveReactions } from '../data/reactions';

export function calculateCauldron(ids: string[], difficulty: Difficulty) {
  let totals = { temperature: 0, density: 0, magicPower: 0 };
  ids.forEach((id) => {
    const ingredient = INGREDIENTS.find((item) => item.id === id);
    if (!ingredient) return;
    totals.temperature += ingredient.temperature;
    totals.density += ingredient.density;
    totals.magicPower += ingredient.magicPower;
  });
  getActiveReactions(ids, difficulty).forEach((reaction) => {
    totals = reaction.apply(totals);
  });
  return totals;
}
