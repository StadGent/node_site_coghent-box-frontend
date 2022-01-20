<template>
  <canvas id="canvas" class="touchcanvas" />
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, watch } from 'vue';
import { useMutation, useQuery, useResult } from '@vue/apollo-composable';
import FabricService from '../services/Fabric/FabricService';
import { GetTouchTableEntityDocument} from 'coghent-vue-3-component-library'

export default defineComponent({
  name: 'TouchTable',
  components: {
  },
  setup: (props) => {
     const relationStringArray = ref<string[]>([])
    const relationsLabelArray = ref<string[]>([])
    const headEntityId = ref<string>()
    let fabricService: FabricService | undefined = undefined

     const { result, loading, fetchMore, onResult, refetch } = useQuery<any>(
      GetTouchTableEntityDocument,
        () => ({
        limit: 1,
        skip: 0,
        searchValue: {
          value: '',
          isAsc: false,
          relation_filter: [],
          randomize: true,
          key: 'title',
          has_mediafile: true,
        },
      }),
      () => ({
        prefetch: false,
      })
    )

    watch(() => result.value, () => {
      if(result.value){
        console.log(result.value)
        console.log(relationStringArray.value)
        refetchRelations({
        limit: 0,
        skip: result.value,
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
    

    const {
      result: relationResult,
      onResult: onRelationResult,
      loading: loadingRelations,
      refetch: refetchRelations
    } = useQuery(
      GetTouchTableEntityDocument,
        () => ({
        limit: 0,
        skip: result.value,
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

    const initializeCanvas= (entities: Array<any>) => {
      fabricService = new FabricService();
      console.log({entities})
      fabricService.generateMainImageFrame(entities[0])

    }

    onResult((queryResult) => {
      if (queryResult.data){
        initializeCanvas(queryResult.data.Entities.results)

        headEntityId.value = queryResult.data.Entities?.results[0].id

        queryResult.data.Entities?.results[0].relations
            .filter((filter: any) => filter.label && filter.label !== '')
            .forEach((relation: any) => {
            relationStringArray.value.push(relation.key)
            relation.label && relationsLabelArray.value.push(relation.label)
          })
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


    return {relationStringArray,
    relationsLabelArray}
  },
});
</script>

<style scoped>
.touchcanvas {
  width: 3840px;
  height: 2160px;
}
</style>
