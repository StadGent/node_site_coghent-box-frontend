import { ref } from 'vue';
import { useBoxVisiter } from 'coghent-vue-3-component-library';
import { apolloClient } from '@/main';

export const logOut = () => {
  const { resetBoxVisiter } = useBoxVisiter(apolloClient);
  resetBoxVisiter();
  window.location.href = '/touchtable/start';
};

export type TimerSettings = {
  timerSeconds: number;
  showModalTime: number;
  enableActivityTracker: Boolean;
  timerFunction: Function;
};

export type TimerState = {
  timer: any;
  timeLeft: undefined | number;
  tracker: any;
};

const timerSettings = ref<TimerSettings>({
  timerSeconds: 120,
  showModalTime: 20,
  enableActivityTracker: true,
  timerFunction: logOut,
});

const timerState = ref<TimerState>({
  timer: undefined,
  timeLeft: undefined,
  tracker: undefined,
});

export const useInactiveTimer = () => {
  const overwriteTimerSettings = (settings: TimerSettings) => {
    timerSettings.value = settings;
  };

  const initiateTimer = () => {
    if (timerSettings.value.enableActivityTracker) {
      initiateActivityTracker();
    }
    timerState.value.timer = setTimeout(() => {
      timerSettings.value.timerFunction();
    }, timerSettings.value.timerSeconds * 1000);
    trackTimeLeft();
  };

  const trackTimeLeft = () => {
    timerState.value.timeLeft = timerSettings.value.timerSeconds;
    timerState.value.tracker = setInterval(() => {
      if (timerState.value.timeLeft) {
        timerState.value.timeLeft = timerState.value.timeLeft - 1;
      }
    }, 1000);
  };

  const initiateActivityTracker = () => {
    window.addEventListener('click', resetTimer);
    window.addEventListener('scroll', resetTimer);
  };

  const resetTimer = () => {
    clearTimeout(timerState.value.timer);
    clearInterval(timerState.value.tracker);
    initiateTimer();
  };

  return {
    overwriteTimerSettings,
    initiateTimer,
    initiateActivityTracker,
    resetTimer,
    timerSettings,
    timerState,
  };
};
