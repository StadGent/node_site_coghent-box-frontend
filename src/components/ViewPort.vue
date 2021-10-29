<template>
  <div ref="viewport"></div>
</template>

<script lang="ts">
import usePredefined from '@/Three/usePredefined';
import Tools from '@/Three/Tools';
import TestData from '@/Three/TestData';
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
    console.log(props.story?.items);

    const viewport = ref(null);
    const predefinedHelper = usePredefined();

    const addBaseStoryToScene = (threeSvc: ThreeService) => {
      threeSvc.state.scene.background = new Color(0x00000);
      // threeSvc.AddGroupsToScene(
      //   usePredefined().BaseStoryCircle(
      //     // `De komst van \n de Turkse \n handelaar`,
      //     props.story?.title as string,
      //     props.story?.items as Record<string, string>,
      //     true,
      //   ),
      // );
      threeSvc.AddGroupsToScene(predefinedHelper.PausedStories());
      // threeSvc.AddGroupsToScene(TestData().story(false));
      // threeSvc.AddToScene(Tools().Grid());
      threeSvc.state.scene.updateMatrixWorld(true);
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