<template>
  <div ref="viewport"></div>
  <video ref="videoElement"></video>
</template>

<script lang="ts">
import useStory from '@/composables/useStory';

import ThreeService from '@/services/ThreeService';
import StoryService from '@/services/StoryService';
import ZoneService from '@/services/ZoneService';
import TaggingService from '@/services/TaggingService';

import { defineComponent, onMounted, PropType, reactive, Ref, ref, watch } from 'vue';
import { Group, Mesh, Vector3 } from 'three';
import { Entity as _Entity, Story } from '@/models/GraphqlModel';

import Tools from '@/Three/helper.tools';
import AudioHelper from '@/Three/helper.audio';
import VideoHelper from '@/Three/helper.video';
import BoundaryHelper from '@/Three/helper.boundary';

import Defaults from '@/Three/defaults.config';
import Timing from '@/Three/defaults.timing';
import Layers from '@/Three/defaults.layers';
import { threeDefaultsWall } from '@/Three/defaults.three';

import PlayBookBuild from '@/Three/playbook.build';

import PlayBook from '@/composables/playbook';

import Measurements from '@/Three/defaults.measurements';
import Common from '@/composables/common';

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

    const setup = async () => {
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
      await Common().awaitTimeout(1000);
      storyData = stories.value;
      storyService = new StoryService(storyData);
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
          console.log('tag',taggingService.taggedObjects);
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
            ).endOfSession(Measurements().spotLight.radius);
          } else {
            chooseStory.value = true;
            audio.pause();
            threeSvc.ClearScene();
            threeSvc.AddToScene(spotlight, 'spotlight', 'Spotlight of story paused');
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
      threeSvc.AddToScene(videoCube, 'videocube', 'Test of the video cube');
      videoElement.value?.play();
      setTimeout(() => {
        console.log('currenttime', videoElement.value?.currentTime);
        videoCube.position.set(0, 0, 0);
      }, 7000);
    };

    onMounted(() => {
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
      Tools().displayBoundaryAsDots(threeSvc, outerBoundary);
      Tools().displayBoundaryAsDots(threeSvc, innerBoundary);

      setup();
      threeSvc.Animate();
    });

    return { viewport, videoElement };
  },
});
</script>