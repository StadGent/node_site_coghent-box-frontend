<template>
  <main class="flex justify-center items-center h-screen w-screen bg-touchtable-dark">
    <CardComponent
      :large="true"
      background-color="bg-accent-yellow"
      rounds-color="bg-touchtable-dark"
      class="w-1/2"
    >
      <section class="w-full">
        <number-display
          :code="NumberPadState.state"
          :max-amount-of-characters="maxAmountOfNumbers"
          class="mb-12"
        />
        <number-pad />
      </section>
      <section class="flex justify-center items-center w-full mt-12">
        <base-button
          class="text-lg underline"
          custom-style="touchtable-black"
          :icon-shown="false"
          text="Ik heb nog geen code"
        />
      </section>
    </CardComponent>
  </main>
</template>

<script lang="ts">
  import { defineComponent, onMounted, ref, watch } from 'vue';
  import {
    CardComponent,
    GetBoxVisiterByCodeDocument,
    BaseButton,
  } from 'coghent-vue-3-component-library';
  import NumberPad, { useNumberPad } from '@/components/NumberPad.vue';
  import NumberDisplay from '@/components/NumberDisplay.vue';
  import { useRouter } from 'vue-router';
  import { useQuery, useMutation } from '@vue/apollo-composable';
  import { useBoxVisiter } from 'coghent-vue-3-component-library';
  import { apolloClient } from '@/main';
  import { BoxVisiter } from '@/models/GraphqlModel';

  export default defineComponent({
    name: 'StartCode',
    components: {
      CardComponent,
      NumberPad,
      NumberDisplay,
      BaseButton,
    },
    props: {},
    setup: (props) => {
      const { updateNumberPad, undoNumberPad, resetNumberPad, NumberPadState } =
        useNumberPad();
      const maxAmountOfNumbers = 8;
      const router = useRouter();
      const { getByCode } = useBoxVisiter(apolloClient);

      const showWrongCodeMessage = () => {
        alert('Wrong code');
      };

      watch(
        () => NumberPadState.value.state.length,
        () => {
          if (NumberPadState.value.state.length == maxAmountOfNumbers) {
            checkCode();
          }
        },
      );

      const checkCode = () => {
        let code: string = NumberPadState.value.state.join('');
        code = '52389932';
        const resolvedBoxVisit = getByCode(code);
        resolvedBoxVisit.then((boxVisit: any) => {
          if (boxVisit) {
            router.push('/touchtable/stories');
          } else {
            showWrongCodeMessage();
            resetNumberPad();
          }
        });
      };

      checkCode();

      return { NumberPadState, maxAmountOfNumbers, checkCode };
    },
  });
</script>

<style scoped></style>
