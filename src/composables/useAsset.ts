import { Metadata } from '@/models/CollectionModel';
import { Asset, ComponentMetadata, Story } from '@/models/GraphqlModel';
import ThreeService from '@/services/ThreeService';
import CubeHelper from '@/Three/helper.cube';
import { CubeParams } from '@/Three/schema.cube';
import Layers from '@/Three/defaults.layers';
import Measurements from '@/Three/defaults.measurements';
import GroupHelper from '@/Three/helper.group';
import TextHelper from '@/Three/helper.text';
import { FontParams } from '@/Three/schema.text';
import { BoxBufferGeometry, Mesh, Vector3, Group, BoxGeometry } from 'three';
import MoveObject from './moveObject';

const useAsset = (
  threeService: ThreeService,
): {
  getTitle: (asset: Asset) => string;
  getCollections: (asset: Asset) => Array<Metadata>;
  getImage: (asset: Asset) => string;
  moveSpotlightToAsset: (
    spotlight: Mesh,
    asset: Mesh<BoxBufferGeometry, any>,
    scale: number,
  ) => Promise<void>;
  zoom: (
    assetImageCube: Mesh<BoxBufferGeometry, any>,
    position: Vector3,
    scale: number,
  ) => void;
  setInactive: (assetImageCube: Mesh<BoxBufferGeometry, any>) => void;
  setActive: (assetImageCube: Mesh<BoxBufferGeometry, any>) => void;
  addMetadata: (
    zoomPosition: Vector3,
    object: Mesh<BoxBufferGeometry, any>,
    color: number,
    scale: number,
    text: string,
  ) => Mesh<BoxBufferGeometry, any>;
  addMetadataToZoomedImage: (
    asset: Asset,
    assetImageCube: Mesh<BoxBufferGeometry, any>,
    storyColor: number,
  ) => Group;
  getAssetsFromFrame: (activeStory: Story, frame: number) => Array<Asset>;
  setZoomTiming: (relationMetadata: ComponentMetadata) => number;
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

  const moveSpotlightToAsset = async (
    spotlight: Mesh,
    asset: Mesh<BoxBufferGeometry, any>,
    scale: number,
  ) => {
    const widest = asset.geometry.parameters.width > asset.geometry.parameters.height;
    if (widest) {
      spotlight.scale.set(
        (asset.geometry.parameters.width / 2) * scale  + Measurements().spotLight.spaceAroundObject,
        (asset.geometry.parameters.width / 2) * scale + Measurements().spotLight.spaceAroundObject,
        Layers.scene,
      );
      await MoveObject().startMoving(spotlight, asset.position);
    } else {
      spotlight.scale.set(
        (asset.geometry.parameters.height / 2) * scale + Measurements().spotLight.spaceAroundObject,
        (asset.geometry.parameters.height / 2) * scale + Measurements().spotLight.spaceAroundObject,
        Layers.scene,
      );
      await MoveObject().startMoving(spotlight, asset.position);
    }
    setActive(asset);
  };

  const zoom = (
    assetImageCube: Mesh<BoxBufferGeometry, any>,
    position: Vector3,
    scale: number,
  ) => {
    assetImageCube.position.set(position.x, position.y, position.z);
    assetImageCube.material.opacity = 1;
    assetImageCube.scale.set(0, 0, 0);
    assetImageCube.scale.set(scale, scale, Layers.presentation);
  };

  const addMetadata = (
    zoomPosition: Vector3,
    object: Mesh<BoxBufferGeometry, any>,
    color: number,
    scale: number,
    text: string,
  ) => {
    const metadataInfo = TextHelper().CreateText(
      text,
      zoomPosition,
      {} as CubeParams,
      { color: color } as FontParams,
    ) as Mesh<BoxGeometry, any>;
    let rest =
      object.geometry.parameters.width * scale - metadataInfo.geometry.parameters.width;
    if (object.position.x < 0) {
      rest = -rest;
    }
    metadataInfo.position.set(
      (object.position.x - rest / 2) * scale,
      (object.position.y + object.geometry.parameters.height / 2) * scale,
      object.position.z,
    );
    return metadataInfo;
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
    cube.scale.set(assetImageCube.scale.x, assetImageCube.scale.y, Layers.presentation);

    const textPosition = new Vector3(
      assetImageCube.position.x - (cubeParams.width / 2.5) * cube.scale.x,
      assetImageCube.position.y + (cubeParams.height / 2) * cube.scale.y,
      assetImageCube.position.z,
    );

    const text = TextHelper().CreateText(
      `${getTitle(asset) ? !undefined : ''} (${
        getCollections(asset)[0]?.value ? !undefined : ''
      })`,
      textPosition,
      undefined,
      {
        color: storyColor,
      } as FontParams,
    );

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

  const setZoomTiming = (relationMetadata: ComponentMetadata) => {
    let timeToZoom = relationMetadata.timestamp_zoom;
    if (
      relationMetadata.timestamp_zoom == undefined ||
      relationMetadata.timestamp_start > relationMetadata.timestamp_zoom ||
      relationMetadata.timestamp_zoom > relationMetadata.timestamp_end
    ) {
      timeToZoom = relationMetadata.timestamp_start;
    }
    return timeToZoom;
  };

  return {
    getTitle,
    getCollections,
    getImage,
    moveSpotlightToAsset,
    zoom,
    addMetadata,
    addMetadataToZoomedImage,
    setInactive,
    setActive,
    getAssetsFromFrame,
    setZoomTiming,
  };
};

export default useAsset;
