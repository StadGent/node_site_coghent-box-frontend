import Common from '@/composables/common';
import MoveObject from '@/composables/moveObject';
import TaggingService from '@/services/TaggingService';
import { Vector3 } from 'three';
import Layers from './defaults.layers';
import TaggingHelper from './helper.tagging';
import ShapesTemplate from './template.shapes';

const MoveHelper = (_taggingService: TaggingService): {
  activeStoryCircle: (_position: Vector3) => void;
  activeStoryCircleWithoutShade: (_position: Vector3) => void;
} => {

  const activeStoryCircle = (_position: Vector3) => {
    const objects = TaggingHelper(_taggingService).getActiveStoryCircle();
    MoveObject().startMoving(objects.text,  new Vector3(_position.x,_position.y,objects.text.position.z));
    MoveObject().startMoving(objects.basic,  new Vector3(_position.x,_position.y,objects.basic.position.z));
    MoveObject().startMoving(objects.progress.ring, new Vector3(_position.x,_position.y,objects.progress.ring.position.z));
    MoveObject().startMoving(objects.shade, new Vector3(_position.x,_position.y,objects.shade?.position.z));
    //FIXME: The dots are a little off..
    const storyCirclePositions = ShapesTemplate().storyCircle(_position, objects.progress.dots.length);
    objects.progress.dots.forEach((_dot, index) => {
      MoveObject().startMoving(_dot.dot, storyCirclePositions.frameDots[index])
      if (_dot.innerDot) {
        MoveObject().startMoving(_dot.innerDot, storyCirclePositions.frameDots[index])
      }

    });
  };
  const activeStoryCircleWithoutShade = (_position: Vector3) => {
    const objects = TaggingHelper(_taggingService).getActiveStoryCircle();
    MoveObject().startMoving(objects.text, _position);
    MoveObject().startMoving(objects.basic, _position);
    MoveObject().startMoving(objects.progress.ring, _position);
    //FIXME: The dots are a little off..
    const storyCirclePositions = ShapesTemplate().storyCircle(_position, objects.progress.dots.length);
    objects.progress.dots.forEach((_dot, index) => {
      MoveObject().startMoving(_dot.dot, storyCirclePositions.frameDots[index]);
      if (_dot.innerDot) {
        MoveObject().startMoving(_dot.innerDot, storyCirclePositions.frameDots[index])
      }
    });
  };

  return { activeStoryCircle, activeStoryCircleWithoutShade }
};

export default MoveHelper;