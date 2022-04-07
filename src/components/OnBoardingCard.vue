<template>
  <VDropdown
    :autoHide="false"
    :shown="showCard"
    :triggers="[]"
    :placement="placement"
    :distance="distance"
  >
    <slot></slot>
    <template #popper
      ><div class="p-4 text-lg onBoardingCard">
        <div class="flex justify-between">
          <h3 class="text-2xl">
            <b>{{ cardTitle }}</b>
          </h3>
          <base-icon
            icon="close"
            class="stroke-current fill-current stroke-2 cursor-pointer"
            @click="endOnBoarding()"
          />
        </div>
        <p>{{ cardDescription }}</p>
        <div class="flex justify-end p-4">
          <base-button
            v-if="showPreviousButton"
            :text="t('touchtable.onBoarding.buttons.previous')"
            custom-style="touchtable-white-round"
            :iconShown="false"
            class="shadow mr-2"
            @click="previousButtonFunction()"
          />
          <base-button
            v-if="showNextButton"
            :text="t(nextButtonText)"
            custom-style="touchtable-green-round"
            :iconShown="false"
            class="shadow"
            @click="nextButtonFunction()"
          />
        </div></div
    ></template>
  </VDropdown>
</template>

<script lang="ts">
  import { defineComponent } from 'vue';
  import { BaseButton, BaseIcon } from 'coghent-vue-3-component-library';
  import { useOnBoarding } from '@/composables/useOnBoarding';
  import { useI18n } from 'vue-i18n';

  export default defineComponent({
    name: 'OnBoardingCard',
    components: { BaseButton, BaseIcon },
    props: {
      cardTitle: {
        type: String,
        required: true,
      },
      cardDescription: {
        type: String,
        required: true,
      },
      showPreviousButton: {
        type: Boolean,
        required: false,
        default: true,
      },
      showNextButton: {
        type: Boolean,
        required: false,
        default: true,
      },
      nextButtonText: {
        type: String,
        required: false,
        default: 'touchtable.onBoarding.buttons.next',
      },
      placement: {
        type: String,
        required: false,
        default: 'top',
      },
      distance: {
        type: Number,
        required: false,
      },
      showCard: {
        type: Boolean,
        required: true,
      },
    },
    emits: ['previousButtonClicked', 'nextButtonClicked'],
    setup(props, { emit }) {
      const { onBoardingState, goToNextStep, goToPreviousStep, changeWalkThroughStatus } =
        useOnBoarding();
      const { t } = useI18n();

      const endOnBoarding = () => {
        changeWalkThroughStatus('ended');
      };

      const previousButtonFunction = () => {
        goToPreviousStep();
        emit('previousButtonClicked', true);
      };

      const nextButtonFunction = () => {
        goToNextStep();
        emit('nextButtonClicked', true);
      };

      return {
        previousButtonFunction,
        nextButtonFunction,
        endOnBoarding,
        t,
      };
    },
  });
</script>

<style scoped>
  .onBoardingCard {
    max-width: 500px;
  }
</style>
