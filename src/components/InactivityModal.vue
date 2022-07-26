<template>
  <BaseModal
    :scroll="false"
    :modal-state="InactivityModalState.state"
    @hide-modal="closeInactivityModal"
  >
    <div class="h-full w-full flex flex-col p-24">
      <h1 class="text-6xl font-bold text-center pb-24">
        {{ t('touchtable.inactivityModal.title') }}
      </h1>
      <p class="text-5xl text-center">0:{{ timerSettings.timeLeft }}</p>
      <section class="flex justify-center items-center pt-24">
        <base-button
          class="shadow mr-8"
          custom-style="touchtable-white-round"
          :icon-shown="true"
          :text="t('touchtable.inactivityModal.shutdown')"
          @click="logOut"
        />
        <base-button
          class="shadow"
          custom-style="touchtable-green-round"
          :icon-shown="false"
          :text="t('touchtable.inactivityModal.keepGoing')"
        />
      </section>
    </div>
  </BaseModal>
</template>

<script lang="ts">
  import { defineComponent, ref } from 'vue';
  import { useInactiveTimer } from '../composables/useInactiveTimer';
  import { BaseModal, BaseButton } from 'coghent-vue-3-component-library';
  import { useI18n } from 'vue-i18n';

  export type ModalState = 'show' | 'hide' | 'loading';

  export type InactivityModalType = {
    state: ModalState;
  };

  const InactivityModalState = ref<InactivityModalType>({
    state: 'hide',
  });

  export const useInactivityModal = () => {
    const updateInactivityModal = (InactivityModalInput: InactivityModalType) => {
      InactivityModalState.value = InactivityModalInput;
    };

    const closeInactivityModal = () => {
      updateInactivityModal({
        state: 'hide',
      });
    };

    const openInactivityModal = () => {
      updateInactivityModal({
        state: 'show',
      });
    };

    return {
      closeInactivityModal,
      openInactivityModal,
      InactivityModalState,
    };
  };

  export default defineComponent({
    name: 'InactivityModal',
    components: { BaseModal, BaseButton },
    setup() {
      const { closeInactivityModal, InactivityModalState } = useInactivityModal();
      const { timerSettings, logOut } = useInactiveTimer();
      const { t } = useI18n();

      return { closeInactivityModal, InactivityModalState, timerSettings, logOut, t };
    },
  });
</script>
