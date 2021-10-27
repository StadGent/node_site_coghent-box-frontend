import { CirclePoint } from './CircleSchema';
import { Vector3 } from 'three';

const CircleHelper = (): {
  CalculatePointOfCircle: (point: CirclePoint) => Vector3;
} => {
  const CalculatePointOfCircle = (point: CirclePoint) => {
    const posX = Math.sin(point.angle * (Math.PI / 180)) * point.radius;
    const posY = Math.cos(point.angle * (Math.PI / 180)) * point.radius;
    return { x: posX, y: posY, z: 0 } as Vector3;
  };

  return { CalculatePointOfCircle };
};

export default CircleHelper;
