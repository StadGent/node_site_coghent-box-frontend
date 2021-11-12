<template>
  <div ref="viewport"></div>
  <button @click="pause = !pause">pause</button>
</template>

<script lang="ts">
import usePredefined, { StoryType } from '@/Three/usePredefined';
import Story from '@/composables/story';
import Frame from '@/composables/frame';
import Tools from '@/Three/Tools';
import TestData from '@/Three/TestData';
import ThreeService from '@/services/ThreeService';
import { defineComponent, onMounted, PropType, reactive, ref, watch } from 'vue';
import { Color, Vector3 } from 'three';
import DefaultColors from '@/Three/defaults.color';
import { Entity } from 'coghent-vue-3-component-library/lib/queries';
import CubeHelper from '@/Three/CubeHelper';
import Common from '@/composables/common';
import FrameOverview from '@/screens/FrameOverview';

export default defineComponent({
  name: 'ViewPort',
  props: {
    stories: {
      type: Array as PropType<Array<Entity>>,
      required: true,
    },
  },
  setup(props) {
    const stories = ref(props.stories);
    const currentStory = 1;
    const story = reactive<StoryType>({
      title: Story().Title(stories.value[currentStory - 1]),
    } as StoryType);
    const pause = ref(false);
    const viewport = ref(null);
    let threeSvc: ThreeService;

    const addBaseStoryToScene = (threeSvc: ThreeService) => {
      threeSvc.state.scene.background = new Color(DefaultColors().black);
      threeSvc.ClearScene();
      const storyOverview = usePredefined().BaseStoryCircle(story, false);
      threeSvc.AddGroupsToScene(storyOverview.storyOverview);
      threeSvc.AddToScene(
        CubeHelper().HighlightImage(story.frameImagePositions?.[2] as Vector3),
      );
      // threeSvc.AddToScene(Tools().Grid());
      threeSvc.state.scene.updateMatrixWorld(true);
    };

    const showPauseScreen = (threeSvc: ThreeService) => {
      threeSvc.ClearScene();
      // threeSvc.AddToScene(Tools().Grid());
      threeSvc.AddGroupsToScene(
        usePredefined().PausedStories(Common().RemoveEntersFromString(story.title),Story().GetStoryTitles(stories.value)),
      );
    };

    const addFrameOverviewToScene = async (threeSvc: ThreeService, frame: Entity) => {
      threeSvc.ClearScene();
      threeSvc.AddGroupsToScene((await FrameOverview(frame).Create()).groups);
      threeSvc.AddToScene(
        CubeHelper().HighlightImage((await FrameOverview(frame).Create()).positions[2] as Vector3, new Vector3(4,4,0)),
      );
    };

    watch(pause, (e) => {
      if (!e && stories) {
        addBaseStoryToScene(threeSvc);
      } else {
        showPauseScreen(threeSvc);
      }
    });

    const buildStory = async () => {
      const storyFramesIds = Story().RelationIds(stories.value[currentStory - 1]);
      const frames = await Frame().GetFrames(storyFramesIds);
      const frameTitles = Frame().GetFrameTitles(frames);
      const centerWords = Story().CreateCenterWords(frameTitles);
      const frameRecord = Frame().CreateFrameRecord(frames);

      story.frames = frames;
      story.framesRecord = frameRecord;
      story.centerWords = centerWords as Record<string, Vector3>;
      story.frameImagePositions = usePredefined().BaseStoryCircle(
        story,
        false,
      ).imagePositions;
    };

    onMounted(async () => {
      threeSvc = new ThreeService(viewport);
      if (stories.value) {
        console.log('stories => ', stories.value)
        await buildStory();
        // addBaseStoryToScene(threeSvc);
        await addFrameOverviewToScene(threeSvc, story.frames[1] as Entity);
      }
      threeSvc.Animate();
    });

    return { viewport, pause };
  },
});
</script>