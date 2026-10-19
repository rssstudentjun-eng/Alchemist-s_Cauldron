export function createPauseDialog(onResume: () => void, onExit: () => void): HTMLDialogElement {
  const dialog = document.createElement('dialog');
  dialog.classList.add('pauseDialog');
  dialog.setAttribute('aria-labelledby', 'pauseTitle');

  const title = document.createElement('h2');
  title.id = 'pauseTitle';
  title.textContent = 'Game paused';

  const resumeButton = document.createElement('button');
  resumeButton.type = 'button';
  resumeButton.textContent = 'Resume';
  resumeButton.addEventListener('click', onResume);

  const exitButton = document.createElement('button');
  exitButton.type = 'button';
  exitButton.textContent = 'Exit to Menu';
  exitButton.addEventListener('click', onExit);

  dialog.addEventListener('cancel', (event) => {
    event.preventDefault();
    onResume();
  });
  dialog.append(title, resumeButton, exitButton);
  return dialog;
}
