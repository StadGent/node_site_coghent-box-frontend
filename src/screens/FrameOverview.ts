import Common from '@/composables/common';
import useAsset from '@/composables/useAsset';
import { Asset } from '@/models/GraphqlModel';
import ThreeService from '@/services/ThreeService';
import CubeHelper from '@/Three/helper.cube';
import SchemaCube, { CubeSchema } from '@/Three/schema.cube';
import Layers from '@/Three/defaults.layers';
import GroupHelper from '@/Three/helper.group';
import { Group, Mesh, Vector3 } from 'three';

const FrameOverview = (threeService: ThreeService): {
  addImage:(asset: Asset, scale:number, position: Vector3) => Promise<Mesh>;
  create: (assets: Record<string, string>) => {
    groups: Array<Group>;
    schemas: Array<CubeSchema>;
  };
} => {

  const addImage = async (asset: Asset, scale: number, position: Vector3) => {
    // const schema = CubeHelper().CreateSchema(position,useAsset(threeService).getImage(asset),new Vector3(3,2,0));
    const schema = CubeHelper().CreateSchema(position,useAsset(threeService).getImage(asset),new Vector3(Common().pixelsToMeters(asset.mediafiles[0]?.mediainfo.width), Common().pixelsToMeters(asset.mediafiles[0]?.mediainfo.height),0));
    console.log('schema url', schema.params.url)
    const cube = await SchemaCube().CreateImageCubeAsync(schema);
    // cube.scale.set(0,0,0);
    cube.scale.set(scale,scale,scale);
    cube.material.opacity = 0;
    return cube;
  };

  const createImageCubes = (assets: Record<string, string>) => {
  
    const cubes: Array<Mesh> = [];
    const schemas: Array<CubeSchema> = [];
    let pos = -15;
    for (const key in assets) {
      const schema = CubeHelper().CreateSchema(
        new Vector3(pos, 0, Layers.scene),
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
