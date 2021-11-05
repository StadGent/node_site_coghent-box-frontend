<template>
  <div ref="viewport"></div>
  <button @click="pause = !pause">pause</button>
</template>

<script lang="ts">
import usePredefined from '@/Three/usePredefined';
import Story from '@/composables/story';
import Tools from '@/Three/Tools';
import TestData from '@/Three/TestData';
import ThreeService from '@/services/ThreeService';
import { defineComponent, onMounted, PropType, reactive, ref, watch } from 'vue';
import { Color } from 'three';
import DefaultColors from '@/Three/defaults.color';
import { Entity } from 'coghent-vue-3-component-library/lib/queries';

export default defineComponent({
  name: 'ViewPort',
  props: {
    stories:{
      type: Array as PropType<Array<Entity>>,
      required: true,
    }
  },
  setup(props) {
    const stories = ref(props.stories);
    const story = reactive({
      frames: {},
      centerWords: {},
    });
    const currentStory = 1;
    const pause = ref(false);
    const viewport = ref(null);
    let threeSvc: ThreeService;


    const addBaseStoryToScene = (threeSvc: ThreeService) => {
      threeSvc.state.scene.background = new Color(DefaultColors().black);
      threeSvc.ClearScene();
      threeSvc.AddGroupsToScene(
        usePredefined().BaseStoryCircle(
          Story().Title(stories.value[currentStory-1]),
          story.frames,
          story.centerWords,
          // `De komst van \n de Turkse \n handelaar`,
          // TestData().storyWordLinks,
          // TestData().centerWords,

          false,
          
        ),
      );

      // threeSvc.AddGroupsToScene(TestData().story(false));
      // threeSvc.AddToScene(Tools().Grid());
      threeSvc.state.scene.updateMatrixWorld(true);
    };
    const showPauseScreen = (threeSvc: ThreeService) => {
      threeSvc.ClearScene();
      threeSvc.AddToScene(Tools().Grid());
      threeSvc.AddGroupsToScene(usePredefined().PausedStories(threeSvc));
    };


    watch(pause, (e) => {
      // if (!e && stories) {
      //   addBaseStoryToScene(threeSvc);
      // }else{
      //   showPauseScreen(threeSvc);
      // }
    });

    const buildStory = async () => {
      const {frames, centerWords} = await Story().GetOrderComponents(stories.value[0], 2);
      story.frames = frames;
      console.log(story.frames);
      story.centerWords = centerWords;
    };

    onMounted(async () => {
      threeSvc = new ThreeService(viewport);
      if(stories.value){
        console.log(stories.value[0]);
        await buildStory();
        addBaseStoryToScene(threeSvc);
      }
      threeSvc.Animate();
    });

    return { viewport, pause };
  },
});
</script>