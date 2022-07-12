import Common from '@/composables/common';
import useAsset from '@/composables/useAsset';
import { Asset } from '@/models/GraphqlModel';
import ThreeService from '@/services/ThreeService';
import CubeHelper from '@/Three/helper.cube';
import SchemaCube, { CubeSchema } from '@/Three/schema.cube';
import Layers from '@/Three/defaults.layers';
import GroupHelper from '@/Three/helper.group';
import { BoxGeometry, Group, Mesh, MeshBasicMaterial, Vector3 } from 'three';
import { iiiF } from '@/main';
import { MediaFile } from 'coghent-vue-3-component-library/lib/queries';

const FrameOverview = (
  threeService: ThreeService,
): {
  addImage: (_mediafile: MediaFile, scale: number, position: Vector3, _dimensions: Vector3) => Promise<Mesh | null>;
  create: (assets: Record<string, string>) => {
    groups: Array<Group>;
    schemas: Array<CubeSchema>;
  };
} => {
  const { generateUrl } = iiiF;

  const addImage = async (_mediafile: MediaFile, scale: number, position: Vector3, _dimensions: Vector3) => {
    let cube: Mesh<BoxGeometry, MeshBasicMaterial> | null = null
    console.log(`_mendiafile`, _mediafile)
    if (_mediafile.original_file_location && _mediafile.mediainfo) {
      const schema = CubeHelper().CreateSchema(
        position,
        _mediafile.original_file_location,
        new Vector3(
          _dimensions.x,
          _dimensions.y,
          _dimensions.z,
        ),
      );
      const filename = Common().getFilenameFromStorageLink(
        schema.params.url as string,
        'download/',
      );

      // _mediafile.transcode_filename ? schema.params.url = generateUrl(encodeURI(_mediafile.transcode_filename), 'full', 'max') : schema.params.url = generateUrl(filename, 'full', 'max');
      if (_mediafile.transcode_filename != null) {
        console.log(`USING TRANSCODE`, _mediafile.transcode_filename)
        console.log(`filename transcode encodeURI(_mediafile.transcode_filename)`, encodeURI(_mediafile.transcode_filename ? _mediafile.transcode_filename : ''))
        console.log(`generatenurl transcode encodeURI(_mediafile.transcode_filename)`, generateUrl(encodeURI(_mediafile.transcode_filename ? _mediafile.transcode_filename : ''), 'full', 'max'))
        schema.params.url = generateUrl(encodeURI(_mediafile.transcode_filename), 'full', 'max')
      } else {
        console.log(`USING ORIGINAL`, _mediafile.original_file_location)
        console.log(`filename`, filename)
        console.log(`generate orginal url`, generateUrl(filename, 'full', 'max'))
        schema.params.url = generateUrl(filename, 'full', 'max');
      }

      // console.log(`ALWAYS USING ORIGINAL FILENAME `)
      // schema.params.url = generateUrl(filename, 'full', 'max')
      // console.log(`filename`, schema.params.url);
      console.log(`\n`);
      cube = await SchemaCube().CreateImageCubeAsync(
        schema,
        threeService.cachedTextures,
      );
      cube.scale.set(scale, scale, 0);
      cube.material.opacity = 1;
    }
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
