import type { Difficulty } from '../../data/recipes';
import { state } from '../../state/game-state';
import { readLeaderboard, clearLeaderboard, formatResultDate } from '../../storage/leaderboard';

export function openLeaderboard(): void {
  let difficulty: Difficulty = state.difficulty;
  const dialog = document.createElement('dialog');
  dialog.classList.add('leaderboardDialog');
  dialog.setAttribute('aria-label', 'Leaderboard');

  function render(): void {
    const title = document.createElement('h2');
    title.textContent = `${difficulty} - Top-10`;
    const { entries, error } = readLeaderboard(difficulty);
    const message = document.createElement('p');
    message.setAttribute('role', 'status');
    message.textContent = error || (entries.length === 0 ? 'No results yet.' : '');
    const table = document.createElement('table');
    const head = document.createElement('thead');
    const header = document.createElement('tr');
    ['Rank', 'Name', 'Difficulty', 'Score', 'Date'].forEach((label) => {
      const cell = document.createElement('th');
      cell.scope = 'col';
      cell.textContent = label;
      header.append(cell);
    });
    head.append(header);
    const body = document.createElement('tbody');
    entries.forEach((entry, index) => {
      const row = document.createElement('tr');
      [
        String(index + 1),
        entry.name,
        difficulty,
        String(entry.score),
        formatResultDate(entry.date),
      ].forEach((value) => {
        const cell = document.createElement('td');
        cell.textContent = value;
        row.append(cell);
      });
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
      question.textContent = `Delete all ${difficulty} results?`;
      const confirm = document.createElement('button');
      confirm.type = 'button';
      confirm.textContent = 'Clear';
      const cancel = document.createElement('button');
      cancel.type = 'button';
      cancel.textContent = 'Cancel';
      confirm.addEventListener('click', () => {
        const clearError = clearLeaderboard(difficulty);
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
    const tabs = document.createElement('div');
    const difficulties: Difficulty[] = ['easy', 'medium', 'hard'];
    difficulties.forEach((item) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.textContent = item[0]?.toUpperCase() + item.slice(1);
      button.setAttribute('aria-pressed', String(item === difficulty));
      button.addEventListener('click', () => {
        difficulty = item;
        render();
      });
      tabs.append(button);
    });
    dialog.replaceChildren(title, tabs, message, table, clearButton, close);
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
