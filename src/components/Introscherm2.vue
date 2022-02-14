<template>
  <div class="flex justify-center flex-wrap h-screen w-screen">
    <CardComponent
      :large="true"
      :backgroundColor="`bg-accent-yellow`"
      :ringColor="'ring-accent-yellow'"
      class="z-10"
    >
      <div class="flex justify-center font-bold text-center text-4xl my-20">
        <h1>
          Welkom in het <br />
          erfgoed paviljoen!
        </h1>
      </div>
    </CardComponent>
    <img class="absolute mt-32 z-0 w-full" src="/images_entrance/intro2.svg" alt="" />
    <p class="text-3xl z-10 mt-48 px-8 py-4 w-full h-48 text-center text-lg font-normal">
      Je kan hier grasduinen in de <br />
      erfgoedcollectie van stad Gent. Laat je <br />
      meenemen op een reis door de tijd...
    </p>
    <div
      class="
        z-10
        fixed
        inset-x-0
        bottom-0
        w-screen
        h-2/6
        flex flex-wrap flex-col
        p-4
        text-center
        bg-background-medium
      "
    >
      <p class="text-3xl p-2">Welk verhaal wil je graag verder ontdekken?</p>
      <p class="font-bold text-3xl">Maak hier je keuze:</p>
      <div class="flex flex-col-4 mt-12 justify-center flex-wrap gap-12">
        <div class="flex flex-col items-center">
          <div class="circle text-white flex justify-center items-center font-bold text-5xl">1</div>
          <p class="p-4 text-center w-36">Het gravensteen doorheen de tijd</p>
        </div>
        <div class="flex flex-col items-center">
          <div class="circle text-white flex justify-center items-center font-bold text-5xl">2</div>
          <p class="p-4 text-center w-36">De opkomst van Turkse handelaars</p>
        </div>
        <div class="flex flex-col items-center">
          <div class="circle text-white flex justify-center items-center font-bold text-5xl">3</div>
          <p class="p-4 text-center w-36">Het gravensteen doorheen de tijd</p>
        </div>
        <div class="flex flex-col items-center">
          <div class="circle text-white flex justify-center items-center font-bold text-5xl">4</div>
          <p class="p-4 text-center w-36">De opkomst van Turkse handelaars</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useRouter } from 'vue-router';
import { CardComponent } from 'coghent-vue-3-component-library';

export default defineComponent({
  name: 'Introscherm2',
  components: { CardComponent },
  props: {
    nextPath: {
      type: String,
      default: '/intro-3',
      required: false,
    },
  },
  setup() {
    const router = useRouter();
    const stories = ['item 1', 'item 2', 'item 3'];
    const nextStep = () => {
      // router.push(`/entrance${props.nextPath}`)
    };

    return { stories };
  },
});
</script>

<style scoped>
.circle {
  width: 162px;
  height: 162px;
  opacity: 0.8;
  border-radius: 50%;
  background: black;
  color: white;
}
</style>