import {
  Vector3,
  Mesh,
  CircleGeometry,
  MeshBasicMaterial,
  Line,
  BufferGeometry,
  LineBasicMaterial,
} from 'three';
import BaseChapes from './shapes.base';
import ChapeHelper from './helper.chape';
import CircleHelper from './helper.circle';
import DefaultColors from './defaults.color';

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
    isTransparant?: true | false,
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
  const CreateCircle = (schema: CircleSchema, isTransparant?: true | false) => {
    const circle = BaseChapes().DrawCircle(
      schema.params.radius,
      schema.params.color || DefaultColors().green,
      schema.params.segments || 50,
      schema.params.opacity || 1,
      isTransparant || false,
    );
    ChapeHelper().SetPosition(schema.position, circle);
    return circle;
  };

  const CreateCircles = (schemas: Array<CircleSchema>) => {
    const circles: Array<Mesh<CircleGeometry, MeshBasicMaterial>> = [];
    schemas.forEach((schema: CircleSchema) => {
      circles.push(CreateCircle(schema));
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
