import type { Difficulty } from './recipes';
import { DIFFICULTY_SETTINGS } from './difficulty';

interface CauldronValues {
  temperature: number;
  density: number;
  magicPower: number;
}

export interface IReaction {
  id: string;
  name: string;
  description: string;
  isActive: (ids: string[]) => boolean;
  timePenalty: number;
  lifePenalty: number;
  clearsCauldron: boolean;
  apply: (values: CauldronValues) => CauldronValues;
}

export const reactions: IReaction[] = [
  {
    id: 'bubbling',
    name: 'Bubbling',
    description: 'Fairy Dust + Caustic Acid increases Magic Power by 50% and costs 10 seconds.',
    isActive: (ids) => ids.includes('fairy-dust') && ids.includes('caustic-acid'),
    timePenalty: 10,
    lifePenalty: 0,
    clearsCauldron: false,
    apply: (values) => ({ ...values, magicPower: values.magicPower * 1.5 }),
  },
  {
    id: 'solar-frost',
    name: 'Solar Frost',
    description: 'Dragon Tears + Frost Lotus sets Temperature to 0 and increases Density by 20%.',
    isActive: (ids) => ids.includes('dragon-tears') && ids.includes('frost-lotus'),
    timePenalty: 0,
    lifePenalty: 0,
    clearsCauldron: false,
    apply: (values) => ({ ...values, temperature: 0, density: values.density * 1.2 }),
  },
  {
    id: 'volatile-mix',
    name: 'Volatile Mix',
    description: 'Phoenix Feather + Essence of the Void costs one life and empties the cauldron.',
    isActive: (ids) => ids.includes('phoenix-feather') && ids.includes('essence-of-the-void'),
    timePenalty: 0,
    lifePenalty: 1,
    clearsCauldron: true,
    apply: () => ({ temperature: 0, density: 0, magicPower: 0 }),
  },
];

export function getActiveReactions(ids: string[], difficulty: Difficulty): IReaction[] {
  return reactions
    .slice(0, DIFFICULTY_SETTINGS[difficulty].reactionCount)
    .filter((reaction) => reaction.isActive(ids));
}
