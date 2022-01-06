import { Metadata } from '@/models/CollectionModel';
import { Asset, ComponentMetadata, Story } from '@/models/GraphqlModel';
import ThreeService from '@/services/ThreeService';
import { CubeParams } from '@/Three/schema.cube';
import Layers from '@/Three/defaults.layers';
import Measurements from '@/Three/defaults.measurements';
import TextHelper from '@/Three/helper.text';
import { FontParams } from '@/Three/schema.text';
import { BoxBufferGeometry, Mesh, Vector3, Group, BoxGeometry } from 'three';
import MoveObject from './moveObject';
import Positions from '@/Three/defaults.positions';
import CustomAnimation from './animation';
import AnimationDefaults from '@/Three/defaults.animation';

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
  ) => Promise<void>;
  setInactive: (assetImageCube: Mesh<BoxBufferGeometry, any>) => Promise<void>;
  setActive: (assetImageCube: Mesh<BoxBufferGeometry, any>) => Promise<void>;
  addMetadata: (
    zoomPosition: Vector3,
    object: Mesh<BoxBufferGeometry, any>,
    color: number,
    scale: number,
    text: string,
  ) => Mesh<BoxBufferGeometry, any>;
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

  const zoom = async (
    assetImageCube: Mesh<BoxBufferGeometry, any>,
    position: Vector3,
    scale: number,
  ) => {
    MoveObject().startMoving(assetImageCube, new Vector3(position.x, position.y, Layers.display));
    assetImageCube.material.opacity = 1;
    await CustomAnimation().grow(assetImageCube, scale, AnimationDefaults.values.scaleStep);

    assetImageCube.scale.set(scale, scale, Layers.display);
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
      new Vector3(zoomPosition.x, zoomPosition.y, Layers.display),
      {} as CubeParams,
      { color: color } as FontParams,
    ) as Mesh<BoxGeometry, any>;
    const middleOfText = metadataInfo.geometry.parameters.width/2;
    metadataInfo.position.set(
      object.position.x - middleOfText,
      object.position.y + Positions().metadataInfoAboveImage().y + (object.geometry.parameters.height * scale) ,
      Layers.display,
    );
    return metadataInfo;
  };

  const setInactive = async (assetImageCube: Mesh<BoxBufferGeometry, any>) => {
    assetImageCube.position.z = Layers.scene;
    await CustomAnimation().fadeOut(assetImageCube,AnimationDefaults.values.opacityInactive, AnimationDefaults.values.fadeStep);    
  };

  const setActive = async (assetImageCube: Mesh<BoxBufferGeometry, any>) => {
    assetImageCube.position.z = Layers.scene;
    await CustomAnimation().fadeIn(assetImageCube,AnimationDefaults.values.opacityActive, AnimationDefaults.values.fadeStep);
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
    setInactive,
    setActive,
    getAssetsFromFrame,
    setZoomTiming,
  };
};

export default useAsset;
