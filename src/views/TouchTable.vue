<template>
  <touch-header/>
  <TouchCanvas/>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue';
import { useMutation, useQuery, useResult } from '@vue/apollo-composable';
import TouchCanvas from '../components/TouchCanvas.vue';
import TouchHeader from '@/components/TouchHeader.vue';

export default defineComponent({
  name: 'TouchTable',
  components: {
      TouchCanvas,
    TouchHeader,
  },
  setup: (props) => {
  }
});
</script>

<style scoped>
</style>
