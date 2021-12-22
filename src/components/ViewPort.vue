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
import { Entity as _Entity, Story } from '@/models/GraphqlModel';

import Tools from '@/Three/helper.tools';
import AudioHelper from '@/Three/helper.audio';
import VideoHelper from '@/Three/helper.video';
import ZoneHelper, { Zone } from '@/Three/helper.zones';

import Defaults from '@/Three/defaults.config';
import Timing from '@/Three/defaults.timing';
import Layers from '@/Three/defaults.layers';

import PlayBookBuild from '@/Three/playbook.build';

import PlayBook from '@/composables/playbook';

import Positions from '@/Three/defaults.positions';
import Measurements from '@/Three/defaults.measurements';

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

    let threeSvc: ThreeService;
    let storyService: StoryService;

    let audio: HTMLAudioElement;
    let audioHelper: {
      DoEvent: (currentTime: number, eventTime: number) => boolean;
    };
    let audioDuration = 120;
    let currentFrame = 0;
    let startSession = false;
    let interval: ReturnType<typeof setTimeout>;
    let storyData: Array<Story> = [];
    let activeStoryData = reactive<Story>({} as Story);
    let spotlight: Mesh;
    let zones: Array<Zone>;

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
        playBook,
        spotlight,
        activeStoryData,
      ).initialSpotLight();

      startSession = await PlayBookBuild(
        threeSvc,
        storyService,
        playBook,
        spotlight,
        activeStoryData,
      ).startOfSession();

      if (stories.value && startSession) {
        alert('got stories and can start');
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
        storyService,
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
      audio.onloadedmetadata = () => {
        audioDuration = audio.duration;
        audio.play();
        timing();
      };      

      const framePlaybook = PlayBook();

      PlayBookBuild(
        threeSvc,
        storyService,
        framePlaybook,
        spotlight,
        activeStoryData,
      ).storyCircle(currentFrame, storyService.getStoryColor(activeStoryData.id));

      PlayBookBuild(
        threeSvc,
        storyService,
        framePlaybook,
        spotlight,
        activeStoryData,
      ).frameOverview(
        zones,
        currentFrame,
        storyService.getStoryColor(activeStoryData.id),
        audioDuration,
      );
      playBook.mergeActionsWithPlaybook(framePlaybook.getSortedPlayBookActions());

      playBook.addToPlayBook(
        async () => {
          PlayBookBuild(
            threeSvc,
            storyService,
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
              framePlaybook,
              spotlight,
              activeStoryData,
            ).endOfSession(Positions().endOfSession(), Measurements().spotLight.radius);
          } else {
            chooseStory.value = true;
            audio.pause();
            threeSvc.ClearScene();
            threeSvc.AddToScene(spotlight);
            spotlight.scale.set(4, 4, Layers.scene);

            PlayBookBuild(
              threeSvc,
              storyService,
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
      threeSvc.AddToScene(videoCube);
      videoElement.value?.play();
      setTimeout(() => {
        console.log('currenttime', videoElement.value?.currentTime);
        videoCube.position.set(0, 0, 0);
      }, 7000);
    };

    onMounted(() => {
      threeSvc = new ThreeService(viewport);
      const zonehelper = ZoneHelper(
        new Vector3(threeSvc.state.width, threeSvc.state.height, 0),
      );
      zones = zonehelper.createZonesXAxis(Defaults().screenZones());
      setup();
      threeSvc.Animate();
    });

    return { viewport, videoElement };
  },
});
</script>