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
      ><div class="p-4 text-lg">
        <h3 class="text-2xl">
          <b>{{ cardTitle }}</b>
        </h3>
        <p v-html="cardDescription"></p>
        <div class="flex justify-end p-4">
          <base-button
            v-if="showPreviousButton"
            text="Vorige"
            custom-style="touchtable-white-round"
            :iconShown="false"
            class="shadow mr-2"
            @click="previousButtonFunction()"
          />
          <base-button
            v-if="showNextButton"
            :text="nextButtonText"
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
  import { BaseButton } from 'coghent-vue-3-component-library';
  import { useOnBoarding } from '@/composables/useOnBoarding';

  export default defineComponent({
    name: 'OnBoardingCard',
    components: { BaseButton },
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
        default: 'Volgende',
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
      const { onBoardingState, goToNextStep, goToPreviousStep } = useOnBoarding();

      const previousButtonFunction = () => {
        goToPreviousStep();
        emit('previousButtonClicked', true);
      };

      const nextButtonFunction = () => {
        goToNextStep();
        console.log(onBoardingState.value);
        emit('nextButtonClicked', true);
      };

      return {
        previousButtonFunction,
        nextButtonFunction,
      };
    },
  });
</script>
