import type { Difficulty } from './recipes';

export const LEVEL_ONE = {
  title: 'Medium',
  shelfSize: 6,
  reactionCount: 0,
  capacity: 4,
  tolerance: 8,
  initialLives: 3,
  initialTime: 150,
  maximumTime: 150,
  scoreReward: 200,
  timeReward: 10,
};

export const DIFFICULTY_SETTINGS: Partial<Record<Difficulty, typeof LEVEL_ONE>> = {
  medium: LEVEL_ONE,
};
