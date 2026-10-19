import { state } from '../state/game-state';
import { LEVEL_ONE } from '../data/difficulty';
import { endGame } from './end-game';

let timer: ReturnType<typeof setInterval> | undefined;

export function stopTimer(): void {
  clearInterval(timer);
  timer = undefined;
}

export function updateTime(): void {
  if (!state.isStarted || state.isPaused) return;
  state.timeLeft = Math.max(0, (state.endTime - Date.now()) / 1000);
  if (state.timeLeft === 0) endGame('Time is up!');
}

export function addTimeBonus(): void {
  const now = Date.now();
  if (!state.isStarted || state.isPaused) return;
  state.endTime = Math.min(
    state.endTime + LEVEL_ONE.timeReward * 1000,
    now + LEVEL_ONE.initialTime * 1000,
  );
  updateTime();
}

export function startTimer(onTick: () => void): void {
  stopTimer();
  if (!state.isStarted || state.isPaused) return;
  timer = setInterval(() => {
    updateTime();
    onTick();
    if (!state.isStarted || state.isPaused) stopTimer();
  }, 200);
}

export function formatTime(seconds: number): string {
  const totalSeconds = Math.ceil(seconds);
  const minutes = Math.floor(totalSeconds / 60);
  const remainder = totalSeconds % 60;
  return `${minutes.toString().padStart(2, '0')}:${remainder.toString().padStart(2, '0')}`;
}
