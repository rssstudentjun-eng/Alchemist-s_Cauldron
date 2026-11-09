import { achievements } from '../../data/achievements';
import { playerStats } from '../../storage/player-stats';
import lock from '../../assets/icons/recipe-book-icons/lock.svg';
import './achievements.scss';

function openAchievements(): void {
  const dialog = document.createElement('dialog');
  dialog.classList.add('achievementsDialog');
  dialog.setAttribute('aria-label', 'Achievements');
  const title = document.createElement('h2');
  title.textContent = 'Achievements';
  const list = document.createElement('ul');
  list.classList.add('achievementsList');

  achievements.forEach((achievement) => {
    const isUnlocked = playerStats.unlockedAchievementIds.includes(achievement.id);
    const item = document.createElement('li');
    item.classList.add('achievementItem');
    item.classList.toggle('isUnlocked', isUnlocked);
    const icon = document.createElement('img');
    icon.classList.add('achievementIcon');
    icon.src = achievement.icon;
    icon.alt = '';
    icon.width = 56;
    icon.height = 56;
    const info = document.createElement('div');
    info.classList.add('achievementInfo');
    const name = document.createElement('h3');
    name.textContent = achievement.title;
    const description = document.createElement('p');
    description.textContent = achievement.description;
    const status = document.createElement('p');
    status.classList.add('achievementStatus');
    if (!isUnlocked) {
      const lockIcon = document.createElement('img');
      lockIcon.src = lock;
      lockIcon.alt = '';
      lockIcon.width = 16;
      lockIcon.height = 16;
      status.append(lockIcon);
    }
    status.append(isUnlocked ? 'Unlocked' : 'Locked');
    info.append(name, description, status);
    if (achievement.getProgress) {
      const progress = document.createElement('p');
      progress.classList.add('achievementProgress');
      progress.textContent = `Progress: ${achievement.getProgress(playerStats)}`;
      info.append(progress);
    }
    item.append(icon, info);
    list.append(item);
  });

  const close = document.createElement('button');
  close.type = 'button';
  close.classList.add('newGameButton');
  close.textContent = 'Close';
  close.addEventListener('click', () => dialog.close());
  dialog.addEventListener('close', () => dialog.remove());
  const hint = document.createElement('p');
  hint.textContent = 'Play on different difficulties to discover more recipes.';
  dialog.append(title, hint, list, close);
  document.body.append(dialog);
  dialog.showModal();
}

export function createAchievementsButton(): HTMLButtonElement {
  const button = document.createElement('button');
  button.type = 'button';
  button.classList.add('newGameButton');
  button.textContent = 'Achievements';
  button.addEventListener('click', openAchievements);
  return button;
}
