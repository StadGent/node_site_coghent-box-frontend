<template>
  <base-overlay :overlay-state="BasketOverlayState.state" class="p-24">
    <main>
      <section class="w-full flex justify-center overflow-y-scroll overlay">
        <the-masonry
          v-if="basketEntities.length == basketItems.length && basketItems.length"
          :entities="{ results: basketEntities }"
          :loading="loadingEntity"
          :generate-url="generateUrl"
          :no-image-url="noImageUrl"
          :show-load-more="false"
        />
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
          absolute
          bottom-0
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
  } from 'coghent-vue-3-component-library';
  import { useQuery } from '@vue/apollo-composable';
  import { Relation, Entity } from 'coghent-vue-3-component-library/lib/queries';
  import { iiiF } from '@/main';
  import Spinner from './Spinner.vue';
  import { useI18n } from 'vue-i18n';

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

      const {
        result: entityResult,
        onResult: onEntityResult,
        refetch: refetchEntity,
        loading: loadingEntity,
        fetchMore: fetchMoreEntities,
      } = useQuery(GetEntityByIdDocument, { id: '' });

      const getEntitiesForRelations = (entitiesToAdd: any[] = []) => {
        const tempEntityArray: any[] = [];
        let basketEntityIds: string[] = [];
        if (entitiesToAdd.length) {
          basketEntityIds = entitiesToAdd.map((item: Relation) =>
            item.key.replace('entities/', ''),
          );
        } else {
          basketEntityIds = props.basketItems.map((item: Relation) =>
            item.key.replace('entities/', ''),
          );
        }
        basketEntityIds.forEach((basketEntityId: string) => {
          fetchMoreEntities({
            variables: { id: basketEntityId },
            updateQuery: (previousData, { fetchMoreResult }) => {
              console.log(fetchMoreResult.Entity);
              if (fetchMoreResult.Entity) {
                tempEntityArray.push(fetchMoreResult.Entity);
                if (props.basketItems.length == tempEntityArray.length) {
                  basketEntities.value.push(...tempEntityArray);
                  console.log({ basketEntities });
                } else if (entitiesToAdd.length) {
                  basketEntities.value.push(...tempEntityArray);
                  console.log({ basketEntities });
                }
              }
            },
          });
        });
      };

      watch(
        () => props.basketItems.length,
        () => {
          console.log('Reload basket');
          if (!basketEntities.value.length) {
            getEntitiesForRelations();
          } else {
            console.log(props.basketItems);
            console.log(basketEntities.value);
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

      watch(
        () => entityResult.value,
        () => {
          console.log(entityResult.value);
        },
      );

      // TODO: Refresh masonry when item gets added
      return {
        closeBasketOverlay,
        openBasketOverlay,
        BasketOverlayState,
        generateUrl,
        noImageUrl,
        basketEntities,
        loadingEntity,
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
