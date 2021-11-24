<template>
  <div ref="viewport"></div>
  <button @click="pause = !pause">pause</button><br />
  <button @click="PlayAudio">play audio</button><br />
  <button @click="PauseAudio">pause audio</button><br />
</template>

<script lang="ts">
import useStory from '@/composables/useStory';
import Tools from '@/Three/Tools';
import ThreeService from '@/services/ThreeService';
import { defineComponent, onMounted, PropType, reactive, ref } from 'vue';
import { BoxBufferGeometry, Color, Group, Mesh, Vector3 } from 'three';
import { Asset, Entity as _Entity, Story } from '@/models/GraphqlModel';
import FrameOverview from '@/screens/FrameOverview';
import { CubeSchema } from '@/Three/CubeSchema';
import AudioSchema from '@/Three/AudioSchema';
import Spot from '@/Three/Spotlight';
import AudioHelper from '@/Three/AudioHelper';
import StoryPaused from '@/screens/StoryPaused';
import Layers from '@/Three/defaults.layers';
import PlayBook from '@/composables/playbook';
import useAsset from '@/composables/useAsset';
import StoryCircle from '@/Three/SectionStoryCircle';
import CircleHelper from '@/Three/CircleHelper';
import CircularProgressBar from '@/Three/CircularProgressbar';
import HorizontalProgressBar from '@/Three/HorizontalProgressBar';
import Colors from '@/Three/defaults.color';
import StoryCircleItems from '@/Three/SectionStoryCircleItems';
import DefaultLines from '@/Three/LinesDefault';
import GroupHelper from '@/Three/GroupHelper';
import useStoryCircle from '@/Three/useStoryCircle.playbook';
import useFrameAssetOverview from '@/Three/useFrameAssetOverview.playbook';

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
    const storyColor = Colors().yellow;
    let currentFrame = 1;
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

    const showPauseScreen = (threeSvc: ThreeService) => {
      threeSvc.ClearScene();
    };

    const PlayAudio = () => {
      audioHelper.Play();
    };
    const PauseAudio = () => {
      audioHelper.Pause();
      console.log('PAUSE');

      console.log('CURRENTIME', audioSchema.audio.context.currentTime);
    };

    const buildStory = (currentStory: number) => {
      console.log('buildStory()', storyData);
      activeStoryData = useStory().setActiveStory(storyData, currentStory - 1);

      spot.create(new Vector3(0, 0, Layers.scene));
      useStoryCircle(threeSvc,activeStoryData,playBook).create(new Vector3(0,0,0),storyColor,currentFrame);
      useFrameAssetOverview(threeSvc,activeStoryData,playBook).create(currentFrame, storyColor);
      currentFrame++;
      useStoryCircle(threeSvc,activeStoryData,playBook).create(new Vector3(0,0,0),storyColor,currentFrame);
      useFrameAssetOverview(threeSvc,activeStoryData,playBook).create(currentFrame, storyColor);
      currentFrame++;
      useStoryCircle(threeSvc,activeStoryData,playBook).create(new Vector3(0,0,0), storyColor,currentFrame);
      useFrameAssetOverview(threeSvc,activeStoryData,playBook).create(currentFrame, storyColor);
    };

    const startStory = () => {
      let current = 0;
      let time = 2;
      setInterval(() => {
        console.log(Math.floor(audioSchema.audio.context.currentTime));
        if (audioHelper.DoEvent(audioSchema.audio.context.currentTime, time)) {
          playBook.getPlayBookFunctions()[current]();
          time += 1;
          current++;
        }
      }, 500);
    };

    onMounted(() => {
      threeSvc = new ThreeService(viewport);
      audioSchema = AudioSchema(threeSvc);
      // audioSchema.loadAudioFile('/Audio/example.mp3');
      audioHelper = AudioHelper(audioSchema);
      if (stories.value) {
        // PlayAudio();
        storyData = stories.value;
        console.log('=> ACTIVE STORIES <=', stories);
        buildStory(currentStory);
        // threeSvc.AddGroupsToScene(HorizontalProgressBar().create(new Vector3(0,-7,Layers.scene),[1000,2000,3000],5000,2500,storyColor));
        startStory();
        // const pos = spot.moveTo(new Vector3(-3,2,Layers.scene), new Vector3(3,-2,Layers.scene))
        // console.log(pos);
        // for (let index = 0; index < pos.length; index++) {
        //   moveSpotlight(pos[index], 4)
        // }
      }
      threeSvc.Animate();
    });

    return { viewport, pause, PlayAudio, PauseAudio };
  },
});
</script>