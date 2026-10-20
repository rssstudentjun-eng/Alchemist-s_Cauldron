import type { Difficulty } from './recipes';

export interface DifficultySettings {
  title: string;
  shelfSize: number;
  reactionCount: number;
  capacity: number;
  tolerance: number;
  initialLives: number;
  initialTime: number;
  maximumTime: number;
  scoreReward: number;
  timeReward: number;
}

export const DIFFICULTY_SETTINGS: Record<Difficulty, DifficultySettings> = {
  easy: {
    title: 'Easy',
    shelfSize: 4,
    reactionCount: 0,
    capacity: 4,
    tolerance: 12,
    initialLives: 5,
    initialTime: 180,
    maximumTime: 180,
    scoreReward: 100,
    timeReward: 15,
  },
  medium: {
    title: 'Medium',
    shelfSize: 6,
    reactionCount: 2,
    capacity: 4,
    tolerance: 8,
    initialLives: 3,
    initialTime: 150,
    maximumTime: 150,
    scoreReward: 200,
    timeReward: 10,
  },
  hard: {
    title: 'Hard',
    shelfSize: 8,
    reactionCount: 3,
    capacity: 5,
    tolerance: 5,
    initialLives: 3,
    initialTime: 150,
    maximumTime: 150,
    scoreReward: 300,
    timeReward: 5,
  },
};
