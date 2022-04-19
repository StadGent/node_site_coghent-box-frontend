<template>
  <router-view />
</template>
<script lang="ts">
  import { Entity } from '@/models/GraphqlModel';
  import { useQuery } from '@vue/apollo-composable';
  import { GetActiveBoxDocument } from 'coghent-vue-3-component-library';
  import { defineComponent, onMounted, provide, ref } from 'vue';
  import { useRouter } from 'vue-router';

  export default defineComponent({
    name: 'Entrance',
    components: {},
    setup() {
      const router = useRouter();
      const stories = ref<Array<Entity>>([]);
      provide('stories', stories);

      const { refetch: updatedStories, loading } = useQuery(
        GetActiveBoxDocument,
        {},
        { fetchPolicy: 'cache-first' },
      );

      onMounted(() => {
        router.push({ name: 'entrance.step1' });
        console.log(updatedStories());
        updatedStories()?.then((value: any) => {
          stories.value = value.data.ActiveBox.results;
        });
      });
    },
  });
</script>

<style></style>
