import './brew-animation.scss';

function animate(element: HTMLElement, className: string, animationName: string): void {
  element.classList.remove(className);
  void element.offsetWidth;
  element.classList.add(className);

  element.addEventListener('animationend', function stopAnimation(event) {
    if (event.target !== element || event.animationName !== animationName) return;
    element.classList.remove(className);
    element.removeEventListener('animationend', stopAnimation);
  });
}

export function showBrewResult(isSuccess: boolean): void {
  const cauldron = document.querySelector<HTMLElement>('.cauldron, .gameOverScreen');
  const app = document.querySelector<HTMLElement>('#app');
  if (!cauldron || !app) return;

  cauldron.classList.remove('isSuccess', 'isExplosion');
  app.classList.remove('isShaking');
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  animate(cauldron, isSuccess ? 'isSuccess' : 'isExplosion', isSuccess ? 'success' : 'explosion');
  if (!isSuccess) animate(app, 'isShaking', 'shake');
}
