<template>
  <nav class="p-10 header bg-neutral-0">
    <div class="spacer"></div>
    <div class="cursor-pointer" @click="openBasketOverlay">
      <h1 class="font-bold text-4xl w-full pr-auto">
        Mijn verhalenbox ({{ basketAmount }})
      </h1>
      <base-icon icon="downwardArrows" class="w-10 h-10 text-text-black" />
    </div>
    <div class="flex">
      <base-button
        class="shadow mr-8 text-xl"
        customStyle="touchtable-green-round"
        :iconShown="false"
        text="Overzicht alle verhalen"
        @click="goToStoriesPage"
      />
      <base-button
        class="shadow text-xl"
        customStyle="touchtable-white-round"
        customIcon="door"
        :iconShown="true"
        text="Afsluiten"
        @click="openShutdownModal"
      />
    </div>
  </nav>
</template>

<script lang="ts">
  import { defineComponent, onMounted, ref } from 'vue';
  import { baseIcon, BaseButton } from 'coghent-vue-3-component-library';
  import { fabricdefaults } from '@/services/Fabric/defaults.fabric';
  import { useShutdownModal } from '@/components/ShutdownModal.vue';
  import { useBasketOverlay } from '@/components/BasketOverlay.vue';
  import { useRouter } from 'vue-router';

  export default defineComponent({
    name: 'TouchHeader',
    components: {
      baseIcon,
      BaseButton,
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
      const router = useRouter();

      const root = document.documentElement;
      root.style.setProperty(
        '--header_height',
        fabricdefaults.canvas.header.height.toString() + 'px',
      );

      const goToStoriesPage = () => {
        router.push('stories');
      };

      return {
        openShutdownModal,
        goToStoriesPage,
        openBasketOverlay,
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
