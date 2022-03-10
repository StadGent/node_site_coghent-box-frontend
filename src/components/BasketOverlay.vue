<template>
  <base-overlay :overlay-state="BasketOverlayState.state">
    <section class="w-full">
      <the-masonry
        v-if="basketEntities.length == basketItems.length"
        :entities="undefined"
        :loading="loadingBasketItem"
        :generate-url="generateUrl"
        :no-image-url="noImageUrl"
        :show-load-more="false"
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
      const { generateUrl, noImageUrl } = iiiF;
      const basketEntityIds: string[] = props.basketItems.map((item: Relation) =>
        item.key.replace('entities/', ''),
      );
      const basketEntities = ref<Entity[]>([]);
      console.log({ basketEntityIds });

      basketEntityIds.forEach((basketEntityId: string) => {
        const basketEntity = getBoxVisitEntityById(basketEntityId);
        console.log({ basketEntity });
      });

      console.log(basketEntities);

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
