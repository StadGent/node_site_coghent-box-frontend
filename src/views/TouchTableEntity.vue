<template>
  <touch-header/>
  <canvas id="canvas" class="touchcanvas" />
  <CardComponent :sideStrip="true" :large="true" :reverseColors="true" class="infocard" v-if="entity">
      <h2 class="font-bold text-4xl pb-4">{{entity.title[0].value}}</h2>
      <p>{{entity.description[0].value}}</p>
      <div class="flex flex-wrap mt-4">
        <div v-for="(item, index) in relationsLabelArray" :key="index" class="bg-tag-neutral text-text-dark py-2 px-4 mr-2 my-2 text-center">
          <p>{{item}}</p>
      </div>
      </div>
  </CardComponent>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, watch } from 'vue';
import FabricService from '../services/Fabric/FabricService';
import { useRoute, useRouter } from 'vue-router'
import { useQuery } from '@vue/apollo-composable'
import { GetTouchTableEntityByIdDocument, CardComponent, GetTouchTableEntityDocument} from 'coghent-vue-3-component-library'
import { fabricdefaults } from '@/services/Fabric/defaults.fabric';
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
      const { result, onResult, refetch } = useQuery(GetTouchTableEntityByIdDocument, { id })
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
        refetch({id :asString(route.params.entityID)})
      })

      watch(() => entity.value, () => {
      if(entity.value){
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

      onResult((queryResult: any)=> {
        if (queryResult.data){
            entity.value = queryResult.data.Entity
            console.log(entity.value)

            fabricService = new FabricService();
            headEntityId.value = entity.value.id
            fabricService.generateMainImageFrame(entity.value)
        }
      })

      onRelationResult((relationResult) => {
      if(relationResult.data && fabricService){
        const relationEntities = relationResult.data.Entities?.results
        console.log({relationResult})
        fabricService.generateSecondaryImageFrames(relationEntities).then(() => {
           relationEntities.forEach((entity: any) => {
          if (headEntityId.value){
            fabricService?.generateRelationBetweenFrames(headEntityId.value, entity.id)
          }
          
        });
        } 
        )

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
