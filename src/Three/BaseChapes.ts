import {
  Mesh,
  CircleGeometry,
  MeshBasicMaterial,
  Line,
  BufferGeometry,
  LineBasicMaterial,
  LineBasicMaterialParameters,
  BoxBufferGeometry,
  TextureLoader,
  Vector3,
  DoubleSide,
} from 'three';

const BaseChapes = (): {
  DrawCircle: (
    radius: number,
    color: number,
    segments: number,
  ) => Mesh<CircleGeometry, MeshBasicMaterial>;
  DrawLine: (
    coordinates: Array<Vector3>,
    materialParams?: LineBasicMaterialParameters,
  ) => Line<BufferGeometry, LineBasicMaterial>;
  DrawImageCube: (
    url: string,
    format: Vector3,
  ) => Mesh<BoxBufferGeometry, MeshBasicMaterial>;
} => {
  const DrawCircle = (radius: number, color: number, segments: number) => {
    const geometry = new CircleGeometry(radius, segments);
    const material = new MeshBasicMaterial({ color: color });
    material.color.convertSRGBToLinear();

    return new Mesh(geometry, material);
  };
  const DrawLine = (
    coordinates: Array<Vector3>,
    materialParams?: LineBasicMaterialParameters,
  ) => {
    const material = new LineBasicMaterial(materialParams || { color: 0x02a77f });
    material.color.convertSRGBToLinear();
    const points: Array<Vector3> = [];
    coordinates.forEach((point) => {
      points.push(new Vector3(point.x, point.y, point.z));
    });
    const geometry = new BufferGeometry().setFromPoints(points);
    return new Line(geometry, material);
  };

  const DrawImageCube = (url: string, format: Vector3) => {
    const loader = new TextureLoader();
    const geometry = new BoxBufferGeometry(format.x, format.y, format.z);
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
