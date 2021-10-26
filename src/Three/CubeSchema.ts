import {
  TextureLoader,
  BoxBufferGeometry,
  MeshBasicMaterial,
  Mesh,
  Vector3,
} from 'three';
import ChapeHelper from './Chapehelper';

export type CubeParams = {
  width: number;
  height: number;
  depth?: number;
  widthSegments?: number;
  heightSegments?: number;
  depthSegments?: number;
  color?: number;
};

export type ImageCubeParams = CubeParams & {
  url: string;
};

export type CubeSchema = {
  position: Vector3;
  params: ImageCubeParams;
};

const SchemaCube = (): {
  CreateImageCube: (schema: CubeSchema) => Mesh<BoxBufferGeometry, MeshBasicMaterial>;
} => {
  const chapeHelper = ChapeHelper();

  const CreateCube = (params: CubeParams) => {};
  const CreateImageCube = (schema: CubeSchema) => {
    const loader = new TextureLoader();
    const geometry = new BoxBufferGeometry(schema.params.width, schema.params.height, 0);
    const material = new MeshBasicMaterial({
      map: loader.load(schema.params.url),
    });
    const cube = new Mesh(geometry, material);
    chapeHelper.SetPosition(schema.position, cube);
    return cube;
  };

  return {
    CreateImageCube,
  };
};

export default SchemaCube;
