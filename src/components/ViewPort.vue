<template>
  <div ref="viewport" class="viewport" />
  <div class="subtitles">
    <p>{{ subtitles }}</p>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, PropType, ref, watch } from 'vue';
import { BoxGeometry, Group, Mesh, MeshBasicMaterial, Vector3 } from 'three';
import { Entity as _Entity, Frame } from '@/models/GraphqlModel';

import ThreeService from '@/services/ThreeService';
import StoryService, { StoryData } from '@/services/StoryService';
import ZoneService from '@/services/ZoneService';
import TextService from '@/services/TextService';
import TaggingService, { Tags } from '@/services/TaggingService';
import SubtitleService from '@/services/SubtitleService';

import AudioHelper, { AudioHelperFunctions } from '@/Three/helper.audio';
import WallGarbageHelper, { GarabageHelperForWall } from '@/Three/helper.wall.garbage';
import SceneHelper from '@/Three/helper.scene';

import Defaults from '@/Three/defaults.config';
import Measurements from '@/Three/defaults.measurements';
import { threeDefaultsWall } from '@/Three/defaults.three';
import AnimationDefaults from '@/Three/defaults.animation';
import Timing from '@/Three/defaults.timing';
import Development from '@/Three/defaults.development';

import PlayBookBuild from '@/Three/playbook.build';

import PlayBook from '@/composables/playbook';
import MoveObject from '@/composables/moveObject';
import CustomAnimation from '@/composables/animation';
import { SensorObject } from '@/composables/common';
import useFrame from '@/composables/useFrame';

import PauseProgressbar from '@/Three/shapes.pauseProgressbar';
import Template from '@/Three/template.shapes';
import { Entity } from 'coghent-vue-3-component-library/lib';
import useStartOfSession from '@/Three/playbook.startOfSession';
import Spot from '@/Three/shapes.spotlight';
import StateService, { FlowState } from '@/services/StateService';
import MetadataLabel from '@/Three/shapes.metadataLabel';

export default defineComponent({
  name: 'ViewPort',
  props: {
    stories: {
      type: Array as PropType<Array<Entity>>,
      default: null,
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
      type: StoryService || null,
      required: true,
    },
    stateService: {
      type: StateService,
      required: true,
    },
    showPauseOverview: {
      type: Boolean,
      default: false,
    },
    currentState: {
      type: String,
      default: FlowState[0],
    },
  },
  emits: ['restartSession', 'resetSelectedStory'],
  setup(props, { emit }) {
    let storySelected = JSON.parse(props.storySelected) as SensorObject;
    const viewport = ref(null);
    const stories = ref<Array<Entity> | null>(null);
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
    let spotlightBackground: Mesh<BoxGeometry, MeshBasicMaterial>;

    let subtitles = ref<string>('');

    const initState = () => {
      threeSvc.ClearScene();
      playBook.clearPlaybook(true);
      taggingService.clearTaggedObjects();
      setup();
    };

    watch(
      () => props.currentState,
      (value) => {
        garbageHelper.pauseScreen();
        initState();
      },
    );

    const isCounting = ref<boolean>(false);
    const counter = ref<number>(0);
    const countingStory = ref<number | null>(null);

    setInterval(async () => {
      if (countingStory.value != null && isCounting.value) {
        if (counter.value > 0)
          startCountdownForSelectedStory(countingStory.value - 1, counter.value);
      }
    }, 1000);

    watch(
      () => props.storySelected,
      async (value) => {
        const _storySelected = JSON.parse(value) as SensorObject;
        let storyDataOfSelected: StoryData | null = null;
        if (storyService) {
          storyDataOfSelected = storyService.getStoryData()[_storySelected.id - 1];
        }
        if (
          chooseStory.value &&
          _storySelected.id != 0 &&
          storyDataOfSelected &&
          !storyDataOfSelected.storySeen &&
          props.stateService.getCurrentState() === FlowState[5]
          // storyDataOfSelected.totalOfFrames > storyDataOfSelected.totalOfFramesSeen
        ) {
          if (
            !isCounting.value &&
            _storySelected.topic.includes('instant') &&
            _storySelected.msg
          ) {
            counter.value = 3;
            isCounting.value = true;
            countingStory.value = _storySelected.id;
          }
          if (
            isCounting.value &&
            _storySelected.topic.includes('instant') &&
            !_storySelected.msg &&
            _storySelected.id === countingStory.value
          ) {
            counter.value = 0;
            isCounting.value = false;
            countingStory.value = null;
          }

          if (
            isCounting.value &&
            _storySelected.topic.includes('present') &&
            _storySelected.msg &&
            _storySelected.id === countingStory.value
          ) {
            counter.value = 0;
            isCounting.value = false;
            countingStory.value = null;
            props.stateService.changeState(FlowState.storySelected);
            console.log('You selected sensor', countingStory.value);
            stories.value ? (storyData = stories.value) : [];
            await setNewStoryWhenSelected(_storySelected.id - 1);
          }

          if (counter.value <= -1) {
            console.log('end of counter');
          }
        }
      },
    );

    watch(
      () => props.stories,
      (value) => {
        stories.value = value;
        initState();
      },
    );

    watch(
      () => props.storyService,
      (value) => {
        if (value) {
          storyService = value;
          if (!props.showPauseOverview) {
            setData();
          } else {
            props.stateService.changeState(FlowState.storyOverview);
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

      const resultStoryData = await PlayBookBuild(
        threeSvc,
        storyService,
        zoneService,
        taggingService,
        playBook,
        spotlight,
        storyService.activeStory,
      ).storyData(storyService, storyService.activeStory, currentFrame);

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
        props.stateService.changeState(FlowState.storyOverview);
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
        storyService.activeStoryData.totalOfFramesSeen,
        true,
      );
      taggingService.retag(Tags.StoryCircleFrameDot, Tags.ActiveStoryCircleFrameDot);
      taggingService.retag(
        Tags.StoryCircleFrameInnerDot,
        Tags.ActiveStoryCircleFrameInnerDot,
      );
      // BUG introduction?
      await checkPositionOfProgressRing();
      //
      const groupOfAssetsTags = taggingService.getByTag(Tags.GroupOfAssets);
      if (groupOfAssetsTags && groupOfAssetsTags[0] && groupOfAssetsTags[0].object) {
        console.log('assets on screen', groupOfAssetsTags[0].object);
        await CustomAnimation().fadeOutGroups(
          [groupOfAssetsTags[0].object],
          0,
          AnimationDefaults.values.fadeStep,
        );
        threeSvc.RemoveFromScene(groupOfAssetsTags[0].object);
      } else {
        console.log('no assets found');
      }

      resetStory();
    };

    const checkPositionOfProgressRing = async () => {
      console.log('tagged objects', taggingService.taggedObjects);
      const frameRing = taggingService.getByTag(Tags.ActiveStoryCircleFrameRing);
      if (frameRing[0] && frameRing[0].object) {
        const ring = frameRing[0].object[0] as Group;
        console.log('frame ring position', ring.position);
        if (ring.position.x != zoneService.middleZoneCenter.x) {
          console.log('ring is not on position center');
          await MoveObject().startMoving(ring, zoneService.middleZoneCenter);
        }
      } else Promise.resolve();
    };

    const startCountdownForSelectedStory = async (
      _storySelected: number,
      _count: number,
    ) => {
      const pausePosition = storyService.getStoryData()[_storySelected].pausedPosition;
      await CustomAnimation().circularLoader(
        threeSvc,
        new Vector3(
          pausePosition.x,
          -(zoneService.sceneZone().height / 2) +
            Measurements().storyCircle.progressRadius / 2,
          pausePosition.z,
        ),
        30,
        10,
        [Tags.SmallCountdownRing, Tags.SmallCountdownProgressRing],
      );
    };

    const setup = async (initial: boolean = true) => {
      threeSvc.ClearScene();

      if (initial) {
        spotlight = Spot().create(
          zoneService.zones[0].center,
          Measurements().storyCircle.radius,
        );

        spotlightBackground = Spot().spotLightBackground();
        threeSvc.AddToScene(spotlight, Tags.Spotlight, 'InitialSpotlight');
        threeSvc.AddToScene(spotlightBackground, Tags.Spotlight, 'InitialSpotlight');
      }

      useStartOfSession(threeSvc, zoneService, spotlight).showScanImage();
      props.stateService.changeState(FlowState.welcome);
    };

    const setData = async () => {
      audioHelper = AudioHelper(threeSvc);
      storyData = storyService.stories;
      showProgressOfFrame = false;
      audio = null;
      const next = storyService.setNextFrameForStory(storyService.activeStory.id);
      currentFrame = next.frame;
      clearInterval(interval);
      playBook.clearPlaybook(true);
      storyService.setStoryPausedPositions(zoneService.zonesInnerToOuter);
      const resultStoryData = await PlayBookBuild(
        threeSvc,
        storyService,
        zoneService,
        taggingService,
        playBook,
        spotlight,
        storyService.activeStory,
      ).storyData(storyService, storyService.activeStory, currentFrame);
      if (resultStoryData) {
        currentStoryID.value = storyService.activeStoryData.storyId;
        props.stateService.changeState(FlowState.countdownToFrame);
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
      } else {
        console.log('No storyData set..');
      }
    };

    const timing = () => {
      props.stateService.changeState(FlowState.framePlaying);
      let currentFunction = 0;
      let currentSubtitle = 1;
      let timingCount = 0;

      let progress: Array<Group> = [];
      interval = setInterval(async () => {
        ++timingCount;
        showProgressOfFrame = true;
        if (
          audio &&
          subtitleService.subtitles &&
          subtitleService.currentSubtitleIndex < subtitleService.subtitles.length
        ) {
          const subtitleParams = subtitleService.getSubtitleForTime(
            audio.currentTime,
            subtitleService.subtitles,
            currentSubtitle,
          );
          subtitles.value = `${subtitleParams.subtitle}`;
        }
        let time = timingCount;
        if (audio != null && !isNaN(audio.duration)) {
          time = audio.currentTime;
        } else if (Defaults().showplayHeadWhenNoAudio()) {
          progress = PlayBookBuild(
            threeSvc,
            storyService,
            zoneService,
            taggingService,
            playBook,
            spotlight,
            storyService.activeStory,
          ).progressOfFrame(
            currentFrame,
            storyService.getStoryColor(storyService.activeStory.id),
            timingCount,
            playBook.lastAction().time,
            progress,
          );
        }
        if (
          audioHelper.DoEvent(
            timingCount,
            playBook.getPlayBookActions()[currentFunction].time,
          )
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
          if (Development().showDevTimeLogs()) {
            console.log(`| timing: reset interval & timeCount`);
          }
          subtitles.value = '';
          currentFunction = 0;
          clearInterval(interval);
          timingCount = 0;
          subtitleService.reset();
        }
      }, 1000);
      interval;
    };

    const buildStory = async (_currenStoryId: string) => {
      spotlightBackground.material.opacity = 0;
      if (props.stateService.getCurrentState() != FlowState[4]) {
        props.stateService.changeState(FlowState.buildFrame);

        const subtitleLink = useFrame(threeSvc).getSubtitleForFrame(
          storyService.activeStory.frames?.[currentFrame] as unknown as Frame,
        );
        await subtitleService.downloadSRTFile(subtitleLink as string);
        await subtitleService.downloadSRTFile(subtitleLink as string);

        let progress: Array<Group> = [];

        const framePlaybook = PlayBook();

        await PlayBookBuild(
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
        ).setActiveStoryCircleToBackground(false);

        await PlayBookBuild(
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

        audio = AudioHelper(threeSvc).setAudioTrack(
          storyService.activeStory,
          currentFrame,
        );
        if (audio === null) {
          setAfterFrameScreen();
          spotlightBackground.material.opacity = Measurements().spotLight.opacity;
          timing();
        }
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
              playBook.addToPlayBook(
                () => {
                  return;
                },
                audioDuration,
                'End of audio.',
              );
              audio.play();
              setAfterFrameScreen();
              spotlightBackground.material.opacity = Measurements().spotLight.opacity;
              timing();
            }
          };
        }
      }
    };

    const setAfterFrameScreen = () => {
      playBook.addToPlayBook(
        () => {
          PlayBookBuild(
            threeSvc,
            storyService,
            zoneService,
            taggingService,
            playBook,
            spotlight,
            storyService.activeStory,
          ).setActiveStoryCircleToBackground(true);
          MoveObject().startMoving(spotlight, zoneService.middleZoneCenter);
          CustomAnimation().shrink(
            spotlight as Mesh<any, MeshBasicMaterial>,
            Measurements().storyCircle.radius,
            AnimationDefaults.values.scaleStep,
          );
        },
        playBook.lastAction().time + Timing.delayForNext,
        'Move the spotlight to the center of the screen until the frame ends',
      );

      playBook.addToPlayBook(
        () => {
          if (audio) {
            audio.pause();
          }
          showProgressOfFrame = false;
          storyService.setStoryColor();
          if (storyService.isEndOfSession()) {
            emit('restartSession', true);
            props.stateService.changeState(FlowState.endCountdown);
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
                setup();
              });
          } else {
            props.stateService.changeState(FlowState.storyOverview);
            emit('resetSelectedStory', {
              topic: 'sensors/0/present',
              id: 0,
              msg: true,
            } as SensorObject);
            emit('restartSession', true);
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
        playBook.lastAction().time + Timing.delayForNext,
        `Update storyData & show endOfSessions screen or the storyOverview`,
      );
      if (Development().showplayBookLogs()) {
        console.log('Audio Duration', audio ? audio?.duration : null);
        console.log('MASTER playbook', playBook.getPlayBookActions());
      }
    };

    const resetStory = () => {
      clearInterval(interval);
      playBook.clearPlaybook(true);
      buildStory(currentStoryID.value);
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

      const text = await MetadataLabel(new Vector3(0, 0, 0)).label('Loading...');
      text.text.position.x -= text.dimensions.x / 2;
      threeSvc.AddToScene(text.text, Tags.Testing);

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
  bottom: 120px;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}
.subtitles p {
  width: 640;
  word-break: break-all;
  font-size: 30px;
  line-height: 40px;
  color: white;
}

.viewport {
  position: relative;
  overflow: hidden;
}

.viewport::before {
  content: '';
  background: linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)),
    url('/background.jpg');
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
