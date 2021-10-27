<template>
  <div ref="viewport"></div>
</template>

<script lang="ts">
import usePredefined from '@/Three/usePredefined';
import ThreeService from '@/services/ThreeService';
import { defineComponent, onMounted, PropType, ref } from 'vue';
import { Story } from '@/views/Wall.vue';
import { Color } from 'three';

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

    const ExtractWords = () => {
      const words: Array<string> = [];
      for (const key in props.story?.items) {
        words.push(key);
      }
      return words;
    };

    const addBaseStoryToScene = (threeSvc: ThreeService) => {
      threeSvc.state.scene.background = new Color(0x00000);
      threeSvc.AddGroupsToScene(
        predefinedHelper.BaseStoryCircle(props.story?.title as string, ExtractWords()),
      );
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
  height: 100vw;
  width: 100vh;
}
</style>
