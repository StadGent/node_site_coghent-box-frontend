<template>
  <BaseModal
    :large="true"
    :modal-state="MediaModalState.state"
    custom-styles="z-50"
    @hide-modal="closeMediaModal"
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
        @click="closeMediaModal"
      >
        <base-icon
          icon="close"
          class="h-5 w-5 ml-0.5 stroke-current fill-current stroke-2"
        />
      </a>
      <IIIFViewer
        v-if="simpleFileType == 'image'"
        :image-url="IIIFImageUrlHelper(getFileNameByMimeType(MediaModalState.mediafile))"
        :canGoFullScreen="false"
      />
      <video-player
        v-if="simpleFileType == 'video'"
        :mediaFile="MediaModalState.mediafile"
      />
    </section>
  </BaseModal>
</template>

<script lang="ts">
  import { defineComponent, onMounted, ref, watch } from 'vue';
  import { IIIFImageUrlHelper } from '../services/Fabric/helper.fabric';
  import {
    BaseModal,
    IIIFViewer,
    BaseIcon,
    getSimpleFileTypeByMimeType,
    getFileNameByMimeType,
    VideoPlayer,
  } from 'coghent-vue-3-component-library';
  import { MediaFile } from 'coghent-vue-3-component-library/lib/queries';

  export type ModalState = 'show' | 'hide' | 'loading';

  export type MediaModalType = {
    state: ModalState;
    mediafile: MediaFile | undefined;
  };

  const MediaModalState = ref<MediaModalType>({
    state: 'hide',
    mediafile: undefined,
  });

  export const useMediaModal = () => {
    const updateMediaModal = (MediaModalInput: ModalState) => {
      MediaModalState.value.state = MediaModalInput;
    };

    const setMediaModalFile = (file: MediaFile) => {
      MediaModalState.value.mediafile = file;
    };

    const closeMediaModal = () => {
      updateMediaModal('hide');
    };

    const openMediaModal = () => {
      updateMediaModal('show');
    };
    return {
      closeMediaModal,
      openMediaModal,
      setMediaModalFile,
      MediaModalState,
    };
  };

  export default defineComponent({
    name: 'MediaModal',
    components: {
      BaseModal,
      IIIFViewer,
      BaseIcon,
      VideoPlayer,
    },
    props: {},
    setup: (props) => {
      const { closeMediaModal, openMediaModal, MediaModalState } = useMediaModal();
      const simpleFileType = ref<string>('');

      watch(
        () => MediaModalState.value.mediafile,
        (mediafile) => {
          if (mediafile) {
            simpleFileType.value = getSimpleFileTypeByMimeType(mediafile.mimetype);
            console.log(mediafile.mimetype);
            console.log(simpleFileType.value);
          }
        },
      );

      return {
        closeMediaModal,
        openMediaModal,
        MediaModalState,
        simpleFileType,
        getFileNameByMimeType,
        IIIFImageUrlHelper,
      };
    },
  });
</script>

<style scoped></style>
