<template>
  <div id="view"></div>
</template>

<script lang="ts">
import ThreeService from '@/services/ThreeService';
import { defineComponent, onMounted } from 'vue';

export default defineComponent({
  name: 'ViewPort',
  setup() {
    onMounted(() => {
      const threeSvc = new ThreeService(document.body);
      threeSvc.Animate();
      threeSvc.state.scene.add();
    });

    return {};
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
