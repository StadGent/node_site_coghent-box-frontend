<template>
  <div class="p-10 header">
      <h1 class="font-bold text-6xl">Mijn verhalenbox ({{basketAmount}})</h1>
      <base-icon icon="downwardArrows" class="w-10 h-10 text-text-black"/>
  </div>    
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue';
import { baseIcon} from 'coghent-vue-3-component-library'
import { fabricdefaults } from '@/services/Fabric/defaults.fabric';

export default defineComponent({
  name: 'TouchHeader',
  components: {
      baseIcon
  },
  props: {
    basketAmount: {
      type: Number,
      default: 0,
      required: false,
    }
  },
  setup: (props) => {
    const root = document.documentElement;
      root.style.setProperty('--header_height', fabricdefaults.canvas.header.height.toString() + 'px');
  }
});
</script>

<style scoped>
.header{
  display: flex;
  justify-content: center;
  align-items: center;
  height: var(--header_height);
}
</style>
