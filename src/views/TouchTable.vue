<template>
  <TouchCanvas/>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue';
import { useMutation, useQuery, useResult } from '@vue/apollo-composable';
import TouchCanvas from '../components/TouchCanvas.vue';

export default defineComponent({
  name: 'TouchTable',
  components: {
      TouchCanvas,
  },
  setup: (props) => {
  }
});
</script>

<style scoped>
</style>
