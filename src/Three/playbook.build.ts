import useFrame from '@/composables/useFrame';
import { PlayBookFunctions } from '@/composables/playbook';
import { Story } from '@/models/GraphqlModel';
import ThreeService from '@/services/ThreeService';
import { Vector3 } from 'three';
import AudioHelper from './AudioHelper';
import Layers from './defaults.layers';
import Timing from './defaults.timing';
import { SpotlightFunctions } from './Spotlight';
import useFrameAssetOverview from './useFrameAssetOverview.playbook';
import useStoryCircle from './useStoryCircle.playbook';
import EndOfSession from '@/screens/EndOfSession';

const PlayBookBuild = (
  threeService: ThreeService,
  playBook: PlayBookFunctions,
  activeStoryData: Story,
): {
  updateAudio: (
    audio: HTMLAudioElement,
    activeFrameIndex: number,
    backupAudioFile: string,
  ) => void;
  storyCircle: (currentFrameIndex: number, storyColor: number) => void;
  frameOverview: (currentFrameIndex: number, storyColor: number, spot: SpotlightFunctions) => void;
  initialSpotLight: (spot: SpotlightFunctions) => void;
  endOfSession: (position: Vector3, spotRadius?: number) => void;
} => {
  const updateAudio = (
    audio: HTMLAudioElement,
    activeFrameIndex: number,
    backupAudioFile: string,
  ) => {
    playBook.addToPlayBook(() => {
      // if (audio && !audio.paused) {
      //   console.log(audio.paused)
      //   audio.pause();
      // }
      audio = AudioHelper().setAudioTrack(
        activeStoryData,
        activeFrameIndex,
        backupAudioFile,
      );
      audio.play();
    }, useFrame().getLastAssetRelationMetadata(activeStoryData, activeFrameIndex).timestamp_end);
  };

  const storyCircle = (currentFrameIndex: number, storyColor: number) => {
    console.log(`alert creating storyCircle`);
    useStoryCircle(threeService, activeStoryData, playBook).create(
      new Vector3(0, 0, 0),
      storyColor,
      currentFrameIndex,
      activeStoryData.frames.length,
      playBook.lastAction().time + Timing.delayNextCycle,
    );
  };

  const frameOverview = (currentFrameIndex: number, storyColor: number, spot: SpotlightFunctions) => {
    useFrameAssetOverview(threeService, activeStoryData, playBook, spot).create(
      currentFrameIndex,
      storyColor,
      playBook.lastAction().time + Timing.delayNextCycle,
    );
  };

  const initialSpotLight = (spot: SpotlightFunctions) => {
    spot.create(new Vector3(0, 0, Layers.scene), 6);
    playBook.addToPlayBook(() => threeService.AddToScene(spot.SpotLight()), 0, `Add initial spotLight to the scene`);
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
    endOfSession
  };
};

export default PlayBookBuild;

