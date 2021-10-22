import {
  Mesh,
  CircleGeometry,
  MeshBasicMaterial,
  Line,
  BufferGeometry,
  LineBasicMaterial,
  Vector2,
  LineBasicMaterialParameters,
  BoxBufferGeometry,
  TextureLoader,
} from 'three';
import useChapeHelpers from './useChapeHelpers';

const BaseChapes = (): {
  DrawCircle: (radius: number, color: number) => Mesh<CircleGeometry, MeshBasicMaterial>;
  DrawOuterCircle: (
    radius: number,
    color: number,
  ) => Line<BufferGeometry, LineBasicMaterial>;
  DrawLine: (
    coordinates: Vector2[],
    materialParams?: LineBasicMaterialParameters,
  ) => Line<BufferGeometry, LineBasicMaterial>;
  DrawImageCube: (
    url: string,
    format: Vector2,
  ) => Mesh<BoxBufferGeometry, MeshBasicMaterial>;
} => {
  const DrawCircle = (radius: number, color: number, segments = 50) => {
    const geometry = new CircleGeometry(radius, segments);
    const material = new MeshBasicMaterial({ color: color });

    return new Mesh(geometry, material);
  };
  const DrawOuterCircle = (radius: number, color: number) => {
    const chapeHelper = useChapeHelpers();
    const points: Vector2[] = [];
    for (let i = 0; i <= 360; i++) {
      const pos = chapeHelper.CalculatePointOfCircle(i, radius);
      points.push({
        x: pos.x,
        y: pos.y,
      } as Vector2);
    }
    return DrawLine(points, { color: color });
  };
  const DrawLine = (
    coordinates: Vector2[],
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

  const DrawImageCube = (url: string, format: Vector2) => {
    const loader = new TextureLoader();
    const geometry = new BoxBufferGeometry(format.x, format.y, 0);
    const material = new MeshBasicMaterial({
      map: loader.load(url),
    });
    return new Mesh(geometry, material);
  };

  return {
    DrawCircle,
    DrawOuterCircle,
    DrawImageCube,
    DrawLine,
  };
};

export default BaseChapes;
