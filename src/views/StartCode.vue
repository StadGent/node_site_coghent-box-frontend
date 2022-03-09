<template>
  <main class="flex justify-center items-center h-screen w-screen bg-touchtable-dark">
    <CardComponent
      :large="true"
      background-color="bg-accent-yellow"
      rounds-color="bg-touchtable-dark"
      class="w-1/2 lg:w-1/4"
    >
      <section class="w-full">
        <number-display
          :code="code"
          :max-amount-of-characters="maxAmountOfNumbers"
          class="mb-12"
        />
        <number-pad @code="updateCode" @codeComplete="checkCode" />
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
  import NumberPad from '@/components/NumberPad.vue';
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
      const maxAmountOfNumbers = 8;
      const code = ref<Array<any>>([]);
      const router = useRouter();
      const { getByCode } = useBoxVisiter(apolloClient);

      const updateCode = (value: any) => {
        code.value = value;
      };

      const showWrongCodeMessage = () => {
        alert('Wrong code');
      };

      const checkCode = () => {
        code.value = ['5', '2', '3', '8', '9', '9', '3', '2'];
        const resolvedBoxVisit = getByCode(code.value.join(''));
        resolvedBoxVisit.then((boxVisit: any) => {
          if (boxVisit) {
            router.push('/touchtable/stories');
          }
        });
        resolvedBoxVisit.catch(() => {
          code.value = [];
          showWrongCodeMessage();
        });
      };

      checkCode();

      return { updateCode, maxAmountOfNumbers, code, checkCode };
    },
  });
</script>

<style scoped></style>
