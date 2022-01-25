import { Vector3 } from 'three';
import Layers from './defaults.layers';
import Measurements from './defaults.measurements';
import CircleHelper from './helper.circle';
import { LayersStoryCircle } from './section.storyCircle';

const Template = (): {
  storyCirclePositions: (_center: Vector3, _segments: number) => {
    center: Vector3,
    frameDots: Array<Vector3>
  };
  storyCircleLayers: (_position: Vector3) => LayersStoryCircle;
} => {
  const storyCirclePositions = (_center: Vector3, _segments: number) => {
    const pointsOfDots = CircleHelper().SplitCircleInSegments(new Vector3(_center.x,_center.y,_center.z + Layers.fraction - 0.05), Measurements().storyCircle.progressRadius, _segments);
    return {
      center: _center,
      frameDots: pointsOfDots
    }
  };

  const storyCircleLayers = (_position: Vector3) => {
    return {
      title: new Vector3(_position.x,_position.y,_position.z + 0.01),
      centerCircle: _position,
      shadedCircle: new Vector3(_position.x,_position.y,_position.z - 0.01),
      progressCircle: _position,
      progressDots: new Vector3(_position.x,_position.y,_position.z + 0.01),
    };
  }

  return {
    storyCirclePositions,
    storyCircleLayers,
  }
};

export default Template;