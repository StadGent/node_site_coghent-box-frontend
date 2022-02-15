<template>
  <div class="background"></div>
  <div class="w-screen h-screen flex flex-col justify-center" @click="nextStep">
    <div class="w-full h-48 mb-8 flex justify-center mb-24">
      <img src="/images_entrance/qr_intro1.svg" alt="" />
    </div>
    <div class="flex flex-wrap text-center text-neutral-0">
      <p class="font-bold text-6xl w-full mt-8">
        Haal hier je code om te <br />starten in de box
      </p>
      <p class="w-full text-center text-3xl mt-8">
        je hebt een ticket nodig om in <br />te loggen.
      </p>
      <div class="h-6 flex justify-center w-full mt-8 w-fullitems-center">
        <img src="/images_entrance/dots_intro1.svg" alt="" />
      </div>
      <p class="font-bold text-6xl mt-8 w-full">
        Get here your ticket to <br />start in the box
      </p>
      <p class="w-full text-center text-3xl mt-8">You need a ticket to log in.</p>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useRouter } from 'vue-router';

export default defineComponent({
  name: 'Introscherm1',
  setup() {
    const router = useRouter();
    const nextStep = () => {
      router.push({name: 'entrance.step2'})
    };

    return { nextStep };
  },
});
</script>

<style>
.background {
  top:0;
  left:0;
  position: absolute;
  width: 100vw;
  height: 100vh;
  background-image: url('/background.png');
  background-size: cover;
  background-color: rgba(45, 36, 42, 0.8);
  z-index: -1;
  filter: blur(15px);
}
</style>