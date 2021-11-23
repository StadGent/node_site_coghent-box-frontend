import { Metadata } from '@/models/CollectionModel';
import { Asset, Story } from '@/models/GraphqlModel';
import CubeHelper from '@/Three/CubeHelper';
import Layers from '@/Three/defaults.layers';
import GroupHelper from '@/Three/GroupHelper';
import TextHelper from '@/Three/TextHelper';
import { FontParams } from '@/Three/Textschema';
import { BoxBufferGeometry, Mesh, Vector3, Group } from 'three';
import Frame from './frame';
import useStory from './useStory';

const useAsset = (): {
  getCollections: (asset: Asset) => Array<Metadata>;
  getDimensions: (asset: Asset) => Array<Metadata>;
  getImage: (asset: Asset) => string;
  zoom: (assetImageCube: Mesh<BoxBufferGeometry, any>, screenHeight: number) => void;
  setInactive: (assetImageCube: Mesh<BoxBufferGeometry, any>) => void;
  addMetadataToZoomedImage: (
    asset: Asset,
    assetImageCube: Mesh<BoxBufferGeometry, any>,
    storyColor: number,
  ) => Group;
  getAssetsFromFrame: (activeStory: Story, frame: number) => Array<Asset>;
} => {
  const getTitle = (asset: Asset) => {
    return asset.title[0].value;
  };

  const getCollections = (asset: Asset) => {
    return asset.metadata.filter((data) => data.key === 'collection');
  };

  const getDimensions = (asset: Asset) => {
    return asset.metadata.filter(
      (data) => data.key === 'hoogte' || data.key === 'diameter',
    );
  };

  const getImage = (asset: Asset) => {
    return asset.mediafiles?.[0]?.original_file_location
      ? asset.mediafiles?.[0]?.original_file_location
      : 'http://localhost:8001/download/4226243bcfd8986cc128e5f5241589b9-2015-0070.JPG';
  };

  const zoom = (assetImageCube: Mesh<BoxBufferGeometry, any>, screenHeight: number) => {
    assetImageCube.position.set(assetImageCube.position.x, -1, assetImageCube.position.z);
    assetImageCube.scale.set(3.2, 3.2 % screenHeight, Layers.presentation);
  };

  const addMetadataToZoomedImage = (
    asset: Asset,
    assetImageCube: Mesh<BoxBufferGeometry, any>,
    storyColor: number,
  ) => {
    const cubeParams = CubeHelper().GetCubeParams(assetImageCube);

    const schema = CubeHelper().CreateSchema(
      assetImageCube.position,
      '',
      new Vector3(cubeParams.width, cubeParams.height, Layers.presentation),
    );
    schema.params.color = storyColor;
    const cube = CubeHelper().HighlightImage(schema, storyColor);
    cube.scale.set(
      assetImageCube.scale.x,
      assetImageCube.scale.y,
      assetImageCube.scale.z,
    );
    assetImageCube.material.opacity = 1;
    const textPosition = new Vector3(
      assetImageCube.position.x - cubeParams.width /2.5 * cube.scale.x,
      assetImageCube.position.y + cubeParams.height / 2* cube.scale.y,
      assetImageCube.position.z,
    );
    const text = TextHelper().CreateText(`${getTitle(asset)}, ${useAsset().getCollections(asset)[0].value}`, textPosition, undefined, {
      color: storyColor,
    } as FontParams);
    return GroupHelper().CreateGroup([text, cube]);
  };

  const setInactive = (assetImageCube: Mesh<BoxBufferGeometry, any>) => {
    assetImageCube.material.opacity = 0.5;
    assetImageCube.position.z = Layers.scene;
  };

  const getAssetsFromFrame = (activeStory: Story, frame: number) => {
    return activeStory.frames[frame].assets;
  };

  return {
    getCollections,
    getDimensions,
    getImage,
    zoom,
    addMetadataToZoomedImage,
    setInactive,
    getAssetsFromFrame,
  };
};

export default useAsset;
