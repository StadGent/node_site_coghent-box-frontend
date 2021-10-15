<template>
  <div ref="viewport"></div>
</template>

<script lang="ts">
import usePredefined from '@/Three/usePredefined';
import ThreeService from '@/services/ThreeService';
import { defineComponent, onMounted, ref } from 'vue';

export default defineComponent({
  name: 'ViewPort',
  setup() {
    const viewport = ref(null);
    const predefinedHelper = usePredefined();

    const addBaseStoryToScene = (threeSvc: ThreeService) => {
      predefinedHelper.BaseStoryCircle().forEach((item: any) => {
        threeSvc.state.scene.add(item);
      });
    };

    onMounted(() => {
      const threeSvc = new ThreeService(viewport);
      addBaseStoryToScene(threeSvc);
      threeSvc.Animate();
    });

    return { viewport };
  },
});
</script>

<style scoped>
.viewport {
  background: rgb(41, 182, 140);
  height: 100vw;
  width: 100vh;
}
</style>
