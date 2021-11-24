import PlayBook from '@/composables/playbook';
import useStory from '@/composables/useStory';
import { Story } from '@/models/GraphqlModel';
import ThreeService from '@/services/ThreeService';
import { Color, Group, Vector3 } from 'three';
import CircleHelper from './CircleHelper';
import { CircleSchema } from './CircleSchema';
import CircularProgressBar from './CircularProgressbar';
import Colors from './defaults.color';
import Layers from './defaults.layers';
import GroupHelper from './GroupHelper';
import DefaultLines from './LinesDefault';
import StoryCircle from './SectionStoryCircle';
import StoryCircleItems from './SectionStoryCircleItems';

const useStoryCircle = (
  threeService: ThreeService,
  activeStoryData: Story,
  playBook: any,
): {
  create: (position: Vector3, storyColor: number, currentFrame: number) => void;
} => {
  const titleCircle = (position: Vector3, storyColor: number, currentFrame: number) => {
    return StoryCircle().Create(
      useStory().title(activeStoryData),
      CircleHelper().CreateSchema(position, 2, storyColor),
      [currentFrame, activeStoryData.frames.length],
      'https://cdn-icons-png.flaticon.com/512/844/844994.png',
      true,
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
      DefaultLines().line3(progressBar.dotSchemas[currentFrame - 1].position),
      useStory().setFrameTitles(activeStoryData)[currentFrame - 1],
    );

    const progressOfFrame = StoryCircle().progressText(
      [currentFrame, activeStoryData.frames.length],
      new Vector3(
        activeFrameLine.endOfLine.x,
        activeFrameLine.endOfLine.y + 0.8,
        Layers.presentation,
      ),
      Colors().white,
    );

    return GroupHelper().CreateGroup([activeFrameLine.object, progressOfFrame]);
  };

  const create = (position: Vector3, storyColor: number, currentFrame: number) => {
    threeService.state.scene.background = new Color(Colors().black);
    playBook.addToPlayBook(() => threeService.ClearScene());

    const progressBar = CircularProgressBar().createActiveSegment(
      new Vector3(0, 0, 0),
      2.5,
      3,
      currentFrame - 1,
      storyColor,
    );

    playBook.addToPlayBook(() => {
      threeService.AddGroupsToScene(titleCircle(position, storyColor, currentFrame));
      threeService.AddGroupsToScene(progressBar.object);
      threeService.AddToScene(frameLineWithTitle(currentFrame, progressBar));
    });
    threeService.state.scene.updateMatrixWorld(true);
  };

  return {
    create,
  };
};

export default useStoryCircle;
