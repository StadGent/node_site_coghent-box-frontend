<template>
  <div ref="viewport"></div>
  <video ref="videoElement"></video>
</template>

<script lang="ts">
import useStory from '@/composables/useStory';
import Tools from '@/Three/Tools';
import ThreeService from '@/services/ThreeService';
import {
  defineComponent,
  onMounted,
  PropType,
  reactive,
  Ref,
  ref,
  watch,
} from 'vue';
import { Mesh, Vector3 } from 'three';
import { Entity as _Entity, Frame, Story } from '@/models/GraphqlModel';
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
import Layers from '@/Three/defaults.layers';
import SchemaCube, { CubeSchema } from '@/Three/CubeSchema';
import MoveObject from '@/composables/moveObject';
import Common from '@/composables/common';
import LineHelper from '@/Three/LineHelper';
import GroupHelper from '@/Three/GroupHelper';
import TextHelper from '@/Three/TextHelper';
import useAsset from '@/composables/useAsset';
import StoryService from '@/services/StoryService';

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
    const currentStory = ref<number>(props.storySelected-1);
    const chooseStory = ref<boolean>(false);
    let storyColor = Defaults().StoryColors()[currentStory.value];
    let currentFrame = 0;
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
    let spotlight: Mesh;
    const playBook = PlayBook();
    let storyService: StoryService;

    watch(
      () => props.storySelected,
      (value) => {
        console.log('You want to select story', props.storySelected);
        console.log('Can you choose a story?', chooseStory.value);
        if (chooseStory.value && value <= storyData.length) {
          chooseStory.value = false;
          currentStory.value = value -1;
          currentFrame = 0;
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

        // playStartVideo();
        setup();
      },
    );

    const setup = async () => {
      if (stories.value) {
        audioHelper = AudioHelper();
        storyData = stories.value;
        storyService = new StoryService(storyData);
        console.log('StoryData', storyService.getStoryData());
        buildStory(currentStory.value, '/Audio/example.mp3');
      }
    };

    const timing = () => {
      let currentFunction = 0;
      interval = setInterval(() => {
        if (
          audioHelper.DoEvent(
            audio.currentTime,
            playBook.getPlayBookActions()[currentFunction].time,
          )
        ) {
          console.log(
            `| Time: ${
              playBook.getPlayBookActions()[currentFunction].time
            } \n| Context: ${playBook.getPlayBookActions()[currentFunction].context}`,
          );
          playBook.getPlayBookActions()[currentFunction].func();
          currentFunction++;
        }
        if (currentFunction > playBook.getPlayBookActions().length - 1) {
          currentFunction = 0;
          clearInterval(interval);
        }
      }, 100);
      interval;
    };

    const buildStory = (currentStory: number, audioFile: string) => {
      threeSvc.ClearScene();
      activeStoryData = useStory().setActiveStory(storyData, currentStory);

      spotlight = PlayBookBuild(
        threeSvc,
        playBook,
        spotlight,
        activeStoryData,
      ).initialSpotLight();

      activeStoryData.frames.map((frame: Frame, index: number) => {
        const framePlaybook = PlayBook();

        currentFrame = index;
        PlayBookBuild(threeSvc, framePlaybook, spotlight, activeStoryData).storyCircle(
          currentFrame,
          storyColor,
        );

        PlayBookBuild(threeSvc, framePlaybook, spotlight, activeStoryData).frameOverview(
          currentFrame,
          storyColor,
        );
        playBook.mergeActionsWithPlaybook(framePlaybook.getSortedPlayBookActions());
        console.log({ currentFrame });
        console.log('length of frames', activeStoryData.frames.length);
        if (currentFrame < activeStoryData.frames.length - 1) {
          playBook.addToPlayBook(
            () => {
              audio.pause();
              audio = AudioHelper().setAudioTrack(
                activeStoryData,
                currentFrame,
                audioFile,
              );
              audio.play();
            },
            playBook.lastAction().time,
            `Starting new audio for frame`,
          );
        }

        //FIXME: Update the storyData when the frame is actually seen
        storyService.updateSeenFramesOfStory(activeStoryData.id, frame, false);
        console.log(`Updated storyData`, storyService.getStoryData());
      });
      playBook.addToPlayBook(
        async () => {
          chooseStory.value = true;
          audio.pause();
          threeSvc.ClearScene();
          threeSvc.AddToScene(spotlight);
          spotlight.scale.set(4, 4, Layers.scene);
          threeSvc.AddGroupsToScene(StoryPaused(storyData).Create([1, 2, 3]));
          await MoveObject().startMoving(spotlight, new Vector3(0, 2.5, Layers.scene));
        },
        playBook.lastAction().time + Timing.frameOverview.spotLightMoved,
        `Display story overview.`,
      );

      audio = AudioHelper().setAudioTrack(activeStoryData, currentFrame, audioFile);
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

    const test_movingObject = () => {
      console.log(`test_movingObjects`);
      threeSvc.ClearScene();
      const cube = SchemaCube().CreateCube({
        position: new Vector3(10, 0, Layers.scene),
        params: { width: 2, height: 2, color: Colors().lightBlue },
      });
      const cube2 = SchemaCube().CreateCube({
        position: new Vector3(0, 0, Layers.scene),
        params: { width: 2, height: 4, color: Colors().pink },
      });
      threeSvc.AddToScene(cube);
      // threeSvc.AddToScene(cube2);
      MoveObject().move(cube, new Vector3(10, 5, Layers.scene));

      // if(MoveObject().move(cube, new Vector3(-10, 2, Layers.scene))){
      //   alert('here')
      // ;

      // }

      // MoveObject().move(cube2, new Vector3(10, 4, Layers.scene));
    };

    const test_zoomObject = () => {
      const cube = SchemaCube().CreateCube({
        position: new Vector3(-15, 0, 0),
        params: {
          color: 0xfff0fe,
          width: Common().pixelsToMeters(3648),
          height: Common().pixelsToMeters(2432),
        },
      } as CubeSchema);
      // const cube = SchemaCube().CreateCube({position: new Vector3(0,0,Layers.presentation), params: {color: 0xfff0fe ,width:4, height: 2}} as CubeSchema);
      threeSvc.AddToScene(cube);
      cube.scale.set(1, 1, 0);
      const metadataInfo = useAsset(threeSvc).addMetadata(
        cube,
        storyColor,
        1,
        'Chair02 , Maarten van Severen (Design Museum Gent)',
      );
      threeSvc.AddToScene(
        GroupHelper().CreateGroup([
          LineHelper().drawLineArroundCube(cube, storyColor),
          metadataInfo,
        ]),
      );

      Tools().dotOnPosition(threeSvc, cube.position);
    };

    onMounted(() => {
      threeSvc = new ThreeService(viewport);
      // threeSvc.AddToScene(Tools().xAxis(new Vector3(0, 0, 0)));
      // threeSvc.AddToScene(Tools().yAxis(new Vector3(0, 0, 0)));

      // test_movingObject();
      // test_zoomObject();

      threeSvc.Animate();
    });

    return { viewport, videoElement };
  },
});
</script>