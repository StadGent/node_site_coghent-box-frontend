<template>
  <div>
    <TouchHeader
      v-model="keyword"
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

    const getData = () => {
      dataRepo.getCollectionData(keyword.value).then((response: Collection) => {
        const length = response.results.length - 1
        response.results.forEach((result: Result, index) => {
          dataRepo.getRelationData(result._id).then((relations: any) => {
            result.relations = relations

            dataRepo.getMediaData(result._id).then((media: any) => {
              if (media[0]) {
                result.image = media[0].thumbnail_file_location
              }

              if (index === length) {
                entities.value = response.results
              }
            })
          })
        })
      })
    }

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
