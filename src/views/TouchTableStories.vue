<template>
  <div v-if="boxVisiter" :key="boxVisiter.code">
    <shutdown-modal :code="boxVisiter.code" />
    <nav class="px-24 py-8 flex justify-between items-center">
      <div class="">
        <h1 class="text-4xl font-bold">
          {{ t('touchtable.header.storyOverviewTitle') }}
        </h1>
      </div>
      <div class="flex">
        <base-button
          class="shadow mr-8 text-xl"
          custom-style="touchtable-white-round"
          custom-icon="door"
          :icon-shown="true"
          :text="t('touchtable.header.buttons.shutdown')"
          @click="openShutdownModal"
        />
        <base-button
          class="shadow text-xl"
          custom-style="touchtable-white-round"
          text="?"
          :icon-shown="false"
          @click="resetOnBoardingState()"
        />
      </div>
    </nav>
    <main class="bg-background-light h-auto min-h-screen p-24">
      <div v-if="!loadingActiveBoxResult && activeBoxResult">
        <div
          v-for="(storyAsset, index) in activeBoxResult.ActiveBox.results"
          :key="storyAsset.id"
          :id="storyAsset.id"
        >
          <story-item
            :story="storyAsset"
            :story-number="index + 1"
            :story-entities="storyAsset.frames"
            :story-color="colors[index].replace('bg-', '')"
            :loading="loadingActiveBoxResult"
            :isLastSeenStory="lastSeenStoryId == storyAsset.id"
            :lastStoryItem="index == storyAssets.length ? true : false"
          />
        </div>
      </div>
      <div v-else class="w-full flex justify-center align-center">
        <spinner />
      </div>
    </main>
  </div>
</template>

<script lang="ts">
  import { defineComponent, nextTick, onMounted, onUpdated, ref, watch } from 'vue';
  import {
    baseIcon,
    BaseButton,
    boxVisiter,
    GetActiveBoxDocument,
  } from 'coghent-vue-3-component-library';
  import { useRouter } from 'vue-router';
  import ShutdownModal, { useShutdownModal } from '@/components/ShutdownModal.vue';
  import StoryItem from '@/components/StoryItem.vue';
  import Spinner from '@/components/Spinner.vue';
  import { useTouchTable } from '@/composables/useTouchTable';
  import { useQuery, useMutation } from '@vue/apollo-composable';
  import { Relation, Entity } from 'coghent-vue-3-component-library/lib/queries';
  import Colors from '@/Three/defaults.color';
  import { useI18n } from 'vue-i18n';
  import { useOnBoarding } from '@/composables/useOnBoarding';

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
      Spinner,
    },
    props: {},
    setup(props) {
      const { openShutdownModal, closeShutdownModal } = useShutdownModal();
      const storyResults = ref<Array<StoryResult>>([]);
      const storyAssets = ref<Array<any>>([]);
      const lastSeenStoryId = ref<any>();
      const colors = [...Colors().storyCss()];
      const router = useRouter();
      const { isFirstStoryOverview } = useTouchTable();
      const { resetOnBoardingState } = useOnBoarding();
      const { t } = useI18n();

      const { result: activeBoxResult, loading: loadingActiveBoxResult } =
        useQuery(GetActiveBoxDocument);

      if (!boxVisiter.value) {
        router.push('/touchtable/start');
      }

      const getLastSeenFrame = (seenFrames: any) => {
        seenFrames.sort((a: any, b: any) => {
          return parseInt(b.date) - parseInt(a.date);
        });
        return seenFrames[0];
      };

      const getStoryForFrame = (stories: Relation[], frame: any) => {
        let storyToReturn: Relation | undefined = undefined;
        stories.forEach((story: any) => {
          const foundFrameInStory = story.frames.find(
            (storyFrame: any) => storyFrame.id == frame.id,
          );
          if (foundFrameInStory) {
            storyToReturn = story.id;
          }
        });
        return storyToReturn;
      };

      watch(
        () => activeBoxResult.value,
        (boxResult) => {
          if (boxResult.ActiveBox) {
            const activeStories = boxResult.ActiveBox.results;
            const boxVisitorStories = boxVisiter.value.relations.filter(
              (relation: Relation) => relation.type == 'stories',
            );
            const seenFrames: Array<any> = [];
            boxVisitorStories.forEach((boxVisitorStory: any) => {
              if (boxVisitorStory.seen_frames) {
                seenFrames.push(...boxVisitorStory.seen_frames);
              } else {
                lastSeenStoryId.value = boxVisitorStory.key.replace('entities/', '');
              }
            });
            if (!lastSeenStoryId.value) {
              try {
                const lastSeenFrame = getLastSeenFrame(seenFrames);
                lastSeenStoryId.value = getStoryForFrame(activeStories, lastSeenFrame);
              } catch (e) {
                console.warn(e);
              }
            }
          }
        },
      );
      const scrollToStory = () => {
        setTimeout(() => {
          const storyItem: any = document.getElementById(lastSeenStoryId.value);
          if (lastSeenStoryId.value && storyItem && isFirstStoryOverview.value) {
            storyItem.scrollIntoView({ behavior: 'smooth' });
          }
        }, 500);
      };

      onUpdated(() => {
        scrollToStory();
      });

      onMounted(() => {
        scrollToStory();
      });

      return {
        openShutdownModal,
        activeBoxResult,
        boxVisiter,
        storyResults,
        colors,
        storyAssets,
        lastSeenStoryId,
        loadingActiveBoxResult,
        resetOnBoardingState,
        t,
      };
    },
  });
</script>

<style scoped>
  .shadow {
    box-shadow: 0px 0px 12px rgba(0, 0, 0, 0.2);
  }
</style>
