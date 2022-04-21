<template>
  <div ref="viewport" class="viewport" />
  <div class="subtitles">
    <p>{{ subtitles }}</p>
  </div>
</template>

<script lang="ts">
  import { defineComponent, onMounted, PropType, ref, watch } from 'vue';
  import {
    BoxGeometry,
    BufferGeometry,
    Group,
    Mesh,
    MeshBasicMaterial,
    Vector3,
  } from 'three';
  import { Entity as _Entity, Frame } from '@/models/GraphqlModel';

  import ThreeService from '@/services/ThreeService';
  import StoryService, { StoryData } from '@/services/StoryService';
  import ZoneService from '@/services/ZoneService';
  import TextService from '@/services/TextService';
  import TaggingService, { Tags } from '@/services/TaggingService';
  import SubtitleService from '@/services/SubtitleService';
  import globals from '@/services/GlobalData';

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
  import useDMX from '@/composables/useDMX';

  import PauseProgressbar from '@/Three/shapes.pauseProgressbar';
  import Template from '@/Three/template.shapes';
  import { Entity } from 'coghent-vue-3-component-library/lib';
  import { FlowState } from '@/services/StateService';
  import MetadataLabel from '@/Three/shapes.metadataLabel';
  import stateService from '@/services/StateService';
  import scenery from '@/composables/useScenery';

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
      const videoElement = ref<HTMLVideoElement>();

      const playBook = PlayBook();

      const taggingService = new TaggingService();

      let textService: TextService;
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

      let subtitles = ref<string>('');

      const initState = () => {
        globals.threeService?.ClearScene();
        playBook.clearPlaybook(true);
        taggingService.clearTaggedObjects();
        scenery.welcomeScene();
        stateService.canScanTicket = true;
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
            // storyService.updateStoryStatus(storyDataOfSelected);
          }
          if (
            stateService.canChooseNextStory &&
            _storySelected.id != 0 &&
            storyDataOfSelected &&
            !storyDataOfSelected.storySeen &&
            stateService.getCurrentState() === FlowState[5]
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
              stateService.canChooseNextStory = false;
              counter.value = 0;
              isCounting.value = false;
              countingStory.value = null;
              stateService.changeState(FlowState.storySelected);
              console.log('You selected sensor', countingStory.value);
              stories.value ? (storyData = stories.value) : [];
              useDMX().lightsOff();
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
              emit('resetSelectedStory', {
                topic: 'sensors/0/present',
                id: 0,
                msg: true,
              } as SensorObject);
              garbageHelper.startOfSession();
              storyService.setStoryPausedPositions(zoneService.zonesInnerToOuter);
              PlayBookBuild(
                globals.threeService as ThreeService,
                storyService,
                zoneService,
                taggingService,
                playBook,
                globals.spotlight as Mesh<BufferGeometry, any>,
                {} as Entity,
              ).storyPausedWithNoActiveStory();
              stateService.canChooseNextStory = true;
            }
          }
        },
      );

      const setNewStoryWhenSelected = async (_storySelected: number) => {
        garbageHelper.removeCountdown();
        storyService.setActiveStory(storyData[_storySelected].id);
        const _storyData = storyService.getStoryDataOfStory(storyData[_storySelected].id);
        const next = storyService.setNextFrameForStory(_storyData.storyId);
        currentFrame = next.frame;

        await PlayBookBuild(
          globals.threeService as ThreeService,
          storyService,
          zoneService,
          taggingService,
          playBook,
          globals.spotlight as Mesh<BufferGeometry, any>,
          storyService.activeStory,
        ).storyData(storyService, storyService.activeStory, currentFrame);

        currentStoryID.value = storyService.activeStoryData.storyId;

        await PlayBookBuild(
          globals.threeService as ThreeService,
          storyService,
          zoneService,
          taggingService,
          playBook,
          globals.spotlight as Mesh<BufferGeometry, any>,
          storyService.activeStory,
        ).setSelectedStory();
        if (props.showPauseOverview) {
          stateService.changeState(FlowState.storyOverview);
          garbageHelper.newStorySelectedWithNoActive();
          audioHelper = AudioHelper(globals.threeService as ThreeService);
        } else {
          await garbageHelper.newStorySelected();
        }

        const progressDots = await PauseProgressbar(storyService.activeStoryData).dots(
          Template().storyCircleLayers(zoneService.middleZoneCenter).progressDots,
          Measurements().storyCircle.progressRadius,
          storyService.activeStoryData.totalOfFrames,
          storyService.activeStoryData.storyColor,
        );
        await SceneHelper(
          globals.threeService as ThreeService,
          storyService,
        ).addFrameProgressDotsToScene(
          progressDots,
          storyService.activeStoryData.storyId,
          storyService.activeStoryData.totalOfFramesSeen,
          true,
        );
        taggingService.retag(Tags.StoryCircleFrameDot, Tags.ActiveStoryCircleFrameDot);
        taggingService.retag(
          Tags.StoryCircleFrameDotCheckmark,
          Tags.ActiveStoryCircleFrameDotCheckmark,
        );
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
          globals.threeService?.RemoveFromScene(groupOfAssetsTags[0].object);
        } else {
          console.log('no assets found');
        }

        resetStory();
      };

      const checkPositionOfProgressRing = async () => {
        const frameRing = taggingService.getByTag(Tags.ActiveStoryCircleFrameRing);
        if (frameRing[0] && frameRing[0].object) {
          const ring = frameRing[0].object[0] as Group;
          if (ring.position.x != zoneService.middleZoneCenter.x) {
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
          globals.threeService as ThreeService,
          new Vector3(pausePosition.x, pausePosition.y, pausePosition.z),
          Measurements().storyCircle.radius,
          15,
          [Tags.SmallCountdownRing, Tags.SmallCountdownProgressRing],
        );
      };

      const setData = async () => {
        audioHelper = AudioHelper(globals.threeService as ThreeService);
        storyData = storyService.stories;
        showProgressOfFrame = false;
        audio = null;
        const next = storyService.setNextFrameForStory(storyService.activeStory.id);
        currentFrame = next.frame;
        clearInterval(interval);
        playBook.clearPlaybook(true);
        storyService.setStoryPausedPositions(zoneService.zonesInnerToOuter);
        const resultStoryData = await PlayBookBuild(
          globals.threeService as ThreeService,
          storyService,
          zoneService,
          taggingService,
          playBook,
          globals.spotlight as Mesh<BufferGeometry, any>,
          storyService.activeStory,
        ).storyData(storyService, storyService.activeStory, currentFrame);
        if (resultStoryData) {
          currentStoryID.value = storyService.activeStoryData.storyId;
          useDMX().lightsOff();
          stateService.changeState(FlowState.countdownToFrame);
          await PlayBookBuild(
            globals.threeService as ThreeService,
            storyService,
            zoneService,
            taggingService,
            playBook,
            globals.spotlight as Mesh<BufferGeometry, any>,
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
        stateService.changeState(FlowState.framePlaying);
        let currentFunction = 0;
        let timingCount = 0;

        let progress: Array<Group> = [];
        interval = setInterval(async () => {
          ++timingCount;
          showProgressOfFrame = true;
          if (
            audio &&
            subtitleService.subtitles &&
            subtitleService.currentSubtitleIndex <= subtitleService.subtitles.length
          ) {
            subtitles.value = subtitleService.getCurrentSubtitleText(audio.currentTime);
          }
          let time = timingCount;
          if (audio != null && !isNaN(audio.duration)) {
            time = audio.currentTime;
          } else if (Defaults().showplayHeadWhenNoAudio()) {
            progress = PlayBookBuild(
              globals.threeService as ThreeService,
              storyService,
              zoneService,
              taggingService,
              playBook,
              globals.spotlight as Mesh<BufferGeometry, any>,
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
        garbageHelper.removeCountdown();
        useDMX().lightsOff();
        globals.spotlightBackground
          ? (globals.spotlightBackground.material.opacity = 0)
          : null;
        if (stateService.getCurrentState() != FlowState[4]) {
          stateService.changeState(FlowState.buildFrame);

          const subtitleLink = useFrame(
            globals.threeService as ThreeService,
          ).getSubtitleForFrame(
            storyService.activeStory.frames?.[currentFrame] as unknown as Frame,
          );
          await subtitleService.downloadSRTFile(subtitleLink as string);
          await subtitleService.downloadSRTFile(subtitleLink as string);

          let progress: Array<Group> = [];

          const framePlaybook = PlayBook();

          await PlayBookBuild(
            globals.threeService as ThreeService,
            storyService,
            zoneService,
            taggingService,
            framePlaybook,
            globals.spotlight as Mesh<BufferGeometry, any>,
            storyService.activeStory,
          ).storyCircle(
            currentFrame,
            storyService.getStoryColor(storyService.activeStory.id),
            !taggingService.idAlreadyInList(storyService.activeStory.id),
          );

          // PlayBookBuild(
          //   globals.threeService as ThreeService,
          //   storyService,
          //   zoneService,
          //   taggingService,
          //   framePlaybook,
          //   globals.spotlight as Mesh<BufferGeometry, any>,
          //   storyService.activeStory,
          // ).setActiveStoryCircleToBackground(false);

          await PlayBookBuild(
            globals.threeService as ThreeService,
            storyService,
            zoneService,
            taggingService,
            framePlaybook,
            globals.spotlight as Mesh<BufferGeometry, any>,
            storyService.activeStory,
          ).frameOverview(
            currentFrame,
            storyService.getStoryColor(storyService.activeStory.id),
            garbageHelper,
          );

          playBook.mergeActionsWithPlaybook(framePlaybook.getSortedPlayBookActions());

          audio = AudioHelper(globals.threeService as ThreeService).setAudioTrack(
            storyService.activeStory,
            currentFrame,
          );
          if (audio === null) {
            setAfterFrameScreen();
            globals.spotlightBackground
              ? (globals.spotlightBackground.material.opacity =
                  Measurements().spotLight.opacity)
              : null;
            timing();
          }
          if (audio != null) {
            audio.ontimeupdate = () => {
              if (audio && showProgressOfFrame) {
                progress = PlayBookBuild(
                  globals.threeService as ThreeService,
                  storyService,
                  zoneService,
                  taggingService,
                  framePlaybook,
                  globals.spotlight as Mesh<BufferGeometry, any>,
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
                globals.spotlightBackground
                  ? (globals.spotlightBackground.material.opacity =
                      Measurements().spotLight.opacity)
                  : null;
                timing();
              }
            };
          }
        }
      };

      const setAfterFrameScreen = () => {
        playBook.addToPlayBook(
          () => {
            // PlayBookBuild(
            //   globals.threeService as ThreeService,
            //   storyService,
            //   zoneService,
            //   taggingService,
            //   playBook,
            //   globals.spotlight as Mesh<BufferGeometry, any>,
            //   storyService.activeStory,
            // ).setActiveStoryCircleToBackground(true);
            MoveObject().startMoving(
              globals.spotlight as Mesh<BufferGeometry, any>,
              zoneService.middleZoneCenter,
            );
            CustomAnimation().shrink(
              globals.spotlight as Mesh<any, MeshBasicMaterial>,
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
              stateService.changeState(FlowState.endCountdown);
              garbageHelper.endOfSessionScreen();
              useDMX().sequence();
              PlayBookBuild(
                globals.threeService as ThreeService,
                storyService,
                zoneService,
                taggingService,
                playBook,
                globals.spotlight as Mesh<BufferGeometry, any>,
                storyService.activeStory,
              ).endOfSession();
            } else {
              stateService.changeState(FlowState.storyOverview);
              emit('resetSelectedStory', {
                topic: 'sensors/0/present',
                id: 0,
                msg: true,
              } as SensorObject);
              garbageHelper.pauseScreen();
              globals.spotlight?.scale.set(
                Measurements().storyCircle.outerCircle,
                Measurements().storyCircle.outerCircle,
                Measurements().storyCircle.outerCircle,
              );
              PlayBookBuild(
                globals.threeService as ThreeService,
                storyService,
                zoneService,
                taggingService,
                playBook,
                globals.spotlight as Mesh<BufferGeometry, any>,
                storyService.activeStory,
              ).storyPaused();
              useDMX().lightsOn();
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
        globals.threeService = new ThreeService(
          viewport,
          threeDefaultsWall,
          taggingService,
        );
        textService = new TextService(globals.threeService as ThreeService);
        zoneService = new ZoneService(
          globals.threeService?.state.sceneDimensions,
          Defaults().screenZones(),
        );
        globals.zoneService = zoneService;
        garbageHelper = WallGarbageHelper(
          globals.threeService as ThreeService,
          taggingService,
        );
        subtitleService = new SubtitleService();
        globals.threeService?.ClearScene();

        if (!stories.value) {
          const text = await MetadataLabel(new Vector3(0, 0, 0)).label('Loading...');
          text.text.position.x -= text.dimensions.x / 2;
          globals.threeService?.AddToScene(text.text, Tags.Testing);
        }

        globals.threeService?.Animate();
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
    -webkit-text-stroke: black 1px;
    color: white;
    font-weight: 700;
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
