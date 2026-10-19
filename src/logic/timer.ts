import { state } from '../state/game-state';
import { LEVEL_ONE } from '../data/difficulty';
import { endGame } from './end-game';

let timer: ReturnType<typeof setInterval> | undefined;

export function stopTimer(): void {
  clearInterval(timer);
  timer = undefined;
}

export function updateTime(): void {
  if (!state.isStarted) return;
  state.timeLeft = Math.max(0, Math.ceil((state.endTime - Date.now()) / 1000));
  if (state.timeLeft === 0) endGame('Time is up!');
}

export function addTimeBonus(): void {
  const now = Date.now();
  if (!state.isStarted) return;
  state.endTime = Math.min(
    state.endTime + LEVEL_ONE.timeReward * 1000,
    now + LEVEL_ONE.initialTime * 1000,
  );
  updateTime();
}

export function startTimer(onTick: () => void): void {
  stopTimer();
  timer = setInterval(() => {
    updateTime();
    onTick();
    if (!state.isStarted) stopTimer();
  }, 200);
}

export function formatTime(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainder = seconds % 60;
  return `${minutes.toString().padStart(2, '0')}:${remainder.toString().padStart(2, '0')}`;
}
