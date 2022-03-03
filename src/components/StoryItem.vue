<template>
  <p class="text-7xl">{{ storyEntities.results }}</p>
  <section>
    <section class="flex items-center">
      <div
        :class="`flex justify-center items-center mr-12 h-40 w-40 rounded-full bg-${storyColor} shadow-purple`"
      >
        <p class="font-bold text-7xl text-text-white">{{ storyNumber }}</p>
      </div>
      <div>
        <h2 :class="`text-5xl font-bold text-${storyColor}`">{{ storyName }}</h2>
      </div>
    </section>
    <section>
      <the-masonry
        ref="masonry"
        :entities="storyEntities"
        :loading="loading"
        :generateUrl="generateUrl"
        :noImageUrl="noImageUrl"
        :showLoadMore="false"
        :itemsEachLoad="10"
      />
    </section>
  </section>
</template>

<script lang="ts">
  import { defineComponent, onMounted, onUpdated, ref, watch } from 'vue';
  import useIIIF from '@/composables/useIIIF';
  import { TheMasonry } from 'coghent-vue-3-component-library';

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

      console.log(props.storyEntities.results);

      onUpdated(() => {
        if (masonry.value && masonry.value.constructTiles) {
          console.log('ye');
          masonry.value.constructTiles();
        }
      });

      return {
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
