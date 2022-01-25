import MoveObject from '@/composables/moveObject';
import TaggingService from '@/services/TaggingService';
import { Vector3 } from 'three';
import Layers from './defaults.layers';
import Measurements from './defaults.measurements';
import TaggingHelper from './helper.tagging';
import Template from './template.shapes';

const MoveHelper = (_taggingService: TaggingService): {
  activeStoryCircle: (_position: Vector3) => void;
  activeStoryCircleWithoutShade: (_position: Vector3) => void;
} => {

  const activeStoryCircle = (_position: Vector3) => {
    const templateLayers = Template().storyCircleLayers(_position);
    const objects = TaggingHelper(_taggingService).getActiveStoryCircle();
    MoveObject().startMoving(objects.text, templateLayers.title);
    MoveObject().startMoving(objects.basic, templateLayers.centerCircle);
    MoveObject().moveGroups(objects.progress.ring, templateLayers.progressCircle);
    MoveObject().startMoving(objects.shade, templateLayers.shadedCircle);
    //FIXME: The dots are a little off..
    const storyCirclePositions = Template().storyCirclePositions(_position, objects.progress.dots.length);
    objects.progress.dots.forEach((_dot, index) => {
      MoveObject().startMoving(_dot.dot, storyCirclePositions.frameDots[index]);
      if (_dot.innerDot) {
        MoveObject().startMoving(_dot.innerDot, storyCirclePositions.frameDots[index])
      }
    });
  };
  const activeStoryCircleWithoutShade = (_position: Vector3) => {
    const templateLayers = Template().storyCircleLayers(_position);
    const objects = TaggingHelper(_taggingService).getActiveStoryCircle();
    MoveObject().startMoving(objects.text, templateLayers.title);
    MoveObject().startMoving(objects.basic, templateLayers.centerCircle);
    MoveObject().moveGroups(objects.progress.ring, templateLayers.progressCircle);
    //FIXME: The dots are a little off..
    const storyCirclePositions = Template().storyCirclePositions(_position, objects.progress.dots.length);
    objects.progress.dots.forEach((_dot, index) => {
      MoveObject().startMoving(_dot.dot, storyCirclePositions.frameDots[index]);
      if (_dot.innerDot) {
        MoveObject().startMoving(_dot.innerDot, storyCirclePositions.frameDots[index]);
      }
    });
  };

  return { activeStoryCircle, activeStoryCircleWithoutShade }
};

export default MoveHelper;