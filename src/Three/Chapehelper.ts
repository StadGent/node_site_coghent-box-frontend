import {
  Vector3,
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
      | Mesh,
  ) => void;
  GetCirclePointsForCircle: (circlePoints: Array<CirclePoint>) => Array<Vector3>;
} => {
  const SetPosition = (
    position: Vector3,
    chape:
      | Mesh<CircleGeometry, MeshBasicMaterial>
      | Line<BufferGeometry, LineBasicMaterial>
      | Mesh<BoxGeometry, MeshBasicMaterial>
      | Mesh,
  ) => {
    chape.position.x = position.x;
    chape.position.y = position.y;
  };

  const GetCirclePointsForCircle = (circlePoints: Array<CirclePoint>) => {
    const points: Array<Vector3> = [];
    circlePoints.map((point: CirclePoint) => {
      points.push(CircleHelper().CalculatePointOfCircle(point, new Vector3(0, 0, 0)));
    });
    return points;
  };

  return { SetPosition, GetCirclePointsForCircle };
};

export default ChapeHelper;
