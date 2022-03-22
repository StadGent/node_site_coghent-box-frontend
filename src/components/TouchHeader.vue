<template>
  <nav class="p-10 header bg-neutral-0">
    <div class="spacer" />
    <div class="cursor-pointer flex justify-center flex-wrap" @click="openBasketOverlay">
      <h1 class="font-bold text-4xl w-full pr-auto">
        Mijn verhalenbox ({{ basketAmount }})
      </h1>
      <base-icon icon="downwardArrows" class="stroke-current fill-current stroke-2" />
    </div>
    <div class="flex">
      <base-button
        class="shadow mr-8 text-xl"
        custom-style="touchtable-green-round"
        :icon-shown="false"
        text="Overzicht alle verhalen"
        @click="goToStoriesPage"
      />
      <base-button
        class="shadow text-xl"
        custom-style="touchtable-white-round"
        custom-icon="door"
        :icon-shown="true"
        text="Afsluiten"
        @click="openShutdownModal"
      />
    </div>
  </nav>
</template>

<script lang="ts">
  import { defineComponent, onMounted, ref } from 'vue';
  import { BaseIcon, BaseButton } from 'coghent-vue-3-component-library';
  import { fabricdefaults } from '@/services/Fabric/defaults.fabric';
  import { useShutdownModal } from '@/components/ShutdownModal.vue';
  import { useBasketOverlay } from '@/components/BasketOverlay.vue';
  import { useRouter } from 'vue-router';

  export default defineComponent({
    name: 'TouchHeader',
    components: {
      BaseIcon,
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
