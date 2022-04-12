<template>
  <BaseModal
    :large="true"
    :modal-state="IIIFModalState.state"
    custom-styles="z-50"
    @hide-modal="closeIIIFModal"
  >
    <section class="h-large flex relative w-full">
      <a
        class="
          right-2
          top-2
          absolute
          bg-neutral-0
          cursor-pointer
          hover:bg-accent-yellow
          ml-2
          mr-2
          p-2
          rounded-full
          shadow-xl
          text-accent-purple
          z-50
          hover:text-neutral-0
        "
        @click="closeIIIFModal"
      >
        <base-icon
          icon="close"
          class="h-5 w-5 ml-0.5 stroke-current fill-current stroke-2"
        />
      </a>
      <IIIFViewer :image-url="IIIFModalState.imageUrl" :canGoFullScreen="false" />
    </section>
  </BaseModal>
</template>

<script lang="ts">
  import { defineComponent, onMounted, ref, watch } from 'vue';
  import { BaseModal, IIIFViewer, BaseIcon } from 'coghent-vue-3-component-library';

  export type ModalState = 'show' | 'hide' | 'loading';

  export type IIIFModalType = {
    state: ModalState;
    imageUrl: string;
  };

  const IIIFModalState = ref<IIIFModalType>({
    state: 'hide',
    imageUrl: '',
  });

  export const useIIIFModal = () => {
    const updateIIIFModal = (IIIFModalInput: ModalState) => {
      IIIFModalState.value.state = IIIFModalInput;
    };

    const setIIIFImage = (imageUrl: string) => {
      IIIFModalState.value.imageUrl = imageUrl;
    };

    const closeIIIFModal = () => {
      updateIIIFModal('hide');
    };

    const openIIIFModal = () => {
      updateIIIFModal('show');
    };
    return {
      closeIIIFModal,
      openIIIFModal,
      setIIIFImage,
      IIIFModalState,
    };
  };

  export default defineComponent({
    name: 'IIIFModal',
    components: {
      BaseModal,
      IIIFViewer,
      BaseIcon,
    },
    props: {},
    setup: (props) => {
      const { closeIIIFModal, openIIIFModal, IIIFModalState } = useIIIFModal();

      return { closeIIIFModal, openIIIFModal, IIIFModalState };
    },
  });
</script>

<style scoped></style>
