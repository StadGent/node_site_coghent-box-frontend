<template>
  <ViewPort :stories="stories" />
</template>
<script lang="ts">
import { defineComponent, ref } from 'vue';
import ViewPort from '@/components/ViewPort.vue';
import { useQuery } from '@vue/apollo-composable';
import { GetFullEntitiesDocument } from 'coghent-vue-3-component-library/lib';
import { SearchFilter  } from 'coghent-vue-3-component-library/lib/queries';
import { GetStoriesDocument  } from 'coghent-vue-3-component-library';

export default defineComponent({
  name: 'Wall',
  components: { ViewPort },

  setup() {
    const searchValue: SearchFilter = {
      value: 'story',
      key: 'type',
      isAsc: true,
      relation_filter: [],
    };
    let stories = ref<Array<any>>();

    const { onResult: Stories } = useQuery(GetStoriesDocument,{searchValue: searchValue})

    Stories((entities) => {
      const activeStories = entities.data.Entities?.results;
      if (activeStories) {
        stories.value = [...activeStories];
      }
    });

    return {
      stories,
    };
  },
});
</script>