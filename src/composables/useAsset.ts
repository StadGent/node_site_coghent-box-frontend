import { Metadata } from '@/models/CollectionModel';
import { Asset, Story } from '@/models/GraphqlModel';
import ThreeService from '@/services/ThreeService';
import CubeHelper from '@/Three/CubeHelper';
import Layers from '@/Three/defaults.layers';
import GroupHelper from '@/Three/GroupHelper';
import TextHelper from '@/Three/TextHelper';
import { FontParams } from '@/Three/Textschema';
import { BoxBufferGeometry, Mesh, Vector3, Group } from 'three';
import Common from './common';

const useAsset = (threeService: ThreeService): {
  getCollections: (asset: Asset) => Array<Metadata>;
  getImage: (asset: Asset) => string;
  moveSpotlightToAsset:(spotlight: Mesh, asset: Mesh<BoxBufferGeometry, any>) => void;
  zoom: (assetImageCube: Mesh<BoxBufferGeometry, any>, spotlight: Mesh, scale: number) => void;
  setInactive: (assetImageCube: Mesh<BoxBufferGeometry, any>) => void;
  setActive: (assetImageCube: Mesh<BoxBufferGeometry, any>) => void;
  addMetadataToZoomedImage: (
    asset: Asset,
    assetImageCube: Mesh<BoxBufferGeometry, any>,
    storyColor: number,
  ) => Group;
  getAssetsFromFrame: (activeStory: Story, frame: number) => Array<Asset>;
} => {
  
  const getTitle = (asset: Asset) => {
    return asset.title[0]?.value;
  };

  const getCollections = (asset: Asset) => {
    return asset.collections;
  };

  const getImage = (asset: Asset) => {
    return asset.mediafiles?.[0]?.original_file_location
      ? asset.mediafiles?.[0]?.original_file_location
      : 'http://localhost:8001/download/4226243bcfd8986cc128e5f5241589b9-2015-0070.JPG';
  };

  const moveSpotlightToAsset = (spotlight: Mesh, asset: Mesh<BoxBufferGeometry, any>) => {
    const widest = asset.geometry.parameters.width > asset.geometry.parameters.height;
    if(widest){
      spotlight.scale.set(asset.geometry.parameters.width + 0.1 / 2 + 1, asset.geometry.parameters.width + 0.1 / 2 + 1, Layers.scene);
      Common().moveObject(spotlight,asset.position);
    }else{
      spotlight.scale.set(asset.geometry.parameters.width + 0.1 / 2 + 1, asset.geometry.parameters.width + 0.1 / 2 + 1, Layers.scene);
      Common().moveObject(spotlight,asset.position);
    }
    setActive(asset);
  };

  const zoom = (assetImageCube: Mesh<BoxBufferGeometry, any>, spotlight: Mesh, scale: number) => {
    assetImageCube.position.set(assetImageCube.position.x, 0, assetImageCube.position.z);
    moveSpotlightToAsset(spotlight,assetImageCube);
    assetImageCube.material.opacity = 1;
    assetImageCube.scale.set(scale, scale, Layers.presentation);
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
    schema.position.z = Layers.presentation;
    const cube = CubeHelper().HighlightImage(schema, storyColor);    
    cube.scale.set(
      assetImageCube.scale.x,
      assetImageCube.scale.y,
      Layers.presentation,
    );

    const textPosition = new Vector3(
      assetImageCube.position.x - cubeParams.width /2.5 * cube.scale.x,
      assetImageCube.position.y + cubeParams.height / 2* cube.scale.y,
      assetImageCube.position.z,
    );

    const text = TextHelper().CreateText(`${getTitle(asset)?!undefined:''} (${getCollections(asset)[0]?.value?!undefined:''})`, textPosition, undefined, {
      color: storyColor,
    } as FontParams);
  
    return GroupHelper().CreateGroup([text, cube]);
  };

  const setInactive = (assetImageCube: Mesh<BoxBufferGeometry, any>) => {
    assetImageCube.material.opacity = 0.5;
    assetImageCube.position.z = Layers.scene;
  };

  const setActive = (assetImageCube: Mesh<BoxBufferGeometry, any>) => {
    assetImageCube.material.opacity = 1;
    assetImageCube.position.z = Layers.scene;
  };

  const getAssetsFromFrame = (activeStory: Story, frame: number) => {
    return activeStory.frames[frame].assets;
  };

  return {
    getCollections,
    getImage,
    moveSpotlightToAsset,
    zoom,
    addMetadataToZoomedImage,
    setInactive,
    setActive,
    getAssetsFromFrame,
  };
};

export default useAsset;
