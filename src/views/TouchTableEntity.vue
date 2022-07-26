<template>
  <div class="touchtable">
    <inactivity-modal />
    <basket-overlay :boxVisitorCode="code" />
    <shutdown-modal :code="code" @disposeCanvas="disposeCanvas" />
    <media-modal />
    <touch-header :basket-amount="BasketOverlayState.overlayItems.length" />
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
          :text="
            entity.mediafiles[0].mediatype.image
              ? t('touchtable.network.infoCard.buttons.zoom.image')
              : entity.mediafiles[0].mediatype.video
              ? t('touchtable.network.infoCard.buttons.zoom.video')
              : t('touchtable.network.infoCard.buttons.zoom.other')
          "
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
      v-if="relationsArray"
      :relations="relationsArray"
      :loading="loading"
      @selected="highlightSelectedFilter"
    />
  </div>
</template>

<script lang="ts">
  import { defineComponent, onUnmounted, ref, watch } from 'vue';
  import FabricService from '../services/Fabric/FabricService';
  import { useRoute, useRouter } from 'vue-router';
  import { useQuery, useMutation } from '@vue/apollo-composable';
  import {
    GetTouchTableEntityByIdDocument,
    CardComponent,
    GetTouchTableEntityDocument,
    BasketByCustomFrameIdDocument,
    BaseButton,
    boxVisiter,
    startAsset,
    historyAssets,
    useBoxVisiter,
    useMediaModal,
    MediaModal,
    getFileNameByMimeType,
  } from 'coghent-vue-3-component-library';
  import {
    excludeUnusedRelations,
    IIIFImageUrlHelper,
  } from '@/services/Fabric/helper.fabric';
  import BasketOverlay, { useBasketOverlay } from '@/components/BasketOverlay.vue';
  import TouchHeader from '@/components/TouchHeader.vue';
  import ShutdownModal from '@/components/ShutdownModal.vue';
  import RelationBrowser from '@/components/RelationBrowser.vue';
  import { fabricdefaults } from '../services/Fabric/defaults.fabric';
  import {
    Relation,
    Entity,
    RelationType,
  } from 'coghent-vue-3-component-library/lib/queries';
  import { apolloClient } from '@/main';
  import OnBoardingCard from '@/components/OnBoardingCard.vue';
  import { useOnBoarding } from '@/composables/useOnBoarding';
  import { useI18n } from 'vue-i18n';
  import inactivityModal, { useInactivityModal } from '../components/InactivityModal.vue';
  import { useInactiveTimer } from '../composables/useInactiveTimer';

  const asString = (x: string | string[]) => (Array.isArray(x) ? x[0] : x);

  export default defineComponent({
    name: 'TouchTableEntity',
    components: {
      CardComponent,
      TouchHeader,
      RelationBrowser,
      BaseButton,
      ShutdownModal,
      MediaModal,
      BasketOverlay,
      OnBoardingCard,
      inactivityModal,
    },
    setup: () => {
      const route = useRoute();
      const router = useRouter();
      let id = asString(route.params.entityID);
      const code = ref<string>(boxVisiter.value ? boxVisiter.value.code : undefined);
      const relationStringArray = ref<string[]>([]);
      const relationsArray = ref<Relation[]>([]);
      const entity = ref<any>();
      let fabricService = ref<FabricService | undefined>(undefined);
      const { onBoardingState } = useOnBoarding();
      const { addBasketOverlayItems, updateBasketOverlayItems, BasketOverlayState } =
        useBasketOverlay();
      const { t } = useI18n();
      const { setMediaModalFile, setMediaModalImageUrl, openMediaModal } =
        useMediaModal();
      const { timerSettings } = useInactiveTimer();
      const { openInactivityModal, closeInactivityModal } = useInactivityModal();

      const {
        result: startEntityResult,
        loading,
        refetch: refetchEntity,
      } = useQuery(GetTouchTableEntityByIdDocument, { id });

      const { result: relationResult, fetchMore: fetchMoreRelations } = useQuery(
        GetTouchTableEntityDocument,
        () => ({
          limit: fabricdefaults.canvas.relationLimit,
          skip: 0,
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
            relationStringArray.value = [];
            relationsArray.value = [];
            id = asString(route.params.entityID);
            if (boxVisiter.value && boxVisiter?.value?.storyboxes[0]?.relations) {
              updateBasketOverlayItems(boxVisiter.value.storyboxes[0].relations);
            }
            refetchEntity({
              id: asString(route.params.entityID),
            });
            const { addAssetToBoxVisiter } = useBoxVisiter(apolloClient);
            addAssetToBoxVisiter(code.value, id, 'visited');
          }
        },
        { deep: true, immediate: true },
      );

      const fetchRelatedEntities = (entity: Entity) => {
        if (entity) {
          console.log('refetch relations');
          fetchMoreRelations({
            variables: {
              limit: fabricdefaults.canvas.relationLimit,
              skip: 0,
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
              let relatedEntities: Entity[] = queryResult.Entities.results.filter(
                (entity: Entity) => !entity?.mediafiles?.[0]?.mediatype?.audio,
              );
              if (relatedEntities && fabricService.value) {
                fabricService.value
                  .generateSecondaryImageFrames(relatedEntities, entity.id)
                  .then(() => {
                    let refetchAmount: number = 0;
                    while (refetchAmount != fabricdefaults.canvas.relationIterations) {
                      relatedEntities.forEach((relatedEntity: Entity) => {
                        const entityRelatedIds = relatedEntity?.relations?.map(
                          (relation: any) => {
                            return relation.key;
                          },
                        );
                        if (entityRelatedIds) {
                          fetchMoreRelations({
                            variables: {
                              limit: fabricdefaults.canvas.relationLimit,
                              skip: 0,
                              searchValue: {
                                value: '',
                                isAsc: false,
                                relation_filter: entityRelatedIds,
                                randomize: false,
                                key: 'title',
                                has_mediafile: true,
                              },
                            },
                            updateQuery: (
                              previousData,
                              { fetchMoreResult: relatedEntitiesResult },
                            ) => {
                              relatedEntitiesResult =
                                relatedEntitiesResult?.Entities?.results.filter(
                                  (entity: Entity) =>
                                    !entity?.mediafiles?.[0]?.mediatype?.audio,
                                );
                              if (relatedEntitiesResult && fabricService.value) {
                                fabricService.value
                                  .generateSecondaryImageFrames(
                                    relatedEntities,
                                    relatedEntity.id,
                                  )
                                  .then(() => {
                                    if (
                                      refetchAmount ==
                                      fabricdefaults.canvas.relationIterations
                                    ) {
                                      relationsArray.value = excludeUnusedRelations(
                                        fabricService.value?.state.canvas,
                                        relationsArray.value,
                                      );
                                    }
                                  });
                                relatedEntities = relatedEntitiesResult;
                              }
                            },
                          });
                        }
                      });
                      refetchAmount++;
                    }
                  });
              }
            },
          });
        }
      };

      const disposeCanvas = () => {
        console.log('dispose');
        fabricService.value?.state.canvas.dispose();
      };

      const getRelations = (entity: Entity) => {
        const metaDataInLabel: string[] = [
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
            }
          });
        }
      };

      const generateCanvas = (primaryEntity: any) => {
        console.log('Entity result');
        if (fabricService.value) {
          // Dispose canvas (destroy it) before creating a new one and filling it up
          disposeCanvas();
        }
        fabricService.value = new FabricService();

        fabricService.value
          .generateMainImageFrame(primaryEntity)
          .then((entityOnCanvas: Entity) => {
            getRelations(primaryEntity);
            entity.value = primaryEntity;

            if (startAsset.value) {
              const startEntity = startAsset.value;
              const historyEntities = historyAssets.value;
              if (startEntity) {
                fabricService.value?.generateInfoBar(startEntity, historyEntities);
              }
            }
            console.log(entityOnCanvas);
            fetchRelatedEntities(primaryEntity);
          });
      };

      watch(
        () => startEntityResult.value,
        (entityResult) => {
          setTimeout(() => {
            if (entityResult) {
              generateCanvas(entityResult.Entity);
            }
          }, 100);
        },
        { immediate: true },
      );

      const addToBasket = () => {
        const { addAssetToBoxVisiter } = useBoxVisiter(apolloClient);
        addAssetToBoxVisiter(code.value, id, 'components').then((relations: Relation[]) =>
          updateBasketOverlayItems(relations),
        );
      };

      const showPictureModal = () => {
        if (entity.value) {
          setMediaModalFile(entity.value.mediafiles[0]);
          setMediaModalImageUrl(
            IIIFImageUrlHelper(getFileNameByMimeType(entity.value.mediafiles[0])),
          );
          openMediaModal();
        }
      };

      const highlightSelectedFilter = (relation: Relation) => {
        fabricService.value?.highlightRelatedFrames(relation);
      };

      if (!boxVisiter.value) {
        window.location.href = '/touchtable/start';
      }

      watch(
        () => timerSettings.value.timeLeft,
        (timeLeft) => {
          if (timeLeft && timeLeft <= timerSettings.value.showModalTime) {
            openInactivityModal();
          } else {
            closeInactivityModal();
          }
        },
      );

      return {
        entity,
        relationStringArray,
        relationsArray,
        loading,
        route,
        highlightSelectedFilter,
        addToBasket,
        code,
        showPictureModal,
        disposeCanvas,
        onBoardingState,
        BasketOverlayState,
        timerSettings,
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
    width: 1919px;
    height: 1070px;
  }
  .infocard {
    position: absolute;
    top: 100px;
    left: 25px;
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
    width: 450px;
    height: calc(1080px - 250px);
  }
  #canvas {
    background-color: #e5e5e5;
  }
</style>
