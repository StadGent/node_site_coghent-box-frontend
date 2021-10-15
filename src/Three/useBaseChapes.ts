import { Position } from '@/models/ThreeServiceModel';
import {
  CircleGeometry,
  MeshBasicMaterial,
  Mesh,
  Vector2,
  BufferGeometry,
  Line,
  LineBasicMaterial,
  LineBasicMaterialParameters,
} from 'three';
import useChapeHelpers from './useChapeHelpers';

const useBaseChapes = (): {
  DrawCircle: (radius: number, color: any) => Mesh<CircleGeometry, MeshBasicMaterial>;
  DrawOuterCircle: (
    radius: number,
    color: any,
  ) => Line<BufferGeometry, LineBasicMaterial>;
  DrawLine: (
    coordinates: Position[],
    materialParams?: LineBasicMaterialParameters,
  ) => Line<BufferGeometry, LineBasicMaterial>;
} => {
  const DrawCircle = (radius: number, color: any, segments = 50) => {
    const geometry = new CircleGeometry(radius, segments);
    const material = new MeshBasicMaterial({ color: color });

    return new Mesh(geometry, material);
  };
  const DrawOuterCircle = (radius: number, color: any) => {
    const chapeHelper = useChapeHelpers();
    const points: Position[] = [];
    for (let i = 0; i <= 360; i++) {
      const pos = chapeHelper.CalculatePointOfCircle(i, radius);
      points.push({
        x: pos.x,
        y: pos.y,
      });
    }
    return DrawLine(points, { color: color });
  };
  const DrawLine = (
    coordinates: Position[],
    materialParams?: LineBasicMaterialParameters,
  ) => {
    const material = new LineBasicMaterial(materialParams);
    const points: Vector2[] = [];
    coordinates.forEach((point) => {
      points.push(new Vector2(point.x, point.y));
    });
    const geometry = new BufferGeometry().setFromPoints(points);
    return new Line(geometry, material);
  };

  return {
    DrawCircle,
    DrawOuterCircle,
    DrawLine,
  };
};

export default useBaseChapes;
