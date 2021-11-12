import Frame from '@/composables/frame';
import CubeHelper from '@/Three/CubeHelper';
import SchemaCube from '@/Three/CubeSchema';
import GroupHelper from '@/Three/GroupHelper';
import { Entity } from 'coghent-vue-3-component-library/lib/queries';
import { Group, Mesh, Vector3 } from 'three';

const FrameOverview = (
  frame: Entity,
): {
  Create: () => Promise<{ groups: Array<Group>; positions: Array<Vector3> }>;
} => {
  const GetAssets = async () => {
    return await Frame().GetAssetsFromFrame(frame.id);
  };

  const CreateImageCubes = (assets: Record<string, string>) => {
    const cubes: Array<Mesh> = [];
    let pos = 0;
    for (const key in assets) {
      const schema = CubeHelper().CreateSchema(
        new Vector3(pos, 0, 0),
        assets[key],
        new Vector3(4, 4, 0),
      );
      cubes.push(SchemaCube().CreateImageCube(schema));
      pos += 6;
    }

    return {
      cubes: GroupHelper().CreateGroup(cubes),
      positions: CubeHelper().GetCubePositions(cubes),
    };
  };
  const Create = async () => {
    const groups: Array<Group> = [];
    console.log('frame => ', frame);
    const assets = await GetAssets();
    console.log('assets fromt frame => ', assets);
    GroupHelper().AddObjectsTogroups([CreateImageCubes(assets).cubes], groups);
    return { groups: groups, positions: CreateImageCubes(assets).positions };
  };

  return { Create };
};

export default FrameOverview;
