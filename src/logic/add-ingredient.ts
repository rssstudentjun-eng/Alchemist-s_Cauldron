import { actualIngredients, MAX_CAULDRON_ITEMS, state } from '../state/game-state';

export function addIngredient(id: string): boolean {
  const quantity = state.shelfStock[id] ?? 0;

  if (
    !state.isStarted ||
    !actualIngredients.some((ingredient) => ingredient.id === id) ||
    quantity <= 0 ||
    state.cauldronIngredients.length >= MAX_CAULDRON_ITEMS
  ) {
    return false;
  }

  state.shelfStock[id] = quantity - 1;
  state.cauldronIngredients.push(id);
  return true;
}
