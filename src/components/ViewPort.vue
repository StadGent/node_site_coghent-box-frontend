<template>
  <div ref="viewport"></div>
</template>

<script lang="ts">
import usePredefined from '@/Three/usePredefined';
import ThreeService from '@/services/ThreeService';
import { defineComponent, onMounted, PropType, ref } from 'vue';
import { Story } from '@/views/Wall.vue';
import Frame1 from '@/frames/Frame1';
import { Color, Scene } from 'three';

export default defineComponent({
  name: 'ViewPort',
  props: {
    story: {
      type: String as any as PropType<Story>,
    },
  },
  setup(props) {
    console.log(props.story);
    const viewport = ref(null);
    const predefinedHelper = usePredefined();

    const addBaseStoryToScene = (threeSvc: ThreeService) => {
      threeSvc.state.scene.background = new Color('white');
      threeSvc.AddGroupsToScene(predefinedHelper.BaseStoryCircle());
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
