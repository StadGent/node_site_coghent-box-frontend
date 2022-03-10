<template>
  <div
    class="
      flex
      grid-cols-1
      h-screen
      w-screen
      text-center
      justify-center
      flex-wrap
      bg-background-light
    "
  >
    <div
      :class="
        selectedStory.color +
          ` circle  w-screen my-16 flex justify-center items-center text-6xl shadow-xl`
      "
    >
      {{ selectedStory.title }}
    </div>
    <p class="font-bold text-7xl w-screen mt-16">
      Mooie keuze!
    </p>
    <p class="text-center w-screen text-3xl mt-16">
      Neem hier je persoonlijke ticket. deze moet <br>
      je scannen om te starten aan de schermen. <br>
      Je kan ook steeds de code ingeven. Je mag <br>
      kiezen waar je start, aan de muur of aan de <br>
      tafel. Zolang er maar een plekje vrij is.
    </p>
    <p class="text-center w-screen text-3xl my-24">
      Veel plezier!
    </p>
    <div
      class="
        z-10
        w-screen
        h-2/6
        gap-12
        justify-center
        flex flex-wrap flex-col-3
        p-4
        text-center
        bg-background-medium
        pt-36
      "
    >
      <div class="flex flex-col items-center">
        <img
          src="/images_entrance/neemticket.svg"
          alt=""
        >
        <p class="p-4 text-center w-40 text-2xl font-bold">
          Neem je ticket uit de machine
        </p>
      </div>
      <img
        class="mb-64"
        src="/images_entrance/arrow.svg"
        alt=""
      >
      <div class="flex flex-col items-center">
        <img
          src="/images_entrance/tafelOfMuur.svg"
          alt=""
        >
        <p class="p-4 text-center w-40 text-2xl font-bold">
          Neem plaats aan de tafel of de muur
        </p>
      </div>
      <img
        class="mb-64"
        src="/images_entrance/arrow.svg"
        alt=""
      >
      <div class="flex flex-col items-center">
        <img
          src="/images_entrance/scan.svg"
          alt=""
        >
        <p class="p-4 text-center w-40 text-2xl font-bold">
          Scan de code om te starten
        </p>
      </div>
    </div>
    <div
      class="
        bg-background-medium
        w-screen
        grid grid-cols-2
        py-6
        pb-12
        text-center
        items-center
      "
    >
      <button
        class="
          flex
          text-center
          justify-center
          mx-8
          py-4
          px-6
          bg-background-light
          text-2xl
        "
        @click="naarStart"
      >
        Naar start
      </button>
      <button
        class="
          flex
          text-center
          justify-center
          mx-8
          py-4
          px-6
          bg-background-light
          text-2xl
        "
        @click="printTicket"
      >
        Print
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { useBoxVisiter } from 'coghent-vue-3-component-library';

import { apolloClient } from '@/main';
import { useQuery } from '@vue/apollo-composable';
import { PrintBoxTicketDocument } from 'coghent-vue-3-component-library';
import { BoxVisiter } from 'coghent-vue-3-component-library';
import useTicket from '@/composables/useTicket';

export default defineComponent({
  name: 'Introscherm3',
  components: {},
  setup(props) {
    const router = useRouter();
    const { selectedStory } = useBoxVisiter(apolloClient);
    let currentVisiter: any = null;
    const { print } = useTicket();

    const { fetchMore: printNewTicket } = useQuery(PrintBoxTicketDocument, { code: '' });

    useBoxVisiter(apolloClient)
      .create(`entities/${selectedStory.value.id}`)
      .then(async (visiter: any) => {
        currentVisiter = visiter;
        if (currentVisiter.code) {
          printTicket();
        }
        alert(visiter.code);
      });

    const printTicket = async () => {
      const ticket = await printNewTicket({
        variables: { code: currentVisiter.code } as any,
      });
      console.log({ ticket });
      try {
        await print(ticket?.data.PrintBoxTicket.body as string);
      } catch (error) {
        console.log('Print service offline.');
      }
    };
    const naarStart = () => {
      router.push({ name: 'entrance.step1' });
    };

    return { printTicket, naarStart, selectedStory };
  },
});
</script>

<style scoped>
.circle {
  width: 556px;
  height: 556px;
  opacity: 0.8;
  border-radius: 50%;
  color: white;
}
</style>