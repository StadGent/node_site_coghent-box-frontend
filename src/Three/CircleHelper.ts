import { CirclePoint } from './CircleSchema';
import { Vector2} from 'three';


const CircleHelper = (): {
  CalculatePointOfCircle: (point: CirclePoint) => Vector2;
} => {
   const CalculatePointOfCircle = (point: CirclePoint) => {
    const posX = Math.sin(point.angle * (Math.PI / 180)) * point.radius;
    const posY = Math.cos(point.angle * (Math.PI / 180)) * point.radius;
    return { x: posX, y: posY } as Vector2;
   };
  
  return { CalculatePointOfCircle }
};

export default CircleHelper;