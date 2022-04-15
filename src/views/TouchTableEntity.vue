<template>
  <div class="touchtable">
    <basket-overlay :basketItems="basketItems" />
    <shutdown-modal :code="code" @disposeCanvas="disposeCanvas" />
    <IIIF-modal />
    <touch-header :basket-amount="basketItems.length" />
    <div>
      <on-boarding-card
        :showCard="
          onBoardingState.status == 'started' &&
          onBoardingState.currentStepName == 'lookAtOtherPictures'
            ? true
            : false
        "
        :cardTitle="t('touchtable.onBoarding.lookAtOtherPictures.title')"
        :cardDescription="t('touchtable.onBoarding.lookAtOtherPictures.description')"
        placement="right"
        :distance="-500"
      >
        <canvas id="canvas" class="touchcanvas" />
      </on-boarding-card>
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
      <p
        v-if="entity.description.length && entity.description[0].value"
        class="text-xl mb-12"
      >
        {{ entity.description[0].value }}
      </p>
      <p class="text-xl mb-12" v-else>
        {{ t('touchtable.network.infoCard.noDescription') }}
      </p>
      <div class="flex w-full flex-wrap justify-center items-center mt-12">
        <base-button
          class="text-xl"
          custom-style="touchtable-black"
          custom-icon="zoomIn"
          :icon-shown="true"
          :text="t('touchtable.network.infoCard.buttons.zoom')"
          @click="showPictureModal"
        />
        <on-boarding-card
          :showCard="
            onBoardingState.status == 'started' &&
            onBoardingState.currentStepName == 'fillStoryBasket'
              ? true
              : false
          "
          :cardTitle="t('touchtable.onBoarding.fillStoryBasket.title')"
          :cardDescription="t('touchtable.onBoarding.fillStoryBasket.description')"
          placement="right"
          :distance="10"
          ><base-button
            class="text-xl"
            custom-style="touchtable-purple"
            custom-icon="archiveDrawer"
            :icon-shown="true"
            :text="t('touchtable.network.infoCard.buttons.add')"
            @click="addToBasket"
        /></on-boarding-card>
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
  import { defineComponent, onUnmounted, ref, watch } from 'vue';
  import FabricService from '../services/Fabric/FabricService';
  import { useRoute } from 'vue-router';
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
  import OnBoardingCard from '@/components/OnBoardingCard.vue';
  import { useOnBoarding } from '@/composables/useOnBoarding';
  import { useI18n } from 'vue-i18n';

  const asString = (x: string | string[]) => (Array.isArray(x) ? x[0] : x);

  type SecondaryRelation = {
    originId: string;
    relatedEntities: Array<Entity>;
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
      OnBoardingCard,
    },
    setup: () => {
      const route = useRoute();
      let id = asString(route.params.entityID);
      const code = ref<string>(boxVisiter.value ? boxVisiter.value.code : undefined);
      const relationStringArray = ref<string[]>([]);
      const relationsLabelArray = ref<string[]>([]);
      const relationsArray = ref<Relation[]>([]);
      const entity = ref<any>();
      const basketItems = ref<Array<Relation>>(
        boxVisiter.value
          ? boxVisiter.value.relations.filter(
              (relation: Relation) => relation.type == 'inBasket',
            )
          : undefined,
      );
      const IIIFImageUrl = ref<string>();
      let fabricService = ref<FabricService | undefined>(undefined);
      const { openIIIFModal, setIIIFImage } = useIIIFModal();
      const { onBoardingState } = useOnBoarding();
      const { t } = useI18n();

      const {
        result: startEntityResult,
        loading,
        refetch: refetchEntity,
      } = useQuery(GetTouchTableEntityByIdDocument, { id });

      const { result: relationResult, fetchMore: fetchMoreRelations } = useQuery(
        GetTouchTableEntityDocument,
        () => ({
          limit: fabricdefaults.canvas.relationLimit,
          skip: startEntityResult ? 0 : 1,
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
          if (route.params.entityID) {
            console.log('Refetch entity');
            relationsLabelArray.value = [];
            relationStringArray.value = [];
            id = asString(route.params.entityID);
            refetchEntity({
              id: asString(route.params.entityID),
            });
            const { addAssetToBoxVisiter } = useBoxVisiter(apolloClient);
            addAssetToBoxVisiter(code.value, id, 'visited');
          }
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
              skip: startEntityResult ? 0 : 1,
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
              console.log({ queryResult });
              console.log('Relation result');
              if (queryResult.Entities.results.length && fabricService.value) {
                const relationEntities: Entity[] = queryResult.Entities?.results;
                if (relationEntities.length) {
                  fabricService.value
                    .generateSecondaryImageFrames(relationEntities, entity.id)
                    .then(() => {
                      relationEntities.forEach((relationEntity: Entity) => {
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
                              newRelation.relatedEntities.forEach(
                                (relatedEntity: Entity) => {
                                  getRelations(relatedEntity);
                                },
                              );
                              fabricService.value?.generateSecondaryImageFrames(
                                newRelation.relatedEntities,
                                newRelation.originId,
                              );
                            },
                          });
                        }
                      });
                    });
                }
              } else {
                alert('This item does not have relations');
              }
            },
          });
        }
      };

      const disposeCanvas = () => {
        fabricService.value?.state.canvas.dispose();
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

      const generateCanvas = (primaryEntity: any) => {
        console.log({ primaryEntity });
        console.log('Entity result');
        if (fabricService.value) {
          // Dispose canvas (destroy it) before creating a new one and filling it up
          disposeCanvas();
        }
        fabricService.value = new FabricService();

        fabricService.value.generateMainImageFrame(primaryEntity);

        getRelations(primaryEntity);
        entity.value = primaryEntity;
        IIIFImageUrl.value = IIIFImageUrlHelper(primaryEntity);

        if (startAsset.value) {
          const startEntity = startAsset.value;
          const historyEntities = historyAssets.value;
          console.log({ historyEntities });
          if (startEntity) {
            fabricService.value?.generateInfoBar(startEntity, historyEntities);
          }
        }
        loadRelations(primaryEntity);
      };

      if (startEntityResult.value) {
        generateCanvas(startEntityResult.value.Entity);
      }

      watch(
        () => startEntityResult.value,
        (entityResult) => {
          if (entityResult) {
            generateCanvas(entityResult.Entity);
          }
        },
        { deep: true },
      );

      const addToBasket = () => {
        const { addAssetToBoxVisiter } = useBoxVisiter(apolloClient);
        addAssetToBoxVisiter(code.value, id, 'inBasket').then(
          (relations: Relation[]) =>
            (basketItems.value = relations.filter(
              (relation: Relation) => relation.type == 'inBasket',
            )),
        );
      };

      const showPictureModal = () => {
        if (IIIFImageUrl.value) {
          setIIIFImage(IIIFImageUrl.value);
          openIIIFModal();
        }
      };

      const highlightSelectedFilter = (filterIndex: number) => {
        fabricService.value?.highlightRelatedFrames(filterIndex, relationsArray.value);
      };

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
        onBoardingState,
        t,
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
