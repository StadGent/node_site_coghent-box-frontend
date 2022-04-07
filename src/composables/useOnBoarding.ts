import { router } from '@/router';
import { ref } from 'vue';

export type OnBoardingStatus = 'started' | 'ended';

const onBoardingSteps: Array<string> = [
  'goToTouchTable',
  'fillStoryBasket',
  'lookAtOtherPictures',
  'backToOverviewPage',
];

export type OnBoardingStep = typeof onBoardingSteps[number];

export type OnBoardingState = {
  status: OnBoardingStatus;
  currentStepNumber: number;
  currentStepName: OnBoardingStep;
};

const onBoardingState = ref<OnBoardingState>({
  status: 'started',
  currentStepNumber: 0,
  currentStepName: onBoardingSteps[0],
});

export const useOnBoarding = () => {
  const changeOnBoardingStatus = (input: OnBoardingStatus) => {
    onBoardingState.value.status = input;
  };

  const goToNextStep = () => {
    const currentStepIndex = onBoardingState.value.currentStepNumber + 1;
    onBoardingState.value.currentStepNumber = currentStepIndex;
    onBoardingState.value.currentStepName = onBoardingSteps[currentStepIndex];
    if (onBoardingState.value.currentStepNumber == onBoardingSteps.length) {
      changeOnBoardingStatus('ended');
    }
  };

  const goToPreviousStep = () => {
    const currentStepIndex = onBoardingState.value.currentStepNumber - 1;
    onBoardingState.value.currentStepNumber = currentStepIndex;
    onBoardingState.value.currentStepName = onBoardingSteps[currentStepIndex];
    if (onBoardingState.value.currentStepName == 'goToTouchTable') {
      router.push('stories');
    }
  };

  const resetOnBoardingState = () => {
    changeOnBoardingStatus('started');
    onBoardingState.value.currentStepNumber = 0;
    onBoardingState.value.currentStepName = onBoardingSteps[0];
  };

  return {
    changeOnBoardingStatus,
    goToNextStep,
    goToPreviousStep,
    resetOnBoardingState,
    onBoardingState,
  };
};
