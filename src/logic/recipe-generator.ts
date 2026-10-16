import { type IRecipe } from '../data/recipes';

export function getRecipe(recipes: IRecipe[]): IRecipe | null {
  const index = Math.floor(Math.random() * recipes.length);

  return recipes[index] ?? null;
}
