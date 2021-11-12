<template>
  <div ref="viewport"></div>
  <button @click="pause = !pause">pause</button>
</template>

<script lang="ts">
import usePredefined from '@/Three/usePredefined';
import Story from '@/composables/story';
import Tools from '@/Three/Tools';
import TestData from '@/Three/TestData';
import {Entity as LocalEntity} from '@/models/GraphqlModel';
import ThreeService from '@/services/ThreeService';
import { defineComponent, onMounted, PropType, reactive, ref, watch } from 'vue';
import { Color, Vector3 } from 'three';
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
          Story().Title(stories.value[currentStory-1] as LocalEntity),
          story.frames || {},
          story.centerWords || {},
          
          // `De komst van \n de Turkse \n handelaar`,
          // TestData().storyWordLinks,
          // TestData().centerWords,
          true,
        ),
      );
      // threeSvc.AddGroupsToScene(TestData().story(false));
      // threeSvc.AddToScene(Tools().Grid());
      threeSvc.state.scene.updateMatrixWorld(true);
    };
    const showPauseScreen = () => {
      threeSvc.ClearScene();
      threeSvc.AddToScene(Tools().Grid());
      threeSvc.AddGroupsToScene(usePredefined().PausedStories());
    };
    

    watch(pause, (e) => {
      if (!e && stories) {
        addBaseStoryToScene(threeSvc);
      }else{
        showPauseScreen();
      }
    });

    const buildStory = async () => {
      const storyFramesIds = Story().RelationIds(stories.value[currentStory-1]);
      const frames = await Story().GetFrames(storyFramesIds);
      const frameTitles = Story().GetFrameTitles(frames);
      const centerWords = Story().CreateCenterWords(frameTitles);
      const frameRecord = Story().CreateFrameRecord(frames);
      const assetsFromFrame = await Story().GetAssetsFromFrame(frames[0].id);
      console.log('assets from frame',assetsFromFrame);

      story.frames = frameRecord;
      story.centerWords = centerWords as Record<string, Vector3>;
    };

    onMounted(async () => {
      threeSvc = new ThreeService(viewport);
      if(stories.value){
        console.log('stories => ', stories.value)
        await buildStory();
        addBaseStoryToScene(threeSvc);
      }
      threeSvc.Animate();
    });

    return { viewport, pause };
  },
});
</script>