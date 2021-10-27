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

const BaseChapes = (): {
  DrawCircle: (
    radius: number,
    color: number,
    segments: number,
  ) => Mesh<CircleGeometry, MeshBasicMaterial>;
  DrawLine: (
    coordinates: Vector2[],
    materialParams?: LineBasicMaterialParameters,
  ) => Line<BufferGeometry, LineBasicMaterial>;
  DrawImageCube: (
    url: string,
    format: Vector2,
  ) => Mesh<BoxBufferGeometry, MeshBasicMaterial>;
} => {
  const DrawCircle = (radius: number, color: number, segments: number) => {
    const geometry = new CircleGeometry(radius, segments);
    const material = new MeshBasicMaterial({ color: color });
    material.color.convertSRGBToLinear();

    return new Mesh(geometry, material);
  };
  const DrawLine = (
    coordinates: Vector2[],
    materialParams?: LineBasicMaterialParameters,
  ) => {
    const material = new LineBasicMaterial(materialParams || { color: 0x02a77f });
    material.color.convertSRGBToLinear();
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
    material.color.convertSRGBToLinear();
    return new Mesh(geometry, material);
  };

  return {
    DrawCircle,
    DrawImageCube,
    DrawLine,
  };
};

export default BaseChapes;
