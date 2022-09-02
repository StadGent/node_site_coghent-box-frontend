<template>
  <div v-if="boxVisiter" :key="boxVisiter.code">
    <inactivity-modal />
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
          @click="restartOnBoarding()"
        />
      </div>
    </nav>
    <main class="bg-background-light h-auto min-h-screen p-24">
      <div v-if="!loadingActiveBoxResult && activeBoxResult && !loadingCustomStory">
        <div
          v-for="(storyAsset, index) in storyAssets"
          :key="storyAsset.id"
          :id="storyAsset.id"
        >
          <story-item
            :story="storyAsset"
            :story-number="index + 1"
            :story-entities="storyAsset.frames"
            :story-color="colors[index] ? colors[index].replace('bg-', '') : colors[0]"
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
    GetStoryByIdDocument,
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
  import { useInactiveTimer } from '@/composables/useInactiveTimer';
  import inactivityModal, { useInactivityModal } from '@/components/InactivityModal.vue';
  import { hideAllPoppers } from 'floating-vue';

  const storiesPageState = ref<Entity[]>([]);

  export const useStoriesPage = () => {
    const setStories = (input: Entity[]) => {
      storiesPageState.value = input;
    };

    const resetStories = () => {
      storiesPageState.value = [];
    };

    return { storiesPageState, setStories, resetStories };
  };

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
      inactivityModal,
    },
    props: {},
    setup(props) {
      const { openShutdownModal, closeShutdownModal } = useShutdownModal();
      const storyResults = ref<Array<StoryResult>>([]);
      const storyAssets = ref<Array<Entity>>([]);
      const lastSeenStoryId = ref<any>();
      const colors = [...Colors().storyCss()];
      const router = useRouter();
      const { isFirstStoryOverview, updateIsFirstStoryOverview } = useTouchTable();
      const { resetOnBoardingState } = useOnBoarding();
      const { timerSettings, timerState } = useInactiveTimer();
      const { openInactivityModal, closeInactivityModal } = useInactivityModal();
      const { storiesPageState, setStories } = useStoriesPage();
      const { t } = useI18n();

      const {
        result: activeBoxResult,
        loading: loadingActiveBoxResult,
        refetch: refetchActiveBoxresult,
      } = useQuery(GetActiveBoxDocument);

      const {
        result: customStoryResult,
        loading: loadingCustomStory,
        refetch: refetchCustomStory,
      } = useQuery(GetStoryByIdDocument, { id: '' });

      if (!boxVisiter.value) {
        window.location.href = '/touchtable/start';
      }

      const getLastSeenFrame = (seenFrames: any) => {
        seenFrames.sort((a: any, b: any) => {
          return parseInt(b.date) - parseInt(a.date);
        });
        return seenFrames[0];
      };

      const getStoryForFrame = (stories: Entity[], frame: any) => {
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

      const getCustomStories = (customStories: Relation[]) => {
        const customStoryIds: string[] = customStories.map((story: Relation) =>
          story.key.replace('entities/', ''),
        );
        customStoryIds.forEach((id: string) => {
          refetchCustomStory({ id });
        });
      };

      const setFirstFrameTitleAsStoryTitle = (story: Entity): Entity => {
        let modifiedStory: Entity = JSON.parse(JSON.stringify(story));
        if (story.frames?.length) {
          const firstFrameTitle: string = story.frames[0]?.title[0]?.value
            ? story.frames[0]?.title[0]?.value
            : '';
          if (modifiedStory.title[0]) {
            modifiedStory.title[0].value = firstFrameTitle;
          }
        }
        return modifiedStory;
      };

      watch(
        () => activeBoxResult.value,
        (boxResult) => {
          if (boxResult.ActiveBox) {
            storyAssets.value = boxResult.ActiveBox.results;
            const boxVisitorStories = boxVisiter.value.relations.filter(
              (relation: Relation) => relation.type == 'stories',
            );
            setStories(storyAssets.value);
            const seenFrames: Array<any> = [];
            const customStories: Relation[] = [];
            boxVisitorStories.forEach((boxVisitorStory: any) => {
              if (boxVisitorStory.seen_frames) {
                seenFrames.push(...boxVisitorStory.seen_frames);
              } else {
                lastSeenStoryId.value = boxVisitorStory.key.replace('entities/', '');
              }
              if (
                !storyAssets.value.find(
                  (storyAsset) =>
                    storyAsset.id === boxVisitorStory.key.replace('entities/', ''),
                )
              ) {
                customStories.push(boxVisitorStory);
                lastSeenStoryId.value = boxVisitorStory.key.replace('entities/', '');
              }
            });
            if (customStories.length) {
              console.log(
                `User created ${customStories.length} stories on coghent webportal `,
              );
              getCustomStories(customStories);
            }
            if (!lastSeenStoryId.value) {
              try {
                const lastSeenFrame = getLastSeenFrame(seenFrames);
                lastSeenStoryId.value = getStoryForFrame(
                  storyAssets.value,
                  lastSeenFrame,
                );
              } catch (e) {
                console.warn(e);
              }
            }
          }
        },
      );

      watch(
        () => customStoryResult.value,
        () => {
          let result: Entity = customStoryResult.value.GetStoryById;
          result = setFirstFrameTitleAsStoryTitle(result);
          if (!storyAssets.value.find((asset: Entity) => asset.id === result.id)) {
            colors.unshift('bg-stories-orange');
            storyAssets.value = [result, ...storyAssets.value];
            setStories(storyAssets.value);
          }
        },
      );

      const scrollToStory = () => {
        setTimeout(() => {
          const storyItem: any = document.getElementById(lastSeenStoryId.value);
          if (lastSeenStoryId.value && storyItem) {
            storyItem.scrollIntoView({ behavior: 'smooth' });
          }
        }, 500);
      };

      const restartOnBoarding = () => {
        resetOnBoardingState();
        scrollToStory();
      };

      onUpdated(() => {
        if (isFirstStoryOverview.value) {
          scrollToStory();
        }
      });

      onMounted(() => {
        if (storiesPageState.value) {
          storyAssets.value = storiesPageState.value;
        } else {
          refetchActiveBoxresult();
        }
      });

      watch(
        () => timerState.value.timeLeft,
        (timeLeft) => {
          if (timeLeft && timeLeft <= timerSettings.value.showModalTime) {
            hideAllPoppers();
            openInactivityModal();
          } else {
            closeInactivityModal();
          }
        },
      );

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
        restartOnBoarding,
        loadingCustomStory,
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
