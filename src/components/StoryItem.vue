<template>
  <section class="py-24">
    <section class="flex items-center">
      <div
        :class="`flex justify-center items-center mr-12 h-52 w-52 -mb-12 z-40 rounded-full bg-${storyColor} shadow-${storyColor}`"
      >
        <p class="font-bold text-7xl text-text-white">
          {{ storyNumber }}
        </p>
      </div>
      <div>
        <h2 :class="`text-5xl font-bold text-${storyColor}`">
          {{ storyName }}
        </h2>
      </div>
    </section>
    <section>
      <the-masonry
        v-bind:tiles="entityData"
        ref="masonry"
        :entities="entityData"
        :loading="loading"
        :generate-url="generateUrl"
        :no-image-url="noImageUrl"
        :show-load-more="false"
        :items-each-load="10"
        :useRouterNavigation="true"
        :hasCustomImageOverlay="true"
        @navigateWithRouter="navigateToTouchtable"
      >
        <template #tile="entity">
          <div
            v-if="entity.seen"
            :class="`
              relative
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
        </template>
      </the-masonry>
    </section>
  </section>
</template>

<script lang="ts">
  import { defineComponent, onMounted, onUpdated, ref, watch } from 'vue';
  import useIIIF from '@/composables/useIIIF';
  import { TheMasonry } from 'coghent-vue-3-component-library';
  import { useBoxVisiter, BaseIcon } from 'coghent-vue-3-component-library';
  import { apolloClient } from '@/main';
  import { useRouter } from 'vue-router';
  import { Entity } from 'coghent-vue-3-component-library/lib/queries';

  export default defineComponent({
    name: 'StoryItem',
    components: { TheMasonry, BaseIcon },
    props: {
      storyName: {
        type: String,
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
    },
    setup(props) {
      const { generateUrl, noImageUrl } = useIIIF();
      const masonry = ref<any>(null);
      const entityData = ref({ results: [] });
      const { boxVisiter, setStartAsset } = useBoxVisiter(apolloClient);
      const relation = boxVisiter.value.relations.find(
        (relation: any) => relation.type === 'stories',
      );
      const router = useRouter();

      props.storyEntities.forEach((frame: any) => {
        const isFrameSeen = relation.seen_frames.find(
          (seenFrame: any) => seenFrame.id === 'entities/' + frame.id,
        )
          ? true
          : false;
        //Set variable on assets to indicate it has been seen
        const frameAssets = frame.assets.map((asset: any) => {
          const newAsset = { ...asset };
          newAsset.seen = isFrameSeen ? true : false;
          return newAsset;
        });
        entityData.value.results = entityData.value.results.concat(frameAssets);
      });

      const navigateToTouchtable = (entity: Entity) => {
        setStartAsset(entity);
        router.push('/touchtable/' + entity.id);
      };

      return {
        entityData,
        generateUrl,
        noImageUrl,
        masonry,
        router,
        navigateToTouchtable,
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
