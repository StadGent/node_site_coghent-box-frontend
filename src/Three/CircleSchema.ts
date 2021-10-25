import {
  Vector2,
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

export type CirclePoint = {
  angle: number;
  radius: number;
};

export type CircleParams = {
  radius: number;
  segments?: number;
  color?: number;
};

export type CircleSchema = {
  position: Vector3;
  params: CircleParams;
};

const SchemaCircle = (): {
  CreateCircle: (schema: CircleSchema) => Mesh<CircleGeometry, MeshBasicMaterial>;
  CreateCircles: (
    schemas: Array<CircleSchema>,
  ) => Array<Mesh<CircleGeometry, MeshBasicMaterial>>;
  CreateOuterCircle: (radius: number) => Line<BufferGeometry, LineBasicMaterial>;
} => {
  const baseChapes = BaseChapes();
  const chapeHelper = ChapeHelper();
  const circleHelper = CircleHelper();

  const CreateCircle = (schema: CircleSchema) => {
    const circle = baseChapes.DrawCircle(
      schema.params.radius,
      schema.params.color || 0x02a77f,
      schema.params.segments || 50,
    );
    chapeHelper.SetPosition(schema.position, circle);
    return circle;
  };

  const CreateCircles = (schemas: Array<CircleSchema>) => {
    const circles: Array<Mesh<CircleGeometry, MeshBasicMaterial>> = [];
    schemas.forEach((schema: CircleSchema) => {
      circles.push(CreateCircle(schema));
    });
    return circles;
  };

  const CreateOuterCircle = (radius: number) => {
    const points: Vector2[] = [];
    for (let i = 0; i <= 360; i++) {
      const pos = circleHelper.CalculatePointOfCircle({
        angle: i,
        radius: radius,
      } as CirclePoint);
      points.push({
        x: pos.x,
        y: pos.y,
      } as Vector2);
    }
    return baseChapes.DrawLine(points);
  };

  return {
    CreateCircle,
    CreateCircles,
    CreateOuterCircle,
  };
};

export default SchemaCircle;