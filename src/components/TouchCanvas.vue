<template>
  <canvas id="canvas" class="w-screen h-screen" />
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue';
import { useMutation, useQuery, useResult } from '@vue/apollo-composable';
import FabricService from '../services/Fabric/FabricService';

export default defineComponent({
  name: 'TouchTable',
  components: {
  },
  setup: (props) => {

    onMounted(() => {
      const fabricService: FabricService = new FabricService();
      const startFrame = fabricService.generateMainImageFrame('/images/testImage.jpg')
      const secondaryFrames = fabricService.generateSecondaryImageFrames(['/images/testImage.jpg', '/images/testImage.jpg', '/images/testImage.jpg', '/images/testImage.jpg', '/images/testImage.jpg', '/images/testImage.jpg', '/images/testImage.jpg', '/images/testImage.jpg', '/images/testImage.jpg', '/images/testImage.jpg'])

  })
    return {}
  },
});
</script>

<style scoped>
</style>
