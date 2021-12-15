import useFrame from '@/composables/useFrame';
import { PlayBookFunctions } from '@/composables/playbook';
import { Story } from '@/models/GraphqlModel';
import ThreeService from '@/services/ThreeService';
import { Mesh, Vector3 } from 'three';
import AudioHelper from './AudioHelper';
import Layers from './defaults.layers';
import Timing from './defaults.timing';
import Spot from './Spotlight';
import useFrameAssetOverview from './useFrameAssetOverview.playbook';
import useStoryCircle from './useStoryCircle.playbook';
import EndOfSession from '@/screens/EndOfSession';
import Measurements from './defaults.measurements';

const PlayBookBuild = (
  threeService: ThreeService,
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
  frameOverview: (currentFrameIndex: number, storyColor: number) => void;
  initialSpotLight: () => Mesh;
  endOfSession: (position: Vector3, spotRadius?: number) => void;
} => {
  const updateAudio = (
    audio: HTMLAudioElement,
    activeFrameIndex: number,
    backupAudioFile: string,
  ) => {
    playBook.addToPlayBook(() => {
      audio = AudioHelper().setAudioTrack(
        activeStoryData,
        activeFrameIndex,
        backupAudioFile,
      );
      audio.play();
    }, useFrame().getLastAssetRelationMetadata(activeStoryData, activeFrameIndex).timestamp_end, 'Set audio track');
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

  const frameOverview = (currentFrameIndex: number, storyColor: number) => {
    useFrameAssetOverview(threeService, activeStoryData, playBook, spotlight).create(
      currentFrameIndex,
      storyColor,
      playBook.lastAction().time + Timing.delayNextCycle,
    );
  };

  const initialSpotLight = () => {
    const spotlight = Spot().create(new Vector3(0, 0, Layers.scene), Measurements().spotLight.radius);
    playBook.addToPlayBook(() => threeService.AddToScene(spotlight), 0, `Add initial spotLight to the scene`);
    threeService.AddToScene(spotlight);
    return spotlight;
  };

  const endOfSession =(position: Vector3, spotRadius?: number) => {
    playBook.addToPlayBook(
      () => {
        threeService.ClearScene();
        threeService.AddGroupsToScene(EndOfSession(position, spotRadius).create());
      },
      playBook.lastAction().time + Timing.delayNextCycle,
      `Display story overview.`,
    );
  }

  return {
    updateAudio,
    storyCircle,
    frameOverview,
    initialSpotLight,
    endOfSession,
  };
};

export default PlayBookBuild;

