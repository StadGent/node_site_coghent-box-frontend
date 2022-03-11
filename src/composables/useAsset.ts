import { Metadata } from '@/models/CollectionModel';
import { Asset, ComponentMetadata, Frame, Story } from '@/models/GraphqlModel';
import ThreeService from '@/services/ThreeService';
import Layers from '@/Three/defaults.layers';
import Measurements from '@/Three/defaults.measurements';
import { BoxBufferGeometry, Mesh, Vector3, Group, BoxGeometry, MeshBasicMaterial } from 'three';
import MoveObject from './moveObject';
import CustomAnimation from './animation';
import AnimationDefaults from '@/Three/defaults.animation';
import MetadataLabel from '@/Three/shapes.metadataLabel';
import Common from './common';
import Spot from '@/Three/shapes.spotlight';
import { Tags } from '@/services/TaggingService';
import { Entity } from 'coghent-vue-3-component-library/lib';

const useAsset = (
  threeService: ThreeService,
): {
  getTitle: (asset: Asset) => string;
  getCollections: (asset: Asset) => Array<Metadata>;
  getImage: (asset: Asset) => string;
  getAssetSpotlightScale: (asset: Mesh<BoxBufferGeometry, any>, scale: number) => number;
  moveSpotlightToAsset: (
    spotlight: Mesh,
    asset: Mesh<BoxBufferGeometry, any>,
    scale: number,
  ) => Promise<void>;
  zoom: (
    assetImageCube: Mesh<BoxBufferGeometry, any>,
    position: Vector3,
    scale: number,
    spotlight: Mesh,
  ) => Promise<void>;
  setInactive: (assetImageCube: Mesh<BoxBufferGeometry, any>) => Promise<void>;
  setActive: (assetImageCube: Mesh<BoxBufferGeometry, any>) => Promise<void>;
  addMetadata: (
    object: Mesh<BoxBufferGeometry, any>,
    color: number,
    text: string,
  ) => Promise<Group>;
  getAssetsFromFrame: (activeStory: Entity, frame: number) => Array<Entity>;
  connectRelationMetadata: (
    parent: Frame | Story,
    child: Asset | Frame,
  ) => ComponentMetadata;
} => {
  const getTitle = (asset: Asset) => {
    return asset.title[0]?.value;
  };

  const getCollections = (asset: Asset) => {
    return asset.collections;
  };

  const getImage = (asset: Asset) => {
    return asset.primary_mediafile_location;
    // return asset.mediafiles?.[0]?.original_file_location
    //   ? asset.mediafiles?.[0]?.original_file_location
    //   : '';
  };

  const getAssetSpotlightScale = (_asset: Mesh<BoxBufferGeometry, any>, _scale: number) => {
    let scale = 1;
    if (_asset.geometry.parameters.height > _asset.geometry.parameters.width) {
      scale = (_asset.geometry.parameters.height / 2) * _scale + Measurements().spotLight.spaceAroundObject;
    } else {
      scale = (_asset.geometry.parameters.width / 2) * _scale + Measurements().spotLight.spaceAroundObject
    }
    return scale;
  }

  const moveSpotlightToAsset = async (
    spotlight: Mesh,
    asset: Mesh<BoxBufferGeometry, any>,
    scale: number,
  ) => {
    const widest = asset.geometry.parameters.width > asset.geometry.parameters.height;
    setActive(asset);
    if (widest) {
      const scaleForSpotlight = getAssetSpotlightScale(asset, scale);
      if (scaleForSpotlight > scale) {
        CustomAnimation().grow(spotlight as Mesh<any, MeshBasicMaterial>, scaleForSpotlight, AnimationDefaults.values.scaleStep);
      } else {
        CustomAnimation().shrink(spotlight as Mesh<any, MeshBasicMaterial>, scaleForSpotlight, AnimationDefaults.values.scaleStep);
      }
      await MoveObject().startMoving(spotlight, asset.position);
    } else if (!widest) {
      const scaleForSpotlight = getAssetSpotlightScale(asset, scale);
      if (scaleForSpotlight > scale) {
        CustomAnimation().grow(spotlight as Mesh<any, MeshBasicMaterial>, scaleForSpotlight, AnimationDefaults.values.scaleStep);
      } else {
        CustomAnimation().shrink(spotlight as Mesh<any, MeshBasicMaterial>, scaleForSpotlight, AnimationDefaults.values.scaleStep);
      }
      await MoveObject().startMoving(spotlight, asset.position);
    }
  };

  const zoom = async (
    assetImageCube: Mesh<BoxBufferGeometry, any>,
    position: Vector3,
    scale: number,
    spotlight: Mesh,
  ) => {
    console.log('scale in zoom', scale)
    if (scale > 1) {
      scale = 1;
    }
    assetImageCube.material.opacity = 1;
    assetImageCube.position.set(position.x, position.y, position.z);
    assetImageCube.position.z =  position.z + Layers.fraction;
    await moveSpotlightToAsset(spotlight, assetImageCube, scale);
    await Common().awaitTimeout(200);
    // await CustomAnimation().grow(assetImageCube, scale, AnimationDefaults.values.scaleStep);
    assetImageCube.scale.set(scale,scale,scale)
  };

  const addMetadata = async (
    object: Mesh<BoxBufferGeometry, any>,
    color: number,
    text: string,
  ) => {
    console.log(text)
    console.log('added with spaces', Common().fillStringToIdealLength(text))
    const metadataInfo = (await MetadataLabel(
      new Vector3(
        object.position.x,
        object.position.y + ((object.geometry.parameters.height / 2) * object.scale.x) + 0.6,
        Layers.presentation
      )
    ).create(text, color)).metadata;
    return metadataInfo;
  };

  const setInactive = async (assetImageCube: Mesh<BoxBufferGeometry, any>) => {
    await CustomAnimation().fadeOut(assetImageCube, AnimationDefaults.values.opacityInactive, AnimationDefaults.values.fadeStep);
  };

  const setActive = async (assetImageCube: Mesh<BoxBufferGeometry, any>) => {
    await CustomAnimation().fadeIn(assetImageCube, AnimationDefaults.values.opacityActive, AnimationDefaults.values.fadeStep);
  };

  const getAssetsFromFrame = (activeStory: Entity, frame: number) => {
    return activeStory.frames?.[frame]?.assets as Array<Entity>;
  };

  const connectRelationMetadata = (parent: Frame | Story, child: Asset | Frame) => {
    const metadataForAsset = parent.relationMetadata.filter(
      (metadata) => Common().FilterOutIdAfterSlash(metadata.key) == child.id,
    )[0];
    return metadataForAsset;
  };

  return {
    getTitle,
    getCollections,
    getImage,
    getAssetSpotlightScale,
    moveSpotlightToAsset,
    zoom,
    addMetadata,
    setInactive,
    setActive,
    getAssetsFromFrame,
    connectRelationMetadata,
  };
};

export default useAsset;
