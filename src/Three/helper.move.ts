import MoveObject from '@/composables/moveObject';
import { StoryData } from '@/services/StoryService';
import TaggingService from '@/services/TaggingService';
import { Vector3 } from 'three';
import TaggingHelper from './helper.tagging';
import Template from './template.shapes';

const MoveHelper = (_taggingService: TaggingService): {
  activeStoryCircle: (_position: Vector3, _storyData: StoryData) => Promise<void>;
} => {

  const activeStoryCircle = async (_position: Vector3, _storyData: StoryData) => {
    const templateLayers = Template().storyCircleLayers(_position);
    const objects = TaggingHelper(_taggingService).getActiveStoryCircle();
    const storyCirclePositions = Template().storyCirclePositions(_position, _storyData.totalOfFrames);

    MoveObject().startMoving(objects.text, new Vector3(templateLayers.title.x - 1.5, templateLayers.title.y, templateLayers.title.z));
    MoveObject().startMoving(objects.basic, templateLayers.centerCircle);
    for (const _child of objects.progress.ring[0].children) {
      const index = objects.progress.ring[0].children.indexOf(_child);
      if (index != objects.progress.ring[0].children.length - 1) {
        MoveObject().startMoving(_child,
          new Vector3(
            storyCirclePositions.frameDots[index].x,
            storyCirclePositions.frameDots[index].y,
            _position.z));
      }
    }
    MoveObject().startMoving(
      objects.progress.ring[0].children[objects.progress.ring[0].children.length - 1],
      new Vector3(
        templateLayers.progressCircle.x,
        templateLayers.progressCircle.y,
        _position.z)
    );
    MoveObject().startMoving(objects.shade, templateLayers.shadedCircle);
    objects.progress.dots.forEach((_dot, index) => {
      MoveObject().startMoving(_dot.dot,
        new Vector3(
          storyCirclePositions.frameDots[index].x,
          storyCirclePositions.frameDots[index].y,
          _position.z)
      );
      if (_dot.innerDot) {
        MoveObject().startMoving(_dot.innerDot,
          new Vector3(
            storyCirclePositions.frameDots[index].x,
            storyCirclePositions.frameDots[index].y,
            _position.z)
        );
      }
    });
  };

  return { activeStoryCircle }
};

export default MoveHelper;