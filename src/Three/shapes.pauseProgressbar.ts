import Common from '@/composables/common';
import { MathUtils, Mesh, MeshBasicMaterial, RingGeometry, Vector3 } from 'three';
import Colors from './defaults.color';
import Measurements from './defaults.measurements';
import CircleHelper from './helper.circle';
import { CircleSchema } from './schema.circle';
import DotWithinDot, { DotWithinDotObjects } from './shapes.dotWithinDot';

export type PauseProgressbarObjects = {
  ring: Mesh<RingGeometry, MeshBasicMaterial>,
  dots: Array<DotWithinDotObjects>,
}

const PauseProgressbar = (): {
  create: (_schema: CircleSchema, _segments: number) => PauseProgressbarObjects;
} => {

  const ring = (_schema: CircleSchema) => {
    const geometry = new RingGeometry(
      _schema.params.radius,
      _schema.params.radius + Measurements().progressBar.thickness,
      360 / 1, 45, 6.3 / 360 - (6.3 / 360 / 1) * 1,
      (6.3 / 360 / 1) * 1 * 360);
    const material = new MeshBasicMaterial({
      color: Colors().white,
      opacity: 0.4,
      transparent: true,
    });
    material.color.convertSRGBToLinear();
    const _ring = new Mesh(geometry, material);
    _ring.rotateZ(MathUtils.degToRad(90));    
    Common().setPosition(_ring, _schema.position);
    return _ring;
  };

  const dots = (_position: Vector3, _radius: number, _segments: number, _color: number) => {
    const pointsOnCircle = CircleHelper().SplitCircleInSegments(_position, _radius, _segments);
    const schemas = CircleHelper().CreateSchemas(pointsOnCircle, _radius, _color);
    const dotWithinDots: Array<DotWithinDotObjects> = [];
    for (const _schema of schemas){
      const _dot = DotWithinDot().create(
        Measurements().progressBar.innerdotRadius,
        Measurements().progressBar.dotRadius,
        _schema.position,
        _schema.params.color || Colors().white, 
        Colors().white
      );
      dotWithinDots.push(_dot);
    }
    return dotWithinDots
  };

  const create = (_schema: CircleSchema, _segments: number) => {
    const _ring = ring(_schema);
    const _dots = dots(
      _schema.position,
      _schema.params.radius + (Measurements().progressBar.thickness / 2),
      _segments,
      _schema.params.color || Colors().white
    );
    return {
      ring: _ring,
      dots: _dots,
    };
  }

  return { create }
};

export default PauseProgressbar;