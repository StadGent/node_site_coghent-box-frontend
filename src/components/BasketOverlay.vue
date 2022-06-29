<template>
  <base-overlay :overlay-state="BasketOverlayState.state" class="p-24">
    <main>
      <section class="w-full flex justify-center overflow-x-hidden overlay">
        <the-masonry
          v-if="
            basketEntities.length == BasketOverlayState.overlayItems.length &&
            BasketOverlayState.overlayItems.length
          "
          ref="masonry"
          :entities="{ results: basketEntities }"
          :loading="loadingEntity"
          :generate-url="generateUrl"
          :no-image-url="noImageUrl"
          :show-load-more="false"
          :hasCustomImageOverlay="true"
        >
          <template #tile="{ entity }">
            <div class="flex absolute p-4 justify-between w-full">
              <base-button
                class="w-0"
                custom-style="secondary-round"
                :icon-shown="true"
                custom-icon="fullscreen"
                @click="openMediaOverlay(entity)"
              />
              <base-button
                class="w-0"
                custom-style="secondary-round"
                :icon-shown="true"
                custom-icon="wasteBasket"
                @click="removeFromBasket(entity.id)"
              />
            </div>
          </template>
        </the-masonry>
        <div v-else-if="BasketOverlayState.overlayItems.length"><spinner /></div>
        <div
          class="w-1/4 text-center flex flex-wrap justify-center call-background"
          v-else
        >
          <h3 class="mt-48 text-xl">
            {{ t('touchtable.network.basketOverlay.empty') }}
          </h3>
        </div>
      </section>
      <section
        class="w-full flex justify-center flex-wrap items-center p-12 font-bold cursor-pointer flex-col"
        @click="closeBasketOverlay"
      >
        <base-icon icon="downwardArrows" class="transform rotate-180 mb-4" />
        <h2 class="text-4xl">{{ t('touchtable.network.basketOverlay.close') }}</h2>
      </section>
    </main>
  </base-overlay>
</template>

<script lang="ts">
  import { defineComponent, onUpdated, PropType, ref, toRefs, watch } from 'vue';
  import {
    BaseOverlay,
    TheMasonry,
    BaseIcon,
    GetEntityByIdDocument,
    BaseButton,
    DeleteRelationFromBoxVisiterDocument,
    boxVisiter,
    useBoxVisiter,
    useMediaModal,
  } from 'coghent-vue-3-component-library';
  import { useQuery, useMutation } from '@vue/apollo-composable';
  import { Relation, Entity } from 'coghent-vue-3-component-library/lib/queries';
  import { iiiF, apolloClient } from '@/main';
  import Spinner from './Spinner.vue';
  import { useI18n } from 'vue-i18n';
  import { IIIFImageUrlHelper } from '@/services/Fabric/helper.fabric';
  import { getFileNameByMimeType } from 'coghent-vue-3-component-library';

  export type OverlayState = 'show' | 'hide' | 'loading';

  export type BasketOverlayType = {
    state: OverlayState;
    overlayItems: Relation[];
  };

  const BasketOverlayState = ref<BasketOverlayType>({
    state: 'hide',
    overlayItems: [],
  });

  export const useBasketOverlay = () => {
    const updateBasketOverlayState = (BasketOverlayInput: OverlayState) => {
      BasketOverlayState.value.state = BasketOverlayInput;
    };

    const addBasketOverlayItems = (basketOverlayItems: Relation[]) => {
      BasketOverlayState.value.overlayItems.push(...basketOverlayItems);
    };

    const updateBasketOverlayItems = (basketOverlayItems: Relation[]) => {
      BasketOverlayState.value.overlayItems = basketOverlayItems;
    };

    const closeBasketOverlay = () => {
      updateBasketOverlayState('hide');
    };

    const openBasketOverlay = () => {
      updateBasketOverlayState('show');
    };

    return {
      closeBasketOverlay,
      openBasketOverlay,
      addBasketOverlayItems,
      updateBasketOverlayItems,
      BasketOverlayState,
    };
  };

  export default defineComponent({
    name: 'BasketOverlay',
    components: {
      BaseOverlay,
      TheMasonry,
      BaseIcon,
      Spinner,
      BaseButton,
    },
    props: {
      boxVisitorCode: {
        type: String,
        required: true,
      },
    },
    setup(props) {
      const {
        closeBasketOverlay,
        openBasketOverlay,
        BasketOverlayState,
        updateBasketOverlayItems,
      } = useBasketOverlay();
      const { generateUrl, noImageUrl } = iiiF;
      const basketEntities = ref<Entity[]>([]);
      const { t } = useI18n();
      const { openMediaModal, setMediaModalFile, setMediaModalImageUrl } =
        useMediaModal();
      const masonry = ref<any>(null);

      const { loading: loadingEntity, fetchMore: fetchMoreEntities } = useQuery(
        GetEntityByIdDocument,
        { id: '' },
      );

      const getEntitiesForRelations = (entitiesToAdd: any[] = []) => {
        const tempEntityArray: any[] = [];
        let basketEntityIds: string[] = [];
        if (entitiesToAdd.length) {
          basketEntityIds = entitiesToAdd.map((item: Relation) =>
            item.key.replace('entities/', ''),
          );
        }
        basketEntityIds.forEach((basketEntityId: string) => {
          fetchMoreEntities({
            variables: { id: basketEntityId },
            updateQuery: (previousData, { fetchMoreResult }) => {
              if (fetchMoreResult.Entity) {
                tempEntityArray.push(fetchMoreResult.Entity);
                if (entitiesToAdd.length == tempEntityArray.length) {
                  basketEntities.value.push(...tempEntityArray);
                }
              }
            },
          });
        });
      };

      watch(
        () => BasketOverlayState.value.overlayItems.length,
        () => {
          console.log('refetchbasket');
          if (!basketEntities.value.length) {
            getEntitiesForRelations(BasketOverlayState.value.overlayItems);
          } else {
            const newEntities = BasketOverlayState.value.overlayItems.filter(
              (item: any) =>
                !basketEntities.value.find(
                  (basketItem: any) => basketItem.id == item.key.replace('entities/', ''),
                ),
            );
            if (newEntities.length) {
              getEntitiesForRelations(newEntities);
            }
          }
        },
        { immediate: true },
      );

      const removeFromBasket = (entityId: string) => {
        const newBasket = basketEntities.value.filter(
          (basketEntity: Entity) => basketEntity.id != entityId,
        );
        basketEntities.value = newBasket;
        const { deleteRelationFromBoxVisiter } = useBoxVisiter(apolloClient);
        deleteRelationFromBoxVisiter(props.boxVisitorCode, entityId).then(
          (result: Relation[]) => {
            console.log({ result });
            const newBasketArray: Relation[] = result.filter(
              (relation: Relation) => relation.type == 'inBasket',
            );
            if (newBasketArray) {
              updateBasketOverlayItems(newBasketArray);
            }
          },
        );
      };

      const openMediaOverlay = (entity: any) => {
        setMediaModalFile(entity.mediafiles[0]);
        setMediaModalImageUrl(
          IIIFImageUrlHelper(getFileNameByMimeType(entity.mediafiles[0])),
        );
        openMediaModal();
      };

      return {
        closeBasketOverlay,
        openBasketOverlay,
        BasketOverlayState,
        generateUrl,
        noImageUrl,
        basketEntities,
        loadingEntity,
        openMediaOverlay,
        removeFromBasket,
        masonry,
        t,
      };
    },
  });
</script>

<style scoped>
  .overlay {
    height: 850px;
  }
  .call-background {
    background: linear-gradient(180deg, #f6f5f1 40%, rgba(255, 255, 255, 0) 97.65%),
      url(/basketCallToAction.png);
    background-repeat: no-repeat;
    background-size: contain;
  }
</style>
