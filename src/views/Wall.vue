<template>
  <ViewPort :stories="stories" />
</template>
<script lang="ts">
import { defineComponent, ref } from 'vue';
import ViewPort from '@/components/ViewPort.vue';
import { useQuery } from '@vue/apollo-composable';
import { GetFullEntitiesDocument } from 'coghent-vue-3-component-library/lib';
import { SearchFilter } from 'coghent-vue-3-component-library/lib/queries';

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
    const { onResult: onStoryResults } = useQuery(GetFullEntitiesDocument, {
      searchValue: searchValue,
    });

    onStoryResults((result) => {
      const entities = result.data.Entities?.results;
      if (entities) {
        stories.value = [...entities];
      }
    });

    return {
      stories,
    };
  },
});
</script>