import type { Difficulty, IRecipe } from '../data/recipes';

export function getRecipe(recipes: IRecipe[], difficulty: Difficulty): IRecipe | null {
  const availableRecipes = recipes.filter((recipe) => recipe.difficulty === difficulty);
  const index = Math.floor(Math.random() * availableRecipes.length);
  return availableRecipes[index] ?? null;
}
