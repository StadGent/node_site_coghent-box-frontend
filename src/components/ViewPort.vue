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
    console.log(props.story?.items);
    const testStory: Record<string, string> = {
      Migratie:
        'http://localhost:8001/download/9ce891fe75a8e75d82019665d2585a83-2005-0025_1.JPG',
      Economie:
        'http://localhost:8001/download/9ce891fe75a8e75d82019665d2585a83-2005-0025_1.JPG',
      Turkije:
        'http://localhost:8001/download/9ce891fe75a8e75d82019665d2585a83-2005-0025_1.JPG',
      Vakantie:
        'http://localhost:8001/download/9ce891fe75a8e75d82019665d2585a83-2005-0025_1.JPG',
      Familie:
        'http://localhost:8001/download/9ce891fe75a8e75d82019665d2585a83-2005-0025_1.JPG',
    };
    const viewport = ref(null);
    const predefinedHelper = usePredefined();

    const addBaseStoryToScene = (threeSvc: ThreeService) => {
      threeSvc.state.scene.background = new Color(0x00000);
      // const story2 = predefinedHelper.BaseStoryCircle(
      //   `De komst van \n de Turkse \n handelaar`,
      //   testStory,
      //   false,
      // );
      // story2[0].scale.set(0.5, 0.5, 0.5);
      // story2[1].scale.set(0.5, 0.5, 0.5);
      // story2[0].position.set(
      //   story2[0].position.x - 24,
      //   story2[0].position.y,
      //   story2[0].position.z,
      // );
      // story2[1].position.set(
      //   story2[1].position.x - 24,
      //   story2[1].position.y,
      //   story2[1].position.z,
      // );
      // threeSvc.AddGroupsToScene(story2);
      // threeSvc.AddGroupsToScene(
      //   predefinedHelper.BaseStoryCircle(
      //     `De komst van \n de Turkse \n handelaar`,
      //     testStory,
      //     // props.story?.title as string,
      //     // props.story?.items as Record<string, string>,
      //     false,
      //   ),
      // );
      threeSvc.AddGroupsToScene(predefinedHelper.PausedStories());
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
