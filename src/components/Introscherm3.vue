<template>
  <div
    class="
      flex
      grid-cols-1
      w-screen
      text-center
      justify-center
      flex-wrap
      bg-background-light
    "
  >
    <div
      :class="
        storyColor +
        ` circle  w-screen my-16 flex justify-center items-center text-6xl shadow-xl`
      "
    >
      {{ storyTitle }}
    </div>
    <p class="font-bold text-7xl w-screen mt-16">Mooie keuze!</p>
    <p class="text-center w-screen text-3xl mt-16">
      Neem hier je persoonlijke ticket. deze moet <br />
      je scannen om te starten aan de schermen. <br />
      Je kan ook steeds de code ingeven. Je mag <br />
      kiezen waar je start, aan de muur of aan de <br />
      tafel. Zolang er maar een plekje vrij is.
    </p>
    <p class="text-center w-screen text-3xl my-24">Veel plezier!</p>
    <div
      class="
        z-10
        fixed
        inset-x-0
        bottom-0
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
        <img src="/images_entrance/neemticket.svg" alt="" />
        <p class="p-4 text-center w-40 text-2xl font-bold">
          Neem je ticket uit de machine
        </p>
      </div>
      <img class="mb-64" src="/images_entrance/arrow.svg" alt="" />
      <div class="flex flex-col items-center">
        <img src="/images_entrance/tafelOfMuur.svg" alt="" />
        <p class="p-4 text-center w-40 text-2xl font-bold">
          Neem plaats aan de tafel of de muur
        </p>
      </div>
      <img class="mb-64" src="/images_entrance/arrow.svg" alt="" />
      <div class="flex flex-col items-center">
        <img src="/images_entrance/scan.svg" alt="" />
        <p class="p-4 text-center w-40 text-2xl font-bold">Scan de code om te starten</p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useRouter } from 'vue-router';

export default defineComponent({
  name: 'Introscherm3',
  components: {},
  setup(props) {
    const storyTitle = localStorage.getItem('STORY_TITLE');
    const storyColor = localStorage.getItem('STORY_COLOR');
    const storyKey = localStorage.getItem('STORY_KEY');
    return { storyTitle, storyColor};
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