<template>
  <div ref="viewport"></div>
  <video ref="videoElement"></video>
</template>

<script lang="ts">
import useStory from '@/composables/useStory';
import Tools from '@/Three/Tools';
import ThreeService from '@/services/ThreeService';
import { defineComponent, onMounted, PropType, reactive, Ref, ref, watch } from 'vue';
import {
  AnimationClip,
  AnimationMixer,
  Clock,
  Mesh,
  NumberKeyframeTrack,
  Vector3,
  VectorKeyframeTrack,
} from 'three';
import { Entity as _Entity, Frame, Story } from '@/models/GraphqlModel';
import Spot from '@/Three/Spotlight';
import AudioHelper from '@/Three/AudioHelper';
import VideoHelper from '@/Three/VideoHelper';
import PlayBookBuild from '@/Three/playbook.build';
import StoryPaused from '@/screens/StoryPaused';
import EndOfSession from '@/screens/EndOfSession';
import PlayBook from '@/composables/playbook';
import Colors from '@/Three/defaults.color';
import Defaults from '@/Three/defaults.config';
import Timing from '@/Three/defaults.timing';
import useFrame from '@/composables/useFrame';
import useAsset from '@/composables/useAsset';
import EndOfStoryText from '@/Three/EndOfStoryText';

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
    const clock = new Clock();
    const spotlightMixer = new AnimationMixer(spot.SpotLight());

    watch(
      () => props.storySelected,
      (value) => {
        console.log('You want to select story', props.storySelected);
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

    watch(
      () => props.stories,
      (value) => {
        stories.value = value;
        spot.create(new Vector3(10, 0, 0), 3, Colors().lightBlue);
        // threeSvc.AddToScene(spot.SpotLight());
        // spot.SpotLight().position.set(-10,0,0);

        // spot.moveTo(
        //   spot.SpotLight(),
        //   new Vector3(10, -5, 0),
        //   new Vector3(10, 5, 0),
        //   Defaults().moveToPositionSteps(),
        // );

        // spot.moveTo(
        //   spot.SpotLight(),
        //   new Vector3(10, 5, 0),
        //   new Vector3(-10, 2, 0),
        //   Defaults().moveToPositionSteps(),
        // );

        // spot.moveTo(
        //   spot.SpotLight(),
        //   new Vector3(-10, 2, 0),
        //   new Vector3(-10, -5, 0),
        //   Defaults().moveToPositionSteps(),
        // );

        // playStartVideo();
        setup();
      },
    );

    const setup = async () => {
      if (stories.value) {
        audioHelper = AudioHelper();
        storyData = stories.value;
        buildStory(currentStory.value, '/Audio/example.mp3');
      }
    };

    const timing = () => {
      console.log(`TIMING`);
      let currentFunction = 0;
      interval = setInterval(() => {
        if (
          audioHelper.DoEvent(
            audio.currentTime,
            playBook.getPlayBookFunctions()[currentFunction].time,
          )
        ) {
          console.log(
            `| Time: ${
              playBook.getPlayBookFunctions()[currentFunction].time
            } \n| Context: ${playBook.getPlayBookFunctions()[currentFunction].context}`,
          );
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

    const buildStory = (currentStory: number, audioFile: string) => {
      threeSvc.ClearScene();
      activeStoryData = useStory().setActiveStory(storyData, currentStory - 1);

      PlayBookBuild(threeSvc, playBook, activeStoryData).initialSpotLight(spot);

      // testMoveingPositions();
      PlayBookBuild(threeSvc, playBook, activeStoryData).storyCircle(1, storyColor);

      activeStoryData.frames.map((frame: Frame, index: number) => {
        currentFrame = index;

        // PlayBookBuild(threeSvc, playBook, activeStoryData).updateAudio(audio,currentFrame, audioFile);

        PlayBookBuild(threeSvc, playBook, activeStoryData).storyCircle(
          currentFrame,
          storyColor,
        );

        playBook.addToPlayBook(
          () => {
            audio.pause();
            audio = AudioHelper().setAudioTrack(activeStoryData, currentFrame, audioFile);
            audio.play();
          },
          useFrame().getLastAssetRelationMetadata(activeStoryData, currentFrame)
            .timestamp_end,
          'Pause audio and create new audio ',
        );

        PlayBookBuild(threeSvc, playBook, activeStoryData).frameOverview(
          currentFrame,
          storyColor,
          spot,
        );
      });

      playBook.addToPlayBook(
        () => {
          chooseStory.value = true;
          audio.pause();
          threeSvc.ClearScene();
          threeSvc.AddGroupsToScene(StoryPaused(storyData).Create([1, 2, 3]));
          spot.move(new Vector3(0, 1.5, 0), 6);
          threeSvc.AddToScene(spot.SpotLight());
        },
        useFrame().getLastAssetRelationMetadata(activeStoryData, currentFrame)
          ?.timestamp_end + Timing.delayNextCycle,
        `Display story overview.`,
      );
      // PlayBookBuild(threeSvc, playBook, activeStoryData).endOfSession();

      console.log('Actions =>', playBook.getPlayBookFunctions());
      audio = AudioHelper().setAudioTrack(activeStoryData, 0, audioFile);
      audio.play();
      timing();
    };

    const resetStory = () => {
      clearInterval(interval);
      playBook.clearPlaybook(true);
      buildStory(currentStory.value, '/Audio/sample4.mp3');
    };

    const playStartVideo = () => {
      const videoSrc =
        'https://www.learningcontainer.com/wp-content/uploads/2020/05/sample-mp4-file.mp4';
      const videoCube = VideoHelper().videoElementAsCube(
        videoElement as Ref<HTMLVideoElement>,
        videoSrc,
        new Vector3(8, 8, 0),
      );
      threeSvc.AddToScene(videoCube);
      videoElement.value?.play();
      setTimeout(() => {
        console.log('currenttime', videoElement.value?.currentTime);
        videoCube.position.set(0, 0, 0);
      }, 7000);
    };

    // const testMoveingPositions = () => {
    //   threeSvc.ClearScene();
    //   activeStoryData = useStory().setActiveStory(storyData, currentStory.value - 1);

    //   const times = [];
    //   for (let index = 0; index <= Defaults().moveToPositionSteps(); index =index+ 0.01) {
    //     times.push(index);

    //   }
    //   console.log(times);
    //    const positions = spot.moveTo(
    //       spot.SpotLight(),
    //       new Vector3(10, -5, 0),
    //       new Vector3(-10, 5, 0),
    //       Defaults().moveToPositionSteps(),
    //     );
    //     console.log(positions);
    //   const keyframe = new VectorKeyframeTrack('.position', times, positions);
    //   const tracks = [keyframe];
    //   const clip = new AnimationClip('smooth', -1,tracks);
    //   const action = spotlightMixer.clipAction(clip);

    //   action.play();
    //   // playBook.addToPlayBook(
    //   //   () => {
    //   //     console.log(`Spotlight()`, spot.SpotLight());
    //   //     // spot.SpotLight().position.set(-10,0,0);
    //   //     spot.move(new Vector3(10,5,0), 4);
    //   //     // threeSvc.AddToScene(spot.SpotLight());

    //   //   },
    //   //   2,
    //   //   'Move object from A to B',
    //   // );

    //   // playBook.addToPlayBook(() => {
    //   //    spot.moveTo(
    //   //     spot.SpotLight(),
    //   //     new Vector3(10, -5, 0),
    //   //     new Vector3(-10, 5, 0),
    //   //     Defaults().moveToPositionSteps(),
    //   //   );
    //   // }, 2.3, 'Move object To');

    //   console.log('Actions =>', playBook.getPlayBookFunctions());
    //   audio = AudioHelper().setAudioTrack(activeStoryData, 0, '/Audio/sample4.mp3');
    //   audio.play();
    //   timing();
    // };

    onMounted(() => {
      threeSvc = new ThreeService(viewport);
      // threeSvc.AddToScene(Tools().xAxis(new Vector3(0, 0, 0)));
      // threeSvc.AddToScene(Tools().yAxis(new Vector3(0, 0, 0)));
      // if (stories.value) {
      //   audioHelper = AudioHelper();
      //   storyData = stories.value;
      //   buildStory(1, '/Audio/example.mp3');
      // }

      threeSvc.Animate();
    });

    return { viewport, videoElement };
  },
});
</script>