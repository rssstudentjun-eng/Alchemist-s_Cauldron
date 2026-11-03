import { achievements, type Achievement } from '../data/achievements';
import { state } from '../state/game-state';
import { playerStats, savePlayerStats } from '../storage/player-stats';

export function checkAchievements(): Achievement[] {
  const unlocked = achievements.filter(
    (achievement) =>
      !playerStats.unlockedAchievementIds.includes(achievement.id) &&
      achievement.isUnlocked(playerStats, state),
  );

  unlocked.forEach((achievement) => {
    playerStats.unlockedAchievementIds.push(achievement.id);
  });
  if (unlocked.length > 0) savePlayerStats();
  return unlocked;
}
