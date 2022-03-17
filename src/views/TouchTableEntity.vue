<template>
  <div class="touchtable">
    <!-- <basket-overlay :basketItems="basketItems" /> -->
    <shutdown-modal :code="code" />
    <IIIF-modal :image-url="IIIFImageUrl" />
    <touch-header :basket-amount="basketItems.length" />
    <div id="canvas-container">
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
        <!-- <base-button
          class="text-xl"
          custom-style="touchtable-purple"
          custom-icon="archiveDrawer"
          :icon-shown="true"
          text="Aan verhalenbox toevoegen"
          @click="addToBasket"
        /> -->
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
    GetBoxVisiterRelationsByTypeDocument,
    AddAssetToBoxVisiterDocument,
    boxVisiter,
    startAsset,
    // historyAsset,
    useBoxVisiter,
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
      // BasketOverlay,
    },
    setup: () => {
      const route = useRoute();
      const id = asString(route.params['entityID']);
      const code = ref<string>(boxVisiter.value.code);
      const relationStringArray = ref<string[]>([]);
      const relationsLabelArray = ref<string[]>([]);
      const relationsArray = ref<Relation[]>([]);
      const subRelations = ref<SecondaryRelation[]>([]);
      const entity = ref<any>();
      const headEntityId = ref<string>();
      const basketItems = ref<Array<Relation>>([]);
      const IIIFImageUrl = ref<string>();
      let fabricService = ref<FabricService | undefined>(undefined);
      const { openIIIFModal, IIIFModalState } = useIIIFModal();
      const { getTouchTableHistory } = useBoxVisiter(apolloClient);

      const {
        result,
        onResult: onEntityResult,
        loading,
        refetch: refetchEntity,
      } = useQuery(GetTouchTableEntityByIdDocument, { id });
      const {
        result: basketResult,
        onResult: onBasketResult,
        refetch: refetchBasket,
      } = useQuery(GetBoxVisiterRelationsByTypeDocument, {
        code: code.value,
        type: 'inBasket',
      });
      const { mutate: mutateBasket, onDone: onDoneAddingToBasket } = useMutation(
        AddAssetToBoxVisiterDocument,
        { variables: { code: code.value, assetId: id, type: 'inBasket' } },
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
          refetchEntity({ id: asString(route.params.entityID) });
          mutateHistory();
          // router.go(0);
        },
      );

      watch(
        () => entity.value,
        () => {
          if (entity.value) {
            console.log('refetch relations');
            console.log(entity.value);
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
                  const relationEntities = queryResult.Entities?.results;
                  const filteredRelationEntities = relationEntities.filter(
                    (ent: Entity) => ent.id != entity.value.id,
                  );
                  fabricService.value
                    .generateSecondaryImageFrames(
                      filteredRelationEntities,
                      entity.value.id,
                    )
                    .then(() => {
                      filteredRelationEntities.forEach((entity: any) => {
                        const entityRelations: Array<string> = [];

                        getRelations(entity);

                        entity.relations.forEach((relation: Relation) => {
                          entityRelations.push(relation.key);
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
                            },
                          },
                          updateQuery: (previousData, { fetchMoreResult }) => {
                            console.log({ fetchMoreResult });
                            const newRelation: SecondaryRelation = {
                              originId: entity.id,
                              relatedEntities: fetchMoreResult.Entities.results,
                            };
                            subRelations.value.push(newRelation);
                          },
                        });
                      });
                    });
                }
              },
            });
          }
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
        mutateBasket();
      };

      const showPictureModal = () => {
        IIIFImageUrl.value = IIIFImageUrlHelper(entity.value);
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
              relationStringArray.value.indexOf(relation.key) < 0 &&
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

      onEntityResult((queryResult) => {
        console.log('Entity result');
        if (queryResult.data) {
          if (fabricService.value) {
            // Dispose canvas (kill it) before creating a new one and filling it up
            fabricService.value.state.canvas.dispose();
          }
          fabricService.value = new FabricService();

          fabricService.value.generateMainImageFrame(queryResult.data.Entity);

          getRelations(queryResult.data.Entity);
          headEntityId.value = queryResult.data.Entity.id;
          entity.value = queryResult.data.Entity;

          if (startAsset.value && boxVisiter.value) {
            const startEntity = startAsset.value;
            // const historyEntity = historyAsset.value;
            // console.log({ historyEntity });
            if (startEntity) {
              fabricService.value?.generateInfoBar(
                startEntity,
                // TODO: get entity instead of relation
                undefined,
              );
            }
          }
        } else {
          alert('Entity not foud');
        }
      });

      onBasketResult((basketResult) => {
        if (basketResult.data) {
          basketItems.value = basketResult.data.BoxVisiterRelationsByType;
        }
      });

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
