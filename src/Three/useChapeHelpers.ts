import { BoxParams, CircleParams, Position } from '@/models/ThreeServiceModel';
import {
  Mesh,
  CircleGeometry,
  MeshBasicMaterial,
  Vector2,
  BufferGeometry,
  Line,
  LineBasicMaterial,
  BoxGeometry,
  Vector3,
} from 'three';
import { story } from './chapes.config';

const useChapeHelpers = (): {
  CalculatePointOfCircle: (angle: number, radius: number) => Vector2;
  GetCircleparams: (circle: Mesh<CircleGeometry, MeshBasicMaterial>) => CircleParams;
  GetBoxparams: (box: Mesh<BoxGeometry, MeshBasicMaterial>) => BoxParams;
  GetCirclePointsForCircle: () => Vector2[];
  SetPosition: (
    position: Vector3,
    chape:
      | Mesh<CircleGeometry, MeshBasicMaterial>
      | Line<BufferGeometry, LineBasicMaterial>
      | Mesh<BoxGeometry, MeshBasicMaterial>,
  ) => void;
  GetEndOfLine: (line: Line<BufferGeometry, LineBasicMaterial>) => Vector3;
  SetImageAtEndOfLine: (
    line: Line<BufferGeometry, LineBasicMaterial>,
    boxImage: Mesh<BoxGeometry, MeshBasicMaterial>,
  ) => void;
  scaleBoxImage: (boxImage: Mesh<BoxGeometry, MeshBasicMaterial>, scale: Vector3) => void;
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
  const GetBoxparams = (box: Mesh<BoxGeometry, MeshBasicMaterial>) => {
    return box.geometry.parameters as BoxParams;
  };

  const GetEndOfLine = (line: Line<BufferGeometry, LineBasicMaterial>) => {
    const position = {
      x: line.geometry.attributes.position.array[6],
      y: line.geometry.attributes.position.array[7],
    };
    return position as Vector3;
  };

  const scaleBoxImage = (
    boxImage: Mesh<BoxGeometry, MeshBasicMaterial>,
    scale: Vector3,
  ) => {
    boxImage.scale.set(scale.x, scale.y, scale.z);
  };

  const SetImageAtEndOfLine = (
    line: Line<BufferGeometry, LineBasicMaterial>,
    boxImage: Mesh<BoxGeometry, MeshBasicMaterial>,
  ) => {
    const pos = GetEndOfLine(line);
    if (pos.x > 0) {
      SetPosition(
        { x: pos.x + GetBoxparams(boxImage).width / 2 + 0.1, y: pos.y } as Vector3,
        boxImage,
      );
    } else {
      SetPosition(
        { x: pos.x - GetBoxparams(boxImage).width / 2 - 0.1, y: pos.y } as Vector3,
        boxImage,
      );
    }
  };

  const SetPosition = (
    position: Vector3,
    chape:
      | Mesh<CircleGeometry, MeshBasicMaterial>
      | Line<BufferGeometry, LineBasicMaterial>
      | Mesh<BoxGeometry, MeshBasicMaterial>,
  ) => {
    chape.position.x = position.x;
    chape.position.y = position.y;
  };

  return {
    CalculatePointOfCircle,
    GetCircleparams,
    GetBoxparams,
    SetPosition,
    GetCirclePointsForCircle,
    GetEndOfLine,
    SetImageAtEndOfLine,
    scaleBoxImage,
  };
};

export default useChapeHelpers;
