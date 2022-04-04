import { Metadata } from '@/models/CollectionModel';
import { Asset, ComponentMetadata, Frame, Story } from '@/models/GraphqlModel';
import ThreeService from '@/services/ThreeService';
import Measurements from '@/Three/defaults.measurements';
import {
  BoxBufferGeometry,
  Mesh,
  Vector3,
  Group,
  MeshBasicMaterial,
} from 'three';
import MoveObject from './moveObject';
import CustomAnimation from './animation';
import AnimationDefaults from '@/Three/defaults.animation';
import MetadataLabel from '@/Three/shapes.metadataLabel';
import Common from './common';
import { Entity } from 'coghent-vue-3-component-library/lib';
import TWEEN from '@tweenjs/tween.js';
import { MediaFile } from 'coghent-vue-3-component-library/lib/queries';

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
    zoomSettings: any
  ) => Promise<Group>;
  getAssetsFromFrame: (activeStory: Entity, frame: number) => Array<Entity>;
  connectRelationMetadata: (
    parent: Frame | Story,
    child: Asset | Frame,
  ) => ComponentMetadata;
  getMediaInfoForAsset: (_assetID: string, _primaryMediafile: string, _assets: Array<Asset>) => null | MediaFile
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

  const getAssetSpotlightScale = (
    _asset: Mesh<BoxBufferGeometry, any>,
    _scale: number,
  ) => {
    let scale = 1;
    const height = Number(_asset.geometry.parameters.height)
    const width = Number(_asset.geometry.parameters.width)
    if (height > width) {
      scale =
        (height / 2) * _scale +
        Measurements().spotLight.spaceAroundObject;
    } else {
      scale =
        (width / 2) * _scale +
        Measurements().spotLight.spaceAroundObject;
    }
    return scale;
  };

  const moveSpotlightToAsset = async (
    spotlight: Mesh,
    asset: Mesh<BoxBufferGeometry, any>,
    scale: number,
    position?: Vector3,
  ) => {
    const widest = asset.geometry.parameters.width > asset.geometry.parameters.height;
    // if (widest) {
    //   const scaleForSpotlight = getAssetSpotlightScale(asset, scale);
    //   if (scaleForSpotlight > scale) {
    //     CustomAnimation().grow(
    //       spotlight as Mesh<any, MeshBasicMaterial>,
    //       scaleForSpotlight,
    //       AnimationDefaults.values.scaleStep,
    //     );
    //   } else {
    //     CustomAnimation().shrink(
    //       spotlight as Mesh<any, MeshBasicMaterial>,
    //       scaleForSpotlight,
    //       AnimationDefaults.values.scaleStep,
    //     );
    //   }
    //   await MoveObject().startMoving(
    //     spotlight,
    //     new Vector3(asset.position.x, asset.position.y, 0),
    //   );
    // } else if (!widest) {
    const scaleForSpotlight = getAssetSpotlightScale(asset, scale);
    // if (scaleForSpotlight > scale) {
    CustomAnimation().scale(
      spotlight as Mesh<any, MeshBasicMaterial>,
      scaleForSpotlight,
    );
    // } else {
    //   CustomAnimation().shrink(
    //     spotlight as Mesh<any, MeshBasicMaterial>,
    //     scaleForSpotlight,
    //     AnimationDefaults.values.scaleStep,
    //   );
    // }
    await MoveObject().startMoving(
      spotlight,
      position ? position : new Vector3(asset.position.x, asset.position.y, 0),
    );
    // }
  };

  const zoom = async (
    assetImageCube: Mesh<BoxBufferGeometry, any>,
    position: Vector3,
    scale: number,
    spotlight: Mesh,
  ) => {
    assetImageCube.material.opacity = 1;
    await new TWEEN.Tween(assetImageCube.position)
      .to(
        {
          x: position.x,
          y: position.y,
          z: -0.2,
        },
        1000,
      )
      .easing(TWEEN.Easing.Cubic.InOut)
      .start();
    const newScale = {
      x: scale,
      y: scale,
      z: assetImageCube.scale.z,
    };
    new TWEEN.Tween(assetImageCube.scale)
      .to(newScale, 1000)
      .easing(TWEEN.Easing.Cubic.InOut)
      .start();
    moveSpotlightToAsset(spotlight, assetImageCube, newScale.x, position);
  };

  const addMetadata = async (
    object: Mesh<BoxBufferGeometry, any>,
    color: number,
    text: string,
    zoomSettings: any
  ) => {
    const labelPosition: Vector3 = zoomSettings.zoomPosition

    const labelText = await MetadataLabel(new Vector3(labelPosition.x, labelPosition.y, 0.1)).label(text)

    const metadataInfo = (
      await MetadataLabel(new Vector3(labelPosition.x, labelPosition.y, 0.1)).create(labelText, color)
    ).metadata;
    const correction = (object.geometry.parameters.width / 2) * zoomSettings.scale
    if (zoomSettings.zoomPosition.x < 0) {
      metadataInfo.position.x += correction
      metadataInfo.position.x += labelText.dimensions.x / 2
      metadataInfo.position.x += labelText.dimensions.y
      metadataInfo.position.x += Measurements().spacing
    } else {
      metadataInfo.position.x -= correction
      metadataInfo.position.x -= labelText.dimensions.x / 2
      metadataInfo.position.x -= labelText.dimensions.y
      metadataInfo.position.x -= Measurements().spacing
    }
    return metadataInfo;
  };

  const setInactive = async (assetImageCube: Mesh<BoxBufferGeometry, any>) => {
    await CustomAnimation().fadeOut(
      assetImageCube,
      AnimationDefaults.values.opacityInactive,
      AnimationDefaults.values.fadeStep,
    );
  };

  const setActive = async (assetImageCube: Mesh<BoxBufferGeometry, any>) => {
    await CustomAnimation().fadeIn(
      assetImageCube,
      AnimationDefaults.values.opacityActive,
      AnimationDefaults.values.fadeStep,
    );
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

  const getMediaInfoForAsset = (_assetID: string, _primaryMediafile: string, _assets: Array<Asset>) => {
    let mediafile: null | MediaFile = null
    if(_assets.length >= 0) {
      for(const asset of _assets){
        if(asset.id === _assetID){
          if(asset.mediafiles.length >= 0){
            for(const file of asset.mediafiles){
              if(file.original_file_location && file.original_file_location === _primaryMediafile){
                mediafile = file as MediaFile
              } 
            }
          }
        }
      }
    }
    return mediafile
  }

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
    getMediaInfoForAsset,
  };
};

export default useAsset;
