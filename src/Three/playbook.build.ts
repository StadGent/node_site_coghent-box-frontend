import useFrame from '@/composables/useFrame';
import { PlayBookFunctions } from '@/composables/playbook';
import { Story } from '@/models/GraphqlModel';
import ThreeService from '@/services/ThreeService';
import { Group, Mesh, Vector3 } from 'three';
import AudioHelper from './helper.audio';
import Layers from './defaults.layers';
import Timing from './defaults.timing';
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
        audio = AudioHelper().setAudioTrack(
          activeStoryData,
          activeFrameIndex,
          backupAudioFile,
        );
        audio.play();
      },
      useFrame().getLastAssetRelationMetadata(activeStoryData, activeFrameIndex)
        .timestamp_end,
      'Set audio track',
    );
  };

  const storyCircle = (currentFrameIndex: number, storyColor: number, canAddToSCene: boolean) => {
    useStoryCircle(threeService, activeStoryData, playBook).create(
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
  ) => {
    useFrameAssetOverview(
      threeService,
      zoneService,
      activeStoryData,
      playBook,
      spotlight,
    ).create(
      currentFrameIndex,
      storyColor,
      playBook.lastAction().time + Timing.delayNextCycle,
    );
  };

  const progressOfFrame = (frameIndex: number, color: number, currentTime: number, audioDuration: number, progressbar: Array<Group>) => {
    const assetsWithTimestampStart = useFrame().getStartTimestampsWithTheirAsset(
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
      Measurements().spotLight.radius,
    );
    threeService.AddToScene(spotlight, Tags.Spotlight, 'InitialSpotlight');
    return spotlight;
  };

  const endOfSession = (spotRadius: number) => {
    return useEndOfSession(threeService, zoneService).create(spotRadius);
  };

  const storyPaused = async (storyData: Array<Story>, taggingService: TaggingService) => {
    const storiesWithTheirProgress = useStory().getStoriesWithTheirProgress(
      storyData,
      storyService.getStoryData(),
    );
    threeService.AddGroupsToScene(
      StoryPaused(storyData, taggingService).Create(storiesWithTheirProgress), Tags.Stories, 'All stories when session is paused.'
    );
    await MoveObject().startMoving(spotlight, new Vector3(0, 0, Layers.background));
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

  const startOfSession = () => {
    return useStartOfSession(threeService, zoneService, spotlight).create();
  };

  const setSelectedStory = (currentStory: number) => {
    const storyCircles = taggingService.getByTag(Tags.StoryCircle);
    const selectedStoryCircle = storyCircles.filter(_object => _object.name == storyService.stories[currentStory].id)[0];
    const storyCircleToMove = storyCircles.filter(_object => _object.name != storyService.stories[currentStory].id);
    // FIXME: const endTexts = taggingService.getByTag(Tags.StoryEndText);
    // console.log({endTexts});
    // CustomAnimation().fadeOutGroups(endTexts[0].object, 0, AnimationDefaults.values.fadeStep)
    for (const _storyCircle of storyCircleToMove) {
      MoveObject().moveGroups(_storyCircle.object, new Vector3(0.01, 12, 1));
    }
    const storyDataOfSelectedStory = storyService.getStoryDataOfStory(storyService.stories[currentStory].id);
    MoveObject().moveGroups(selectedStoryCircle.object, new Vector3(-storyDataOfSelectedStory.pausedPosition.x, -storyDataOfSelectedStory.pausedPosition.y, -storyDataOfSelectedStory.pausedPosition.z));
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
