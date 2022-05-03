<template>
  <base-overlay :overlay-state="BasketOverlayState.state" class="p-24">
    <main>
      <section
        class="w-full flex justify-center overflow-y-scroll overflow-x-hidden overlay"
      >
        <the-masonry
          v-if="basketEntities.length == basketItems.length && basketItems.length"
          ref="masonry"
          :entities="{ results: basketEntities }"
          :loading="loadingEntity"
          :generate-url="generateUrl"
          :no-image-url="noImageUrl"
          :show-load-more="false"
          :hasCustomImageOverlay="true"
        >
          <template #tile="entity">
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
        <div v-else-if="basketItems.length"><spinner /></div>
        <h3 class="text-lg" v-else>
          {{ t('touchtable.network.basketOverlay.empty') }}
        </h3>
      </section>
      <section
        class="
          w-full
          flex
          justify-center
          flex-wrap
          items-center
          p-12
          font-bold
          cursor-pointer
          flex-col
        "
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
  } from 'coghent-vue-3-component-library';
  import { useQuery } from '@vue/apollo-composable';
  import { Relation, Entity } from 'coghent-vue-3-component-library/lib/queries';
  import { iiiF } from '@/main';
  import Spinner from './Spinner.vue';
  import { useI18n } from 'vue-i18n';
  import { useMediaModal } from '@/components/MediaModal.vue';
  import { IIIFImageUrlHelper } from '../services/Fabric/helper.fabric';

  export type OverlayState = 'show' | 'hide' | 'loading';

  export type BasketOverlayType = {
    state: OverlayState;
  };

  const BasketOverlayState = ref<BasketOverlayType>({
    state: 'hide',
  });

  export const useBasketOverlay = () => {
    const updateBasketOverlay = (BasketOverlayInput: BasketOverlayType) => {
      BasketOverlayState.value = BasketOverlayInput;
    };

    const closeBasketOverlay = () => {
      updateBasketOverlay({
        state: 'hide',
      });
    };

    const openBasketOverlay = () => {
      updateBasketOverlay({
        state: 'show',
      });
    };

    return {
      closeBasketOverlay,
      openBasketOverlay,
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
      basketItems: {
        type: Array as PropType<Relation[]>,
        required: true,
      },
    },
    setup(props) {
      const { closeBasketOverlay, openBasketOverlay, BasketOverlayState } =
        useBasketOverlay();
      const { generateUrl, noImageUrl } = iiiF;
      const basketEntities = ref<Entity[]>([]);
      const { t } = useI18n();
      const { openMediaModal, setMediaModalFile } = useMediaModal();
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
        () => props.basketItems.length,
        () => {
          if (!basketEntities.value.length) {
            getEntitiesForRelations(props.basketItems);
          } else {
            const newEntities = props.basketItems.filter(
              (item: any) =>
                !basketEntities.value.find(
                  (basketItem: any) => basketItem.id == item.key.replace('entities/', ''),
                ),
            );
            getEntitiesForRelations(newEntities);
          }
        },
        { immediate: true },
      );

      // Todo: fix masonry collapse

      const openIIIFOverlay = (entity: any) => {
        setMediaModalFile(entity.mediafiles[0]);
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
        openIIIFOverlay,
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
</style>
