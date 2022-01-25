import Common from '@/composables/common';
import MoveObject from '@/composables/moveObject';
import TaggingService from '@/services/TaggingService';
import { Vector3 } from 'three';
import Layers from './defaults.layers';
import Measurements from './defaults.measurements';
import TaggingHelper from './helper.tagging';
import ShapesTemplate from './template.shapes';

const MoveHelper = (_taggingService: TaggingService): {
  activeStoryCircle: (_position: Vector3) => void;
  activeStoryCircleWithoutShade: (_position: Vector3) => void;
} => {

  const activeStoryCircle = (_position: Vector3) => {
    const objects = TaggingHelper(_taggingService).getActiveStoryCircle();
    console.log('tagged objects', _taggingService.taggedObjects);
    console.log('active story objects', objects);
    MoveObject().startMoving(objects.text, new Vector3(_position.x - Measurements().storyCircle.correctionText, _position.y, Layers.scene + Layers.fraction - 0.05));
    MoveObject().startMoving(objects.basic, new Vector3(_position.x, _position.y, objects.basic.position.z));
    MoveObject().moveGroups(objects.progress.ring, new Vector3(_position.x, _position.y, objects.progress.ring[0].position.z));
    MoveObject().startMoving(objects.shade, new Vector3(_position.x, _position.y, Layers.scene - Layers.fraction));
    //FIXME: The dots are a little off..
    const storyCirclePositions = ShapesTemplate().storyCircle(_position, objects.progress.dots.length);
    objects.progress.dots.forEach((_dot, index) => {
      MoveObject().startMoving(_dot.dot, storyCirclePositions.frameDots[index]);
      if (_dot.innerDot) {
        MoveObject().startMoving(_dot.innerDot, storyCirclePositions.frameDots[index])
      }
    });
  };
  const activeStoryCircleWithoutShade = (_position: Vector3) => {
    const objects = TaggingHelper(_taggingService).getActiveStoryCircle();
    console.log('ring without shade', objects.progress.ring);
    MoveObject().startMoving(objects.text, new Vector3(_position.x - Measurements().storyCircle.correctionText, _position.y, Layers.scene + Layers.fraction - 0.05));
    MoveObject().startMoving(objects.basic, _position);
    MoveObject().startMoving(objects.progress.ring, _position);
    //FIXME: The dots are a little off..
    const storyCirclePositions = ShapesTemplate().storyCircle(_position, objects.progress.dots.length);
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