import { reactive, Ref, ref } from 'vue';

const isFirstStoryOverview = ref<boolean>(true);

export const useTouchTable = () => {
  const updateIsFirstStoryOverview = (input: boolean) => {
    isFirstStoryOverview.value = input;
  };

  return {
    updateIsFirstStoryOverview,
    isFirstStoryOverview,
  };
};
