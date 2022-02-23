<template>
  <main class="flex justify-center items-center h-screen w-screen bg-touchtable-dark">
    <CardComponent
      :large="true"
      backgroundColor="bg-accent-yellow"
      roundsColor="bg-touchtable-dark"
      class="w-1/4 h-1/4"
    >
      <number-display
        :code="code"
        :maxAmountOfCharacters="maxAmountOfNumbers"
        class="mb-12"
      />
      <number-pad @code="updateCode" />
    </CardComponent>
  </main>
</template>

<script lang="ts">
  import { defineComponent, onMounted, ref, watch } from 'vue';
  import {
    BaseModal,
    IIIFViewer,
    BaseIcon,
    CardComponent,
  } from 'coghent-vue-3-component-library';
  import NumberPad from '@/components/NumberPad.vue';
  import NumberDisplay from '@/components/NumberDisplay.vue';
  import { useRouter } from 'vue-router';

  export default defineComponent({
    name: 'StartCode',
    components: {
      CardComponent,
      NumberPad,
      NumberDisplay,
    },
    props: {},
    setup: (props) => {
      const maxAmountOfNumbers = 8;
      const code = ref<Array<any>>([]);
      const router = useRouter();
      const startId: string = 'f42792cd-4e59-4dae-8fd0-3997ab4a0ca7';

      const updateCode = (value: any) => {
        code.value = value;
      };

      window.sessionStorage.setItem('startId', startId);
      // router.push('/touchtable/' + startId)

      return { startId, updateCode, maxAmountOfNumbers, code };
    },
  });
</script>

<style scoped></style>
