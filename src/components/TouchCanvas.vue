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
import CubeHelper from '@/Three/helper.cube'
import SchemaCube from '@/Three/schema.cube'
import { Vector3 } from 'three';
import TaggingService, { Tags } from '@/services/TaggingService';

export default defineComponent({
  name: 'TouchTable',
  components: {
  },
  setup: (props) => {
    const canvas = ref(null);
    let threeSvc: ThreeService;

    onMounted(() => {
      const taggingService = new TaggingService()
      threeSvc = new ThreeService(canvas, threeDefaultsTouchTable, taggingService);
      threeSvc.ClearScene();
      threeSvc.ChangeSceneBackgroundColor(0xefefef)
      threeSvc.Animate()
      threeSvc.setupZoom()
      const schema = CubeHelper().CreateSchema(new Vector3(0,0,0), '../assets/logo.png');
      const cube = SchemaCube().CreateImageCube(schema);
      threeSvc.AddToScene(cube, Tags.Testing)
      console.log({threeSvc})

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
