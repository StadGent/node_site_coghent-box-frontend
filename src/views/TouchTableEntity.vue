<template>
<div class="touchtable" :key="id">
  <shutdown-modal :code="code"/>
  <touch-header :basketAmount="basketItems.length"/>
  <div id="canvas-container">
  <canvas id="canvas" class="touchcanvas"/>
  </div>
  <CardComponent :sideStrip="true" :large="true" :reverseColors="true" class="infocard" v-if="entity">
      <h2 class="font-bold text-6xl mb-12">{{entity.title[0].value}}</h2>
      <p class="text-4xl mb-12" v-if="entity.description[0].value">{{entity.description[0].value}}</p>
      <p class="text-4xl mb-12" v-else>This item does not have a description</p>
      <div class="flex w-full justify-center items-center mt-12">
      <base-button
          customStyle="touchtable-purple"
          customIcon="archiveDrawer"
          :iconShown="true"
          text="Aan verhalenbox toevoegen"
          @click="addToBasket"
        />
      </div>
  </CardComponent>
  <relationBrowser v-if="relationsLabelArray" :relations="relationsLabelArray" :loading="loading" @selected="highlightSelectedFilter"/>
</div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, watch } from 'vue';
import FabricService from '../services/Fabric/FabricService';
import { useRoute, useRouter } from 'vue-router'
import { useQuery, useMutation } from '@vue/apollo-composable'
import { GetTouchTableEntityByIdDocument, CardComponent, GetTouchTableEntityDocument, BaseButton, GetBoxVisiterRelationsByTypeDocument, AddAssetToBoxVisiterDocument} from 'coghent-vue-3-component-library'
import TouchHeader from '@/components/TouchHeader.vue';
import ShutdownModal from '@/components/ShutdownModal.vue';
import RelationBrowser from '@/components/RelationBrowser.vue';
import {fabricdefaults} from '../services/Fabric/defaults.fabric'
import { Relation, Entity } from 'coghent-vue-3-component-library/lib/queries'
import { router } from '@/router';

const asString = (x: string | string[]) => (Array.isArray(x) ? x[0] : x)

type SecondaryRelation = {
  originId: string,
  relatedEntities: Array<Relation>
}

export default defineComponent({
  name: 'TouchTableEntity',
  components: {
      CardComponent,
      TouchHeader,
      RelationBrowser,
      BaseButton,
      ShutdownModal
  },
  setup: () => {
      const route = useRoute()
      const id = asString(route.params['entityID'])
      const code = ref<string>('74173758')
      const { result, onResult:onEntityResult, loading, refetch } = useQuery(GetTouchTableEntityByIdDocument, {id})
      const { result: basketResult, onResult:onBasketResult, refetch:refetchBasket } = useQuery(GetBoxVisiterRelationsByTypeDocument, { code: code.value, type: "inBasket"})
      const { mutate: mutateBasket, onDone: onDoneAddingToBasket } = useMutation(AddAssetToBoxVisiterDocument, {variables: {code: code.value, assetId: id, type: "inBasket"}})
      const { mutate: mutateHistory, onDone: onDoneAddingHistory } = useMutation(AddAssetToBoxVisiterDocument, {variables: {code: code.value, assetId: id, type: "visited"}})
      const relationStringArray = ref<string[]>([])
      const relationsLabelArray = ref<string[]>([])
      const relationsArray = ref<Relation[]>([])
      const subRelations = ref<SecondaryRelation[]>([])
      const entity = ref<any>()
      const headEntityId = ref<string>()
      const basketItems = ref<Array<any>>([])
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
        // refetch({id :asString(route.params.entityID)})
        window.sessionStorage.removeItem('historyEntity')
        window.sessionStorage.setItem('historyEntity', JSON.stringify(entity.value))
        mutateHistory()
        router.go(0)
      })

      watch(() => entity.value, () => {
      if(entity.value){
        console.log('refetch relations')
        console.log(entity.value)
        if(entity.value.id == window.sessionStorage.getItem('startId')){
          window.sessionStorage.setItem('startEntity', JSON.stringify(entity.value))
        }
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

      const addToBasket = () => {
          mutateBasket()

      }

      const getRelations = (entity: Entity) => {

        const metaDataInLabel: string[] = [
        'objectnaam',
        'object_category',
        'MensgemaaktObject.draagt',
        'Entiteit.maaktDeelUitVan',
        'MaterieelDing.productie',
        'MensgemaaktObject.maaktDeelUitVan',
        'MaterieelDing.bestaatUit',
        'MaterieelDing.isOvergedragenBijVerwerving',
        'Entiteit.classificatie',
        'Entiteit.wordtNaarVerwezenDoor',
      ]

      if (entity.relations){
        entity.relations
          .forEach((relation: any) => {
            if (relationStringArray.value.indexOf(relation.key) < 0 && !metaDataInLabel.includes(relation.label)){
              relationsArray.value.push(relation)
              relationStringArray.value.push(relation.key)
              relationsLabelArray.value.push(relation.value)
            }
          })
      }
        
      }

      const highlightSelectedFilter = (filterIndex: number) => {
        console.log(relationsArray.value)
        fabricService?.highlightRelatedFrames(filterIndex, relationsArray.value)
      }

      onEntityResult((queryResult: any)=> {
        if (queryResult.data){
            console.log('new canvas')
            fabricService = undefined
            fabricService = new FabricService();
            
            fabricService.generateMainImageFrame(queryResult.data.Entity)
            
            getRelations(queryResult.data.Entity)
            headEntityId.value = queryResult.data.Entity.id
            entity.value = queryResult.data.Entity

            if (window.sessionStorage.getItem('startEntity')){
              const startEntity = window.sessionStorage.getItem('startEntity')
              const historyEntity = window.sessionStorage.getItem('historyEntity')
            if(startEntity && historyEntity){
              fabricService?.generateInfoBar(JSON.parse(startEntity), JSON.parse(historyEntity))
            }
        }
        }
      })

      onRelationResult((relationResult) => {
      console.log('Relation result')
      if(relationResult.data && fabricService){
        const relationEntities = relationResult.data.Entities?.results
        const filteredRelationEntities = relationEntities.filter((ent: Entity) => ent.id != entity.value.id)
        fabricService.generateSecondaryImageFrames(filteredRelationEntities, id).then(() => {

          filteredRelationEntities.forEach((entity: any) => {
          const entityRelations: Array<string> = []

          getRelations(entity)

          entity.relations.forEach((relation: Relation) => {
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
            console.log({fetchMoreResult})
            const newRelation: SecondaryRelation = {
              originId: entity.id,
              relatedEntities: fetchMoreResult.Entities.results
            }
            subRelations.value.push(newRelation)
          }}
          )
          
        });
        })
      }
  })

  onBasketResult((basketResult) => {
    if (basketResult.data){
      basketItems.value = basketResult.data.BoxVisiterRelationsByType
    }
  })

  onDoneAddingToBasket((_basketItems) => {
    if(_basketItems.data){
      basketItems.value = _basketItems.data.AddAssetToBoxVisiter.filter((asset: any) => asset.type == "inBasket")
    }
  })

    return {entity,
    relationStringArray,
    relationsLabelArray,
    loading,
    route,
    highlightSelectedFilter,
    addToBasket,
    basketItems,
    code}
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
  background-color: #E5E5E5;
}
</style>
