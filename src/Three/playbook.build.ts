import useFrame from '@/composables/useFrame';
import { PlayBookFunctions } from '@/composables/playbook';
import { Story } from '@/models/GraphqlModel';
import ThreeService from '@/services/ThreeService';
import { Mesh, Vector3 } from 'three';
import AudioHelper from './helper.audio';
import Layers from './defaults.layers';
import Timing from './defaults.timing';
import Spot from './shapes.spotlight';
import useFrameAssetOverview from './playbook.frameAssetOverview';
import useStoryCircle from './playbook.storyCircle';
import Measurements from './defaults.measurements';
import { Zone } from './helper.zones';
import StoryService, { StoryData } from '@/services/StoryService';
import MoveObject from '@/composables/moveObject';
import useStory from '@/composables/useStory';
import StoryPaused from '@/screens/StoryPaused';
import useStartOfSession from './playbook.startOfSession';
import useEndOfSession from './playbook.endOfSession';

const PlayBookBuild = (
  threeService: ThreeService,
  storyService: StoryService,
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
    zones: Array<Zone>,
    currentFrameIndex: number,
    storyColor: number,
    audioDuration: number,
  ) => void;
  initialSpotLight: () => Mesh;
  endOfSession: (position: Vector3, spotRadius: number) => Promise<boolean>;
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
      new Vector3(0, 0, 0),
      storyColor,
      currentFrameIndex,
      activeStoryData.frames.length,
      playBook.lastAction().time,
    );
  };

  const frameOverview = (
    zones: Array<Zone>,
    currentFrameIndex: number,
    storyColor: number,
    audioDuration: number,
  ) => {
    useFrameAssetOverview(
      threeService,
      activeStoryData,
      playBook,
      spotlight,
      zones,
    ).create(
      currentFrameIndex,
      storyColor,
      playBook.lastAction().time + Timing.delayNextCycle,
      audioDuration,
    );
  };

  const initialSpotLight = () => {
    const spotlight = Spot().create(
      new Vector3(0, 0, Layers.scene),
      Measurements().spotLight.radius,
    );
    threeService.AddToScene(spotlight);
    return spotlight;
  };

  const endOfSession = (position: Vector3, spotRadius: number) => {
    return useEndOfSession(threeService).create(position, spotRadius);
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
    return useStartOfSession(threeService, spotlight).create();
  };

  return {
    updateAudio,
    storyCircle,
    frameOverview,
    initialSpotLight,
    endOfSession,
    storyPaused,
    storyData,
    startOfSession,
  };
};

export default PlayBookBuild;
