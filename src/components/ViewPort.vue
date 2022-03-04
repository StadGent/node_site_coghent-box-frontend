<template>
  <div ref="viewport" class="viewport" />
  <div class="subtitles">
    <p>{{ subtitles }}</p>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, PropType, reactive, Ref, ref, watch } from 'vue';
import { Group, Mesh, MeshBasicMaterial, Vector3 } from 'three';
import { Entity as _Entity, Frame, Story } from '@/models/GraphqlModel';

import ThreeService from '@/services/ThreeService';
import StoryService, { StoryData } from '@/services/StoryService';
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
import { Entity } from 'coghent-vue-3-component-library/lib';
import useStartOfSession from '@/Three/playbook.startOfSession';
import Spot from '@/Three/shapes.spotlight';

export default defineComponent({
  name: 'ViewPort',
  props: {
    stories: {
      type: Array as PropType<Array<Entity>>,
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
    showPauseOverview: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['restartSession', 'resetSelectedStory'],
  setup(props, { emit }) {
    let storySelected = JSON.parse(props.storySelected) as SensorObject;
    const viewport = ref(null);
    const stories = ref(props.stories);
    const currentStoryID = ref<string>('');
    const chooseStory = ref<boolean>(false);
    const videoElement = ref<HTMLVideoElement>();

    const playBook = PlayBook();

    const taggingService = new TaggingService();

    let textService: TextService;
    let threeSvc: ThreeService;
    let storyService: StoryService;
    let zoneService: ZoneService;
    let subtitleService: SubtitleService;

    let audio: HTMLAudioElement | null;
    let audioHelper: AudioHelperFunctions;
    let garbageHelper: GarabageHelperForWall;
    let audioDuration = 90;
    let currentFrame = 0;
    let showProgressOfFrame = false;
    let interval: ReturnType<typeof setTimeout>;
    let storyData: Array<Entity> = [];
    let spotlight: Mesh;

    let subtitles = ref<string>('');

    watch(
      () => props.storySelected,
      async (value) => {
        const _storySelected = JSON.parse(value) as SensorObject;
        const storyDataOfSelected = storyService.getStoryData()[_storySelected.id - 1];
        if (
          chooseStory.value &&
          _storySelected.id != 0 &&
          !storyDataOfSelected.storySeen
        ) {
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
        if (!props.showPauseOverview) {
          setData();
        } else {
          emit('resetSelectedStory', {
            topic: 'sensors/0/present',
            id: 0,
            msg: true,
          } as SensorObject);
          garbageHelper.startOfSession();
          storyService.setStoryPausedPositions(zoneService.zonesInnerToOuter);
          PlayBookBuild(
            threeSvc,
            storyService,
            zoneService,
            taggingService,
            playBook,
            spotlight,
            {} as Entity,
          ).storyPausedWithNoActiveStory();
          chooseStory.value = true;
        }
      },
    );

    const setNewStoryWhenSelected = async (_storySelected: number) => {
      chooseStory.value = false;
      const _storyData = storyService.getStoryDataOfStory(storyData[_storySelected].id);
      const next = storyService.setNextFrameForStory(_storyData.storyId);
      currentFrame = next.frame;
      storyService.setActiveStory(storyData[_storySelected].id);
      currentStoryID.value = storyService.activeStoryData.storyId;

      await PlayBookBuild(
        threeSvc,
        storyService,
        zoneService,
        taggingService,
        playBook,
        spotlight,
        storyService.activeStory,
      ).setSelectedStory();
      if (props.showPauseOverview) {
        garbageHelper.newStorySelectedWithNoActive();
        audioHelper = AudioHelper(threeSvc);
      } else {
        await garbageHelper.newStorySelected();
      }

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
      threeSvc.ClearScene();

      spotlight = Spot().create(
        zoneService.middleZoneCenter,
        Measurements().storyCircle.radius,
      );
      threeSvc.AddToScene(spotlight, Tags.Spotlight, 'InitialSpotlight');
      useStartOfSession(threeSvc, zoneService, spotlight).showScanImage();
    };

    const setData = async () => {
      audioHelper = AudioHelper(threeSvc);
      storyData = storyService.stories;
      showProgressOfFrame = false;
      audio = null;
      const next = storyService.setNextFrameForStory(storyService.activeStory.id);
      currentFrame = next.frame;
      clearInterval(interval);
      storyService.setStoryPausedPositions(zoneService.zonesInnerToOuter);
      await PlayBookBuild(
        threeSvc,
        storyService,
        zoneService,
        taggingService,
        playBook,
        spotlight,
        storyService.activeStory,
      )
        .startOfSession()
        .finally(async () => {
          garbageHelper.startOfSession();
          buildStory(currentStoryID.value);
        });
    };

    const timing = () => {
      console.log('| MASTER playbook: ', playBook.getPlayBookActions());
      let currentFunction = 0;
      let currentSubtitle = 1;
      let timingCount = 0;
      interval = setInterval(async () => {
        ++timingCount;
        showProgressOfFrame = true;
        if (audio && subtitleService.subtitles.length > 0) {
          const subtitleParams = subtitleService.getSubtitleForTime(
            audio.currentTime,
            subtitleService.subtitles,
            currentSubtitle,
          );
          subtitles.value = `${subtitleParams.subtitle}`;
          currentSubtitle = subtitleParams.index;
        }
        let time = timingCount;
        if (audio != null && !isNaN(audio.duration)) {
          time = audio.currentTime;
        }

        if (
          audioHelper.DoEvent(time, playBook.getPlayBookActions()[currentFunction].time)
        ) {
          if (Development().showDevTimeLogs()) {
            console.log(
              `| timingCount: ${timingCount}\n| Time: ${
                playBook.getPlayBookActions()[currentFunction].time
              } \n| Context: ${playBook.getPlayBookActions()[currentFunction].context}`,
            );
          }
          playBook.getPlayBookActions()[currentFunction].func();
          currentFunction++;
        }
        if (currentFunction > playBook.getPlayBookActions().length - 1) {
          console.log(`| timing: reset interval & timeCount`);
          subtitles.value = '';
          currentFunction = 0;
          clearInterval(interval);
          timingCount = 0;
        }
      }, 1000);
      interval;
    };

    const buildStory = async (_currenStoryId: string) => {
      PlayBookBuild(
        threeSvc,
        storyService,
        zoneService,
        taggingService,
        playBook,
        spotlight,
        storyService.activeStory,
      ).storyData(storyService, storyService.activeStory, currentFrame);

      audio = AudioHelper(threeSvc).setAudioTrack(storyService.activeStory, currentFrame);
      if (audio == null) {
        timing();
      }

      const subtitleLink = useFrame(threeSvc).getSubtitleForFrame(
        storyService.activeStory.frames?.[currentFrame] as unknown as Frame,
      );
      // TODO: await or not await for subtitles?
      subtitleService.downloadSRTFile(subtitleLink as string);

      let progress: Array<Group> = [];

      if (audio != null) {
        audio.ontimeupdate = () => {
          if (audio && showProgressOfFrame) {
            progress = PlayBookBuild(
              threeSvc,
              storyService,
              zoneService,
              taggingService,
              framePlaybook,
              spotlight,
              storyService.activeStory,
            ).progressOfFrame(
              currentFrame,
              storyService.getStoryColor(storyService.activeStory.id),
              audio.currentTime,
              audioDuration,
              progress,
            );
          }
        };
        audio.onloadedmetadata = () => {
          if (audio) {
            audioDuration = audio.duration;
            // REVIEW:maybe duplicate
            // setAfterFrameScreen();
            audio.play();
            timing();
          }
        };
      }

      const framePlaybook = PlayBook();

      PlayBookBuild(
        threeSvc,
        storyService,
        zoneService,
        taggingService,
        framePlaybook,
        spotlight,
        storyService.activeStory,
      ).storyCircle(
        currentFrame,
        storyService.getStoryColor(storyService.activeStory.id),
        !taggingService.idAlreadyInList(storyService.activeStory.id),
      );

      PlayBookBuild(
        threeSvc,
        storyService,
        zoneService,
        taggingService,
        framePlaybook,
        spotlight,
        storyService.activeStory,
      ).frameOverview(
        currentFrame,
        storyService.getStoryColor(storyService.activeStory.id),
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
    };

    const setAfterFrameScreen = () => {
      playBook.addToPlayBook(
        () => {
          if (audio) {
            audio.pause();
          }

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
              storyService.activeStory,
            )
              .endOfSession()
              .then((_start) => {
                emit('restartSession', _start);
                setup();
              });
          } else {
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
              storyService.activeStory,
            ).storyPaused();
            chooseStory.value = true;
          }
        },
        audio && isNaN(audio.duration) ? playBook.lastAction().time + 1 : audioDuration,
        `Update storyData & show endOfSessions screen or the storyOverview`,
      );
    };

    const resetStory = () => {
      clearInterval(interval);
      playBook.clearPlaybook(true);
      buildStory(currentStoryID.value);
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
      setup();

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
