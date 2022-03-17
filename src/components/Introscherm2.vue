<template>
  <div class="flex justify-center flex-wrap h-screen w-screen bg-background-light">
    <CardComponent
      :large="true"
      :background-color="`bg-accent-yellow`"
      :ring-color="'ring-accent-yellow'"
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
        flex flex-wrap
        p-4
        text-center
        bg-background-medium
        items-center
        justify-center
      "
    >
      <svg
        v-if="loading"
        class="animate-spin -ml-1 mr-3 h-36 w-36 text-white"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          class="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          stroke-width="4"
        />
        <path
          class="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
      <p v-if="!loading" class="text-3xl p-2 w-full text-6xl mt-10">
        Welk verhaal wil je graag verder ontdekken?
      </p>
      <p v-if="!loading" class="font-bold text-6xl w-full">Maak hier je keuze:</p>
      <div
        v-if="!loading"
        class="grid grid-cols-2 mt-12 flex-wrap justify-evenly w-full mt-10"
      >
        <div
          v-for="(item, index) in stories"
          :key="index"
          class="flex flex-col items-center"
          @click="nextStep(item, index)"
        >
          <div
            :class="
              colors[index] +
              ' circle text-white flex justify-center items-center font-bold text-9xl'
            "
          >
            {{ index + 1 }}
          </div>
          <p class="p-4 text-center text-5xl mb-10">
            {{ item.title[0] ? item.title[0].value : '' }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import { defineComponent, onMounted, ref } from 'vue';
  import { useRouter } from 'vue-router';
  import { CardComponent, GetActiveBoxDocument } from 'coghent-vue-3-component-library';
  import { Entity } from 'coghent-vue-3-component-library/lib/queries';
  import { useQuery } from '@vue/apollo-composable';
  import { useBoxVisiter } from 'coghent-vue-3-component-library';
  import Colors from '@/Three/defaults.color';

  export default defineComponent({
    name: 'Introscherm2',
    components: { CardComponent },
    setup() {
      const router = useRouter();
      const { setSelectedStory } = useBoxVisiter();
      const colors = Colors().storyCss();
      const nextStep = async (_entity: any, index: number) => {
        let title = '';
        if (_entity.title) {
          title = _entity.title[0]?.value as string;
        }
        setSelectedStory({
          id: _entity.id,
          color: colors[index],
          title: title,
        });

        router.push({ name: 'entrance.step3' });
      };

      const stories = ref<Array<Entity>>([]);

      const { refetch: updatedStories, loading } = useQuery(
        GetActiveBoxDocument,
        {},
        { fetchPolicy: 'cache-first' },
      );

      onMounted(() => {
        updatedStories()?.then((value) => {
          stories.value = value.data.ActiveBox.results;
        });
      });

      return { stories, colors, nextStep, loading };
    },
  });
</script>

<style scoped>
  .circle {
    width: 380px;
    height: 380px;
    opacity: 1;
    border-radius: 50%;
    /* background: black; */
    color: white;
  }
</style>
