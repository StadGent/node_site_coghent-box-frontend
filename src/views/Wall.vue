<template>
  <ViewPort :story="story" />
</template>
<script lang="ts">
import { defineComponent, onMounted, reactive, ref } from 'vue';
import ViewPort from '@/components/ViewPort.vue';
import { useQuery } from '@vue/apollo-composable';
import RESTRepository from '@/repositories/RestRepository';
import {
  GetEntityByIdDocument,
  GetFullEntitiesDocument,
} from 'coghent-vue-3-component-library/lib';
import { Entity, SearchFilter } from 'coghent-vue-3-component-library/lib/queries';

export type Story = {
  title: string;
  items: Record<string, string>;
};

export default defineComponent({
  name: 'Wall',
  components: { ViewPort },
  setup() {
    const restRepo = new RESTRepository();
    const entities = ref();
    const items = reactive<Record<string, string>>({});
    const story = reactive<Story>({
      title: '',
      items: {},
    });
    const {
      onResult: onEntities,
      loading,
      refetch,
    } = useQuery(GetFullEntitiesDocument, {
      searchValue: { value: '', type: 'story' } as SearchFilter,
      limit: 10,
    });
    const { onResult: onRelation, refetch: refetchRelation } = useQuery(
      GetEntityByIdDocument,
      {
        id: '13532913-b00f-49a9-9382-c0a763654574',
      },
    );
    const getRelation = (id: string) => {
      return refetchRelation({ id: id });
    };

    onEntities((value: any) => {
      entities.value = value.data.Entities;
      story.title = entities.value.results?.[0]?.title?.[0]?.value;

      Getrelations(entities.value.results);
    });

    const Getrelations = (allEntities: Entity[]) => {
      allEntities[0].relations?.forEach((relation: any) => {
        const index = (relation?.key.indexOf('/') as number) + 1;
        const id = relation?.key.slice(index);
        getRelation(String(id))?.then((entity: any) => {
          items[entity.data.Entity?.title[0]?.value] =
            entity.data.Entity?.mediafiles?.[0]?.original_file_location ||
            'http://localhost:8001/download/9ce891fe75a8e75d82019665d2585a83-2005-0025_1.JPG';
        });
      });
      story.items = items;
    };

    return { story };
  },
});
</script>