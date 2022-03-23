<template>
  <main
    class="flex justify-center items-center h-screen w-screen bg-touchtable-dark"
    @click="hideWrongCodeMessage()"
  >
    <CardComponent
      :large="true"
      background-color="bg-accent-yellow"
      rounds-color="bg-touchtable-dark"
      class="w-1/2"
    >
      <section class="w-full">
        <VDropdown
          :shown="displayWrongCodeMessage"
          placement="right-start"
          :showTriggers="[]"
        >
          <number-display
            :code="NumberPadState.state"
            :max-amount-of-characters="maxAmountOfNumbers"
            class="mb-12"
          />
          <template #popper
            ><div class="p-4 text-lg">
              <p><b>Deze code werd helaas niet gevonden!</b></p>
              <p>Probeer het nogmaals</p>
            </div></template
          >
        </VDropdown>
        <number-pad />
      </section>
      <section class="flex justify-center items-center w-full mt-12">
        <VDropdown>
          <base-button
            class="text-lg underline"
            custom-style="touchtable-black"
            :icon-shown="false"
            text="Ik heb nog geen code"
          />
          <template #popper
            ><div class="p-4 text-lg">
              <p><b>Geen paniek!</b></p>
              <p>
                Je kan jouw persoonlijke code laten afdrukken via het scherm aan de
                ingang. Veel succes!
              </p>
            </div></template
          >
        </VDropdown>
      </section>
    </CardComponent>
  </main>
</template>

<script lang="ts">
  import { defineComponent, onMounted, ref, watch } from 'vue';
  import {
    CardComponent,
    BaseButton,
    GetBoxVisiterRelationsByTypeDocument,
    useBoxVisiter,
  } from 'coghent-vue-3-component-library';
  import NumberPad, { useNumberPad } from '@/components/NumberPad.vue';
  import NumberDisplay from '@/components/NumberDisplay.vue';
  import { useRouter } from 'vue-router';
  import { apolloClient } from '@/main';

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
      const displayWrongCodeMessage = ref<boolean>(false);

      const showWrongCodeMessage = () => {
        displayWrongCodeMessage.value = true;
      };

      const hideWrongCodeMessage = () => {
        displayWrongCodeMessage.value = false;
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
        // code = '81453243';
        const { getByCode } = useBoxVisiter(apolloClient);
        const resolvedBoxVisit = getByCode(code);
        resolvedBoxVisit.then((boxVisit: any) => {
          if (boxVisit) {
            router.push('/touchtable/stories');
            resetNumberPad();
          } else {
            showWrongCodeMessage();
            resetNumberPad();
          }
        });
      };

      // checkCode();

      return {
        NumberPadState,
        maxAmountOfNumbers,
        checkCode,
        displayWrongCodeMessage,
        hideWrongCodeMessage,
      };
    },
  });
</script>

<style scoped></style>
