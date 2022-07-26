import { ref } from 'vue';
import { useBoxVisiter } from 'coghent-vue-3-component-library';
import { apolloClient } from '@/main';
import { timer } from 'd3';

export type TimerSettings = {
  timer: any;
  timerSeconds: number;
  timeLeft: undefined | number;
  tracker: any;
  showModalTime: number;
};

const timerSettings = ref<TimerSettings>({
  timer: undefined,
  timerSeconds: 120,
  timeLeft: undefined,
  tracker: undefined,
  showModalTime: 20,
});

export const useInactiveTimer = () => {
  const initiateTimer = () => {
    initiateActivityTracker();
    timerSettings.value.timer = setTimeout(() => {
      logOut();
    }, timerSettings.value.timerSeconds * 1000);
    trackTimeLeft();
  };

  const trackTimeLeft = () => {
    timerSettings.value.timeLeft = timerSettings.value.timerSeconds;
    timerSettings.value.tracker = setInterval(() => {
      if (timerSettings.value.timeLeft) {
        timerSettings.value.timeLeft = timerSettings.value.timeLeft - 1;
      }
    }, 1000);
  };

  const initiateActivityTracker = () => {
    window.addEventListener('click', resetTimer);
    window.addEventListener('scroll', resetTimer);
  };

  const resetTimer = () => {
    clearTimeout(timerSettings.value.timer);
    clearInterval(timerSettings.value.tracker);
    initiateTimer();
  };

  const logOut = () => {
    const { resetBoxVisiter } = useBoxVisiter(apolloClient);
    resetBoxVisiter();
    window.location.href = '/touchtable/start';
  };

  return { initiateTimer, initiateActivityTracker, resetTimer, logOut, timerSettings };
};
