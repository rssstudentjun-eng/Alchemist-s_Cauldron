import { readLeaderboard, clearLeaderboard, formatResultDate } from '../../storage/leaderboard';

export function openLeaderboard(): void {
  const dialog = document.createElement('dialog');
  dialog.classList.add('leaderboardDialog');
  dialog.setAttribute('aria-label', 'Level 1 leaderboard');

  function render(): void {
    const title = document.createElement('h2');
    title.textContent = 'Level 1 � Top-10';
    const { entries, error } = readLeaderboard();
    const message = document.createElement('p');
    message.setAttribute('role', 'status');
    message.textContent = error || (entries.length === 0 ? 'No results yet.' : '');
    const table = document.createElement('table');
    const head = document.createElement('thead');
    const header = document.createElement('tr');
    ['Rank', 'Name', 'Score', 'Date'].forEach((label) => {
      const cell = document.createElement('th');
      cell.scope = 'col';
      cell.textContent = label;
      header.append(cell);
    });
    head.append(header);
    const body = document.createElement('tbody');
    entries.forEach((entry, index) => {
      const row = document.createElement('tr');
      [String(index + 1), entry.name, String(entry.score), formatResultDate(entry.date)].forEach(
        (value) => {
          const cell = document.createElement('td');
          cell.textContent = value;
          row.append(cell);
        },
      );
      body.append(row);
    });
    table.append(head, body);
    const clearButton = document.createElement('button');
    clearButton.type = 'button';
    clearButton.textContent = 'Clear Leaderboard';
    clearButton.addEventListener('click', () => {
      const confirmation = document.createElement('dialog');
      confirmation.classList.add('confirmationDialog');
      confirmation.setAttribute('aria-label', 'Clear leaderboard confirmation');
      const question = document.createElement('p');
      question.textContent = 'Delete all Level 1 results?';
      const confirm = document.createElement('button');
      confirm.type = 'button';
      confirm.textContent = 'Clear';
      const cancel = document.createElement('button');
      cancel.type = 'button';
      cancel.textContent = 'Cancel';
      confirm.addEventListener('click', () => {
        const clearError = clearLeaderboard();
        confirmation.close();
        if (clearError) message.textContent = clearError;
        else render();
      });
      cancel.addEventListener('click', () => confirmation.close());
      confirmation.addEventListener('close', () => confirmation.remove());
      confirmation.append(question, confirm, cancel);
      document.body.append(confirmation);
      confirmation.showModal();
    });
    const close = document.createElement('button');
    close.type = 'button';
    close.textContent = 'Close';
    close.addEventListener('click', () => dialog.close());
    dialog.replaceChildren(title, message, table, clearButton, close);
  }

  dialog.addEventListener('close', () => dialog.remove());
  render();
  document.body.append(dialog);
  dialog.showModal();
}

export function createLeaderboardButton(): HTMLButtonElement {
  const button = document.createElement('button');
  button.type = 'button';
  button.classList.add('newGameButton');
  button.textContent = 'Leaderboard';
  button.addEventListener('click', openLeaderboard);
  return button;
}
