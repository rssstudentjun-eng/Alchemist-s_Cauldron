import { state } from '../state/game-state';

export function clearCauldron(): void {
  state.cauldronIngredients = [];
}
