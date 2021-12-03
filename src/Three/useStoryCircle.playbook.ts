import { PlayBookFunctions } from '@/composables/playbook';
import useStory from '@/composables/useStory';
import { Story } from '@/models/GraphqlModel';
import ThreeService from '@/services/ThreeService';
import { Color, Group, Vector3 } from 'three';
import CircleHelper from './CircleHelper';
import { CircleSchema } from './CircleSchema';
import CircularProgressBar from './CircularProgressbar';
import Colors from './defaults.color';
import Layers from './defaults.layers';
import Timing from './defaults.timing';
import GroupHelper from './GroupHelper';
import DefaultLines from './LinesDefault';
import StoryCircle from './SectionStoryCircle';
import StoryCircleItems from './SectionStoryCircleItems';

const useStoryCircle = (
  threeService: ThreeService,
  activeStoryData: Story,
  playBook: PlayBookFunctions,
): {
  create: (position: Vector3, storyColor: number, currentFrame: number, frames: number, timestamp: number) => void;
} => {
  const titleCircle = (position: Vector3, storyColor: number, currentFrame: number) => {
    return StoryCircle().Create(
      useStory().title(activeStoryData),
      CircleHelper().CreateSchema(position, 2, storyColor),
      [currentFrame, activeStoryData.frames.length],
      'https://cdn-icons-png.flaticon.com/512/844/844994.png',
      true,
      true
    );
  };
  
  const frameLineWithTitle = (
    currentFrame: number,
    progressBar: {
      object: Group[];
      dotSchemas: CircleSchema[];
    },
  ) => {
    const activeFrameLine = StoryCircleItems().CreateDashedLineWithWord(
      DefaultLines().line3(progressBar.dotSchemas[currentFrame].position),
      useStory().setFrameTitles(activeStoryData)[currentFrame],
    );

    const progressOfFrame = StoryCircle().progressText(
      [currentFrame + 1, activeStoryData.frames.length],
      new Vector3(
        activeFrameLine.endOfLine.x,
        activeFrameLine.endOfLine.y + 0.8,
        Layers.presentation,
      ),
      Colors().white,
    );

    return GroupHelper().CreateGroup([activeFrameLine.object, progressOfFrame]);
  };

  const create = (position: Vector3, storyColor: number, currentFrame: number, frames: number, timestamp: number) => {
    threeService.state.scene.background = new Color(Colors().black);
    playBook.addToPlayBook(() => threeService.ClearScene(), timestamp - Timing.storyCircle.clearScene);

    const progressBar = CircularProgressBar().createActiveSegment(
      new Vector3(0, 0, 0),
      2.5,
      frames,
      currentFrame +1,
      storyColor,
    );

    playBook.addToPlayBook(() => {
      threeService.AddGroupsToScene(titleCircle(position, storyColor, currentFrame + 1));
      threeService.AddGroupsToScene(progressBar.object);
    }, timestamp);
    playBook.addToPlayBook(() => {
      threeService.AddToScene(frameLineWithTitle(currentFrame, progressBar));
    }, timestamp + Timing.storyCircle.showFrameTitle);
    threeService.state.scene.updateMatrixWorld(true);
  };

  return {
    create,
  };
};

export default useStoryCircle;
