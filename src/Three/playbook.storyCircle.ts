import { PlayBookFunctions } from '@/composables/playbook';
import useStory from '@/composables/useStory';
import { Story } from '@/models/GraphqlModel';
import ThreeService from '@/services/ThreeService';
import { Group, Vector3 } from 'three';
import CircleHelper from './helper.circle';
import { CircleSchema } from './schema.circle';
import CircularProgressBar from './shapes.circularProgressbar';
import Colors from './defaults.color';
import Layers from './defaults.layers';
import Measurements from './defaults.measurements';
import GroupHelper from './helper.group';
import DefaultLines from './defaults.lines';
import StoryCircle from './section.storyCircle';
import StoryCircleItems from './section.storyCircleItems';
import { Tags } from '@/services/TaggingService';
import Images from './defaults.images';
import StoryService from '@/services/StoryService';

const useStoryCircle = (
  threeService: ThreeService,
  _storyService: StoryService,
  activeStoryData: Story,
  playBook: PlayBookFunctions,
): {
  create: (
    position: Vector3,
    storyColor: number,
    currentFrame: number,
    frames: number,
    timestamp: number,
    canAddToSCene: boolean,
  ) => void;
} => {
  const titleCircle = (position: Vector3, storyColor: number, currentFrame: number) => {
    return StoryCircle().Create(
      useStory(_storyService).title(activeStoryData),
      CircleHelper().CreateSchema(
        position,
        Measurements().storyCircle.radius,
        storyColor,
      ),
      [currentFrame, activeStoryData.frames.length],
      Images.story.defaultIcon,
      true,
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
      DefaultLines().line3(progressBar.dotSchemas[currentFrame].position),
      useStory(_storyService).setFrameTitles(activeStoryData)[currentFrame],
    );

    const progressOfFrame = StoryCircle().progressText(
      [currentFrame + 1, activeStoryData.frames.length],
      new Vector3(
        activeFrameLine.endOfLine.x,
        activeFrameLine.endOfLine.y + 0.8,
        Layers.scene,
      ),
      Colors().white,
    );

    return GroupHelper().CreateGroup([activeFrameLine.object, progressOfFrame]);
  };

  const create = (
    position: Vector3,
    storyColor: number,
    currentFrame: number,
    frames: number,
    timestamp: number,
    canAddToSCene: boolean,
  ) => {
    if (canAddToSCene) {
      const progressBar = CircularProgressBar().createActiveSegment(
        new Vector3(0, 0, position.z),
        Measurements().progressBar.radius,
        frames,
        currentFrame + 1,
        storyColor,
      );

      playBook.addToPlayBook(
        () => {
          threeService.AddGroupsToScene(
            titleCircle(position, storyColor, currentFrame + 1),
            Tags.ActiveStoryCircle,
            'The title circle of a storycircle.',
          );
          threeService.AddGroupsToScene(
            progressBar.object,
            Tags.CircularProgressBar,
            'Circular progressbar for current frame.',
          );
        },
        timestamp,
        `Add title cirle with progressbar to the scene.`,
      );
      //DEMO: Removed frame title for demo
      // playBook.addToPlayBook(
      //   () => {
      //     threeService.AddToScene(
      //       frameLineWithTitle(currentFrame, progressBar),
      //       Tags.FrameTitle,
      //       'Active frame title.',
      //     );
      //   },
      //   timestamp + Timing.storyCircle.showFrameTitle,
      //   `Add the frame title to the scene.`,
      // );
    }
    threeService.state.scene.updateMatrixWorld(true);
  };

  return {
    create,
  };
};

export default useStoryCircle;
