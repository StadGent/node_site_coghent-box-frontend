import { Vector3 } from 'three';
import Layers from './defaults.layers';
import Measurements from './defaults.measurements';
import CircleHelper from './helper.circle';

const ShapesTemplate = (): {
  storyCircle: (_center: Vector3, _segments: number) => {
    center: Vector3,
    frameDots: Array<Vector3>
  };
} => {
  const storyCircle = (_center: Vector3, _segments: number) => {
    const pointsOfDots = CircleHelper().SplitCircleInSegments(new Vector3(_center.x,_center.y,_center.z + Layers.fraction - 0.05), Measurements().storyCircle.progressRadius, _segments);
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