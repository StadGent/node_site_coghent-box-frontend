import {
  Vector3,
  Mesh,
  CircleGeometry,
  MeshBasicMaterial,
  Line,
  BufferGeometry,
  LineBasicMaterial,
} from 'three';
import BaseChapes from './BaseChapes';
import ChapeHelper from './Chapehelper';
import CircleHelper from './CircleHelper';
import DefaultColors from './defaults.color';
import Layers from './defaults.layers';

export type CirclePoint = {
  angle: number;
  radius: number;
};

export type CircleParams = {
  radius: number;
  segments?: number;
  color?: number;
  opacity?: number
};

export type CircleSchema = {
  position: Vector3;
  params: CircleParams;
};

const SchemaCircle = (): {
  CreateCircle: (
    schema: CircleSchema,
    layer: number,
  ) => Mesh<CircleGeometry, MeshBasicMaterial>;
  CreateCircles: (
    schemas: Array<CircleSchema>,
  ) => Array<Mesh<CircleGeometry, MeshBasicMaterial>>;
  CreateOuterCircle: (
    radius: number,
    position: Vector3,
    color?: number,
  ) => Line<BufferGeometry, LineBasicMaterial>;
} => {
  const CreateCircle = (schema: CircleSchema, layer: number) => {
    const circle = BaseChapes().DrawCircle(
      schema.params.radius,
      schema.params.color || DefaultColors().green,
      schema.params.segments || 50,
      schema.params.opacity || 1,
    );
    ChapeHelper().SetPosition(schema.position, circle);
    circle.position.z = layer;
    return circle;
  };

  const CreateCircles = (schemas: Array<CircleSchema>) => {
    const circles: Array<Mesh<CircleGeometry, MeshBasicMaterial>> = [];
    schemas.forEach((schema: CircleSchema) => {
      circles.push(CreateCircle(schema, Layers.presentation));
    });
    return circles;
  };

  const CreateOuterCircle = (radius: number, position: Vector3, color?: number) => {
    const points: Array<Vector3> = [];
    for (let i = 0; i <= 360; i++) {
      const pos = CircleHelper().CalculatePointOfCircle(
        {
          angle: i,
          radius: radius,
        } as CirclePoint,
        position as Vector3,
      );
      points.push({
        x: pos.x,
        y: pos.y,
      } as Vector3);
    }
    return BaseChapes().DrawLine(points, { color: color || DefaultColors().green });
  };

  return {
    CreateCircle,
    CreateCircles,
    CreateOuterCircle,
  };
};

export default SchemaCircle;
