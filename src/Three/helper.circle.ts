import { CirclePoint, CircleSchema } from './schema.circle';
import { Vector3 } from 'three';

const CircleHelper = (): {
  CalculatePointOfCircle: (point: CirclePoint, position: Vector3) => Vector3;
  CreateSchema: (position: Vector3, radius: number, color: number, opacity?: number) => CircleSchema;
  CreateSchemas: (positions: Array<Vector3>, radius: number, color: number) => Array<CircleSchema>;
  SplitCircleInSegments: (position: Vector3, radius: number, segments: number) => Array<Vector3>;
} => {
  const CalculatePointOfCircle = (point: CirclePoint, position: Vector3) => {
    const posX = Math.sin(point.angle * (Math.PI / 180)) * point.radius;
    const posY = Math.cos(point.angle * (Math.PI / 180)) * point.radius;
    return { x: posX + position.x, y: posY + position.y, z: position.z } as Vector3;
  };

  const CreateSchema = (position: Vector3, radius: number, color: number, opacity?: number) => {
    return {
      position: position,
      params: {
        radius: radius,
        color: color,
        opacity: opacity || 1
      },
    } as CircleSchema;
  };
  const CreateSchemas = (positions: Array<Vector3>, radius: number, color: number) => {
    const schemas: Array<CircleSchema> = [];
    for (const position of positions) {
      schemas.push(CreateSchema(position,radius,color));
    }
    return schemas;
  };

  const SplitCircleInSegments = (position: Vector3, radius: number, segments: number) => {
    const points : Array<Vector3> = []
    const angle = 360 /segments;
    for (let i = 0; i < segments; i++) {
      points.push(CalculatePointOfCircle({angle: angle * i, radius: radius}, position))
    }
    return points;
  };

  return { CalculatePointOfCircle, CreateSchema, CreateSchemas, SplitCircleInSegments };
};

export default CircleHelper;
