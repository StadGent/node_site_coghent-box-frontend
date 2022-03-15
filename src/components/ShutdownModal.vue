<template>
  <BaseModal
    :scroll="false"
    :modal-state="ShutdownModalState.state"
    class="w-1/2"
    @hide-modal="closeShutdownModal"
  >
    <section class="flex flex-wrap justify-center items-center w-full p-24">
      <section class="w-full">
        <h1 class="text-6xl font-bold text-center pb-12">
          Ben je zeker dat je wil afsluiten?
        </h1>
        <p class="text-3xl text-center">
          Wanneer je afsluit blijven alle beelden die in je verhalenbox zitten bewaard.<br />
          Je kan deze thuis raadplegen via de website met jouw persoonlijke code:
        </p>
        <box-visit-code :code="code" class="my-12" />
      </section>
      <section class="flex justify-center items-center pt-48">
        <base-button
          class="shadow mr-8"
          custom-style="touchtable-white-round"
          :icon-shown="true"
          text="Ja, sessie afsluiten"
          @click="goToCodeScreen"
        />
        <base-button
          class="shadow"
          custom-style="touchtable-green-round"
          :icon-shown="false"
          text="Nee, terug naar het archief"
          @click="goToStoriesScreen"
        />
      </section>
    </section>
  </BaseModal>
</template>

<script lang="ts">
  import { defineComponent, onMounted, ref, watch } from 'vue';
  import { BaseModal, BaseButton, useBoxVisiter } from 'coghent-vue-3-component-library';
  import BoxVisitCode from '@/components/BoxVisitCode.vue';
  import { apolloClient } from '@/main';
  import { useRoute, useRouter } from 'vue-router';

  export type ModalState = 'show' | 'hide' | 'loading';

  export type ShutdownModalType = {
    state: ModalState;
  };

  const ShutdownModalState = ref<ShutdownModalType>({
    state: 'hide',
  });

  export const useShutdownModal = () => {
    const updateShutdownModal = (ShutdownModalInput: ShutdownModalType) => {
      ShutdownModalState.value = ShutdownModalInput;
    };

    const closeShutdownModal = () => {
      updateShutdownModal({
        state: 'hide',
      });
    };

    const openShutdownModal = () => {
      updateShutdownModal({
        state: 'show',
      });
    };

    return {
      closeShutdownModal,
      openShutdownModal,
      ShutdownModalState,
    };
  };

  export default defineComponent({
    name: 'ShutdownModal',
    components: {
      BaseModal,
      BaseButton,
      BoxVisitCode,
    },
    props: {
      code: {
        type: String,
        required: true,
      },
    },
    setup: (props) => {
      const { openShutdownModal, closeShutdownModal, ShutdownModalState } =
        useShutdownModal();
      const { resetBoxVisiter } = useBoxVisiter(apolloClient);
      const router = useRouter();

      const goToCodeScreen = () => {
        closeShutdownModal();
        resetBoxVisiter();
        router.push('/touchtable/start');
      };

      const goToStoriesScreen = () => {
        closeShutdownModal();
        router.push('/touchtable/stories');
      };

      return {
        ShutdownModalState,
        closeShutdownModal,
        goToCodeScreen,
        goToStoriesScreen,
      };
    },
  });
</script>

<style scoped>
  .shadow {
    box-shadow: 0px 0px 12px rgba(0, 0, 0, 0.2);
  }
</style>
