import Common from '@/composables/common';
import useAsset from '@/composables/useAsset';
import { Asset } from '@/models/GraphqlModel';
import ThreeService from '@/services/ThreeService';
import CubeHelper from '@/Three/CubeHelper';
import SchemaCube, { CubeSchema } from '@/Three/CubeSchema';
import Layers from '@/Three/defaults.layers';
import GroupHelper from '@/Three/GroupHelper';
import { Group, Mesh, Vector3 } from 'three';

const FrameOverview = (threeService: ThreeService): {
  addImage:(asset: Asset, position: Vector3) => Mesh;
  create: (assets: Record<string, string>) => {
    groups: Array<Group>;
    schemas: Array<CubeSchema>;
  };
} => {

  const addImage = (asset: Asset, position: Vector3) => {
    const schema = CubeHelper().CreateSchema(position,useAsset(threeService).getImage(asset),new Vector3(Common().pixelsToMeters(asset.mediafiles[0]?.mediainfo.width), Common().pixelsToMeters(asset.mediafiles[0]?.mediainfo.height),0));
    const cube = SchemaCube().CreateImageCube(schema);
    return cube;
  };

  const createImageCubes = (assets: Record<string, string>) => {
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
  const create = (assets: Record<string, string>) => {
    const groups: Array<Group> = [];
    GroupHelper().AddObjectsTogroups([createImageCubes(assets).cubes], groups);
    return { groups: groups, schemas: createImageCubes(assets).schemas };
  };

  return { create, addImage };
};

export default FrameOverview;
