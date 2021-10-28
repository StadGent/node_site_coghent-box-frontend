import { CirclePoint, CircleSchema } from './CircleSchema';
import { Vector3 } from 'three';

const CircleHelper = (): {
  CalculatePointOfCircle: (point: CirclePoint, position: Vector3) => Vector3;
  CreateSchema: (position: Vector3, radius: number, color: number) => CircleSchema;
} => {
  const CalculatePointOfCircle = (point: CirclePoint, position: Vector3) => {
    const posX = Math.sin(point.angle * (Math.PI / 180)) * point.radius;
    const posY = Math.cos(point.angle * (Math.PI / 180)) * point.radius;
    return { x: posX + position.x, y: posY + position.y, z: 0 } as Vector3;
  };

  const CreateSchema = (position: Vector3, radius: number, color: number) => {
    return {
      position: position,
      params: {
        radius: radius,
        color: color,
      },
    } as CircleSchema;
  };

  return { CalculatePointOfCircle, CreateSchema };
};

export default CircleHelper;
