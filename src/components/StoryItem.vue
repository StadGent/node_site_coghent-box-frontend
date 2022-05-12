<template>
  <section :class="storyNumber == 1 ? 'pb-12' : 'py-12'">
    <section class="flex items-center">
      <div
        :class="`flex justify-center items-center mr-12 h-48 w-48 z-40 rounded-full bg-${storyColor} shadow-${storyColor}`"
      >
        <p class="font-bold text-7xl text-text-white">
          {{ storyNumber }}
        </p>
      </div>
      <div>
        <h2 :class="`text-5xl font-bold text-${storyColor}`">
          {{ story.title[0].value }}
        </h2>
      </div>
    </section>
    <section v-if="storyEntities.length">
      <the-masonry
        ref="masonry"
        :tiles="entityData"
        :entities="entityData"
        :loading="loading"
        :generate-url="generateUrl"
        :no-image-url="noImageUrl"
        :show-load-more="false"
        :items-each-load="entityData.length"
        :use-router-navigation="true"
        :has-custom-image-overlay="true"
        @navigateWithRouter="navigateToTouchtable"
      >
        <template #tile="{ entity }">
          <router-link
            :to="{ path: '/touchtable/' + entity.id }"
            class="absolute top-0 left-0 w-full h-full"
            @click="handleTouchtableNavigation(entity)"
          >
            <div
              v-if="entity.seen"
              :class="`
              absolute
              top-4
              left-4
              flex
              justify-center
              items-center
              rounded-full
              w-14
              h-14
              bg-${storyColor}
              text-text-white text-3xl
            `"
            >
              <base-icon icon="check" class="stroke-current fill-current stroke-2" />
            </div>
            <div
              v-if="
                onBoardingEntityId == entity.id &&
                isLastSeenStory &&
                onBoardingState.status == 'started' &&
                onBoardingState.currentStepName == 'goToTouchTable'
              "
              class="text-4xl"
            >
              <on-boarding-card
                :showCard="true"
                :cardTitle="t('touchtable.onBoarding.goToTouchTable.title')"
                :cardDescription="t('touchtable.onBoarding.goToTouchTable.description')"
                :showPreviousButton="false"
                placement="right"
                @nextButtonClicked="navigateToTouchtable(entity)"
              ></on-boarding-card>
            </div>
          </router-link>
        </template>
      </the-masonry>
    </section>
    <section v-else class="py-24">
      <h3 class="text-xl font-bold">Dit verhaal heeft nog geen assets</h3>
    </section>
  </section>
</template>

<script lang="ts">
  import { defineComponent, nextTick, onMounted, onUpdated, ref, watch } from 'vue';
  import { TheMasonry } from 'coghent-vue-3-component-library';
  import { useBoxVisiter, BaseIcon } from 'coghent-vue-3-component-library';
  import { apolloClient } from '@/main';
  import { useRouter } from 'vue-router';
  import { Entity, Relation } from 'coghent-vue-3-component-library/lib/queries';
  import { iiiF } from '@/main';
  import { useTouchTable } from '@/composables/useTouchTable';
  import { useOnBoarding } from '@/composables/useOnBoarding';
  import OnBoardingCard from '@/components/OnBoardingCard.vue';
  import { useI18n } from 'vue-i18n';

  type EntityData = {
    results: any[];
  };

  export default defineComponent({
    name: 'StoryItem',
    components: { TheMasonry, BaseIcon, OnBoardingCard },
    props: {
      story: {
        type: Object,
        required: true,
      },
      storyNumber: {
        type: Number,
        required: true,
      },
      storyColor: {
        type: String,
        required: true,
      },
      storyEntities: {
        type: Object,
        required: true,
      },
      loading: {
        type: Boolean,
        required: true,
      },
      lastStoryItem: {
        type: Boolean,
        required: true,
        default: false,
      },
      isLastSeenStory: {
        type: Boolean,
        required: false,
      },
    },
    setup(props) {
      const { generateUrl, noImageUrl } = iiiF;
      const masonry = ref<any>(null);
      const entityData = ref<EntityData>({ results: [] });
      const { boxVisiter, setStartAsset, setSelectedStory } = useBoxVisiter(apolloClient);
      const boxVisiterStories = boxVisiter.value.relations.find(
        (relation: any) => relation.type === 'stories',
      );
      const router = useRouter();
      const { updateIsFirstStoryOverview } = useTouchTable();
      const onBoardingEntityId = ref<string>();
      const { onBoardingState } = useOnBoarding();
      const { t } = useI18n();

      const filterVisitedRelationsFromBoxVisiter = (relations: Relation[]): string[] => {
        const visitedRelations = relations
          .filter((relation: Relation) => relation.type == 'visited')
          .map((relation: Relation) => relation.key.replace('entities/', ''));
        return visitedRelations as string[];
      };

      const tempAssetArray: any[] = [];
      props.storyEntities.forEach((frame: any, frameIndex: number) => {
        const visitedAssets = filterVisitedRelationsFromBoxVisiter(
          boxVisiter.value.relations,
        );
        try {
          let isFrameSeen: Boolean = false;
          boxVisiterStories.seen_frames.forEach((seenFrame: any) => {
            if (seenFrame.id == frame.id) {
              isFrameSeen = true;
            }
          });
          const frameAssets = frame.assets.map((asset: any, index: number) => {
            if (index == 0 && frameIndex == 0) {
              onBoardingEntityId.value = asset.id;
            }
            const newAsset = { ...asset };
            newAsset.seen =
              isFrameSeen || visitedAssets.includes(asset.id) ? true : false;
            return newAsset;
          });
          tempAssetArray.push(...entityData.value.results.concat(frameAssets));
        } catch (e) {
          if (frame.assets) {
            console.log(`No seen frames, looking for visited assets instead`);
            const frameAssets = frame.assets.map((asset: any, index: number) => {
              if (index == 0 && frameIndex == 0) {
                onBoardingEntityId.value = asset.id;
              }
              const newAsset = { ...asset };
              newAsset.seen = visitedAssets.includes(asset.id) ? true : false;
              return newAsset;
            });
            tempAssetArray.push(...entityData.value.results.concat(frameAssets));
          }
        }
      });

      entityData.value.results = tempAssetArray;

      const handleTouchtableNavigation = (entity: Entity) => {
        updateIsFirstStoryOverview(false);
        setStartAsset(entity);
        setSelectedStory({
          id: props.story.id,
          color: props.storyColor,
          title: props.story.title[0].value,
        });
      };

      return {
        entityData,
        generateUrl,
        noImageUrl,
        masonry,
        router,
        handleTouchtableNavigation,
        onBoardingEntityId,
        onBoardingState,
        t,
      };
    },
  });
</script>

<style scoped>
  .shadow-accent-purple {
    box-shadow: 0px 0px 20px rgba(182, 80, 153, 0.75);
  }
  .shadow-accent-blue {
    box-shadow: 0px 0px 20px rgba(159, 205, 217, 0.75);
  }
  .shadow-accent-yellow {
    box-shadow: 0px 0px 20px rgba(253, 194, 11, 0.75);
  }
  .shadow-accent-green {
    box-shadow: 0px 0px 20px rgba(2, 167, 127, 0.75);
  }
</style>
