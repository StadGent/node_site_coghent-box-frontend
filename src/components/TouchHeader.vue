<template>
  <nav class="p-10 header bg-neutral-0">
    <div class="spacer" />
    <div class="cursor-pointer flex justify-center flex-wrap" @click="openBasketOverlay">
      <h1 class="font-bold text-4xl w-full pr-auto">
        {{ t('header.basket') + ` (${basketAmount})` }}
      </h1>
      <base-icon icon="downwardArrows" class="stroke-current fill-current stroke-2" />
    </div>
    <div class="flex">
      <on-boarding-card
        :showCard="
          onBoardingState.status == 'started' &&
          onBoardingState.currentStepName == 'backToOverviewPage'
            ? true
            : false
        "
        cardTitle="Alle verhalen op een rij"
        cardDescription="Via deze knop kan je steeds terug naar het overzicht van<br/>de afbeeldingen van alle verhalen."
        nextButtonText="Ik ben er klaar voor!"
        placement="bottom-end"
      >
        <base-button
          class="shadow mr-8 text-xl"
          custom-style="touchtable-green-round"
          :icon-shown="false"
          :text="t('header.buttons.overview')"
          @click="goToStoriesPage"
        />
      </on-boarding-card>
      <base-button
        class="shadow text-xl"
        custom-style="touchtable-white-round"
        custom-icon="door"
        :icon-shown="true"
        :text="t('header.buttons.shutdown')"
        @click="openShutdownModal"
      />
    </div>
  </nav>
</template>

<script lang="ts">
  import { defineComponent, onMounted, ref } from 'vue';
  import { BaseIcon, BaseButton, useBoxVisiter } from 'coghent-vue-3-component-library';
  import { fabricdefaults } from '@/services/Fabric/defaults.fabric';
  import { useShutdownModal } from '@/components/ShutdownModal.vue';
  import { useBasketOverlay } from '@/components/BasketOverlay.vue';
  import { useRouter } from 'vue-router';
  import OnBoardingCard from '@/components/OnBoardingCard.vue';
  import { useOnBoarding } from '@/composables/useOnBoarding';
  import { useI18n } from 'vue-i18n';

  export default defineComponent({
    name: 'TouchHeader',
    components: {
      BaseIcon,
      BaseButton,
      OnBoardingCard,
    },
    props: {
      basketAmount: {
        type: Number,
        default: 0,
        required: false,
      },
    },
    setup: (props) => {
      const { openShutdownModal, closeShutdownModal } = useShutdownModal();
      const { closeBasketOverlay, openBasketOverlay } = useBasketOverlay();
      const { onBoardingState } = useOnBoarding();
      const router = useRouter();
      const { t } = useI18n();

      const root = document.documentElement;
      root.style.setProperty(
        '--header_height',
        fabricdefaults.canvas.header.height.toString() + 'px',
      );

      const goToStoriesPage = () => {
        const { clearHistoryAssets } = useBoxVisiter();
        clearHistoryAssets();
        router.push('stories');
      };

      return {
        openShutdownModal,
        goToStoriesPage,
        openBasketOverlay,
        onBoardingState,
        t,
      };
    },
  });
</script>

<style scoped>
  .header {
    position: relative;
    top: 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: var(--header_height);
  }
  .shadow {
    box-shadow: 0px 0px 12px rgba(0, 0, 0, 0.2);
  }
  .spacer {
    width: 700px;
    height: 100%;
  }
</style>
