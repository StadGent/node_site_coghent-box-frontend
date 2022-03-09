<template>
  <div v-if="boxVisiter">
    <shutdown-modal :code="boxVisiter.code" />
    <nav class="px-24 py-10 flex justify-between items-center">
      <div class="">
        <h1 class="text-5xl font-bold">Ontdek alle verhalen</h1>
      </div>
      <div class="flex">
        <base-button
          class="shadow mr-8 text-3xl"
          custom-style="touchtable-white-round"
          custom-icon="door"
          :icon-shown="true"
          text="Afsluiten"
          @click="openShutdownModal"
        />
        <base-button
          class="shadow text-3xl"
          custom-style="touchtable-white-round"
          text="?"
          :icon-shown="false"
        />
      </div>
    </nav>
    <main class="bg-background-light h-auto min-h-screen p-24">
      <div
        v-if="
          !loadingActiveBoxResult &&
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
    </main>
  </div>
</template>

<script lang="ts">
  import { defineComponent, ref, watch } from 'vue';
  import {
    baseIcon,
    BaseButton,
    BoxVisiter,
    boxVisiter,
    useBoxVisiter,
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
      const colors = ['accent-purple', 'accent-green', 'accent-blue', 'accent-yellow'];
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
