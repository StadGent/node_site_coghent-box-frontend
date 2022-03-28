<template>
  <div class="touchtable">
    <basket-overlay v-if="basketItems.length" :basketItems="basketItems" />
    <shutdown-modal :code="code" @disposeCanvas="disposeCanvas" />
    <IIIF-modal :image-url="IIIFImageUrl" />
    <touch-header :basket-amount="basketItems.length" />
    <div id="my-canvas">
      <canvas id="canvas" class="touchcanvas" />
    </div>
    <CardComponent
      v-if="entity"
      :side-strip="true"
      :large="true"
      :reverseColors="true"
      :scroll="true"
      class="infocard"
    >
      <h2 class="font-bold text-4xl mb-12">
        {{ entity.title[0].value }}
      </h2>
      <p v-if="entity.description.length" class="text-xl mb-12">
        {{ entity.description[0].value }}
      </p>
      <p class="text-xl mb-12" v-else>Dit item heeft geen beschrijving</p>
      <div class="flex w-full flex-wrap justify-center items-center mt-12">
        <base-button
          class="text-xl"
          custom-style="touchtable-black"
          custom-icon="zoomIn"
          :icon-shown="true"
          text="Afbeelding vergroten"
          @click="showPictureModal"
        />
        <base-button
          class="text-xl"
          custom-style="touchtable-purple"
          custom-icon="archiveDrawer"
          :icon-shown="true"
          text="Aan verhalenbox toevoegen"
          @click="addToBasket"
        />
      </div>
    </CardComponent>
    <relationBrowser
      v-if="relationsLabelArray"
      :relations="relationsLabelArray"
      :loading="loading"
      @selected="highlightSelectedFilter"
    />
  </div>
</template>

<script lang="ts">
  import { defineComponent, onMounted, ref, watch } from 'vue';
  import FabricService from '../services/Fabric/FabricService';
  import { useRoute, useRouter } from 'vue-router';
  import { useQuery, useMutation } from '@vue/apollo-composable';
  import {
    GetTouchTableEntityByIdDocument,
    CardComponent,
    GetTouchTableEntityDocument,
    BaseButton,
    AddAssetToBoxVisiterDocument,
    boxVisiter,
    startAsset,
    historyAssets,
  } from 'coghent-vue-3-component-library';
  import BasketOverlay from '@/components/BasketOverlay.vue';
  import TouchHeader from '@/components/TouchHeader.vue';
  import ShutdownModal from '@/components/ShutdownModal.vue';
  import RelationBrowser from '@/components/RelationBrowser.vue';
  import { fabricdefaults } from '../services/Fabric/defaults.fabric';
  import { Relation, Entity } from 'coghent-vue-3-component-library/lib/queries';
  import IIIFModal, { useIIIFModal } from '@/components/IIIFModal.vue';
  import { IIIFImageUrlHelper } from '../services/Fabric/helper.fabric';
  import { apolloClient } from '@/main';

  const asString = (x: string | string[]) => (Array.isArray(x) ? x[0] : x);

  type SecondaryRelation = {
    originId: string;
    relatedEntities: Array<Relation>;
  };

  export default defineComponent({
    name: 'TouchTableEntity',
    components: {
      CardComponent,
      TouchHeader,
      RelationBrowser,
      BaseButton,
      ShutdownModal,
      IIIFModal,
      BasketOverlay,
    },
    setup: () => {
      const route = useRoute();
      const router = useRouter();
      let id = asString(route.params.entityID);
      const code = ref<string>(boxVisiter.value ? boxVisiter.value.code : undefined);
      const relationStringArray = ref<string[]>([]);
      const relationsLabelArray = ref<string[]>([]);
      const relationsArray = ref<Relation[]>([]);
      const subRelations = ref<SecondaryRelation[]>([]);
      const entity = ref<any>();
      const headEntityId = ref<string>();
      const basketItems = ref<Array<Relation>>(
        boxVisiter.value
          ? boxVisiter.value.relations.filter(
              (relation: Relation) => relation.type == 'inBasket',
            )
          : undefined,
      );
      const IIIFImageUrl = ref<string>();
      let fabricService = ref<FabricService | undefined>(undefined);
      const { openIIIFModal, IIIFModalState } = useIIIFModal();

      console.log({ id });
      console.log(entity.value);

      const {
        result,
        onResult: onEntityResult,
        loading,
        refetch: refetchEntity,
      } = useQuery(GetTouchTableEntityByIdDocument, { id });

      const { mutate: mutateBasket, onDone: onDoneAddingToBasket } = useMutation(
        AddAssetToBoxVisiterDocument,
        { variables: { code: code.value, assetId: '', type: 'inBasket' } },
      );
      const { mutate: mutateHistory, onDone: onDoneAddingHistory } = useMutation(
        AddAssetToBoxVisiterDocument,
        { variables: { code: code.value, assetId: id, type: 'visited' } },
      );

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
        }),
      );

      watch(
        () => route.params.entityID,
        () => {
          console.log('Refetch entity');
          relationsLabelArray.value = [];
          relationStringArray.value = [];
          id = asString(route.params.entityID);
          refetchEntity({ id: asString(route.params.entityID) });
          mutateHistory();
        },
        { deep: true, immediate: true },
      );

      const loadRelations = (entity: Entity) => {
        if (entity) {
          console.log('refetch relations');
          console.log(entity);
          fetchMoreRelations({
            variables: {
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
            },
            updateQuery: (previousData, { fetchMoreResult: queryResult }) => {
              console.log(queryResult);
              console.log('Relation result');
              if (queryResult.Entities && fabricService.value) {
                const relationEntities: Entity[] = queryResult.Entities?.results;
                const filteredRelationEntities: Entity[] = relationEntities.filter(
                  (ent: Entity) => ent.id != entity.id,
                );
                if (filteredRelationEntities.length) {
                  fabricService.value
                    .generateSecondaryImageFrames(filteredRelationEntities, entity.id)
                    .then(() => {
                      filteredRelationEntities.forEach((relationEntity: Entity) => {
                        const entityRelations: Array<string> = [];

                        getRelations(relationEntity);
                        if (relationEntity.relations) {
                          relationEntity.relations.forEach((relation: any) => {
                            entityRelations.push(relation.key);
                          });
                        }
                        if (entityRelations.length) {
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
                              },
                            },
                            updateQuery: (previousData, { fetchMoreResult }) => {
                              console.log({ fetchMoreResult });
                              const newRelation: SecondaryRelation = {
                                originId: relationEntity.id,
                                relatedEntities: fetchMoreResult.Entities.results,
                              };
                              subRelations.value.push(newRelation);
                            },
                          });
                        }
                      });
                    });
                }
              }
            },
          });
        }
      };

      watch(
        () => result.value,
        (entityResult) => {
          console.log({ entityResult });
          console.log('Entity result');
          if (entityResult) {
            if (fabricService.value) {
              // Dispose canvas (kill it) before creating a new one and filling it up
              disposeCanvas();
            }
            fabricService.value = new FabricService();

            fabricService.value.generateMainImageFrame(entityResult.Entity);

            getRelations(entityResult.Entity);
            headEntityId.value = entityResult.Entity.id;
            entity.value = entityResult.Entity;
            IIIFImageUrlHelper(entityResult.Entity);

            if (startAsset.value) {
              const startEntity = startAsset.value;
              const historyEntities = historyAssets.value;
              if (startEntity) {
                fabricService.value?.generateInfoBar(startEntity, historyEntities);
              }
            }
          } else {
            alert('Entity not found');
          }
          loadRelations(entity.value);
        },
      );

      watch(
        () => subRelations.value.length,
        () => {
          subRelations.value.forEach((relation: SecondaryRelation) => {
            fabricService.value?.generateSecondaryImageFrames(
              relation.relatedEntities,
              relation.originId,
            );
            subRelations.value = subRelations.value.filter(
              (subrelation: any) => subrelation != relation,
            );
          });
        },
      );

      const addToBasket = () => {
        mutateBasket({ code: code.value, assetId: id, type: 'inBasket' });
      };

      const showPictureModal = () => {
        openIIIFModal();
      };

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
        ];

        if (entity.relations) {
          entity.relations.forEach((relation: any) => {
            if (
              !relationStringArray.value.includes(relation.key) &&
              !metaDataInLabel.includes(relation.label) &&
              relation.key &&
              relation.value
            ) {
              relationsArray.value.push(relation);
              relationStringArray.value.push(relation.key);
              relationsLabelArray.value.push(relation.value);
            }
          });
        }
      };

      const highlightSelectedFilter = (filterIndex: number) => {
        fabricService.value?.highlightRelatedFrames(filterIndex, relationsArray.value);
      };

      const disposeCanvas = () => {
        fabricService.value?.state.canvas.dispose();
      };

      onDoneAddingToBasket((_basketItems) => {
        if (_basketItems.data) {
          basketItems.value = _basketItems.data.AddAssetToBoxVisiter.filter(
            (asset: any) => asset.type == 'inBasket',
          );
        }
      });

      return {
        entity,
        relationStringArray,
        relationsLabelArray,
        loading,
        route,
        highlightSelectedFilter,
        addToBasket,
        basketItems,
        code,
        showPictureModal,
        IIIFImageUrl,
        disposeCanvas,
      };
    },
  });
</script>

<style scoped>
  .touchcanvas {
    width: 100%;
    height: 100%;
  }
  .touchtable {
    width: 1920px;
    height: 1080px;
  }
  .infocard {
    position: absolute;
    top: 100px;
    left: 25px;
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
    width: 425px;
    height: calc(1080px - 250px);
  }
  #canvas {
    background-color: #e5e5e5;
  }
</style>
