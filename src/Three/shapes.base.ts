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
  LineDashedMaterial,
  LineDashedMaterialParameters,
  VideoTexture,
} from 'three';
import { CubeParams } from './schema.cube';
import DefaultColors from './defaults.color';

const BaseChapes = (): {
  DrawCircle: (
    radius: number,
    color: number,
    segments: number,
    opacity?: number,
    isTransparant?: true | false,
  ) => Mesh<CircleGeometry, MeshBasicMaterial>;
  DrawLine: (
    coordinates: Array<Vector3>,
    materialParams?: LineBasicMaterialParameters,
  ) => Line<BufferGeometry, LineBasicMaterial>;
  DrawDashedLine: (
    coordinates: Array<Vector3>,
    materialParams?: LineDashedMaterialParameters,
  ) => Line<BufferGeometry, LineDashedMaterial>;
  DrawImageCube: (
    url: string,
    format: Vector3,
  ) => Mesh<BoxBufferGeometry, MeshBasicMaterial>;
  DrawVideoCube: (
    video: HTMLVideoElement,
    format: Vector3,
  ) => Mesh<BoxBufferGeometry, MeshBasicMaterial>;
  DrawCube: (params: CubeParams) => Mesh<BoxBufferGeometry, MeshBasicMaterial>;
} => {
  const DrawCircle = (
    radius: number,
    color: number,
    segments: number,
    opacity?: number,
    isTransparant?: true | false,
  ) => {
    const geometry = new CircleGeometry(radius, segments);
    const material = new MeshBasicMaterial({
      color: color,
      opacity: opacity || 1,
      transparent: isTransparant || true,
    });
    material.color.convertSRGBToLinear();

    return new Mesh(geometry, material);
  };
  const DrawLine = (
    coordinates: Array<Vector3>,
    materialParams?: LineBasicMaterialParameters,
  ) => {
    const material = new LineBasicMaterial(
      materialParams || { color: DefaultColors().green },
    );
    material.color.convertSRGBToLinear();
    const points: Array<Vector3> = [];
    coordinates.forEach((point) => {
      points.push(new Vector3(point.x, point.y, point.z));
    });
    const geometry = new BufferGeometry().setFromPoints(points);
    return new Line(geometry, material);
  };

  const DrawDashedLine = (
    coordinates: Array<Vector3>,
    materialParams?: LineDashedMaterialParameters,
  ) => {
    const material = new LineDashedMaterial(
      materialParams || { color: DefaultColors().green },
    );
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

  const DrawVideoCube = (video: HTMLVideoElement, format: Vector3) => {
    const texture = new VideoTexture(video);
    texture.needsUpdate = true;
    const geometry = new BoxBufferGeometry(format.x, format.y, format.z);
    const material = new MeshBasicMaterial({
      map: texture,
    });
    // material.color.convertSRGBToLinear();
    return new Mesh(geometry, material);
  };

  const DrawCube = (params: CubeParams) => {
    const geometry = new BoxBufferGeometry(params.width, params.height, 0);
    const material = new MeshBasicMaterial({
      color: params.color || DefaultColors().white,
      opacity: params.opacity || 1,
      transparent: params.isTransparant || false,
    });
    material.color.convertSRGBToLinear();
    return new Mesh(geometry, material);
  };

  return {
    DrawCircle,
    DrawImageCube,
    DrawVideoCube,
    DrawLine,
    DrawDashedLine,
    DrawCube,
  };
};

export default BaseChapes;
