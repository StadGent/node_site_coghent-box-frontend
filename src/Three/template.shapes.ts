import { Vector3 } from 'three';
import Measurements from './defaults.measurements';
import CircleHelper from './helper.circle';

const ShapesTemplate = (): {
  storyCircle: (_center: Vector3, _segments: number) => {
    center: Vector3,
    frameDots: Array<Vector3>
  };
} => {
  const storyCircle = (_center: Vector3, _segments: number) => {
    const pointsOfDots = CircleHelper().SplitCircleInSegments(_center, Measurements().storyCircle.progressRadius, _segments);
    return {
      center: _center,
      frameDots: pointsOfDots
    }
  };

  return {
    storyCircle,
  }
};

export default ShapesTemplate;