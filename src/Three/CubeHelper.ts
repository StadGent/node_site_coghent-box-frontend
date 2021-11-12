import { Mesh, BoxGeometry, MeshBasicMaterial, Vector3 } from 'three';
import { CubeParams, CubeSchema } from './CubeSchema';

const CubeHelper = (): {
  GetCubeParams: (cube: Mesh<BoxGeometry, MeshBasicMaterial>) => CubeParams;
  GetCubePosition: (cube: Mesh) => Vector3;
  GetCubePositions: (cubes: Array<Mesh>) => Array<Vector3>;
  CreateSchema: (position: Vector3, url: string) => CubeSchema;
  GetCubesPositions: (cubes: Array<Mesh>) => Array<Vector3>;
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

  const CreateSchema = (position: Vector3, url: string) => {
    return {
      position: position as Vector3,
      params: {
        width: 2,
        height: 2,
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
  return {
    GetCubeParams,
    GetCubePosition,
    GetCubePositions,
    CreateSchema,
    GetCubesPositions,
  };
};

export default CubeHelper;
