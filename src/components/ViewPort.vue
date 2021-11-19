<template>
  <div ref="viewport"></div>
  <button @click="pause = !pause">pause</button><br />
  <button @click="PlayAudio">play audio</button><br />
  <button @click="PauseAudio">pause audio</button><br />
</template>

<script lang="ts">
import usePredefined, { StoryType } from '@/Three/usePredefined';
import useStory from '@/composables/useStory';
import Frame from '@/composables/frame';
import Tools from '@/Three/Tools';
import TestData from '@/Three/TestData';
import ThreeService from '@/services/ThreeService';
import { defineComponent, onMounted, PropType, reactive, ref } from 'vue';
import { BufferGeometry, Color, Material, Mesh, Vector3 } from 'three';
import DefaultColors from '@/Three/defaults.color';
import { Entity } from 'coghent-vue-3-component-library/lib/queries';
import { Entity as _Entity, Story } from '@/models/GraphqlModel';
import FrameOverview from '@/screens/FrameOverview';
import { CubeSchema } from '@/Three/CubeSchema';
import AudioSchema from '@/Three/AudioSchema';
import Spot from '@/Three/Spotlight';
import AudioHelper from '@/Three/AudioHelper';
import StoryPaused from '@/screens/StoryPaused';
import Layers from '@/Three/defaults.layers';
import PlayBook from '@/composables/playbook';

export default defineComponent({
  name: 'ViewPort',
  props: {
    stories: {
      type: Array as PropType<Array<Story>>,
      required: true,
    },
  },
  setup(props) {
    const stories = ref(props.stories);
    const currentStory = 1;
    const pause = ref(false);
    const viewport = ref(null);
    let threeSvc: ThreeService;
    let audioSchema: any;
    let audioHelper: any;
    let storyData = reactive<Array<Story>>([]);
    let activeStoryData = reactive<Story>({} as Story);
    const spot = Spot();
    const playBook = PlayBook();
    let frameAssetSchemas: Array<CubeSchema> = [];

    const moveSpotlight = (position: Vector3, widestLength: number) => {
      spot.move(position, widestLength);
      threeSvc.AddToScene(spot.SpotLight());
    };

    const addBaseStoryToScene = (threeSvc: ThreeService) => {
      threeSvc.state.scene.background = new Color(DefaultColors().black);
      threeSvc.ClearScene();

      // const storyOverview = usePredefined().BaseStoryCircle(story, false);
      // console.log('Storyoverview', storyOverview);
      // threeSvc.AddGroupsToScene(storyOverview.storyOverview);
      // threeSvc.AddToScene(
      //   CubeHelper().HighlightImage(story.frameSchemas?.[0] as CubeSchema),
      // );
      // threeSvc.AddToScene(Tools().Grid());
      threeSvc.state.scene.updateMatrixWorld(true);
    };

    const showPauseScreen = (threeSvc: ThreeService) => {
      threeSvc.ClearScene();
      // threeSvc.AddToScene(Tools().Grid());
      // threeSvc.AddGroupsToScene(
      //   usePredefined().PausedStories(
      //     Common().RemoveEntersFromString(story.title),
      //     Story().GetStoryTitles(stories.value),
      //   ),
      // );
    };

    const addFrameOverviewToScene = (
      threeSvc: ThreeService,
      assets: Record<string, string>,
    ) => {
      threeSvc.ClearScene();
      const overviewFrame = FrameOverview().Create(assets);
      frameAssetSchemas = overviewFrame.schemas;
      threeSvc.AddGroupsToScene(overviewFrame.groups);
    };

    const PlayAudio = () => {
      audioHelper.Play();
    };
    const PauseAudio = () => {
      audioHelper.Pause();
      console.log('PAUSE');

      console.log('CURRENTIME', audioSchema.audio.context.currentTime);
    };

    const buildFrameAssetOverview = (currentFrame: number) => {
      playBook.addToPlayBook(() =>
        addFrameOverviewToScene(
          threeSvc,
          useStory().setFrameAssets(activeStoryData, currentFrame - 1),
        ),
      );

      playBook.addToPlayBook(() => moveSpotlight(frameAssetSchemas[0].position, 4))
      playBook.addToPlayBook(() => moveSpotlight(frameAssetSchemas[1].position, 4))
      playBook.addToPlayBook(() => moveSpotlight(frameAssetSchemas[2].position, 4))


    };

    const buildStory = (currentStory: number) => {
      console.log('buildStory()', storyData);
      activeStoryData = useStory().setActiveStory(storyData, currentStory - 1);
      // const activeStoryTitle = useStory().title(activeStoryData);
      // const frameTitles = useStory().setFrameTitles(activeStoryData);
      // const frameAssets = useStory().setFrameAssets(activeStoryData, currentFrame - 1);

      spot.create(new Vector3(0, 0, Layers.scene));
      buildFrameAssetOverview(1)
      buildFrameAssetOverview(2)
      buildFrameAssetOverview(3)
    }

    const startStory = () => {
      let current = 0;
      let time = 2;
      setInterval(() => {
        console.log(Math.floor(audioSchema.audio.context.currentTime));
        if (
          audioHelper.DoEvent(audioSchema.audio.context.currentTime, time)
        ) {
          playBook.getPlayBookFunctions()[current]();
          time += 1.5;
          current++;
        }
      }, 500);
    };

    onMounted(() => {
      threeSvc = new ThreeService(viewport);
      audioSchema = AudioSchema(threeSvc);
      audioSchema.loadAudioFile('/Audio/example.mp3');
      audioHelper = AudioHelper(audioSchema);
      if (stories.value) {
        // PlayAudio();
        storyData = stories.value;
        console.log('=> ACTIVE STORIES <=', stories);
        buildStory(currentStory);
        startStory();
      }
      threeSvc.Animate();
    });

    return { viewport, pause, PlayAudio, PauseAudio };
  },
});
</script>