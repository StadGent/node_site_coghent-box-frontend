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

const PlayBookBuild = (
  threeService: ThreeService,
  storyService: StoryService,
  zoneService: ZoneService,
  playBook: PlayBookFunctions,
  spotlight: Mesh,
  activeStoryData: Story,
): {
  updateAudio: (
    audio: HTMLAudioElement,
    activeFrameIndex: number,
    backupAudioFile: string,
  ) => void;
  storyCircle: (currentFrameIndex: number, storyColor: number) => void;
  frameOverview: (
    currentFrameIndex: number,
    storyColor: number,
  ) => void;
  progressOfFrame: (frameIndex:number, color: number, currentTime: number, audioDuration: number, progressbar: Array<Group>) => Array<Group>;
  initialSpotLight: () => Mesh;
  endOfSession: (spotRadius: number) => Promise<boolean>;
  storyPaused: (storyData: Array<Story>) => Promise<void>;
  storyData: (
    storyService: StoryService,
    activeStoryData: Story,
    frameIndex: number,
  ) => {
    storyData: Array<StoryData>;
    endOfSession: true | false;
  };
  startOfSession: () => Promise<true | false>;
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

  const storyCircle = (currentFrameIndex: number, storyColor: number) => {
    useStoryCircle(threeService, activeStoryData, playBook).create(
      zoneService.middleZoneCenter,
      storyColor,
      currentFrameIndex,
      activeStoryData.frames.length,
      playBook.lastAction().time,
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

  const progressOfFrame = (frameIndex:number, color: number, currentTime: number, audioDuration: number, progressbar: Array<Group>) => {
    const assetsWithTimestampStart = useFrame().getStartTimestampsWithTheirAsset(
      activeStoryData.frames[frameIndex],
    );
    threeService.RemoveGroupsFromScene(progressbar);
    progressbar = HorizontalProgressBar().create(
      new Vector3(0, -7, Layers.scene),
      Object.values(assetsWithTimestampStart),
      audioDuration,
      currentTime,
      color,
    );
    threeService.AddGroupsToScene(progressbar);
    return progressbar;
  }

  const initialSpotLight = () => {
    const spotlight = Spot().create(
      new Vector3(zoneService.middleZoneCenter.x, zoneService.middleZoneCenter.y, Layers.scene),
      Measurements().spotLight.radius,
    );
    threeService.AddToScene(spotlight, 'spotlight', 'initialSpotlight');
    return spotlight;
  };

  const endOfSession = (spotRadius: number) => {
    return useEndOfSession(threeService, zoneService).create(spotRadius);
  };

  const storyPaused = async (storyData: Array<Story>) => {
    const storiesWithTheirProgress = useStory().getStoriesWithTheirProgress(
      storyData,
      storyService.getStoryData(),
    );
    threeService.AddGroupsToScene(
      StoryPaused(storyData).Create(storiesWithTheirProgress),
    );
    await MoveObject().startMoving(spotlight, new Vector3(0, 2.5, Layers.scene));
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
    return useStartOfSession(threeService, zoneService,spotlight).create();
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
  };
};

export default PlayBookBuild;
