import useFrame from '@/composables/useFrame';
import { PlayBookFunctions } from '@/composables/playbook';
import { Story } from '@/models/GraphqlModel';
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
import Common from '@/composables/common';
import WallGarbageHelper, { GarabageHelperForWall } from './helper.wall.garbage';
import TaggingHelper from './helper.tagging';
import MoveHelper from './helper.move';
import SceneHelper from './helper.scene';
import StoryCircle from './section.storyCircle';
import { CircleParams, CircleSchema } from './schema.circle';

const PlayBookBuild = (
  threeService: ThreeService,
  storyService: StoryService,
  zoneService: ZoneService,
  taggingService: TaggingService,
  playBook: PlayBookFunctions,
  spotlight: Mesh,
  activeStoryData: Story,
): {
  updateAudio: (
    audio: HTMLAudioElement,
    activeFrameIndex: number,
    backupAudioFile: string,
  ) => void;
  storyCircle: (currentFrameIndex: number, storyColor: number, canAddToSCene: boolean) => void;
  frameOverview: (
    currentFrameIndex: number,
    storyColor: number,
    garbageHelper: GarabageHelperForWall,
  ) => void;
  progressOfFrame: (frameIndex: number, color: number, currentTime: number, audioDuration: number, progressbar: Array<Group>) => Array<Group>;
  initialSpotLight: () => Mesh;
  endOfSession: (spotRadius: number) => Promise<boolean>;
  storyPaused: (taggingService: TaggingService) => Promise<void>;
  storyData: (
    storyService: StoryService,
    activeStoryData: Story,
    frameIndex: number,
  ) => {
    storyData: Array<StoryData>;
    endOfSession: true | false;
  };
  startOfSession: () => Promise<true | false>;
  setSelectedStory: () => Promise<void>;
} => {
  const updateAudio = (
    audio: HTMLAudioElement,
    activeFrameIndex: number,
  ) => {
    playBook.addToPlayBook(
      () => {
        audio = AudioHelper(threeService).setAudioTrack(
          activeStoryData,
          activeFrameIndex,
        );
        audio.play();
      },
      useFrame(threeService).getLastAssetRelationMetadata(activeStoryData, activeFrameIndex)
        .timestamp_end,
      'Set audio track',
    );
  };

  const storyCircle = (currentFrameIndex: number, storyColor: number, canAddToSCene: boolean) => {
    useStoryCircle(threeService, taggingService, storyService, activeStoryData, playBook).create(
      new Vector3(zoneService.middleZoneCenter.x, zoneService.middleZoneCenter.y, Layers.scene + Layers.fraction),
      storyColor,
      currentFrameIndex,
      activeStoryData.frames.length,
      playBook.lastAction().time,
      canAddToSCene,
    );
  };

  const frameOverview = (
    currentFrameIndex: number,
    storyColor: number,
    garbageHelper: GarabageHelperForWall,
  ) => {
    useFrameAssetOverview(
      threeService,
      zoneService,
      activeStoryData,
      playBook,
      spotlight,
      garbageHelper,
    ).create(
      currentFrameIndex,
      storyColor,
      playBook.lastAction().time,
    );
  };

  const progressOfFrame = (frameIndex: number, color: number, currentTime: number, audioDuration: number, progressbar: Array<Group>) => {
    const assetsWithTimestampStart = useFrame(threeService).getStartTimestampsWithTheirAsset(
      activeStoryData.frames[frameIndex],
    );
    taggingService.removeAllTagsFrom(Tags.FrameProgressbar);
    threeService.RemoveGroupsFromScene(progressbar);
    progressbar = HorizontalProgressBar().create(
      new Vector3(0, -7, Layers.scene),
      Object.values(assetsWithTimestampStart),
      audioDuration,
      currentTime,
      color,
    );
    threeService.AddGroupsToScene(progressbar, Tags.FrameProgressbar, 'Horizontal progressbar of frame.');
    return progressbar;
  }

  const initialSpotLight = () => {
    const spotlight = Spot().create(
      zoneService.middleZoneCenter,
      Measurements().storyCircle.radius,
    );
    threeService.AddToScene(spotlight, Tags.Spotlight, 'InitialSpotlight');
    return spotlight;
  };

  const endOfSession = async (spotRadius: number) => {
    await MoveObject().startMoving(spotlight, new Vector3(0, 0, Layers.scene));
    return useEndOfSession(threeService, zoneService).create(spotRadius);
  };

  const storyPaused = async (taggingService: TaggingService) => {
    const assetsOnScreen = taggingService.getByTag(Tags.GroupOfAssets)[0].object as Group;
    assetsOnScreen.position.setZ(Layers.background);
    CustomAnimation().grow(spotlight as Mesh<any, MeshBasicMaterial>, Measurements().pauseScreen.spotLightRadius, AnimationDefaults.values.scaleStep);
    const inactiveStories = storyService.getDataOfInactiveStories();
    MoveHelper(taggingService).activeStoryCircle(
      new Vector3(
        storyService.activeStoryData.pausedPosition.x,
        -(zoneService.sceneZone().height / 2) + Measurements().pauseScreen.bannerHeight,
        Layers.scene + Layers.fraction)
    );
    await SceneHelper(threeService, storyService).addPauseScreenObjectsToScene(StoryPaused(taggingService, zoneService, storyService).Create(inactiveStories), zoneService.sceneZone());
    await MoveObject().startMoving(spotlight, new Vector3(0.01, -(zoneService.sceneZone().height / 2) + Measurements().pauseScreen.bannerHeight, Layers.scene));

    await CustomAnimation().fadeOut(taggingService.getByTag(Tags.ActiveStoryCircleShade)[0].object, -1, AnimationDefaults.values.fadeStep);
    taggingService.removeAllTagsFrom(Tags.ActiveStoryCircleShade);
    TaggingHelper(taggingService).tagActiveStorycircleAsStoryCircle();
  };

  const storyData = (
    storyService: StoryService,
    activeStoryData: Story,
    frameIndex: number,
  ) => {
    const storyData = storyService.updateSeenFramesOfStory(
      activeStoryData.id,
      activeStoryData.frames[frameIndex],
    );
    return {
      storyData: storyData,
      endOfSession: storyService.isEndOfSession(),
    };
  };

  const startOfSession = async () => {
    return await useStartOfSession(threeService, zoneService, spotlight).create();
  };

  const setSelectedStory = async () => {
    spotlight.position.set(spotlight.position.x - 0.01, spotlight.position.y, spotlight.position.z)
    TaggingHelper(taggingService).tagStorycircleAsActiveStoryCircle(storyService.activeStoryData.storyId);
    console.log('taggedobjects after selected new active story', taggingService.taggedObjects);
    await CustomAnimation().shrink(spotlight as Mesh<any, MeshBasicMaterial>, Measurements().storyCircle.radius, AnimationDefaults.values.scaleStep);
    await MoveObject().startMoving(spotlight, zoneService.middleZoneCenter);
    threeService.AddToScene(StoryCircle(storyService).shadedCircle(
      {
        position: new Vector3(
          storyService.activeStoryData.pausedPosition.x,
          -(zoneService.sceneZone().height / 2) + Measurements().pauseScreen.bannerHeight,
          Layers.scene + Layers.fraction), params: { color: storyService.activeStoryData.storyColor } as CircleParams
      } as CircleSchema), Tags.ActiveStoryCircleShade);
    MoveHelper(taggingService).activeStoryCircle(zoneService.middleZoneCenter);
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
    storyData,
    startOfSession,
    setSelectedStory,
  };
};

export default PlayBookBuild;
