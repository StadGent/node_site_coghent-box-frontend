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
      spot.create(new Vector3(0, 0, Layers.scene), 6);
      playBook.addToPlayBook(() => threeSvc.AddToScene(spot.SpotLight()));      
      useStoryCircle(threeSvc,activeStoryData,playBook).create(new Vector3(0,0,0),storyColor,currentFrame);
      useFrameAssetOverview(threeSvc,activeStoryData,playBook, spot).create(currentFrame, storyColor);
      currentFrame++;
      useStoryCircle(threeSvc,activeStoryData,playBook).create(new Vector3(0,0,0),storyColor,currentFrame);
      useFrameAssetOverview(threeSvc,activeStoryData,playBook, spot).create(currentFrame, storyColor);
      currentFrame++;
      useStoryCircle(threeSvc,activeStoryData,playBook).create(new Vector3(0,0,0), storyColor,currentFrame);
      useFrameAssetOverview(threeSvc,activeStoryData,playBook, spot).create(currentFrame, storyColor);
      playBook.addToPlayBook(() => {
        threeSvc.ClearScene();
        threeSvc.AddGroupsToScene(StoryPaused(storyData).Create([2,3,1]));
      });
    };

    const startStory = () => {
      let current = 0;
      let time = 2;
      const interval = setInterval(() => {
        if (audioHelper.DoEvent(audioSchema.audio.context.currentTime, time)) {
          console.log(audioSchema.audio.context.currentTime);
          playBook.getPlayBookFunctions()[current]();
          time += 1;
          current++;
        }
        if(current > playBook.getPlayBookFunctions().length - 1){
          current = 0;
          PauseAudio();
          clearInterval(interval);
        }
      }, 500);
      interval
    };


    onMounted(() => {
      threeSvc = new ThreeService(viewport);
      audioSchema = AudioSchema(threeSvc);
      // audioSchema.loadAudioFile('/Audio/example.mp3');
      audioHelper = AudioHelper(audioSchema);
      if (stories.value) {
        storyData = stories.value;
        console.log('=> ACTIVE STORIES <=', stories);
        buildStory(currentStory);
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