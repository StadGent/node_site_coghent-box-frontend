<template>
  <div ref="viewport"></div>
  <video ref="videoElement"></video>
</template>

<script lang="ts">
import useStory from '@/composables/useStory';
import Tools from '@/Three/Tools';
import ThreeService from '@/services/ThreeService';
import { defineComponent, onMounted, PropType, reactive, Ref, ref, watch } from 'vue';
import { Vector3 } from 'three';
import { Entity as _Entity, Frame, Story } from '@/models/GraphqlModel';
import Spot from '@/Three/Spotlight';
import AudioHelper from '@/Three/AudioHelper';
import VideoHelper from '@/Three/VideoHelper';
import StoryPaused from '@/screens/StoryPaused';
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
    const chooseStory = ref<boolean>(false);
    let storyColor = Colors().yellow;
    let currentFrame = 1;
    const viewport = ref(null);
    const videoElement = ref<HTMLVideoElement>();
    let audio: HTMLAudioElement;
    let threeSvc: ThreeService;
    let audioHelper: {
      DoEvent: (currentTime: number, eventTime: number) => boolean;
    };
    let interval: ReturnType<typeof setTimeout>;
    let storyData: Array<Story> = [];
    let activeStoryData = reactive<Story>({} as Story);
    const spot = Spot();
    const playBook = PlayBook();

    watch(
      () => props.storySelected,
      (value) => {
        console.log('Can you choose a story?', chooseStory.value);
        if (chooseStory.value && value <= storyData.length) {
          chooseStory.value = false;
          currentStory.value = value;
          currentFrame = 1;
          storyColor = Defaults().StoryColors()[value];
          console.log('Selected story => ', currentStory.value);
          resetStory();
        }
      },
    );

    const resetStory = () => {
      clearInterval(interval);
      playBook.clearPlaybook(true);
      buildStory(currentStory.value, '/Audio/sample4.mp3');
    };

    const buildStory = (currentStory: number, audioFile: string) => {
      threeSvc.ClearScene();
      audio = new Audio(audioFile);
      console.log('buildStory()', storyData);
      activeStoryData = useStory().setActiveStory(storyData, currentStory - 1);
      console.log('ActiveStoryData => ', activeStoryData);
      spot.create(new Vector3(0, 0, Layers.scene), 6);
      playBook.addToPlayBook(() => threeSvc.AddToScene(spot.SpotLight()), 0);

      activeStoryData.frames.map((frame: Frame, index: number) => {
        currentFrame = index;
        useStoryCircle(threeSvc, activeStoryData, playBook).create(
          new Vector3(0, 0, 0),
          storyColor,
          currentFrame,
          activeStoryData.frames.length,
          playBook.lastAction().time + 1,
        );

        useFrameAssetOverview(threeSvc, activeStoryData, playBook, spot).create(
          currentFrame,
          storyColor,
          playBook.lastAction().time + 1,
        );
      });

      playBook.addToPlayBook(() => {
        chooseStory.value = true;
        audio.pause();
        threeSvc.ClearScene();
        threeSvc.AddGroupsToScene(StoryPaused(storyData).Create([1, 2, 3]));
        spot.move(new Vector3(0, 1.5, 0), 6);
        threeSvc.AddToScene(spot.SpotLight());
      }, playBook.lastAction().time + 1);

      console.log('Actions =>', playBook.getPlayBookFunctions());
      startStory();
    };

    const startStory = () => {
      console.log(`START STORY`);
      console.log(`There are ${playBook.getPlayBookFunctions().length} actions.`);
      let currentFunction = 0;
      audio.play();
      interval = setInterval(() => {
        if (
          audioHelper.DoEvent(
            audio.currentTime,
            playBook.getPlayBookFunctions()[currentFunction].time,
          )
        ) {
          playBook.getPlayBookFunctions()[currentFunction].func();
          currentFunction++;
        }
        if (currentFunction > playBook.getPlayBookFunctions().length - 1) {
          currentFunction = 0;
          clearInterval(interval);
        }
      }, 100);
      interval;
    };

    const setup = async () => {
      console.log('setup');
      if (stories.value) {
        audioHelper = AudioHelper();
        storyData = stories.value;
        buildStory(currentStory.value, '/Audio/example.mp3');
      }
    };

    watch(
      () => props.stories,
      (value) => {
        stories.value = value;
        playStartVideo();
        // setup();
      },
    );
    const playStartVideo = () => {
      const videoSrc = 'https://www.learningcontainer.com/wp-content/uploads/2020/05/sample-mp4-file.mp4';
      const videoCube = VideoHelper().videoElementAsCube(videoElement as Ref<HTMLVideoElement>, videoSrc, new Vector3(8,8,0));
      threeSvc.AddToScene(videoCube);
      videoElement.value?.play();
      setTimeout(() => {console.log('currenttime',videoElement.value?.currentTime);videoCube.position.set(0,0,0);}, 7000)
    };

    onMounted(() => {
      threeSvc = new ThreeService(viewport);
      // threeSvc.AddToScene(Tools().xAxis(new Vector3(0, 0, 0)));
      // threeSvc.AddToScene(Tools().yAxis(new Vector3(0, 0, 0)));
      threeSvc.Animate();
    });

    return { viewport, videoElement };
  },
});
</script>