<template>
  <base-overlay :overlay-state="BasketOverlayState.state" class="p-24">
    <main>
      <section class="w-full">
        <the-masonry
          v-if="basketEntities.length == basketItems.length"
          :entities="{ results: basketEntities }"
          :loading="loadingEntity"
          :generate-url="generateUrl"
          :no-image-url="noImageUrl"
          :show-load-more="false"
        />
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
        <h2 class="text-4xl">Sluiten</h2>
      </section>
    </main>
  </base-overlay>
</template>

<script lang="ts">
  import { defineComponent, PropType, ref, toRefs, watch } from 'vue';
  import {
    BaseOverlay,
    TheMasonry,
    BaseIcon,
    GetEntityByIdDocument,
  } from 'coghent-vue-3-component-library';
  import { useQuery } from '@vue/apollo-composable';
  import {
    Relation,
    Entity,
    RelationType,
  } from 'coghent-vue-3-component-library/lib/queries';
  import { useBoxVisiter } from 'coghent-vue-3-component-library';
  import { apolloClient } from '@/main';
  import { getBoxVisitEntityById } from '@/services/Fabric/helper.boxvisit';
  import { iiiF } from '@/main';

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

      const {
        result: entityResult,
        onResult: onEntityResult,
        refetch: refetchEntity,
        loading: loadingEntity,
      } = useQuery(GetEntityByIdDocument, { id: '' });

      watch(
        () => props.basketItems,
        (basketItems) => {
          if (basketItems.length) {
            const basketEntityIds: string[] = props.basketItems.map((item: Relation) =>
              item.key.replace('entities/', ''),
            );
            basketEntityIds.forEach((basketEntityId: string) => {
              refetchEntity({ id: basketEntityId });
            });
          }
        },
      );

      const tempEntityArray: any[] = [];
      onEntityResult((queryResult) => {
        if (queryResult.data.Entity) {
          tempEntityArray.push(queryResult.data.Entity);
          if (props.basketItems.length == tempEntityArray.length) {
            basketEntities.value.push(...tempEntityArray);
            console.log({ basketEntities });
          }
        }
      });
      // TODO: Refresh masonry when item gets added
      return {
        closeBasketOverlay,
        openBasketOverlay,
        BasketOverlayState,
        generateUrl,
        noImageUrl,
        basketEntities,
        loadingEntity,
      };
    },
  });
</script>
