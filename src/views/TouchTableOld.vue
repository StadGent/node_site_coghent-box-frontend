<template>
  <div class="text-text-dark">
    <TouchHeader
      v-model:keyword="keyword"
      :msg="msg"
      :get-data="getData"
      :basket="basket"
    />
    <TouchCanvas v-model:basket="basket" v-model:legend="legend" :entities="entities" />
    <div class="legend">
      <div v-for="option in legend" :key="option.type" @click="filterOnType(option.type)">
        <div class="legendDiv" :style="{ backgroundColor: option.color }" />
        <span>{{ option.type }}</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue';
import { useMutation, useQuery, useResult } from '@vue/apollo-composable';

import {
  GetFullEntitiesDocument,
  EntitiesResults,
  GetEntityByIdDocument,
} from 'coghent-vue-3-component-library';
import TouchCanvas from '../components/TouchCanvas.vue';
import TouchHeader from '../components/TouchHeader.vue';
import { Square } from '../models/SquareModel';
import { DataRepository } from '../repositories/DataRepository';
import { Collection, Result, Relation } from '../models/CollectionModel';

export default defineComponent({
  name: 'TouchTable',
  components: {
    TouchCanvas,
    TouchHeader,
  },
  props: {
    msg: {
      type: String,
      required: true,
    },
  },
  setup: (props) => {
    const basket = ref<Square[]>([]);
    const legend = ref<any[]>([]);
    const keyword = ref<string>('Strijkijzer');
    const entities = ref<Result[]>([]);

    const dataRepo: DataRepository = new DataRepository();

    onMounted(() => {});

    const { result, loading, onResult, refetch } = useQuery(GetFullEntitiesDocument, {
      searchValue: { value: keyword.value },
      limit: 10,
      fetchPolicy: 'no-cache',
    });

    const { result: IdResult, refetch: idRefetch } = useQuery(GetEntityByIdDocument, {
      id: '',
    });

    const getData = () => {
      console.log('refetching');
      refetch({
        searchValue: { value: keyword.value },
        limit: 10,
        fetchPolicy: 'no-cache',
      });
    };

    const getEntity = (id: string): Promise<any> | undefined => {
      return idRefetch({
        id: id,
      });
    };

    // onResult(({ data, error }) => {
    //   console.log(data?.Entities);
    //   const response: EntitiesResults | undefined | null = data?.Entities;
    //   if (response && response.results) {
    //     const newEntities: Result[] = [];
    //     const relations = new Map();
    //     response.results.forEach((result, index: number) => {
    //       const newEntity: any = {};
    //       if (result && result.id !== 'noid') {
    //         newEntity.id = result.id;
    //         newEntity.type = result.type;
    //         // if(result.title && result.title[0]){
    //         //   newEntity.title = result.title[0].value
    //         // }
    //         newEntity.metadata = result.metadata;
    //         if (result.mediafiles && result.mediafiles[0]) {
    //           newEntity.image = result.mediafiles[0].original_file_location;
    //         }
    //         newEntity.relations = [];
    //         result.relations?.forEach((relation) => {
    //           if (relation && relation.key) {
    //             const entityRel: Relation = {
    //               key: relation.key,
    //               type: relation.type,
    //               entity: undefined,
    //             };
    //             const rel = relations.get(relation.key);
    //             if (rel) {
    //               entityRel.entity = rel;
    //             } else {
    //               getEntity(relation.key)?.then((res) => {
    //                 const entityData = res.data.Entity;
    //                 relations.set(relation.key, entityData);
    //                 entityRel.entity = {
    //                   id: entityData.id,
    //                   type: entityData.type,
    //                   title: entityData.title[0].value,
    //                   data: {},
    //                   identifiers: [],
    //                   metadata: [],
    //                   relations: [],
    //                   image: undefined,
    //                 };
    //               });
    //             }
    //             newEntity.relations.push(entityRel);
    //           }
    //         });
    //         newEntities.push(newEntity);
    //       }
    //     });
    //     entities.value = newEntities;
    //   }
    // });

    const filterOnType = (type: string) => {
      keyword.value = type;
      getData();
    };

    return {
      basket,
      legend,
      keyword,
      entities,
      getData,
      filterOnType,
      result,
    };
  },
});
</script>

<style scoped>
h1 {
  color: #42b983;
}
p {
  color: white;
}
.legend {
  position: fixed;
  bottom: 20px;
  left: 100px;
}
.legend div {
  cursor: pointer;
}
.legend div:hover {
  font-weight: bold;
}
.legendDiv {
  width: 30px;
  height: 15px;
  float: left;
  margin-right: 5px;
}
</style>
