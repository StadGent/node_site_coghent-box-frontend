import { Mesh, BoxGeometry, MeshBasicMaterial } from 'three';
import { CubeParams } from './CubeSchema';

const CubeHelper = (): {
  GetCubeParams: (cube: Mesh<BoxGeometry, MeshBasicMaterial>) => CubeParams;
} => {
  const GetCubeParams = (cube: Mesh<BoxGeometry, MeshBasicMaterial>) => {
    return cube.geometry.parameters as CubeParams;
  };
  return { GetCubeParams };
};

export default CubeHelper;
