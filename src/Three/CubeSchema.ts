import {
  TextureLoader,
  BoxBufferGeometry,
  MeshBasicMaterial,
  Mesh,
  Vector3,
} from 'three';
import BaseChapes from './BaseChapes';
import ChapeHelper from './Chapehelper';
import Layers from './defaults.layers';

export type CubeParams = {
  width: number;
  height: number;
  depth?: number;
  widthSegments?: number;
  heightSegments?: number;
  depthSegments?: number;
  color?: number;
  url?: string;
  opacity?: number;
  isTransparant?: true | false;
};

export type ImageCubeParams = CubeParams & {
  url: string;
};

export type CubeSchema = {
  position: Vector3;
  params: CubeParams;
};

const SchemaCube = (): {
  CreateCube: (schema: CubeSchema) => Mesh<BoxBufferGeometry, MeshBasicMaterial>;
  CreateImageCube: (schema: CubeSchema) => Mesh<BoxBufferGeometry, MeshBasicMaterial>;
} => {
  const chapeHelper = ChapeHelper();

  const CreateCube = (schema: CubeSchema) => {
    const cube = BaseChapes().DrawCube(schema.params);
    chapeHelper.SetPosition(schema.position, cube);
    cube.position.z = 0;
    return cube;
  };
  const CreateImageCube = (schema: CubeSchema) => {
    const loader = new TextureLoader();
    const geometry = new BoxBufferGeometry(schema.params.width, schema.params.height, 0);
    const material = new MeshBasicMaterial({
      transparent: true,
      map: loader.load(
        schema.params.url ||
          'http://localhost:8001/download/9ce891fe75a8e75d82019665d2585a83-2005-0025_1.JPG',
      ),
    });
    const cube = new Mesh(geometry, material);
    chapeHelper.SetPosition(schema.position, cube);
    
    // cube.position.z = Layers.presentation;
    return cube;
  };

  return {
    CreateCube,
    CreateImageCube,
  };
};

export default SchemaCube;
