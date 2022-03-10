<template>
  <div
    id="browser"
    class="relation_browser_container no-scrollbar"
  >
    <FilterTag
      v-for="(item, index) in relations"
      :key="index"
      :filter="item"
      :is-selected="index == selectedTagIndex ? true : false"
      :icon="'check'"
      :small="false"
      :loading="loading"
      @click="selectTag(index)"
    />
  </div>
</template>

<script lang="ts">
  import { defineComponent, onMounted, PropType, ref, watch } from 'vue';
  import { fabricdefaults } from '@/services/Fabric/defaults.fabric';
  import { FilterTag } from 'coghent-vue-3-component-library';
  import { Relation } from 'coghent-vue-3-component-library/lib/queries';

  export default defineComponent({
    name: 'RelationBrowser',
    components: {
      FilterTag,
    },
    props: {
      relations: {
        type: Array as PropType<Relation[]>,
        required: true,
      },
      loading: {
        type: Boolean,
        required: false,
        default: false,
      },
    },
    emits: ['selected'],
    setup: (props, { emit }) => {
      const selectedTagIndex = ref<number>();
      const root = document.documentElement;
      root.style.setProperty(
        '--browser_height',
        fabricdefaults.canvas.relationBrowser.height.toString() + 'px',
      );

      const selectTag = (tagIndex: number) => {
        if (selectedTagIndex.value == tagIndex) {
          selectedTagIndex.value = undefined;
        } else {
          selectedTagIndex.value = tagIndex;
        }
        emit('selected', [selectedTagIndex.value]);
      };

      return { selectTag, selectedTagIndex };
    },
  });
</script>

<style scoped>
  .relation_browser_container {
    display: flex;
    position: relative;
    bottom: 0;
    left: 0;
    width: auto;
    height: var(--browser_height);
    background-color: white;
    overflow: auto;
    white-space: nowrap;
  }

  .no-scrollbar {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }

  .no-scrollbar::-webkit-scrollbar {
    display: none;
  }
</style>
