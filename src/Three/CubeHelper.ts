import { Mesh, BoxGeometry, MeshBasicMaterial, Vector3 } from 'three';
import SchemaCube, { CubeParams, CubeSchema } from './CubeSchema';
import DefaultColors from './defaults.color';

const CubeHelper = (): {
  GetCubeParams: (cube: Mesh<BoxGeometry, MeshBasicMaterial>) => CubeParams;
  GetCubePosition: (cube: Mesh) => Vector3;
  GetCubePositions: (cubes: Array<Mesh>) => Array<Vector3>;
  CreateSchema: (position: Vector3, url: string, dimensions?: Vector3) => CubeSchema;
  GetCubesPositions: (cubes: Array<Mesh>) => Array<Vector3>;
  HighlightImage: (schema: CubeSchema) => Mesh;
  ScaleBoxImage: (boxImage: Mesh, scale: Vector3) => void;
} => {
  const GetCubeParams = (cube: Mesh<BoxGeometry, MeshBasicMaterial>) => {
    return cube.geometry.parameters as CubeParams;
  };

  const GetCubePosition = (cube: Mesh) => {
    return cube.position;
  };

  const GetCubePositions = (cubes: Array<Mesh>) => {
    const positions: Array<Vector3> = [];
    for (const cube of cubes) {
      positions.push(GetCubePosition(cube));
    }
    return positions;
  };

  const CreateSchema = (position: Vector3, url: string, dimensions?: Vector3) => {
    return {
      position: position as Vector3,
      params: {
        width: dimensions?.x || 2,
        height: dimensions?.y || 2,
        url: url,
      },
    };
  };

  const GetCubesPositions = (cubes: Array<Mesh>) => {
    const positions: Array<Vector3> = [];
    for (const cube of cubes) {
      positions.push(cube.position);
    }
    return positions;
  };

  const HighlightImage = (schema: CubeSchema) => {
    const cube = SchemaCube().CreateCube({
      position: schema.position,
      params: {
        width: schema.params.width + 0.2 || 2.2,
        height: schema.params.height + 0.2 || 2.2,
        color: DefaultColors().pink,
      },
    });
    cube.position.z = -0.01;
    return cube;
  };

  const ScaleBoxImage = (boxImage: Mesh, scale: Vector3) => {
    console.log(boxImage);
    boxImage.scale.set(scale.x, scale.y, scale.z);
  };

  return {
    GetCubeParams,
    GetCubePosition,
    GetCubePositions,
    CreateSchema,
    GetCubesPositions,
    HighlightImage,
    ScaleBoxImage,
  };
};

export default CubeHelper;
