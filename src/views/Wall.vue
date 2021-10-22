<template>
  <ViewPort />
</template>
<script lang="ts">
import { defineComponent, onMounted } from 'vue';
import ViewPort from '@/components/ViewPort.vue';
import { useQuery } from '@vue/apollo-composable';
import {
  GetEntityByIdDocument,
  GetFullEntitiesDocument,
} from 'coghent-vue-3-component-library/lib';
import RESTRepository from '@/repositories/RestRepository';

export default defineComponent({
  name: 'Wall',
  components: { ViewPort },
  setup() {
    const restRepo = new RESTRepository();
    const { result, loading } = useQuery(GetFullEntitiesDocument, {
      searchValue: { value: '', type: 'story' },
      limit: 10,
    });
    console.log('RESULT', result.value?.Entities);

    const storyTitle = result.value?.Entities?.results?.[0]?.title?.[0]?.value;
    console.log(storyTitle);
    const relations = result.value?.Entities?.results?.[0]?.relations;
    console.log(relations);
    relations?.forEach((relation: any) => {
      const index = (relation?.key.indexOf('/') as number) + 1;
      const id = relation?.key.slice(index, -1);
      const { result, loading } = useQuery(GetEntityByIdDocument, { id: id });
      console.log(result);
    });
  },
});
</script>