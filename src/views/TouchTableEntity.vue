<template>
  <touch-header/>
  <canvas id="canvas" class="touchcanvas" />
  <CardComponent :sideStrip="true" :large="true" :reverseColors="true" class="infocard" v-if="entity">
      <h2 class="font-bold text-4xl pb-4">{{entity.objectName[0].value}}</h2>
      <p>{{entity.description[0].value}}</p>
      <div class="flex flex-wrap mt-4">
        <div v-for="(item, index) in relationsLabelArray" :key="index" class="bg-tag-neutral text-text-dark py-2 px-4 mr-2 my-2 text-center">
          <p>{{item}}</p>
      </div>
      </div>
  </CardComponent>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue';
import FabricService from '../services/Fabric/FabricService';
import { useRoute, useRouter } from 'vue-router'
import { useQuery } from '@vue/apollo-composable'
import { GetEntityByIdDocument, CardComponent} from 'coghent-vue-3-component-library'
import { fabricdefaults } from '@/services/Fabric/defaults.fabric';
import TouchHeader from '@/components/TouchHeader.vue';


const asString = (x: string | string[]) => (Array.isArray(x) ? x[0] : x)

export default defineComponent({
  name: 'TouchTable',
  components: {
      CardComponent,
      TouchHeader,
  },
  setup: (props) => {
      const id = asString(useRoute().params['entityID'])
      const { result, onResult } = useQuery(GetEntityByIdDocument, { id })
      const relationStringArray = ref<string[]>([])
      const relationsLabelArray = ref<string[]>([])
      const entity = ref<any>()

      onMounted(() => {
        let mainImage = window.localStorage.getItem('selectedObject')
        if(mainImage){
            mainImage = JSON.parse(mainImage)
            console.log({mainImage})
            const fabricService: FabricService = new FabricService();
            console.log(fabricService.state.canvas)
            fabricService.generateMainImageFrame(mainImage)
        }
      })

      onResult((queryResult: any)=> {
        if (queryResult.data){
            console.log(queryResult.data)

            queryResult.data.Entity?.relations
            .filter((filter: any) => filter.label && filter.label !== '')
            .forEach((relation: any) => {
            relationStringArray.value.push(relation.key)
            relation.label && relationsLabelArray.value.push(relation.label)
          })

          entity.value = queryResult.data.Entity
          console.log(relationStringArray)
          console.log(relationsLabelArray)
        }
      })

    return {entity,
    relationStringArray,
    relationsLabelArray}
  },
});
</script>

<style scoped>
.touchcanvas {
  width: 3840px;
  height: 2160px;
}
.infocard{
    position: absolute;
    top: 100px;
    left: 100px;
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
    width: 500px;
}
</style>
