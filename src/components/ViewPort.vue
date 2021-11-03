<template>
  <div ref="viewport"></div>
  <button @click="pause = !pause">pause</button>
</template>

<script lang="ts">
import usePredefined from '@/Three/usePredefined';
import Tools from '@/Three/Tools';
import TestData from '@/Three/TestData';
import ThreeService from '@/services/ThreeService';
import { defineComponent, onMounted, PropType, ref, watch } from 'vue';
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

    const pause = ref(false);
    const viewport = ref(null);
    let threeSvc: ThreeService;

    const addBaseStoryToScene = (threeSvc: ThreeService) => {
      threeSvc.state.scene.background = new Color(0x00000);
      threeSvc.ClearScene();
      threeSvc.AddGroupsToScene(
        usePredefined().BaseStoryCircle(
          `De komst van \n de Turkse \n handelaar`,
          TestData().storyWordLinks,
          // props.story?.title as string,
          // props.story?.items as Record<string, string>,
          true,
        ),
      );

      // threeSvc.AddGroupsToScene(TestData().story(false));
      threeSvc.AddToScene(Tools().Grid());
      threeSvc.state.scene.updateMatrixWorld(true);
    };
    const showPauseScreen = (threeSvc: ThreeService) => {
      threeSvc.ClearScene();
      threeSvc.AddToScene(Tools().Grid());
      threeSvc.AddGroupsToScene(usePredefined().PausedStories(threeSvc));
    };

    watch(pause, (e) => {
      showPauseScreen(threeSvc);
      if (!pause.value) {
        addBaseStoryToScene(threeSvc);
      }
    });

    onMounted(() => {
      threeSvc = new ThreeService(viewport);
      showPauseScreen(threeSvc);
      // addBaseStoryToScene(threeSvc);
      threeSvc.Animate();
    });

    return { viewport, pause };
  },
});
</script>