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
import useStory from '@/composables/useStory';
import StoryPaused from '@/screens/StoryPaused';
import useStartOfSession from './playbook.startOfSession';
import useEndOfSession from './playbook.endOfSession';
import HorizontalProgressBar from './shapes.horizontalProgressBar';
import ZoneService from '@/services/ZoneService';
import TaggingService, { Tags } from '@/services/TaggingService';
import CustomAnimation from '@/composables/animation';
import AnimationDefaults from './defaults.animation';
import Common from '@/composables/common';
import { GarabageHelperForWall } from './helper.wall.garbage';
import TaggingHelper from './helper.tagging';

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
  storyPaused: (storyData: Array<Story>, taggingService: TaggingService) => Promise<void>;
  storyData: (
    storyService: StoryService,
    activeStoryData: Story,
    frameIndex: number,
  ) => {
    storyData: Array<StoryData>;
    endOfSession: true | false;
  };
  startOfSession: () => Promise<true | false>;
  setSelectedStory: (currentStory: number) => void;
} => {
  const updateAudio = (
    audio: HTMLAudioElement,
    activeFrameIndex: number,
    backupAudioFile: string,
  ) => {
    playBook.addToPlayBook(
      () => {
        audio = AudioHelper(threeService).setAudioTrack(
          activeStoryData,
          activeFrameIndex,
          backupAudioFile,
        );
        audio.play();
      },
      useFrame(threeService).getLastAssetRelationMetadata(activeStoryData, activeFrameIndex)
        .timestamp_end,
      'Set audio track',
    );
  };

  const storyCircle = (currentFrameIndex: number, storyColor: number, canAddToSCene: boolean) => {
    useStoryCircle(threeService, storyService, activeStoryData, playBook).create(
      zoneService.middleZoneCenter,
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
      new Vector3(zoneService.middleZoneCenter.x, zoneService.middleZoneCenter.y, Layers.scene),
      Measurements().storyCircle.outerCircle,
    );
    threeService.AddToScene(spotlight, Tags.Spotlight, 'InitialSpotlight');
    return spotlight;
  };

  const endOfSession = (spotRadius: number) => {
    MoveObject().startMoving(spotlight, new Vector3(0, 0, Layers.scene));
    return useEndOfSession(threeService, zoneService).create(spotRadius);
  };

  const storyPaused = async (storyData: Array<Story>, taggingService: TaggingService) => {
    const assetsOnScreen = taggingService.getByTag(Tags.GroupOfAssets)[0].object as Group;
    assetsOnScreen.position.setZ(Layers.background);
    Common().setScale(spotlight, Measurements().pauseScreen.spotLightRadius);
    MoveObject().startMoving(spotlight, new Vector3(0, -(zoneService.sceneZone().height / 2) + Measurements().pauseScreen.bannerHeight, Layers.scene));
    const inactiveStories = storyService.getDataOfInactiveStories();
    // console.log('storycircle groups',TaggingHelper(taggingService).activeStoryCircle());
    
    // const activeStoryCircle = taggingService.getByTag(Tags.ActiveStoryCircle)[0].object as Array<Group>;
    // const activeStoryCircleProgressbar = taggingService.getByTag(Tags.CircularProgressBar)[0].object as Array<Group>;
    // console.log({activeStoryCircle});
    MoveObject().moveGroups(taggingService.getByTag(Tags.ActiveStoryCircleFull)[0].object, new Vector3(storyService.activeStoryData.pausedPosition.x, -(zoneService.sceneZone().height / 2) + Measurements().pauseScreen.bannerHeight, Layers.scene + Layers.fraction));
    MoveObject().startMoving(taggingService.getByTag(Tags.ActiveStoryCircleText)[0].object, new Vector3(storyService.activeStoryData.pausedPosition.x, -(zoneService.sceneZone().height / 2) + Measurements().pauseScreen.bannerHeight, Layers.scene + Layers.fraction));
    // MoveObject().moveGroups(TaggingHelper(taggingService).activeStoryCircle(), new Vector3(storyService.activeStoryData.pausedPosition.x, -(zoneService.sceneZone().height / 2) + Measurements().pauseScreen.bannerHeight, Layers.scene + Layers.fraction));
    // MoveObject().moveGroups(activeStoryCircleProgressbar, new Vector3(storyService.activeStoryData.pausedPosition.x, -(zoneService.sceneZone().height / 2) + Measurements().pauseScreen.bannerHeight,Layers.scene + Layers.fraction));

    threeService.AddGroupsToScene(
      StoryPaused(taggingService, zoneService, storyService).Create(inactiveStories), Tags.Stories, 'All incative stories when session is paused.'
    );
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

  const setSelectedStory = (currentStory: number) => {
    const storyCircles = taggingService.getByTag(Tags.StoryCircle);

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
