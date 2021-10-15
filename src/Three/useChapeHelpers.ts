import { CircleParams, Position } from '@/models/ThreeServiceModel';
import {
  Mesh,
  CircleGeometry,
  MeshBasicMaterial,
  Vector2,
  BufferGeometry,
  Line,
  LineBasicMaterial,
} from 'three';
import { story } from './chapes.config';

const useChapeHelpers = (): {
  CalculatePointOfCircle: (angle: number, radius: number) => Vector2;
  GetCircleparams: (circle: Mesh<CircleGeometry, MeshBasicMaterial>) => CircleParams;
  GetCirclePointsForCircle: () => Vector2[];
  SetPosition: (
    position: Position,
    chape:
      | Mesh<CircleGeometry, MeshBasicMaterial>
      | Line<BufferGeometry, LineBasicMaterial>,
  ) => void;
  GetEndOfLine: (line: Line<BufferGeometry, LineBasicMaterial>) => Vector2;
} => {
  const CalculatePointOfCircle = (angle: number, radius: number) => {
    const posX = Math.sin(angle * (Math.PI / 180)) * radius;
    const posY = Math.cos(angle * (Math.PI / 180)) * radius;
    return { x: posX, y: posY } as Vector2;
  };

  const GetCirclePointsForCircle = () => {
    const points: Vector2[] = [];
    story.circlePoints.map((point) => {
      points.push(CalculatePointOfCircle(point.angle, point.radius));
    });
    return points;
  };

  const GetCircleparams = (circle: Mesh<CircleGeometry, MeshBasicMaterial>) => {
    return circle.geometry.parameters as CircleParams;
  };

  const GetEndOfLine = (line: Line<BufferGeometry, LineBasicMaterial>) => {
    const position = {
      x: line.geometry.attributes.position.array[6],
      y: line.geometry.attributes.position.array[7],
    };
    return position as Vector2;
  };

  const SetPosition = (
    position: Position,
    chape:
      | Mesh<CircleGeometry, MeshBasicMaterial>
      | Line<BufferGeometry, LineBasicMaterial>,
  ) => {
    chape.position.x = position.x;
    chape.position.y = position.y;
  };

  return {
    CalculatePointOfCircle,
    GetCircleparams,
    SetPosition,
    GetCirclePointsForCircle,
    GetEndOfLine,
  };
};

export default useChapeHelpers;
