<template>
  <router-view v-if="!loading" />
  <div
    v-if="loading"
    class="
      bg-background-medium
      w-screen
      h-screen
      flex flex-col
      justify-center
      items-center
      px-12
    "
  >
    <svg
      class="animate-spin -ml-1 mr-3 h-36 w-36 text-white"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        class="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        stroke-width="4"
      />
      <path
        class="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  </div>
</template>
<script lang="ts">
  import Common from '@/composables/common';
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
      const showCodePopup = ref<string | null>(null);
      provide('showCodePopup', showCodePopup);
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

        if (showCodePopup.value === null) {
          showCodePopup.value = Common().getUrlParamValue('popup');
        }
      });

      return { loading };
    },
  });
</script>

<style></style>
