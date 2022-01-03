<template>
  <div ref="viewport"></div>
  <video ref="videoElement"></video>
</template>

<script lang="ts">
import { defineComponent, onMounted, PropType, reactive, Ref, ref, watch } from 'vue';
import { Group, Mesh, MeshBasicMaterial, Vector3 } from 'three';
import { Entity as _Entity, Story } from '@/models/GraphqlModel';

import ThreeService from '@/services/ThreeService';
import StoryService from '@/services/StoryService';
import ZoneService from '@/services/ZoneService';
import TaggingService, { Tags } from '@/services/TaggingService';

import Tools from '@/Three/helper.tools';
import AudioHelper from '@/Three/helper.audio';
import VideoHelper from '@/Three/helper.video';
import BoundaryHelper from '@/Three/helper.boundary';

import Defaults from '@/Three/defaults.config';
import Timing from '@/Three/defaults.timing';
import Layers from '@/Three/defaults.layers';
import AnimationDefaults from '@/Three/defaults.animation';

import PlayBookBuild from '@/Three/playbook.build';

import PlayBook from '@/composables/playbook';
import Common from '@/composables/common';
import useStory from '@/composables/useStory';
import CustomAnimation from '@/composables/animation';

import Measurements from '@/Three/defaults.measurements';
import SchemaCube, { CubeSchema } from '@/Three/schema.cube';
import Colors from '@/Three/defaults.color';
import { threeDefaultsWall } from '@/Three/defaults.three';
import GroupHelper from '@/Three/helper.group';
import StoryCircle from '@/Three/section.storyCircle';
import { CircleSchema } from '@/Three/schema.circle';
import MoveObject from '@/composables/moveObject';

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
    storyService: {
      type: StoryService,
      required: true,
    },
  },
  emits: ['restartSession'],
  setup(props, { emit }) {
    const viewport = ref(null);
    const stories = ref(props.stories);
    const currentStory = ref<number>(props.storySelected - 1);
    const chooseStory = ref<boolean>(false);
    const videoElement = ref<HTMLVideoElement>();

    const playBook = PlayBook();

    const taggingService = new TaggingService();

    let threeSvc: ThreeService;
    let storyService: StoryService;
    let zoneService: ZoneService;

    let audio: HTMLAudioElement;
    let audioHelper: {
      DoEvent: (currentTime: number, eventTime: number) => boolean;
    };
    let audioDuration = 120;
    let currentFrame = 0;
    let startSession = false;
    let showProgressOfFrame = false;
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
      },
    );
    watch(
      () => props.storyService,
      (value) => {
        storyService = value;
        // setup();
        // setData();
      },
    );

    const setup = async () => {
      threeSvc.ClearScene();
      spotlight = PlayBookBuild(
        threeSvc,
        storyService,
        zoneService,
        playBook,
        spotlight,
        activeStoryData,
      ).initialSpotLight();

      startSession = await PlayBookBuild(
        threeSvc,
        storyService,
        zoneService,
        playBook,
        spotlight,
        activeStoryData,
      )
        .startOfSession()
        .finally(() => {
          setData();
        });
    };

    const setData = async () => {
      alert('got stories and can start');
      audioHelper = AudioHelper();
      storyData = storyService.stories;
      storyService.setStoryPausedPositions(zoneService.zonesInnerToOuter);
      console.log('StoryData', storyService.getStoryData());
      buildStory(currentStory.value, '/Audio/example.mp3');
    };

    const timing = () => {
      let currentFunction = 0;
      interval = setInterval(() => {
        showProgressOfFrame = true;
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
        storyService,
        zoneService,
        playBook,
        spotlight,
        activeStoryData,
      ).initialSpotLight();

      // playBook.addToPlayBook(
      //   () => {
      //     audio.pause();
      //     audio = AudioHelper().setAudioTrack(activeStoryData, currentFrame, audioFile);
      //     audio.play();
      //     alert(audio.duration);
      //   },
      //   playBook.lastAction().time,
      //   `Starting new audio for frame`,
      // );

      audio = AudioHelper().setAudioTrack(activeStoryData, currentFrame, audioFile);
      let progress: Array<Group> = [];
      audio.ontimeupdate = () => {
        if (showProgressOfFrame) {
          progress = PlayBookBuild(
            threeSvc,
            storyService,
            zoneService,
            framePlaybook,
            spotlight,
            activeStoryData,
          ).progressOfFrame(
            currentFrame,
            storyService.getStoryColor(activeStoryData.id),
            audio.currentTime,
            audioDuration,
            progress,
          );
        }
      };

      audio.onloadedmetadata = () => {
        audioDuration = audio.duration;
        audio.play();
        timing();
      };

      const framePlaybook = PlayBook();

      PlayBookBuild(
        threeSvc,
        storyService,
        zoneService,
        framePlaybook,
        spotlight,
        activeStoryData,
      ).storyCircle(currentFrame, storyService.getStoryColor(activeStoryData.id));

      PlayBookBuild(
        threeSvc,
        storyService,
        zoneService,
        framePlaybook,
        spotlight,
        activeStoryData,
      ).frameOverview(currentFrame, storyService.getStoryColor(activeStoryData.id));
      playBook.mergeActionsWithPlaybook(framePlaybook.getSortedPlayBookActions());

      playBook.addToPlayBook(
        async () => {
          showProgressOfFrame = false;
          PlayBookBuild(
            threeSvc,
            storyService,
            zoneService,
            framePlaybook,
            spotlight,
            activeStoryData,
          ).storyData(storyService, activeStoryData, currentFrame);
          if (storyService.isEndOfSession()) {
            audio.pause();
            //TODO: Restart the entire session flow
            PlayBookBuild(
              threeSvc,
              storyService,
              zoneService,
              framePlaybook,
              spotlight,
              activeStoryData,
            )
              .endOfSession(Measurements().spotLight.radius)
              .then((_start) => {
                emit('restartSession', _start);
                setup();
              });
          } else {
            chooseStory.value = true;
            audio.pause();
            threeSvc.ClearScene();
            threeSvc.AddToScene(spotlight, Tags.Spotlight, 'Spotlight of story paused');
            spotlight.scale.set(4, 4, Layers.scene);

            PlayBookBuild(
              threeSvc,
              storyService,
              zoneService,
              framePlaybook,
              spotlight,
              activeStoryData,
            ).storyPaused(storyData);
          }
          console.log('tag', taggingService.taggedObjects);
        },
        playBook.lastAction().time +
          Timing.frameOverview.spotLightMoved +
          Timing.delayNextCycle,
        `Update storyData & show endOfSessions screen or the storyOverview`,
      );
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
      threeSvc.AddToScene(videoCube, Tags.Video, 'Test of the video cube');
      videoElement.value?.play();
      setTimeout(() => {
        console.log('currenttime', videoElement.value?.currentTime);
        videoCube.position.set(0, 0, 0);
      }, 7000);
    };

    onMounted(async () => {
      threeSvc = new ThreeService(viewport, threeDefaultsWall, taggingService);
      zoneService = new ZoneService(
        threeSvc.state.sceneDimensions,
        Defaults().screenZones(),
      );
      threeSvc.ClearScene();

      const innerBoundary = BoundaryHelper(
        zoneService.sceneZone(),
        Defaults().screenZonePadding(),
      ).createInnerBoundary();
      const outerBoundary = BoundaryHelper(
        zoneService.sceneZone(),
        Defaults().screenZonePadding(),
      ).createOuterBoundary();
      // Tools().displayBoundaryAsDots(threeSvc, outerBoundary);
      // Tools().displayBoundaryAsDots(threeSvc, innerBoundary);

      // setup();
      const imagecube = SchemaCube().CreateImageCube({position: new Vector3(0,0,0), params: {width: 3, height: 3, color: Colors().white, isTransparant: true}} as CubeSchema);
      const cube = SchemaCube().CreateCube({position: new Vector3(-5,0,0), params: {width: 3, height: 3, color: Colors().white}} as CubeSchema);
      threeSvc.AddToScene(cube, Tags.Testing);
      threeSvc.AddToScene(imagecube, Tags.Testing);
      const testGroup = GroupHelper().CreateGroup([cube,imagecube]);
      threeSvc.AddToScene(testGroup, Tags.Testing);
      testGroup.position.set(5,2,0);
      await CustomAnimation().fadeOutGroups([testGroup], 0.2, AnimationDefaults.values.fadeStep);
      const _storyCircle = StoryCircle().Create('my title',{params: {radius: 2, color: Colors().green}, position: new Vector3(-5,0,0)} as CircleSchema,[0,0], '', false,true)
      threeSvc.AddGroupsToScene(_storyCircle, Tags.Testing);
      await CustomAnimation().fadeOutGroups(_storyCircle, 0.2, AnimationDefaults.values.fadeStep);

      // await CustomAnimation().grow(cube, 2, AnimationDefaults.values.scaleStep);
      // await CustomAnimation().shrink(cube, 1, AnimationDefaults.values.scaleStep);
      console.log('TaggedObjects => ',taggingService.taggedObjects);
      threeSvc.Animate();
    });

    return { viewport, videoElement };
  },
});
</script>