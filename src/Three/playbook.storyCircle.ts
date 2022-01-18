import { PlayBookFunctions } from '@/composables/playbook';
import useStory from '@/composables/useStory';
import { Story } from '@/models/GraphqlModel';
import ThreeService from '@/services/ThreeService';
import { Vector3 } from 'three';
import CircleHelper from './helper.circle';
import Measurements from './defaults.measurements';
import StoryCircle from './section.storyCircle';
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
    return StoryCircle(_storyService).Create(
      useStory(_storyService).title(activeStoryData),
      CircleHelper().CreateSchema(
        position,
        Measurements().storyCircle.radius,
        storyColor,
      ),
      Images.story.defaultIcon,
    );
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
      const storyCircle = titleCircle(position, storyColor, currentFrame + 1);

      playBook.addToPlayBook(
        () => {
          threeService.AddToScene(
            storyCircle.text,
            Tags.ActiveStoryCircleText,
            'The text of a storycircle.',
          );
          threeService.AddGroupsToScene(
            storyCircle.frameDots,
            Tags.ActiveStoryCircleFrameDots,
            'The progress of the frames dots of a storycircle.',
          );
          threeService.AddToScene(
            storyCircle.progress,
            Tags.ActiveStoryCircleProgress,
            'The progress of a storycircle.',
          );
          threeService.AddToScene(
            storyCircle.shade,
            Tags.ActiveStoryCircleShade,
            'The shaded circle of a storycircle.',
          );
          threeService.AddToScene(
            storyCircle.basic,
            Tags.ActiveStoryCircleBasic,
            'The middle circle of the storycircle.',
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
