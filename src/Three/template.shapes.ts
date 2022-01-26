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
    const layers = storyCircleLayers(_center);
    console.log('Layers of progressdots',layers.progressDots);
    console.log('_segments',_segments);
    const pointsOfDots = CircleHelper().SplitCircleInSegments(layers.progressDots, Measurements().storyCircle.progressRadius + (Measurements().progressBar.thickness / 2), _segments);
    console.log({pointsOfDots});
    return {
      center: _center,
      frameDots: pointsOfDots
    }
  };

  const storyCircleLayers = (_position: Vector3) => {
    return {
      title: new Vector3(_position.x, _position.y, _position.z + Layers.fraction),
      centerCircle: _position,
      shadedCircle: new Vector3(_position.x, _position.y, _position.z - 0.01),
      progressCircle: _position,
      progressDots: new Vector3(_position.x, _position.y, _position.z + Layers.fraction),
    };
  }

  return {
    storyCirclePositions,
    storyCircleLayers,
  }
};

export default Template;