<template>
  <div>
    <h1>{{ msg }}</h1>
    <div>
      <input v-model="keyword" placeholder="keyword" />
      <button @click="getData()">Get data</button>
    </div>
    <p>Currently in basket:</p>
    <p>
      <span v-for="square in basket" :key="square.id">{{ square.title.text }}, </span>
    </p>
    <TouchCanvas v-model:basket="basket" v-model:legend="legend" :entities="entities"/>
    <div class="legend">
      <div v-for="option in legend" :key="option.type" @click="filterOnType(option.type)">
        <div class="legendDiv" :style="{backgroundColor: option.color}"></div>
        <span>{{option.type}}</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue'
import TouchCanvas from '../components/TouchCanvas.vue'
import { Square } from '../models/SquareModel'
import { ElasticData, ElasticHit } from '../models/ElasticDataModel'
import { DataRepository } from '../repositories/DataRepository'

export default defineComponent({
  name: 'TouchTable',
  components: {
    TouchCanvas,
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
    const keyword = ref<String>("Strijkijzer")
    const entities = ref<ElasticHit[]>([])
    const dataRepo: DataRepository = new DataRepository()

    onMounted(() => {
      
    })

    const getData = () => {
      dataRepo.getData(keyword.value).then((response: ElasticData) => {
        console.log(response.hits.hits)
        entities.value = response.hits.hits
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
