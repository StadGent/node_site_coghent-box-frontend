import { Mesh, BoxGeometry, MeshBasicMaterial, Vector3 } from 'three';
import { CubeParams, CubeSchema } from './CubeSchema';

const CubeHelper = (): {
  GetCubeParams: (cube: Mesh<BoxGeometry, MeshBasicMaterial>) => CubeParams;
  CreateSchema: (position: Vector3, url: string) => CubeSchema;
} => {
  const GetCubeParams = (cube: Mesh<BoxGeometry, MeshBasicMaterial>) => {
    return cube.geometry.parameters as CubeParams;
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
  return { GetCubeParams, CreateSchema };
};

export default CubeHelper;
