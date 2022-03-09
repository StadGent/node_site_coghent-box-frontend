<template>
  <base-overlay :overlayState="BasketOverlayState.state">
    <section class="w-full">
      <the-masonry
        v-if="basketEntities.length == basketItems.length"
        :entities="undefined"
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
  import { useBoxVisiter } from 'coghent-vue-3-component-library';
  import { apolloClient } from '@/main';
  import { getBoxVisitEntitiesById } from '@/services/Fabric/helper.boxvisit';

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
      const { generateUrl, noImageUrl } = useIIIF();
      console.log(props.basketItems.map((item: Relation) => item.key));

      getBoxVisitEntitiesById(props.basketItems.map((item: Relation) => item.key));

      return {
        closeBasketOverlay,
        openBasketOverlay,
        BasketOverlayState,
        generateUrl,
        noImageUrl,
      };
    },
  });
</script>
