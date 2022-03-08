<template>
  <base-overlay :overlayState="BasketOverlayState.state">
    <section class="w-full">
      <the-masonry
        :entities="{ results: basketEntities }"
        :loading="loadingBasketItem"
        :generateUrl="generateUrl"
        :noImageUrl="noImageUrl"
        :showLoadMore="false"
      />
    </section>
    <section
      class="w-full flex justify-center items-center p-12 font-bold cursor-pointer"
      @click="closeBasketOverlay"
    >
      <h2 class="text-6xl">Sluiten</h2>
    </section>
  </base-overlay>
</template>

<script lang="ts">
  import { defineComponent, PropType, ref, toRefs, watch } from 'vue';
  import {
    BaseOverlay,
    TheMasonry,
    GetEntityByIdDocument,
  } from 'coghent-vue-3-component-library';
  import { useQuery } from '@vue/apollo-composable';
  import {
    Relation,
    Entity,
    RelationType,
  } from 'coghent-vue-3-component-library/lib/queries';
  import useIIIF from '@/composables/useIIIF';

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
    components: { BaseOverlay, TheMasonry },
    props: {
      basketItems: {
        type: Array as PropType<Relation[]>,
        required: true,
      },
    },
    setup(props) {
      const { closeBasketOverlay, openBasketOverlay, BasketOverlayState } =
        useBasketOverlay();
      const basketEntities = ref<Entity[]>([]);
      const { generateUrl, noImageUrl } = useIIIF();

      const {
        result: basketItemResult,
        onResult: onBasketItemResult,
        loading: loadingBasketItem,
        refetch: refetchBasketItem,
      } = useQuery(GetEntityByIdDocument, {
        id: '',
      });

      props.basketItems.forEach((basketItem: Relation) => {
        refetchBasketItem({ id: basketItem.key.replace('entities/', '') });
      });

      onBasketItemResult((queryResult) => {
        if (
          queryResult?.data?.Entity &&
          !basketEntities?.value?.find(
            (basketEntity: Entity) => basketEntity?.id == queryResult?.data?.Entity?.id,
          )
        ) {
          const newBasketEntity: Entity = queryResult.data.Entity;
          basketEntities.value.push(newBasketEntity);
        }
        console.log({ basketEntities });
      });

      return {
        closeBasketOverlay,
        openBasketOverlay,
        BasketOverlayState,
        basketEntities,
        loadingBasketItem,
        generateUrl,
        noImageUrl,
      };
    },
  });
</script>
