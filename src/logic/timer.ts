import { state } from '../state/game-state';

let timer: ReturnType<typeof setInterval> | undefined;

export function stopTimer(): void {
  clearInterval(timer);
  timer = undefined;
}

export function startTimer(onTick: () => void): void {
  stopTimer();
  timer = setInterval(() => {
    if (!state.isStarted) {
      stopTimer();
      return;
    }
    state.timeLeft = Math.max(0, state.timeLeft - 1);
    if (state.timeLeft === 0) {
      state.isStarted = false;
      state.message = 'Time is up!';
      stopTimer();
    }
    onTick();
  }, 1000);
}
