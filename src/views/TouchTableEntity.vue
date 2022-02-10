<template>
<div class="touchtable">
  <touch-header/>
  <canvas id="canvas" class="touchcanvas"/>
  <CardComponent :sideStrip="true" :large="true" :reverseColors="true" class="infocard" v-if="entity">
      <h2 class="font-bold text-6xl mb-12">{{entity.title[0].value}}</h2>
      <p class="text-4xl mb-12" v-if="entity.description[0].value">{{entity.description[0].value}}</p>
      <p class="text-4xl mb-12" v-else>This item does not have a description</p>
  </CardComponent>
  <relationBrowser v-if="relationsLabelArray" :relations="relationsLabelArray" :loading="loading"/>
</div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, watch } from 'vue';
import FabricService from '../services/Fabric/FabricService';
import { useRoute, useRouter } from 'vue-router'
import { useQuery } from '@vue/apollo-composable'
import { GetTouchTableEntityByIdDocument, CardComponent, GetTouchTableEntityDocument} from 'coghent-vue-3-component-library'
import TouchHeader from '@/components/TouchHeader.vue';
import RelationBrowser from '@/components/RelationBrowser.vue';
import {fabricdefaults} from '../services/Fabric/defaults.fabric'

const asString = (x: string | string[]) => (Array.isArray(x) ? x[0] : x)

type SecondaryRelation = {
  originId: string,
  relatedEntities: Array<any>
}

export default defineComponent({
  name: 'TouchTableEntity',
  components: {
      CardComponent,
      TouchHeader,
      RelationBrowser,
  },
  setup: () => {
      const route = useRoute()
      const id = asString(route.params['entityID'])
      const { result, onResult:onEntityResult, loading, refetch } = useQuery(GetTouchTableEntityByIdDocument, { id})
      const relationStringArray = ref<string[]>([])
      const relationsLabelArray = ref<string[]>([])
      const subRelations = ref<SecondaryRelation[]>([])
      const entity = ref<any>()
      const headEntityId = ref<string>()
      let fabricService: FabricService | undefined = undefined

      const {
      result: relationResult,
      onResult: onRelationResult,
      loading: loadingRelations,
      refetch: refetchRelations,
      fetchMore: fetchMoreRelations,
    } = useQuery(
      GetTouchTableEntityDocument,
        () => ({
        limit: fabricdefaults.canvas.relationLimit,
        skip: result ? 0 : 1,
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
        limit: fabricdefaults.canvas.relationLimit,
        skip: result ? 0 : 1,
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

      watch(() => subRelations.value.length, () => {
        subRelations.value.forEach((relation: SecondaryRelation) => {
          fabricService?.generateSecondaryImageFrames(relation.relatedEntities, relation.originId)
          subRelations.value = subRelations.value.filter((subrelation: any) => subrelation != relation)
        })
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
            
            getRelationStrings(queryResult.data.Entity)
            headEntityId.value = queryResult.data.Entity.id
            entity.value = queryResult.data.Entity
        }
      })

      onRelationResult((relationResult) => {
      console.log('Relation result')
      if(relationResult.data && fabricService){
        const relationEntities = relationResult.data.Entities?.results
        const filteredRelationEntities = relationEntities.filter((ent: any) => ent.id != entity.value.id)
        fabricService.generateSecondaryImageFrames(filteredRelationEntities, id)
        
        filteredRelationEntities.forEach((entity: any) => {
          const entityRelations: Array<string> = []

          entity.relations.forEach((relation: any) => {
            entityRelations.push(relation.key)
          });

          fetchMoreRelations({
            variables: {
              limit: fabricdefaults.canvas.relationLimit,
              skip: relationResult ? 0 : 1,
              searchValue: {
              value: '',
              isAsc: false,
              relation_filter: entityRelations,
              randomize: false,
              key: 'title',
              has_mediafile: true,
            }
          },
          updateQuery: (previousData, {fetchMoreResult}) => {
            console.log(entity.id)
            console.log({fetchMoreResult})
            const newRelation: SecondaryRelation = {
              originId: entity.id,
              relatedEntities: fetchMoreResult.Entities.results
            }
            subRelations.value.push(newRelation)
          }}
          )
          
        });


      }
  })

    return {entity,
    relationStringArray,
    relationsLabelArray,
    loading,
    route}
  },
});
</script>

<style scoped>
.touchcanvas{
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
    height: calc(2160px - 300px)
}
#canvas{
  background-color: #F0EDE6;
}
</style>
