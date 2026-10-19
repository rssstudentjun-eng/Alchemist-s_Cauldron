export interface LeaderboardEntry {
  name: string;
  score: number;
  date: number;
}

const LEADERBOARD_KEY = 'alchemist-level-one-top10';

export function isValidPlayerName(name: string): boolean {
  return /^[\p{L}\p{N} _-]{2,15}$/u.test(name) && name.trim().length > 0;
}

function sortEntries(entries: LeaderboardEntry[]): LeaderboardEntry[] {
  return entries
    .sort((first, second) => second.score - first.score || first.date - second.date)
    .slice(0, 10);
}

export function readLeaderboard(): { entries: LeaderboardEntry[]; error: string } {
  try {
    const data: unknown = JSON.parse(localStorage.getItem(LEADERBOARD_KEY) ?? '[]');
    if (!Array.isArray(data)) throw new Error('Invalid leaderboard');
    const entries: LeaderboardEntry[] = [];
    for (const entry of data) {
      if (!entry || typeof entry !== 'object') continue;
      if (typeof entry.name !== 'string' || !isValidPlayerName(entry.name)) continue;
      if (typeof entry.score !== 'number' || !Number.isInteger(entry.score) || entry.score < 0)
        continue;
      if (
        typeof entry.date !== 'number' ||
        !Number.isFinite(entry.date) ||
        Number.isNaN(new Date(entry.date).getTime())
      )
        continue;
      entries.push({ name: entry.name, score: entry.score, date: entry.date });
    }
    return { entries: sortEntries(entries), error: '' };
  } catch {
    return { entries: [], error: 'Leaderboard could not be loaded.' };
  }
}

export function isTopScore(entries: LeaderboardEntry[], score: number, date: number): boolean {
  if (entries.length < 10) return true;
  const last = entries[entries.length - 1];
  return !!last && (score > last.score || (score === last.score && date < last.date));
}

export function saveResult(name: string, score: number, date: number): string {
  if (!isValidPlayerName(name)) return 'Use letters, digits, spaces, _ or -.';
  if (!Number.isInteger(score) || score < 0 || !Number.isFinite(date)) return 'Invalid result.';
  const { entries, error } = readLeaderboard();
  if (error) return error;
  if (!isTopScore(entries, score, date)) return 'This result is no longer in the Top-10.';
  try {
    localStorage.setItem(
      LEADERBOARD_KEY,
      JSON.stringify(sortEntries([...entries, { name, score, date }])),
    );
    return '';
  } catch {
    return 'Result could not be saved. Please try again.';
  }
}

export function clearLeaderboard(): string {
  try {
    localStorage.removeItem(LEADERBOARD_KEY);
    return '';
  } catch {
    return 'Leaderboard could not be cleared.';
  }
}

export function formatResultDate(timestamp: number): string {
  const date = new Date(timestamp);
  const pad = (value: number) => value.toString().padStart(2, '0');
  return `${pad(date.getDate())}.${pad(date.getMonth() + 1)}.${date.getFullYear()} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
}
