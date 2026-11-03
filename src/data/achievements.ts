import type { GameState } from '../state/game-state';
import type { PlayerStats } from '../storage/player-stats';
import { recipes } from './recipes';
import firstBrew from '../assets/icons/recipe-book-icons/first-brew.svg';
import masterAlchemist from '../assets/icons/recipe-book-icons/crystal-ball.svg';
import perfectRun from '../assets/icons/recipe-book-icons/perfect-run.svg';
import explorer from '../assets/icons/recipe-book-icons/explorer.svg';
import legendaryAlchemist from '../assets/icons/recipe-book-icons/legendary-alchemist.svg';

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  isUnlocked: (stats: PlayerStats, game: GameState) => boolean;
}

export const achievements: Achievement[] = [
  {
    id: 'first-brew',
    title: 'First Brew',
    description: 'Successfully brew your first potion.',
    icon: firstBrew,
    isUnlocked: (stats) => stats.successfulBrews >= 1,
  },
  {
    id: 'master-alchemist',
    title: 'Master Alchemist',
    description: 'Successfully brew 50 potions.',
    icon: masterAlchemist,
    isUnlocked: (stats) => stats.successfulBrews >= 50,
  },
  {
    id: 'perfect-run',
    title: 'Perfect Run',
    description: 'Finish a game with at least one successful brew and no mistakes.',
    icon: perfectRun,
    isUnlocked: (_stats, game) =>
      !game.isStarted && !!game.gameOverReason && game.mistakes === 0 && game.successfulBrews > 0,
  },
  {
    id: 'explorer',
    title: 'Explorer',
    description: 'Successfully brew 10 different recipes.',
    icon: explorer,
    isUnlocked: (stats) => stats.discoveredRecipeIds.length >= 10,
  },
  {
    id: 'legendary-alchemist',
    title: 'Legendary Alchemist',
    description: 'Successfully brew every recipe.',
    icon: legendaryAlchemist,
    isUnlocked: (stats) => stats.discoveredRecipeIds.length >= recipes.length,
  },
];
