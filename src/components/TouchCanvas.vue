<template>
  <div ref="canvas" class="viewport"></div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue';
import { useMutation, useQuery, useResult } from '@vue/apollo-composable';
import ThreeService from '@/services/ThreeService';
import {
  threeDefaultsTouchTable,
} from '@/Three/defaults.three';
import TaggingService from '@/services/TaggingService';

export default defineComponent({
  name: 'TouchTable',
  components: {
  },
  setup: (props) => {
    const canvas = ref(null);
    let threeSvc: ThreeService;

    onMounted(() => {
      console.log(canvas)
      threeSvc = new ThreeService(canvas, threeDefaultsTouchTable, new TaggingService());
      threeSvc.ClearScene();
      console.log(threeSvc.state)

  })
    return {canvas}
  },
});
</script>

<style scoped>
.viewport {
  width: 100vw;
  height: 100vh;
}
</style>
