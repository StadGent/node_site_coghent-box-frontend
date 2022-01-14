<template>
  <div class="p-10 flex justify-center align-center">
      <h1 class="font-bold text-7xl">Mijn verhalenbox</h1>
      <base-icon icon="downwardArrows" class="w-10 h-10 text-text-black"/>
  </div>    
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue';
import { baseIcon} from 'coghent-vue-3-component-library'

export default defineComponent({
  name: 'TouchHeader',
  components: {
      baseIcon
  },
  setup: (props) => {
  }
});
</script>

<style scoped>
</style>
