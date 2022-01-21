import { PlayBookFunctions } from '@/composables/playbook';
import useStory from '@/composables/useStory';
import { Story } from '@/models/GraphqlModel';
import ThreeService from '@/services/ThreeService';
import { Vector3 } from 'three';
import CircleHelper from './helper.circle';
import Measurements from './defaults.measurements';
import StoryCircle from './section.storyCircle';
import TaggingService, { Tags } from '@/services/TaggingService';
import Images from './defaults.images';
import StoryService from '@/services/StoryService';
import SceneHelper from './helper.scene';
import TaggingHelper from './helper.tagging';

const useStoryCircle = (
  threeService: ThreeService,
  _taggingService: TaggingService,
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
      _storyService.activeStoryData,
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
        async () => {
          await SceneHelper(threeService, _storyService).addStoryCircleToScene(_storyService.activeStoryData.storyId, storyCircle, true);
          TaggingHelper(_taggingService).tagStorycircleAsActiveStoryCircle(_storyService.activeStoryData.storyId);
        },
        timestamp,
        `Add full storyCircle to the scene.`,
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
