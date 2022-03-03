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
          customStyle="touchtable-white-round"
          customIcon="door"
          :iconShown="true"
          text="Afsluiten"
          @click="openShutdownModal"
        />
        <base-button
          class="shadow text-3xl"
          customStyle="touchtable-white-round"
          text="?"
          :iconShown="false"
        />
      </div>
    </nav>
    <main class="bg-background-light h-auto min-h-screen p-24">
      <story-item
        v-for="(storyAsset, index) in storyAssets"
        :key="storyAsset.story.id"
        :storyNumber="index + 1"
        :storyName="storyAsset.story.title[0].value"
        :storyEntities="storyAsset.assets"
        :storyColor="colors[index]"
        :loading="loadingEntity"
      />
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
      const endOfData = ref<Boolean>(false);
      const colors = ['accent-purple', 'accent-green', 'accent-blue', 'accent-yellow'];
      const router = useRouter();

      const {
        result: storyResult,
        onResult: onStoryResult,
        loading: loadingStory,
        refetch: refetchStory,
      } = useQuery(GetStoryByIdDocument, { id: '' });

      const {
        result: entityResult,
        onResult: onEntityResult,
        loading: loadingEntity,
        refetch: refetchEntity,
        fetchMore: fetchMoreEntities,
      } = useQuery(GetEntityByIdDocument, { id: '' });

      console.log(boxVisiter.value);

      watch(
        () => stories.value,
        () => {
          const storyArray = stories.value;
          storyArray.forEach((story) => {
            console.log({ story });
            refetchStory({ id: story.key.replace('entities/', '') });
          });
        },
      );

      watch(
        () => storyResults.value.length,
        () => {
          storyResults.value.forEach((storyResult: StoryResult, index: number) => {
            const story: Entity = storyResult.story;
            const assets: Array<Entity> = [];
            storyResult.assetIds.forEach((assetId: string) => {
              fetchMoreEntities({
                variables: { id: assetId },
                updateQuery: (previousData, { fetchMoreResult }) => {
                  assets.push(fetchMoreResult.Entity);
                },
              });
            });
            const storyObject = {
              story,
              assets: { results: assets },
            };
            storyAssets.value.push(storyObject);
            console.log(storyAssets.value[index].assets.results.length);
            console.log('results ' + storyResults.value[index].assetIds.length);
            if (
              storyAssets.value[index].assets.results.length ==
              storyResults.value[index].assetIds.length
            ) {
              console.log('endOfData');
              endOfData.value = true;
            }
          });
        },
      );

      onStoryResult((queryResult) => {
        if (queryResult.data.Entity) {
          let storyAssetIds: Array<string> = [];
          queryResult.data.Entity.frames.forEach((frame: any) => {
            frame.assets.forEach((asset: any) => {
              console.log({ asset });
              console.log(queryResult.data.Entity);
              storyAssetIds.push(asset.id);
            });
          });
          if (storyAssetIds) {
            const story = {
              story: queryResult.data.Entity,
              assetIds: storyAssetIds,
            };
            storyResults.value.push(story);
          }
          console.log(storyResults.value);
        }
      });

      if (!boxVisiter.value) {
        router.push('/touchtable/start');
      } else {
        stories.value = boxVisiter.value.relations.filter(
          (relation: any) => relation.type == 'stories',
        );
      }

      return {
        openShutdownModal,
        boxVisiter,
        stories,
        storyResults,
        colors,
        storyAssets,
        loadingEntity,
        endOfData,
      };
    },
  });
</script>

<style scoped>
  .shadow {
    box-shadow: 0px 0px 12px rgba(0, 0, 0, 0.2);
  }
</style>
