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
import { defineComponent, onMounted, PropType, reactive, ref, watch } from 'vue';
import { Color, Vector3 } from 'three';
import { Entity as _Entity, Story } from '@/models/GraphqlModel';
import AudioSchema from '@/Three/AudioSchema';
import Spot from '@/Three/Spotlight';
import AudioHelper from '@/Three/AudioHelper';
import StoryPaused from '@/screens/StoryPaused';
import ScanQR from '@/screens/ScanQR';
import Layers from '@/Three/defaults.layers';
import PlayBook from '@/composables/playbook';
import Colors from '@/Three/defaults.color';
import useStoryCircle from '@/Three/useStoryCircle.playbook';
import useFrameAssetOverview from '@/Three/useFrameAssetOverview.playbook';
import Defaults from '@/Three/defaults.config';

export default defineComponent({
  name: 'ViewPort',
  props: {
    stories: {
      type: Array as PropType<Array<Story>>,
      required: true,
    },
    storySelected: {
      type: Number,
      required: true,
      default: 1,
    },
  },
  setup(props) {
    const stories = ref(props.stories);
    const currentStory = ref<number>(props.storySelected);
    const chooseStory = ref<boolean>(true);
    let storyColor = Colors().yellow;
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

    watch(
      () => props.storySelected,
      (value) => {
        if (chooseStory.value) {
          currentStory.value = value;
          storyColor = Defaults().StoryColors()[value];
          resetStory();
          console.log('Selected story => ', currentStory.value);
        }
      },
    );
        
    const resetStory = () => {
      const isCleared = playBook.clearPlaybook(true);
      if (isCleared) {
        PauseAudio();
        console.log(`Cleared playbook ${isCleared}`);
        buildStory(currentStory.value);
        audioSchema = AudioSchema(threeSvc);
        
        // audioSchema.loadAudioFile('/Audio/example.mp3');

        startStory();
      }
    };

    const moveSpotlight = (position: Vector3, widestLength: number) => {
      spot.move(position, widestLength);
      threeSvc.AddToScene(spot.SpotLight());
    };

    const showPauseScreen = (threeSvc: ThreeService) => {
      threeSvc.ClearScene();
    };

    const PlayAudio = () => {
      console.log(`PLAY`);
      audioHelper.Play();
    };

    const PauseAudio = () => {
      console.log(`PAUSED`);
      audioHelper.Pause();
    };

    const buildStory = (currentStory: number) => {
      threeSvc.ClearScene();
      threeSvc.state.scene.background = new Color(0xff4fff);
      console.log('buildStory()', storyData);
      activeStoryData = useStory().setActiveStory(storyData, currentStory - 1);
      console.log('ActiveStoryData => ', activeStoryData);
      spot.create(new Vector3(0, 0, Layers.scene), 6);
      playBook.addToPlayBook(() => threeSvc.AddToScene(spot.SpotLight()), 0);

      // threeSvc.AddToScene(ScanQR().create());
      useStoryCircle(threeSvc, activeStoryData, playBook).create(
        new Vector3(0, 0, 0),
        storyColor,
        currentFrame,
        activeStoryData.frames.length,
        0,
      );
      // useFrameAssetOverview(threeSvc, activeStoryData, playBook, spot).create(
      //   currentFrame,
      //   storyColor,
      //   3,
      // );
      // currentFrame++;
      // useStoryCircle(threeSvc, activeStoryData, playBook).create(
      //   new Vector3(0, 0, 0),
      //   storyColor,
      //   currentFrame,
      //   17,
      // );
      // useFrameAssetOverview(threeSvc,activeStoryData,playBook, spot).create(currentFrame, storyColor, 19);
      // currentFrame++;
      // useStoryCircle(threeSvc,activeStoryData,playBook).create(new Vector3(0,0,0), storyColor,currentFrame, 40);
      // useFrameAssetOverview(threeSvc,activeStoryData,playBook, spot).create(currentFrame, storyColor,43);
      // playBook.addToPlayBook(() => threeSvc.AddGroupsToScene(StoryPaused(storyData).Create([1, 2, 3])), 50);
      // playBook.addToPlayBook(() => {
      //   threeSvc.ClearScene();
      //   threeSvc.AddGroupsToScene(StoryPaused(storyData).Create([1, 2, 3]));
      // }, 48)
      console.log('Actions =>', playBook.getPlayBookFunctions());
    };

    const startStory = () => {
      console.log(`START STORY`);
      console.log(`There are ${playBook.getPlayBookFunctions().length} actions.`);
      audioHelper.Play();
      let currentFunction = 0;
      const interval = setInterval(() => {
        console.log(
          `Current time is => ${
            audioSchema.audio.context.currentTime
          } \n Time from function is => ${
            playBook.getPlayBookFunctions()[currentFunction].time
          }`,
        );
        if (
          audioHelper.DoEvent(
            audioSchema.audio.context.currentTime,
            playBook.getPlayBookFunctions()[currentFunction].time,
          )
        ) {
          playBook.getPlayBookFunctions()[currentFunction].func();
          currentFunction++;
        }
        if (currentFunction > playBook.getPlayBookFunctions().length - 1) {
          currentFunction = 0;
          PauseAudio();
          clearInterval(interval);
        }
      }, 100);
      interval;
    };

    onMounted(() => {
      threeSvc = new ThreeService(viewport);
      audioSchema = AudioSchema(threeSvc);
      // audioSchema.loadAudioFile('/Audio/example.mp3');
      audioHelper = AudioHelper(audioSchema);
      if (stories.value) {
        storyData = stories.value;
        buildStory(currentStory.value);
        startStory();
        // threeSvc.AddGroupsToScene(StoryPaused(storyData).Create([1, 2, 3]));
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