import { recipes } from '../data/recipes';

export interface PlayerStats {
  gamesPlayed: number;
  successfulBrews: number;
  failedBrews: number;
  bestScore: number;
  discoveredRecipeIds: string[];
  unlockedAchievementIds: string[];
}

const STATS_KEY = 'alchemist-player-stats';

function createPlayerStats(): PlayerStats {
  return {
    gamesPlayed: 0,
    successfulBrews: 0,
    failedBrews: 0,
    bestScore: 0,
    discoveredRecipeIds: [],
    unlockedAchievementIds: [],
  };
}

function isValidPlayerStats(data: unknown): data is PlayerStats {
  if (!data || typeof data !== 'object') return false;
  for (const key of ['gamesPlayed', 'successfulBrews', 'failedBrews', 'bestScore']) {
    const value: unknown = Reflect.get(data, key);
    if (typeof value !== 'number' || !Number.isSafeInteger(value) || value < 0) return false;
  }
  if (!('discoveredRecipeIds' in data) || !Array.isArray(data.discoveredRecipeIds)) return false;
  const recipeIds: unknown[] = data.discoveredRecipeIds;
  if (
    !recipeIds.every((id) => typeof id === 'string' && recipes.some((recipe) => recipe.id === id))
  )
    return false;
  if (new Set(recipeIds).size !== recipeIds.length) return false;

  if (!('unlockedAchievementIds' in data) || !Array.isArray(data.unlockedAchievementIds))
    return false;
  const achievementIds: unknown[] = data.unlockedAchievementIds;
  if (!achievementIds.every((id) => typeof id === 'string' && id.trim().length > 0)) return false;
  return new Set(achievementIds).size === achievementIds.length;
}

export function loadPlayerStats(): PlayerStats {
  try {
    const saved: unknown = JSON.parse(localStorage.getItem(STATS_KEY) ?? 'null');
    if (isValidPlayerStats(saved)) return saved;
    localStorage.removeItem(STATS_KEY);
  } catch {
    return createPlayerStats();
  }
  return createPlayerStats();
}

export const playerStats: PlayerStats = loadPlayerStats();

export function savePlayerStats(): void {
  try {
    localStorage.setItem(STATS_KEY, JSON.stringify(playerStats));
  } catch {
    return;
  }
}
