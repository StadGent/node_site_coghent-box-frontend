<template>
  <section class="pb-24">
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
        :items-each-load="10"
        :use-router-navigation="true"
        :has-custom-image-overlay="true"
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
    <section v-else class="py-24">
      <h3 class="text-xl font-bold">Dit verhaal heeft nog geen assets</h3>
    </section>
  </section>
</template>

<script lang="ts">
  import { defineComponent, onMounted, onUpdated, ref, watch } from 'vue';
  import { TheMasonry } from 'coghent-vue-3-component-library';
  import { useBoxVisiter, BaseIcon } from 'coghent-vue-3-component-library';
  import { apolloClient } from '@/main';
  import { useRouter } from 'vue-router';
  import { Entity } from 'coghent-vue-3-component-library/lib/queries';
  import { iiiF } from '@/main';

  type EntityData = {
    results: [];
  };

  export default defineComponent({
    name: 'StoryItem',
    components: { TheMasonry, BaseIcon },
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
    },
    setup(props) {
      const { generateUrl, noImageUrl } = iiiF;
      const masonry = ref<any>(null);
      const entityData = ref<EntityData>({ results: [] });
      const { boxVisiter, setStartAsset, setSelectedStory } = useBoxVisiter(apolloClient);
      const relation = boxVisiter.value.relations.find(
        (relation: any) => relation.type === 'stories',
      );
      const router = useRouter();

      props.storyEntities.forEach((frame: any) => {
        try {
          const isFrameSeen =
            relation.seen_frames && relation.seen_frames.includes('entities/' + frame.id);
          //Set variable on assets to indicate it has been seen
          const frameAssets = frame.assets.map((asset: any) => {
            const newAsset = { ...asset };
            newAsset.seen = isFrameSeen ? true : false;
            return newAsset;
          });
          entityData.value.results.push(...entityData.value.results.concat(frameAssets));
        } catch (e) {
          if (frame.assets) {
            entityData.value.results += { ...frame.assets };
          }
          console.log(`Seen frames could not be shown: ${e}`);
        }
      });

      const navigateToTouchtable = (entity: Entity) => {
        setStartAsset(entity);
        router.push('/touchtable/' + entity.id);
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
