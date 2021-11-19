import CubeHelper from '@/Three/CubeHelper';
import SchemaCube, { CubeSchema } from '@/Three/CubeSchema';
import Layers from '@/Three/defaults.layers';
import GroupHelper from '@/Three/GroupHelper';
import { Group, Mesh, Vector3 } from 'three';

const FrameOverview = (): {
  Create: (assets: Record<string, string>) => {
    groups: Array<Group>;
    schemas: Array<CubeSchema>;
  };
} => {
  const CreateImageCubes = (assets: Record<string, string>) => {
    const cubes: Array<Mesh> = [];
    const schemas: Array<CubeSchema> = [];
    let pos = -15;
    for (const key in assets) {
      const schema = CubeHelper().CreateSchema(
        new Vector3(pos, 0, Layers.presentation),
        assets[key],
        new Vector3(4, 4, 0),
      );
      schemas.push(schema);
      cubes.push(SchemaCube().CreateImageCube(schema));
      pos += 8;
    }

    return {
      cubes: GroupHelper().CreateGroup(cubes),
      schemas: schemas,
    };
  };
  const Create = (assets: Record<string, string>) => {
    const groups: Array<Group> = [];
    GroupHelper().AddObjectsTogroups([CreateImageCubes(assets).cubes], groups);
    return { groups: groups, schemas: CreateImageCubes(assets).schemas };
  };

  return { Create };
};

export default FrameOverview;
