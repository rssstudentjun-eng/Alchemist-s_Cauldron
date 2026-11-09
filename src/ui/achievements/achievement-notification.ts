import type { Achievement } from '../../data/achievements';
import trophy from '../../assets/icons/recipe-book-icons/trophy.svg';
import './achievement-notification.scss';

const notification = document.createElement('div');
notification.classList.add('achievementNotification');
notification.setAttribute('role', 'status');
notification.setAttribute('aria-atomic', 'true');
document.body.append(notification);

const titles: string[] = [];
let timeout: ReturnType<typeof setTimeout> | undefined;

export function showAchievementNotification(achievements: Achievement[]): void {
  if (achievements.length === 0) return;
  clearTimeout(timeout);
  titles.push(...achievements.map((achievement) => achievement.title));

  const icon = document.createElement('img');
  icon.src = trophy;
  icon.alt = '';
  icon.width = 40;
  icon.height = 40;
  const message = document.createElement('p');
  message.textContent = `Achievements unlocked: ${titles.join(', ')}!`;
  notification.replaceChildren(icon, message);

  timeout = setTimeout(() => {
    notification.replaceChildren();
    titles.length = 0;
  }, 6000);
}
