<template>
  <div class="text-text-dark">
    <TouchHeader
      v-model:keyword="keyword"
      :msg="msg"
      :get-data="getData"
      :basket="basket"
    />
    <TouchCanvas
      v-model:basket="basket"
      v-model:legend="legend"
      :entities="entities"
    />
    <div class="legend">
      <div
        v-for="option in legend"
        :key="option.type"
        @click="filterOnType(option.type)"
      >
        <div
          class="legendDiv"
          :style="{backgroundColor: option.color}"
        />
        <span>{{ option.type }}</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue'
import { useMutation, useQuery, useResult } from '@vue/apollo-composable'

import { GetFullEntitiesDocument, EntitiesResults } from 'coghent-vue-3-component-library'
import TouchCanvas from '../components/TouchCanvas.vue'
import TouchHeader from '../components/TouchHeader.vue'
import { Square } from '../models/SquareModel'
import { DataRepository } from '../repositories/DataRepository'
import { Collection, Result } from '../models/CollectionModel'

export default defineComponent({
  name: 'TouchTable',
  components: {
    TouchCanvas,
    TouchHeader
  },
  props: {
    msg: {
      type: String,
      required: true
    }
  },
  setup: (props) => {
    const basket = ref<Square[]>([])
    const legend = ref<any[]>([])
    const keyword = ref<string>('Strijkijzer')
    const entities = ref<Result[]>([])
    
    const dataRepo: DataRepository = new DataRepository()

    onMounted(() => {

    })


    const { result, loading, onResult, refetch } = useQuery(
      GetFullEntitiesDocument, {
        searchQuery: keyword.value,
        limit: 100,
        fetchPolicy: 'no-cache'
      }
    )

    const getData = () => {
      console.log('refetching')
      refetch({
        searchQuery: keyword.value,
        limit: 100,
        fetchPolicy: 'no-cache'
      })
    }

    onResult(({ data, error }) => {
      console.log(result.value)
      console.log(data)
      console.log(error)
      //console.log(error.value)
      console.log(loading.value)
      const response : EntitiesResults | undefined | null | any = data?.Entities
      if(response && response.results){
        const newEntities: Result[] = []
        response.results.forEach((result: any, index: number) => {
          const newEntity: any = {}
          if(result && result.id !== "noid") {
            newEntity.id = result.id
            newEntity.type = result.type
            newEntity.metadata = result.metadata
            newEntity.relations = result.relations
            newEntity.image = result.mediafiles[0].original_file_location
            newEntities.push(newEntity)
            //promises.push(dataRepo.getRelationData(result.id))
            //promises.push(dataRepo.getMediaData(result.id))
            /*Promise.all(promises).then(([relations, media]) => {
              newEntity.relations = relations
              if (media[0]) {
                newEntity.image = media[0].thumbnail_file_location
              }
              newEntities.push(newEntity)
            })*/
          }
        })
        entities.value = newEntities
      }
    })

    const filterOnType = (type: string) => {
      keyword.value = type
      getData()
    }

    return {
      basket,
      legend,
      keyword,
      entities,
      getData,
      filterOnType
    }
  }
})

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
