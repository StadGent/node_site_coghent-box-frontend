import Frame from '@/composables/frame';
import CubeHelper from '@/Three/CubeHelper';
import SchemaCube, { CubeSchema } from '@/Three/CubeSchema';
import GroupHelper from '@/Three/GroupHelper';
import { Entity } from 'coghent-vue-3-component-library/lib/queries';
import { Group, Mesh, Vector3 } from 'three';

const FrameOverview = (
  frame: Entity,
): {
  Create: () => Promise<{ groups: Array<Group>; schemas: Array<CubeSchema> }>;
} => {
  const GetAssets = async () => {
    return await Frame().GetAssetsFromFrame(frame.id);
  };

  const CreateImageCubes = (assets: Record<string, string>) => {
    const cubes: Array<Mesh> = [];
    const schemas: Array<CubeSchema> = [];
    let pos = -15;
    for (const key in assets) {
      const schema = CubeHelper().CreateSchema(
        new Vector3(pos, 0, 0),
        assets[key],
        new Vector3(4, 4, 0),
      );
      schemas.push(schema);
      cubes.push(SchemaCube().CreateImageCube(schema));
      pos += 6;
    }

    return {
      cubes: GroupHelper().CreateGroup(cubes),
      schemas: schemas,
    };
  };
  const Create = async () => {
    const groups: Array<Group> = [];
    const assets = await GetAssets();
    GroupHelper().AddObjectsTogroups([CreateImageCubes(assets).cubes], groups);
    return { groups: groups, schemas: CreateImageCubes(assets).schemas };
  };

  return { Create };
};

export default FrameOverview;
