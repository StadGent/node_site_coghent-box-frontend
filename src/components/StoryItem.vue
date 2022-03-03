<template>
  <section>
    <section class="flex items-center">
      <div
        :class="`flex justify-center items-center mr-12 h-40 w-40 rounded-full bg-${storyColor} shadow-purple`"
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
        ref="masonry"
        :entities="entityData"
        :loading="loading"
        :generate-url="generateUrl"
        :no-image-url="noImageUrl"
        :show-load-more="false"
        :items-each-load="10"
        :make-url="
          (entity: any) => {
            return '/touchtable/' + entity.id;
          }
        "
      />
    </section>
  </section>
</template>

<script lang="ts">
  import { defineComponent, onMounted, onUpdated, ref, watch } from 'vue';
  import useIIIF from '@/composables/useIIIF';
  import { TheMasonry } from 'coghent-vue-3-component-library';
  import { useBoxVisiter } from 'coghent-vue-3-component-library';
  import { apolloClient } from '@/main';

  export default defineComponent({
    name: 'StoryItem',
    components: { TheMasonry },
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
      const { boxVisiter } = useBoxVisiter(apolloClient);
      const relation = boxVisiter.value.relations.find(
        (relation: any) => relation.type === 'stories',
      );
      console.log(relation);

      props.storyEntities.forEach((frame: any) => {
        console.log(frame.id);
        const isFrameSeen = relation.seen_frames.find(
          (seenFrame: any) => seenFrame.id === 'entities/' + frame.id,
        );
        console.log(isFrameSeen);
        //Set variable on assets to indicate it has been seen
        entityData.value.results = entityData.value.results.concat(frame.assets);
      });

      return {
        entityData,
        generateUrl,
        noImageUrl,
        masonry,
      };
    },
  });
</script>

<style scoped>
  .shadow-purple {
    box-shadow: 0px 0px 12px rgba(182, 80, 153, 0.2);
  }
</style>
