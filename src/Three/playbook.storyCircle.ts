import { PlayBookFunctions } from '@/composables/playbook';
import useStory from '@/composables/useStory';
import { Story } from '@/models/GraphqlModel';
import ThreeService from '@/services/ThreeService';
import { Color, Group, Vector3 } from 'three';
import CircleHelper from './helper.circle';
import { CircleSchema } from './schema.circle';
import CircularProgressBar from './shapes.circularProgressbar';
import Colors from './defaults.color';
import Layers from './defaults.layers';
import Measurements from './defaults.measurements';
import Timing from './defaults.timing';
import GroupHelper from './helper.group';
import DefaultLines from './defaults.lines';
import StoryCircle from './section.storyCircle';
import StoryCircleItems from './section.storyCircleItems';

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
      CircleHelper().CreateSchema(position, Measurements().storyCircle.radius, storyColor),
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
    playBook.addToPlayBook(() => threeService.ClearScene(), timestamp), `Clear scene for storyCircle`;

    const progressBar = CircularProgressBar().createActiveSegment(
      new Vector3(0, 0, 0),
      Measurements().progressBar.radius,
      frames,
      currentFrame + 1,
      storyColor,
    );

    playBook.addToPlayBook(() => {
      threeService.AddGroupsToScene(titleCircle(position, storyColor, currentFrame + 1));
      threeService.AddGroupsToScene(progressBar.object);
    }, timestamp, `Add title cirle with progressbar to the scene.`);
    playBook.addToPlayBook(() => {
      threeService.AddToScene(frameLineWithTitle(currentFrame, progressBar));
    }, timestamp + Timing.storyCircle.showFrameTitle, `Add the frame title to the scene.`);
    threeService.state.scene.updateMatrixWorld(true);
  };

  return {
    create,
  };
};

export default useStoryCircle;
