<template>
  <div
    class="flex justify-center flex-wrap h-screen w-screen bg-background-light"
  >
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
    <img class="fixed mt-32 z-0 w-full" src="/images_entrance/intro2.svg" alt="" />
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
        <div
          v-for="(item, index) in stories"
          @click="nextStep(item, index)"
          :key="index"
          class="flex flex-col items-center"
        >
          <div
            :class="
              colors[index] +
              ' circle text-white flex justify-center items-center font-bold text-5xl'
            "
          >
            {{ index + 1 }}
          </div>
          <p class="p-4 text-center w-36">{{ item.value }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { useRouter } from 'vue-router';
import { CardComponent, GetActiveBoxDocument } from 'coghent-vue-3-component-library';
import { Relation } from 'coghent-vue-3-component-library/lib/queries';
import { useQuery } from '@vue/apollo-composable';

export default defineComponent({
  name: 'Introscherm2',
  components: { CardComponent },
  setup() {
    const router = useRouter();

    const nextStep = (_relation: Relation, index: number) => {
      localStorage.setItem('STORY_KEY', _relation.key);
      localStorage.setItem('STORY_TITLE', _relation.value as string);
      localStorage.setItem('STORY_COLOR', colors[index]);
      router.push({ name: 'entrance.step3' });
    };

    const colors = [
      'bg-stories-pink',
      'bg-stories-green',
      'bg-stories-blue',
      'bg-stories-yellow',
    ];
    const stories = ref<Array<Relation>>([]);

    const { onResult: onActiveBox } = useQuery(GetActiveBoxDocument);

    onActiveBox((value) => {
      stories.value = value.data.ActiveBox as Array<Relation>;
    });

    return { stories, colors, nextStep };
  },
});
</script>

<style scoped>
.circle {
  width: 162px;
  height: 162px;
  opacity: 1;
  border-radius: 50%;
  /* background: black; */
  color: white;
}
</style>