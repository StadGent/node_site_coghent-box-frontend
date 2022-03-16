<template>
  <div v-if="boxVisiter">
    <shutdown-modal :code="boxVisiter.code" />
    <nav class="px-24 py-8 flex justify-between items-center">
      <div class="">
        <h1 class="text-4xl font-bold">Ontdek alle verhalen</h1>
      </div>
      <div class="flex">
        <base-button
          class="shadow mr-8 text-xl"
          custom-style="touchtable-white-round"
          custom-icon="door"
          :icon-shown="true"
          text="Afsluiten"
          @click="openShutdownModal"
        />
        <!-- <base-button
          class="shadow text-xl"
          custom-style="touchtable-white-round"
          text="?"
          :icon-shown="false"
        /> -->
      </div>
    </nav>
    <main class="bg-background-light h-auto min-h-screen p-24">
      <div
        v-if="
          !loadingActiveBoxResult &&
          activeBoxResult &&
          activeBoxResult.ActiveBox &&
          activeBoxResult.ActiveBox.results
        "
      >
        <story-item
          v-for="(storyAsset, index) in activeBoxResult.ActiveBox.results"
          :key="storyAsset.id"
          :story="storyAsset"
          :story-number="index + 1"
          :story-entities="storyAsset.frames"
          :story-color="colors[index]"
          :loading="loadingActiveBoxResult"
        />
      </div>
      <div v-else class="w-screen h-screen flex justify-center align-center">
        <svg
          class="animate-spin -ml-1 mr-3 text-white"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          width="48"
          height="48"
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
      </div>
    </main>
  </div>
</template>

<script lang="ts">
  import { defineComponent, ref, watch } from 'vue';
  import {
    baseIcon,
    BaseButton,
    boxVisiter,
    GetStoryByIdDocument,
    GetActiveBoxDocument,
    GetEntityByIdDocument,
  } from 'coghent-vue-3-component-library';
  import { useRouter } from 'vue-router';
  import ShutdownModal, { useShutdownModal } from '@/components/ShutdownModal.vue';
  import StoryItem from '@/components/StoryItem.vue';
  import { useQuery, useMutation } from '@vue/apollo-composable';
  import { Relation, Entity } from 'coghent-vue-3-component-library/lib/queries';

  type StoryResult = {
    story: Entity;
    assetIds: Array<string>;
  };

  export default defineComponent({
    name: 'TouchTableStories',
    components: {
      BaseButton,
      ShutdownModal,
      StoryItem,
    },
    props: {},
    setup(props) {
      const { openShutdownModal, closeShutdownModal } = useShutdownModal();
      const stories = ref<Array<Relation>>([]);
      const storyResults = ref<Array<StoryResult>>([]);
      const storyAssets = ref<Array<any>>([]);
      const colors = ['accent-green', 'accent-purple', 'accent-yellow', 'accent-blue'];
      const router = useRouter();

      const { result: activeBoxResult, loading: loadingActiveBoxResult } =
        useQuery(GetActiveBoxDocument);

      if (!boxVisiter.value) {
        router.push('/touchtable/start');
      } else {
        stories.value = boxVisiter.value.relations.filter(
          (relation: any) => relation.type == 'stories',
        );
      }

      return {
        openShutdownModal,
        activeBoxResult,
        boxVisiter,
        stories,
        storyResults,
        colors,
        storyAssets,
        loadingActiveBoxResult,
      };
    },
  });
</script>

<style scoped>
  .shadow {
    box-shadow: 0px 0px 12px rgba(0, 0, 0, 0.2);
  }
</style>
