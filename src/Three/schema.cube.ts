import {
  TextureLoader,
  BoxBufferGeometry,
  MeshBasicMaterial,
  Mesh,
  Vector3,
  Texture,
} from 'three';
import BaseChapes from './shapes.base';
import ChapeHelper from './helper.chape';

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
  CreateImageCubeAsync: (schema: CubeSchema) => Promise<Mesh<BoxBufferGeometry, MeshBasicMaterial>>;
} => {
  const chapeHelper = ChapeHelper();

  const CreateCube = (schema: CubeSchema) => {
    const cube = BaseChapes().DrawCube(schema.params);
    cube.material.transparent = true;
    cube.material.opacity = schema.params.opacity || 1;
    chapeHelper.SetPosition(schema.position, cube);
    return cube;
  };

  const loadTexture = (_url: string) => {
    const loader = new TextureLoader();
    return new Promise((resolve, reject) => {
      resolve(loader.load(
        _url
      ))
    })
  }

  const CreateImageCube = (schema: CubeSchema) => {
    const loader = new TextureLoader();
    const geometry = new BoxBufferGeometry(schema.params.width, schema.params.height, 0);

    const material = new MeshBasicMaterial({
      transparent: true,
      map: loader.load(
        schema.params.url || ''
      )
    });
    const cube = new Mesh(geometry, material);
    chapeHelper.SetPosition(schema.position, cube);
    return cube;
  };

  const CreateImageCubeAsync = async (schema: CubeSchema) => {
    const geometry = new BoxBufferGeometry(schema.params.width, schema.params.height, 0);
    const loadedImage = await loadTexture(schema.params.url as string)
    console.log({ loadedImage })
    const material = new MeshBasicMaterial({
      transparent: true,
      map: loadedImage as Texture
    });
    const cube = new Mesh(geometry, material);
    chapeHelper.SetPosition(schema.position, cube);
    return cube;
  };

  return {
    CreateCube,
    CreateImageCube,
    CreateImageCubeAsync
  };
};

export default SchemaCube;
