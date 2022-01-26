import Common from '@/composables/common';
import { Group, MathUtils, Mesh, MeshBasicMaterial, RingGeometry, Vector3 } from 'three';
import Colors from './defaults.color';
import Measurements from './defaults.measurements';
import CircleHelper from './helper.circle';
import GroupHelper from './helper.group';
import SchemaCircle, { CircleSchema } from './schema.circle';
import DotWithinDot, { DotWithinDotObjects } from './shapes.dotWithinDot';

export type PauseProgressbarObjects = {
  ring: Array<Group>,
  dots: Array<DotWithinDotObjects>,
}

const PauseProgressbar = (): {
  create: (_schema: CircleSchema, _segments: number) => PauseProgressbarObjects;
  dots: (_position: Vector3, _radius: number, _segments: number, _color: number) => Array<DotWithinDotObjects>;
} => {

  const ring = (_schema: CircleSchema, _segments: number) => {
    const geometry = new RingGeometry(
      _schema.params.radius,
      _schema.params.radius + Measurements().progressBar.thickness,
      360 / 1, 45, 6.3 / 360 - (6.3 / 360 / 1) * 1,
      (6.3 / 360 / 1) * 1 * 360);
    const material = new MeshBasicMaterial({
      color: Colors().progressGrey,
      opacity: Measurements().progressBar.opacity,
      transparent: true,
    });
    material.color.convertSRGBToLinear();
    const _ring = new Mesh(geometry, material);
    _ring.rotateZ(MathUtils.degToRad(90));
    Common().setPosition(_ring, _schema.position)
    const pointsOnCircle = CircleHelper().SplitCircleInSegments(_schema.position, _schema.params.radius + (Measurements().progressBar.thickness / 2), _segments);
    const schemas = CircleHelper().CreateSchemas(pointsOnCircle, Measurements().progressBar.dotRadius, Colors().progressGrey,Measurements().progressBar.opacity);
    const ringGroup = new Group();
    const dots = SchemaCircle().CreateCircles(schemas);
    dots.forEach((_dot, index) => {
      Common().setPosition(_dot,schemas[index].position)
      ringGroup.add(_dot);
    });
    ringGroup.add(_ring);
    return [ringGroup];
  };

  const dots = (_position: Vector3, _radius: number, _segments: number, _color: number) => {
    const pointsOnCircle = CircleHelper().SplitCircleInSegments(new Vector3(_position.x,_position.y,_position.z + 0.01), _radius + (Measurements().progressBar.thickness / 2), _segments);
    const schemas = CircleHelper().CreateSchemas(pointsOnCircle, _radius - (Measurements().progressBar.thickness / 2), _color);
    const dotWithinDots: Array<DotWithinDotObjects> = [];
    for (const _schema of schemas) {
      const _dot = DotWithinDot().create(
        Measurements().progressBar.activeDotRadius,
        Measurements().progressBar.seenDotRadius,
        _schema.position,
        _color,
        Colors().white
      );
      dotWithinDots.push(_dot);
    }
    return dotWithinDots
  };

  const create = (_schema: CircleSchema, _segments: number) => {
    const _ring = ring(_schema, _segments);
    const _dots = dots(
      _schema.position,
      _schema.params.radius,
      _segments,
      _schema.params.color || Colors().white
    );
    return {
      ring: _ring,
      dots: _dots,
    };
  }

  return { create, dots }
};

export default PauseProgressbar;