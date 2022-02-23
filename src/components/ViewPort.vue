<template>
  <div ref="viewport" class="viewport" />
  <div class="subtitles">
    <p>{{ subtitles }}</p>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, PropType, reactive, Ref, ref, watch } from 'vue';
import { Group, Mesh, MeshBasicMaterial, Vector3 } from 'three';
import { Entity as _Entity, Story } from '@/models/GraphqlModel';

import ThreeService from '@/services/ThreeService';
import StoryService from '@/services/StoryService';
import ZoneService from '@/services/ZoneService';
import TextService from '@/services/TextService';
import TaggingService, { Tags } from '@/services/TaggingService';
import SubtitleService from '@/services/SubtitleService';

import Tools from '@/Three/helper.tools';
import AudioHelper, { AudioHelperFunctions } from '@/Three/helper.audio';
import VideoHelper from '@/Three/helper.video';
import WallGarbageHelper, { GarabageHelperForWall } from '@/Three/helper.wall.garbage';
import SceneHelper from '@/Three/helper.scene';

import TestSingleComponent from '@/Three/test.components';

import Defaults from '@/Three/defaults.config';
import Measurements from '@/Three/defaults.measurements';
import { threeDefaultsWall } from '@/Three/defaults.three';
import AnimationDefaults from '@/Three/defaults.animation';
import Timing from '@/Three/defaults.timing';
import Development from '@/Three/defaults.development';

import PlayBookBuild from '@/Three/playbook.build';

import PlayBook from '@/composables/playbook';
import useStory from '@/composables/useStory';
import MoveObject from '@/composables/moveObject';
import CustomAnimation from '@/composables/animation';
import { SensorObject } from '@/composables/common';
import useFrame from '@/composables/useFrame';

import PauseProgressbar from '@/Three/shapes.pauseProgressbar';
import Template from '@/Three/template.shapes';

export default defineComponent({
  name: 'ViewPort',
  props: {
    stories: {
      type: Array as PropType<Array<Story>>,
      required: true,
    },
    storySelected: {
      type: String,
      required: true,
      default: JSON.stringify({
        topic: 'sensors/1/present',
        id: 1,
        msg: true,
      } as SensorObject),
    },
    storyService: {
      type: StoryService,
      required: true,
    },
  },
  emits: ['restartSession', 'resetSelectedStory'],
  setup(props, { emit }) {
    let storySelected = JSON.parse(props.storySelected) as SensorObject;
    const viewport = ref(null);
    const stories = ref(props.stories);
    const currentStory = ref<number>(storySelected.id - 1);
    const chooseStory = ref<boolean>(false);
    const videoElement = ref<HTMLVideoElement>();

    const playBook = PlayBook();

    const taggingService = new TaggingService();

    let textService: TextService;
    let threeSvc: ThreeService;
    let storyService: StoryService;
    let zoneService: ZoneService;
    let subtitleService: SubtitleService;

    let audio: HTMLAudioElement;
    let audioHelper: AudioHelperFunctions;
    let garbageHelper: GarabageHelperForWall;
    let audioDuration = 90;
    let currentFrame = 0;
    let showProgressOfFrame = false;
    let interval: ReturnType<typeof setTimeout>;
    let storyData: Array<Story> = [];
    let activeStoryData = reactive<Story>({} as Story);
    let spotlight: Mesh;

    let subtitles = ref<string>('');

    watch(
      () => props.storySelected,
      async (value) => {
        const _storySelected = JSON.parse(value) as SensorObject;
        if (chooseStory.value && _storySelected.id != 0) {
          chooseStory.value = false;
          console.log('You selected sensor', _storySelected.id);
          storyData = stories.value;

          await startCountdownForSelectedStory(_storySelected.id - 1, 3);
          await startCountdownForSelectedStory(_storySelected.id - 1, 2);
          await startCountdownForSelectedStory(_storySelected.id - 1, 1);
          await setNewStoryWhenSelected(_storySelected.id - 1);
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
        storyService.setActiveStory(storyService.stories[0].id);
        //TODO:
        setup();
      },
    );

    const setNewStoryWhenSelected = async (_storySelected: number) => {
      chooseStory.value = false;
      const _storyData = storyService.getStoryDataOfStory(storyData[_storySelected].id);
      storyService.setActiveStory(storyData[_storySelected].id);
      currentStory.value = _storySelected;
      currentFrame = _storyData.totalOfFramesSeen;
      console.log('Selected story => ', currentStory.value);

      await PlayBookBuild(
        threeSvc,
        storyService,
        zoneService,
        taggingService,
        playBook,
        spotlight,
        activeStoryData,
      ).setSelectedStory();
      await garbageHelper.newStorySelected();

      const progressDots = PauseProgressbar(storyService.activeStoryData).dots(
        Template().storyCircleLayers(zoneService.middleZoneCenter).progressDots,
        Measurements().storyCircle.progressRadius,
        storyService.activeStoryData.totalOfFrames,
        storyService.activeStoryData.storyColor,
      );
      await SceneHelper(threeSvc, storyService).addFrameProgressDotsToScene(
        progressDots,
        storyService.activeStoryData.storyId,
        storyService.activeStoryData.totalOfFramesSeen + 1,
        true,
      );
      taggingService.retag(Tags.StoryCircleFrameDot, Tags.ActiveStoryCircleFrameDot);
      taggingService.retag(
        Tags.StoryCircleFrameInnerDot,
        Tags.ActiveStoryCircleFrameInnerDot,
      );
      resetStory();
    };

    const startCountdownForSelectedStory = async (
      _storySelected: number,
      _count: number,
    ) => {
      const pausePosition = storyService.getStoryData()[_storySelected].pausedPosition;
      await CustomAnimation().singleCircularCountdown(
        threeSvc,
        new Vector3(
          pausePosition.x,
          -(zoneService.sceneZone().height / 2) + 1,
          pausePosition.z,
        ),
        0.3,
        0.1,
        [
          Tags.SmallCountdownRing,
          Tags.SmallCountdowndownNumber,
          Tags.SmallCountdownProgressRing,
        ],
        new Vector3(-0.12, -0.15, 0),
        Measurements().text.size.small,
        _count,
      );
    };

    const setup = async () => {
      // await Common().awaitTimeout(5000);
      threeSvc.ClearScene();
      spotlight = PlayBookBuild(
        threeSvc,
        storyService,
        zoneService,
        taggingService,
        playBook,
        spotlight,
        activeStoryData,
      ).initialSpotLight();
      storyService.setStoryPausedPositions(zoneService.zonesInnerToOuter);

      // setData();

      await PlayBookBuild(
        threeSvc,
        storyService,
        zoneService,
        taggingService,
        playBook,
        spotlight,
        activeStoryData,
      )
        .startOfSession()
        .finally(async () => {
          garbageHelper.startOfSession();
          setData();
        });
    };

    const setData = async () => {
      audioHelper = AudioHelper(threeSvc);
      storyData = storyService.stories;
      console.log('StoryData', storyService.getStoryData());
      buildStory(currentStory.value);
    };

    const timing = () => {
      console.log('| MASTER playbook: ', playBook.getPlayBookActions());
      let currentFunction = 0;
      let currentSubtitle = 1;
      let timingCount = 0;
      interval = setInterval(async () => {
        ++timingCount;
        if (Development().showDevTimeLogs()) {
          console.log({ timingCount });
        }
        showProgressOfFrame = true;
        if (subtitleService.subtitles.length > 0) {
          const subtitleParams = subtitleService.getSubtitleForTime(
            audio.currentTime,
            subtitleService.subtitles,
            currentSubtitle,
          );
          subtitles.value = `${subtitleParams.subtitle}`;
          currentSubtitle = subtitleParams.index;
        }
        let time = audio.currentTime;
        if (isNaN(audio.duration)) {
          time = timingCount;
        }

        if (
          audioHelper.DoEvent(time, playBook.getPlayBookActions()[currentFunction].time)
        ) {
          if (Development().showDevTimeLogs()) {
            console.log(
              `| Time: ${
                playBook.getPlayBookActions()[currentFunction].time
              } \n| Context: ${playBook.getPlayBookActions()[currentFunction].context}`,
            );
          }
          playBook.getPlayBookActions()[currentFunction].func();
          currentFunction++;
        }
        if (currentFunction > playBook.getPlayBookActions().length - 1) {
          subtitles.value = '';
          currentFunction = 0;
          clearInterval(interval);
          timingCount = 0;
        }
      }, 1000);
      interval;
    };

    const buildStory = async (currentStory: number) => {
      activeStoryData = useStory(storyService).setActiveStory(storyData, currentStory);

      PlayBookBuild(
        threeSvc,
        storyService,
        zoneService,
        taggingService,
        playBook,
        spotlight,
        activeStoryData,
      ).storyData(storyService, activeStoryData, currentFrame);

      audio = AudioHelper(threeSvc).setAudioTrack(activeStoryData, currentFrame);

      const subtitleLink = useFrame(threeSvc).getSubtitleForFrame(
        activeStoryData.frames[currentFrame],
      );
      // TODO: await or not await for subtitles?
      subtitleService.downloadSRTFile(subtitleLink as string);

      let progress: Array<Group> = [];
      audio.ontimeupdate = () => {
        if (showProgressOfFrame) {
          progress = PlayBookBuild(
            threeSvc,
            storyService,
            zoneService,
            taggingService,
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
        // REVIEW:maybe duplicate
        // setAfterFrameScreen();
        console.log('| MASTER playbook: ', playBook.getPlayBookActions());
        audio.play();
        timing();
      };

      const framePlaybook = PlayBook();

      PlayBookBuild(
        threeSvc,
        storyService,
        zoneService,
        taggingService,
        framePlaybook,
        spotlight,
        activeStoryData,
      ).storyCircle(
        currentFrame,
        storyService.getStoryColor(activeStoryData.id),
        !taggingService.idAlreadyInList(activeStoryData.id),
      );

      PlayBookBuild(
        threeSvc,
        storyService,
        zoneService,
        taggingService,
        framePlaybook,
        spotlight,
        activeStoryData,
      ).frameOverview(
        currentFrame,
        storyService.getStoryColor(activeStoryData.id),
        garbageHelper,
      );
      playBook.mergeActionsWithPlaybook(framePlaybook.getSortedPlayBookActions());

      playBook.addToPlayBook(
        () => {
          MoveObject().startMoving(spotlight, zoneService.middleZoneCenter);
          CustomAnimation().shrink(
            spotlight as Mesh<any, MeshBasicMaterial>,
            Measurements().storyCircle.radius,
            AnimationDefaults.values.scaleStep,
          );
          3;
        },
        playBook.lastAction().time + Timing.delayToPauseScreen,
        'Move the spotlight to the center of the screen until the frame ends',
      );
      setAfterFrameScreen();

      if (isNaN(audio.duration)) {
        timing();
      }
    };

    const setAfterFrameScreen = () => {
      playBook.addToPlayBook(
        () => {
          audio.pause();
          showProgressOfFrame = false;
          storyService.setStoryColor();
          if (storyService.isEndOfSession()) {
            garbageHelper.endOfSessionScreen();
            PlayBookBuild(
              threeSvc,
              storyService,
              zoneService,
              taggingService,
              playBook,
              spotlight,
              activeStoryData,
            )
              .endOfSession()
              .then((_start) => {
                emit('restartSession', _start);
                // setup();
              });
          } else {
            currentStory.value = 0;
            emit('resetSelectedStory', {
              topic: 'sensors/0/present',
              id: 0,
              msg: true,
            } as SensorObject);
            garbageHelper.pauseScreen();
            spotlight.scale.set(
              Measurements().storyCircle.outerCircle,
              Measurements().storyCircle.outerCircle,
              Measurements().storyCircle.outerCircle,
            );
            PlayBookBuild(
              threeSvc,
              storyService,
              zoneService,
              taggingService,
              playBook,
              spotlight,
              activeStoryData,
            ).storyPaused(taggingService);
            chooseStory.value = true;
          }
        },
        isNaN(audio.duration)?playBook.lastAction().time + 1:audioDuration,
        // audioDuration,
        `Update storyData & show endOfSessions screen or the storyOverview`,
      );
    };

    const resetStory = () => {
      clearInterval(interval);
      playBook.clearPlaybook(true);
      buildStory(currentStory.value);
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
      textService = new TextService(threeSvc);
      zoneService = new ZoneService(
        threeSvc.state.sceneDimensions,
        Defaults().screenZones(),
      );
      garbageHelper = WallGarbageHelper(threeSvc, taggingService);
      subtitleService = new SubtitleService();
      threeSvc.ClearScene();

      threeSvc.Animate();
    });

    return { viewport, videoElement, subtitles };
  },
});
</script>
<style>
.subtitles {
  width: 100%;
  height: 100px;
  position: fixed;
  bottom: 200px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.subtitles p {
  width: 600px;
  word-break: break-all;
  font-size: 24px;
  color: white;
}

.viewport {
  position: relative;
}

.viewport::before {
  content: '';
  background: linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)),
    url('/background.png');
  background-color: #000000;
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  filter: blur(20px);
  z-index: -10;
}
</style>
