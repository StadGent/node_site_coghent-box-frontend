<template>
  <div ref="viewport"></div>
  <video ref="videoElement"></video>
</template>

<script lang="ts">
import useStory from '@/composables/useStory';

import ThreeService from '@/services/ThreeService';
import StoryService from '@/services/StoryService';

import { defineComponent, onMounted, PropType, reactive, Ref, ref, watch } from 'vue';
import { Mesh, Vector3 } from 'three';
import { Entity as _Entity, Frame, Story } from '@/models/GraphqlModel';

import Tools from '@/Three/helper.tools';
import AudioHelper from '@/Three/helper.audio';
import VideoHelper from '@/Three/helper.video';
import ZoneHelper from '@/Three/helper.zones';
import LineHelper from '@/Three/helper.line';
import GroupHelper from '@/Three/helper.group';
import TextHelper from '@/Three/helper.text';

import Defaults from '@/Three/defaults.config';
import Colors from '@/Three/defaults.color';
import Timing from '@/Three/defaults.timing';
import Layers from '@/Three/defaults.layers';

import PlayBookBuild from '@/Three/playbook.build';
import StoryPaused from '@/screens/StoryPaused';
import EndOfSession from '@/screens/EndOfSession';
import PlayBook from '@/composables/playbook';
import useFrame from '@/composables/useFrame';
import MoveObject from '@/composables/moveObject';
import Common from '@/composables/common';
import useAsset from '@/composables/useAsset';

import SchemaCube, { CubeSchema } from '@/Three/schema.cube';

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
    const viewport = ref(null);
    const stories = ref(props.stories);
    const currentStory = ref<number>(props.storySelected - 1);
    const chooseStory = ref<boolean>(false);
    const videoElement = ref<HTMLVideoElement>();

    const playBook = PlayBook();
    const audioDuration = 120;

    let threeSvc: ThreeService;
    let storyService: StoryService;

    let audio: HTMLAudioElement;
    let audioHelper: {
      DoEvent: (currentTime: number, eventTime: number) => boolean;
    };
    let currentFrame = 0;
    let interval: ReturnType<typeof setTimeout>;
    let storyData: Array<Story> = [];
    let activeStoryData = reactive<Story>({} as Story);
    let spotlight: Mesh;

    watch(
      () => props.storySelected,
      (value) => {
        console.log('You want to select story', props.storySelected);
        console.log('Can you choose a story?', chooseStory.value);
        storyData = stories.value;
        if (
          chooseStory.value &&
          value <= storyData.length &&
          !storyService.storyIsSeen(storyData[value - 1].id)
        ) {
          const _storyData = storyService.getStoryDataOfStory(storyData[value - 1].id);
          chooseStory.value = false;
          currentStory.value = value - 1;
          currentFrame = _storyData.totalOfFramesSeen;
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
        // setup();
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

      playBook.addToPlayBook(
        () => {
          audio.pause();
          audio = AudioHelper().setAudioTrack(activeStoryData, currentFrame, audioFile);
          audio.play();
        },
        playBook.lastAction().time,
        `Starting new audio for frame`,
      );

      const framePlaybook = PlayBook();

      PlayBookBuild(threeSvc, framePlaybook, spotlight, activeStoryData).storyCircle(
        currentFrame,
        storyService.getStoryColor(activeStoryData.id),
      );

      PlayBookBuild(threeSvc, framePlaybook, spotlight, activeStoryData).frameOverview(
        currentFrame,
        storyService.getStoryColor(activeStoryData.id),
        audioDuration,
      );
      playBook.mergeActionsWithPlaybook(framePlaybook.getSortedPlayBookActions());

      playBook.addToPlayBook(
        async () => {
          chooseStory.value = true;
          audio.pause();
          threeSvc.ClearScene();
          threeSvc.AddToScene(spotlight);
          spotlight.scale.set(4, 4, Layers.scene);
          storyService.updateSeenFramesOfStory(
            activeStoryData.id,
            activeStoryData.frames[currentFrame],
          );

          const storiesWithTheirProgress = useStory().getStoriesWithTheirProgress(
            storyData,
            storyService.getStoryData(),
          );
          threeSvc.AddGroupsToScene(
            StoryPaused(storyData).Create(storiesWithTheirProgress),
          );
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
        Colors().white,
        1,
        'Chair02 , Maarten van Severen (Design Museum Gent)',
      );
      threeSvc.AddToScene(
        GroupHelper().CreateGroup([
          LineHelper().drawLineArroundCube(cube, Colors().white),
          metadataInfo,
        ]),
      );

      Tools().dotOnPosition(threeSvc, cube.position);
    };

    onMounted(() => {
      threeSvc = new ThreeService(viewport);
      const zonehelper = ZoneHelper(new Vector3(threeSvc.state.width,threeSvc.state.height,0));
      const zones = zonehelper.createZonesXAxis(Defaults().screenZones());
      console.log({zones});
      zones.forEach(zone => {
        threeSvc.AddToScene(Tools().yAxis(new Vector3(zone.start.x, zone.start.y, zone.start.z)));
      })
      const object = SchemaCube().CreateCube({position: new Vector3(-1,0,Layers.presentation), params: {width: 3,height: 2, color: Colors().yellow}} as CubeSchema);
      threeSvc.AddToScene(object);
      const inZone = zonehelper.objectIsInZone(object);
      Tools().dotOnPosition(threeSvc, zonehelper.getMiddleOfZone(inZone));

      // test_movingObject();
      // test_zoomObject();

      threeSvc.Animate();
    });

    return { viewport, videoElement };
  },
});
</script>