import {
  Vector3,
  Vector2,
  Mesh,
  CircleGeometry,
  MeshBasicMaterial,
  Line,
  BufferGeometry,
  LineBasicMaterial,
  BoxGeometry,
} from 'three';
import CircleHelper from './CircleHelper';
import { CirclePoint } from './CircleSchema';

const ChapeHelper = (): {
  SetPosition: (
    position: Vector3,
    chape:
      | Mesh<CircleGeometry, MeshBasicMaterial>
      | Line<BufferGeometry, LineBasicMaterial>
      | Mesh<BoxGeometry, MeshBasicMaterial>
  ) => void;
  GetCirclePointsForCircle: (circlePoints: Array<CirclePoint>) => Array<Vector2>
} => {
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

  const GetCirclePointsForCircle = (circlePoints: Array<CirclePoint>) => {
    const points: Array<Vector2> = [];
    circlePoints.map((point: CirclePoint) => {
      points.push(CircleHelper().CalculatePointOfCircle(point));
    });
    return points;
  };

  return { SetPosition, GetCirclePointsForCircle };
};

export default ChapeHelper;
