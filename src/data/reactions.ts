import type { Difficulty } from './recipes';
import { DIFFICULTY_SETTINGS } from './difficulty';

interface CauldronValues {
  temperature: number;
  density: number;
  magicPower: number;
}

interface IReaction {
  id: string;
  name: string;
  ingredients: string[];
  timePenalty: number;
  lifePenalty: number;
  apply: (values: CauldronValues) => CauldronValues;
}

// Medium uses the first two reactions. Hard also enables Volatile Mix.
export const reactions: IReaction[] = [
  {
    id: 'bubbling',
    name: 'Bubbling',
    ingredients: ['fairy-dust', 'caustic-acid'],
    timePenalty: 10,
    lifePenalty: 0,
    apply: (values) => ({ ...values, magicPower: values.magicPower * 1.5 }),
  },
  {
    id: 'solar-frost',
    name: 'Solar Frost',
    ingredients: ['dragon-tears', 'frost-lotus'],
    timePenalty: 0,
    lifePenalty: 0,
    apply: (values) => ({ ...values, temperature: 0, density: values.density * 1.2 }),
  },
  {
    id: 'volatile-mix',
    name: 'Volatile Mix',
    ingredients: ['phoenix-feather', 'essence-of-the-void'],
    timePenalty: 0,
    lifePenalty: 1,
    apply: () => ({ temperature: 0, density: 0, magicPower: 0 }),
  },
];

export function getActiveReactions(ids: string[], difficulty: Difficulty): IReaction[] {
  return reactions
    .slice(0, DIFFICULTY_SETTINGS[difficulty].reactionCount)
    .filter((reaction) => reaction.ingredients.every((id) => ids.includes(id)));
}
