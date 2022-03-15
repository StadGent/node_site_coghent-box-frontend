import useFrame from '@/composables/useFrame';
import { PlayBookFunctions } from '@/composables/playbook';
import { Frame, Story } from '@/models/GraphqlModel';
import ThreeService from '@/services/ThreeService';
import { Group, Mesh, MeshBasicMaterial, Vector3 } from 'three';
import AudioHelper from './helper.audio';
import Layers from './defaults.layers';
import Spot from './shapes.spotlight';
import useFrameAssetOverview from './playbook.frameAssetOverview';
import useStoryCircle from './playbook.storyCircle';
import Measurements from './defaults.measurements';
import StoryService, { StoryData } from '@/services/StoryService';
import MoveObject from '@/composables/moveObject';
import StoryPaused from '@/screens/StoryPaused';
import useStartOfSession from './playbook.startOfSession';
import useEndOfSession from './playbook.endOfSession';
import HorizontalProgressBar from './shapes.horizontalProgressBar';
import ZoneService from '@/services/ZoneService';
import TaggingService, { Tags } from '@/services/TaggingService';
import CustomAnimation from '@/composables/animation';
import AnimationDefaults from './defaults.animation';
import WallGarbageHelper, { GarabageHelperForWall } from './helper.wall.garbage';
import TaggingHelper from './helper.tagging';
import MoveHelper from './helper.move';
import SceneHelper from './helper.scene';
import StoryCircle from './section.storyCircle';
import { CircleParams, CircleSchema } from './schema.circle';
import { Entity } from 'coghent-vue-3-component-library/lib';
import Development from './defaults.development';

const PlayBookBuild = (
  threeService: ThreeService,
  storyService: StoryService,
  zoneService: ZoneService,
  taggingService: TaggingService,
  playBook: PlayBookFunctions,
  spotlight: Mesh,
  activeStory: Entity,
): {
  updateAudio: (
    audio: HTMLAudioElement,
    activeFrameIndex: number,
    backupAudioFile: string,
  ) => void;
  storyCircle: (
    currentFrameIndex: number,
    storyColor: number,
    canAddToSCene: boolean,
  ) => Promise<void>;
  frameOverview: (
    currentFrameIndex: number,
    storyColor: number,
    garbageHelper: GarabageHelperForWall,
  ) => Promise<void>;
  progressOfFrame: (
    frameIndex: number,
    color: number,
    currentTime: number,
    audioDuration: number,
    progressbar: Array<Group>,
  ) => Array<Group>;
  initialSpotLight: () => Mesh;
  endOfSession: () => Promise<void>;
  storyPaused: () => Promise<void>;
  storyPausedWithNoActiveStory: () => Promise<void>;
  storyData: (
    storyService: StoryService,
    activeStory: Entity,
    frameIndex: number,
  ) => Promise<Array<StoryData> | null>;
  startOfSession: () => Promise<true | false>;
  setSelectedStory: () => Promise<void>;
} => {
  const logBuild = (_buildName: string) => {
    if (Development().showBuildLogs()) {
      console.log(`PLAYBOOK BUILD | ${_buildName}`);
    }
  };

  const updateAudio = (audio: HTMLAudioElement | null, activeFrameIndex: number) => {
    logBuild('updateAudio');
    playBook.addToPlayBook(
      () => {
        audio = AudioHelper(threeService).setAudioTrack(activeStory, activeFrameIndex);
        if (audio != null) audio.play();
      },
      useFrame(threeService).getLastAssetRelationMetadata(activeStory, activeFrameIndex)
        .timestamp_end,
      'Set audio track',
    );
  };

  const storyCircle = async (
    currentFrameIndex: number,
    storyColor: number,
    canAddToSCene: boolean,
  ) => {
    logBuild('storyCircle');
    await useStoryCircle(
      threeService,
      taggingService,
      storyService,
      activeStory,
      playBook,
    ).create(
      new Vector3(
        zoneService.middleZoneCenter.x,
        zoneService.middleZoneCenter.y,
        Layers.scene + Layers.fraction,
      ),
      storyColor,
      currentFrameIndex,
      activeStory.frames?.length as number,
      playBook.lastAction().time,
      canAddToSCene,
    );
  };

  const frameOverview = async (
    currentFrameIndex: number,
    storyColor: number,
    garbageHelper: GarabageHelperForWall,
  ) => {
    logBuild('frameOverview');
    await useFrameAssetOverview(
      threeService,
      zoneService,
      activeStory,
      playBook,
      spotlight,
      garbageHelper,
    ).create(currentFrameIndex, storyColor, playBook.lastAction().time);
  };

  const progressOfFrame = (
    frameIndex: number,
    color: number,
    currentTime: number,
    audioDuration: number,
    progressbar: Array<Group>,
  ) => {
    logBuild('progressOfFrame');
    const assetsWithTimestampStart = useFrame(
      threeService,
    ).getStartTimestampsWithTheirAsset(
      activeStory.frames?.[frameIndex] as unknown as Frame,
    );
    taggingService.removeAllTagsFrom(Tags.FrameProgressbar);
    threeService.RemoveGroupsFromScene(progressbar);
    progressbar = HorizontalProgressBar().create(
      new Vector3(0, -450, Layers.scene),
      Object.values(assetsWithTimestampStart),
      audioDuration,
      currentTime,
      color,
    );
    threeService.AddGroupsToScene(
      progressbar,
      Tags.FrameProgressbar,
      'Horizontal progressbar of frame.',
    );
    return progressbar;
  };

  const initialSpotLight = () => {
    logBuild('initialSpotLight');
    const spotlight = Spot().create(
      zoneService.middleZoneCenter,
      Measurements().storyCircle.radius,
    );
    threeService.AddToScene(spotlight, Tags.Spotlight, 'InitialSpotlight');
    return spotlight;
  };

  const endOfSession = async () => {
    logBuild('endOfSession');
    await CustomAnimation().grow(
      spotlight as Mesh<any, MeshBasicMaterial>,
      Measurements().spotLight.radius,
      AnimationDefaults.values.scaleStep,
    );
    await MoveObject().startMoving(
      spotlight,
      new Vector3(
        zoneService.middleZoneCenter.x,
        zoneService.middleZoneCenter.y - 1,
        zoneService.middleZoneCenter.z,
      ),
    );
    return useEndOfSession(threeService, zoneService).create();
  };

  const storyPaused = async () => {
    logBuild('storyPaused');
    const assetsOnScreen = taggingService.getByTag(Tags.GroupOfAssets)[0].object as Group;
    assetsOnScreen.position.setZ(Layers.background);
    CustomAnimation().grow(
      spotlight as Mesh<any, MeshBasicMaterial>,
      Measurements().pauseScreen.spotLightRadius,
      AnimationDefaults.values.scaleStep,
    );
    const inactiveStories = storyService.getDataOfInactiveStories();
    MoveHelper(taggingService).activeStoryCircle(
      new Vector3(
        storyService.activeStoryData.pausedPosition.x,
        -(zoneService.sceneZone().height / 2) + Measurements().pauseScreen.bannerHeight,
        storyService.activeStoryData.pausedPosition.z,
      ),
      storyService.activeStoryData,
    );
    await SceneHelper(threeService, storyService).addPauseScreenObjectsToScene(
      await StoryPaused(taggingService, zoneService, storyService).Create(
        inactiveStories,
      ),
      zoneService.sceneZone(),
    );
    await MoveObject().startMoving(spotlight, new Vector3(0, 0, spotlight.position.z));

    await CustomAnimation().fadeOut(
      taggingService.getByTag(Tags.ActiveStoryCircleShade)[0].object,
      -1,
      AnimationDefaults.values.fadeStep,
    );
    taggingService.removeAllTagsFrom(Tags.ActiveStoryCircleShade);
    TaggingHelper(taggingService).tagActiveStorycircleAsStoryCircle();
  };

  const storyPausedWithNoActiveStory = async () => {
    logBuild('storyPausedWithNoActiveStory');
    CustomAnimation().grow(
      spotlight as Mesh<any, MeshBasicMaterial>,
      Measurements().pauseScreen.spotLightRadius,
      AnimationDefaults.values.scaleStep,
    );
    await SceneHelper(threeService, storyService).addPauseScreenObjectsToScene(
      await StoryPaused(taggingService, zoneService, storyService).Create(
        storyService.getStoryData(),
      ),
      zoneService.sceneZone(),
    );
    await MoveObject().startMoving(
      spotlight,
      new Vector3(
        0.01,
        -(zoneService.sceneZone().height / 2) + Measurements().pauseScreen.bannerHeight,
        Layers.scene,
      ),
    );
  };

  const storyData = async (
    storyService: StoryService,
    activeStory: Entity,
    frameIndex: number,
  ) => {
    logBuild('storyData');
    let storyData = null;
    if (activeStory.frames && activeStory.frames[frameIndex]) {
      storyData = await storyService.updateSeenFramesOfStory(
        activeStory.id,
        activeStory.frames[frameIndex] as unknown as Frame,
      );
    }
    return storyData;
  };

  const startOfSession = async () => {
    logBuild('startOfSession');
    return await useStartOfSession(threeService, zoneService, spotlight).create();
  };

  const setSelectedStory = async () => {
    logBuild('setSelectedStory');
    spotlight.position.set(
      spotlight.position.x - 0.01,
      spotlight.position.y,
      spotlight.position.z,
    );
    TaggingHelper(taggingService).tagStorycircleAsActiveStoryCircle(
      storyService.activeStoryData.storyId,
    );
    await CustomAnimation().shrink(
      spotlight as Mesh<any, MeshBasicMaterial>,
      Measurements().storyCircle.radius,
      AnimationDefaults.values.scaleStep,
    );
    await MoveObject().startMoving(spotlight, zoneService.middleZoneCenter);
    threeService.AddToScene(
      StoryCircle(storyService).shadedCircle({
        position: new Vector3(
          storyService.activeStoryData.pausedPosition.x,
          -(zoneService.sceneZone().height / 2) + Measurements().pauseScreen.bannerHeight,
          Layers.scene + Layers.fraction,
        ),
        params: { color: storyService.activeStoryData.storyColor } as CircleParams,
      } as CircleSchema),
      Tags.ActiveStoryCircleShade,
    );
    await MoveHelper(taggingService).activeStoryCircle(
      zoneService.middleZoneCenter,
      storyService.activeStoryData,
    );
    WallGarbageHelper(threeService, taggingService).removeActiveFrameDots();
  };

  return {
    updateAudio,
    storyCircle,
    frameOverview,
    progressOfFrame,
    initialSpotLight,
    endOfSession,
    storyPaused,
    storyPausedWithNoActiveStory,
    storyData,
    startOfSession,
    setSelectedStory,
  };
};

export default PlayBookBuild;
