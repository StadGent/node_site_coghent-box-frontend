<template>
<BaseModal :scroll="false" :modal-state="ShutdownModalState.state" @hide-modal="closeShutdownModal" class="w-1/2">
    <section class="flex flex-wrap justify-center items-center w-full p-24">
        <section class="w-full">
        <h1 class="text-6xl font-bold text-center pb-12">Ben je zeker dat je wil afsluiten?</h1>
        <p class="text-3xl text-center">Wanneer je afsluit blijven alle beelden die in je verhalenbox zitten bewaard.<br/> Je kan deze thuis raadplegen via de website met jouw persoonlijke code:</p>
        <box-visit-code :code="code" class="my-12"/>
        </section>
        <section class="flex justify-center items-center pt-48">
        <base-button
          class="shadow mr-8"
          customStyle="touchtable-white-round"
          :iconShown="true"
          text="Ja, sessie afsluiten"
        />
        <base-button
          class="shadow"
          customStyle="touchtable-green-round"
          :iconShown="false"
          text="Nee, terug naar het archief"
        />
        </section>
    </section>
</BaseModal>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, watch } from 'vue';
import { BaseModal, BaseButton} from 'coghent-vue-3-component-library'
import BoxVisitCode from '@/components/BoxVisitCode.vue';

export type ModalState = 'show' | 'hide' | 'loading'

export type ShutdownModalType = {
  state: ModalState
}

const ShutdownModalState = ref<ShutdownModalType>({
  state: 'hide',
})

export const useShutdownModal = () => {
  const updateShutdownModal = (ShutdownModalInput: ShutdownModalType) => {
    ShutdownModalState.value = ShutdownModalInput
  }

  const closeShutdownModal = () => {
    updateShutdownModal({
      state: 'hide',
    })
  }

  const openShutdownModal = () => {
    updateShutdownModal({
      state: 'show',
    })
  }
  return {
    closeShutdownModal,
    openShutdownModal,
    ShutdownModalState,
  }
}


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
      }
  },
  setup: (props) => {
      const { openShutdownModal, closeShutdownModal, ShutdownModalState } = useShutdownModal()

      return {
          ShutdownModalState,
          closeShutdownModal
      }
  },
});
</script>

<style scoped>
.shadow{
  box-shadow: 0px 0px 12px rgba(0, 0, 0, 0.2);
}
</style>
