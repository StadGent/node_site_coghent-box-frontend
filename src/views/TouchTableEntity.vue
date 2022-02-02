<template>
<div class="touchtable">
  <touch-header/>
  <div id="canvascontainer"></div>
  <canvas id="canvas" class="touchcanvas" />
  <CardComponent :sideStrip="true" :large="true" :reverseColors="true" class="infocard" v-if="entity">
      <h2 class="font-bold text-6xl pb-6">{{entity.title[0].value}}</h2>
      <p class="text-4xl" v-if="entity.description[0].value">{{entity.description[0].value}}</p>
      <p class="text-4xl" v-else>This item does not have a description</p>
      <div class="flex flex-wrap mt-4">
        <div v-for="(item, index) in relationsLabelArray" :key="index" class="bg-tag-neutral text-text-dark py-4 px-6 mr-2 my-2 text-center text-4xl font-bold">
          <p>{{item}}</p>
      </div>
      </div>
  </CardComponent>
</div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, watch } from 'vue';
import FabricService from '../services/Fabric/FabricService';
import { useRoute, useRouter } from 'vue-router'
import { useQuery } from '@vue/apollo-composable'
import { GetTouchTableEntityByIdDocument, CardComponent, GetTouchTableEntityDocument} from 'coghent-vue-3-component-library'
import TouchHeader from '@/components/TouchHeader.vue';

const asString = (x: string | string[]) => (Array.isArray(x) ? x[0] : x)

export default defineComponent({
  name: 'TouchTableEntity',
  components: {
      CardComponent,
      TouchHeader,
  },
  setup: () => {
      const route = useRoute()
      const id = asString(route.params['entityID'])
      const { result, onResult:onEntityResult, refetch } = useQuery(GetTouchTableEntityByIdDocument, { id })
      const relationStringArray = ref<string[]>([])
      const relationsLabelArray = ref<string[]>([])
      const entity = ref<any>()
      const headEntityId = ref<string>()
      let fabricService: FabricService | undefined = undefined

      const {
      result: relationResult,
      onResult: onRelationResult,
      loading: loadingRelations,
      refetch: refetchRelations
    } = useQuery(
      GetTouchTableEntityDocument,
        () => ({
        limit: 0,
        skip: entity.value,
        searchValue: {
          value: '',
          isAsc: false,
          relation_filter: relationStringArray.value,
          randomize: false,
          key: 'title',
          has_mediafile: true,
        },
      }),
      () => ({
        prefetch: false,
      })
    )

    watch(() => route.params.entityID, () => {
      console.log('Refetch entity')
        refetch({id :asString(route.params.entityID)})
      })

      watch(() => entity.value, () => {
      if(entity.value){
        console.log('refetch relations')
        console.log(entity.value)
        refetchRelations({
        limit: 0,
        skip: entity.value,
        searchValue: {
          value: '',
          isAsc: false,
          relation_filter: relationStringArray.value,
          randomize: false,
          key: 'title',
          has_mediafile: true,
        },
      })
      }
      })

      const getRelationStrings = (entity: any) => {
        const tempStringArray: Array<string> = []
        const tempLabelArray: Array<string> = []
        entity.relations
          .forEach((relation: any) => {
            if (tempStringArray.indexOf(relation.key) < 0){
              tempStringArray.push(relation.key)
              tempLabelArray.push(relation.value)
            }
          })
          relationStringArray.value = tempStringArray
          relationsLabelArray.value = tempLabelArray
      }

      onEntityResult((queryResult: any)=> {
        if (queryResult.data){
            console.log('new canvas')
            fabricService = undefined
            fabricService = new FabricService();
            
            fabricService.generateMainImageFrame(queryResult.data.Entity)
            entity.value = queryResult.data.Entity
            headEntityId.value = entity.value.id
            getRelationStrings(entity.value)
        }
      })

      onRelationResult((relationResult) => {
      console.log('Relation result')
      if(relationResult.data && fabricService){
        const relationEntities = relationResult.data.Entities?.results
        const filteredRelationEntities = relationEntities.filter((ent: any) => ent.id != entity.value.id)
        fabricService.generateSecondaryImageFrames(filteredRelationEntities)

      }
  })

    return {entity,
    relationStringArray,
    relationsLabelArray,
    route}
  },
});
</script>

<style scoped>
.touchcanvas {
  width: 100%;
  height: 100%;
}
.touchtable {
  width: 3840px;
  height: 2160px;
}
.infocard{
    position: absolute;
    top: 100px;
    left: 100px;
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
    width: 800px;
    height: calc(2160px - 200px)
}
#canvas{
  background-color: #F0EDE6;
}
</style>
