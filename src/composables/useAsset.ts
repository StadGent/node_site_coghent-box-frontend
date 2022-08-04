import { Metadata } from '@/models/CollectionModel';
import { Asset, ComponentMetadata, Frame, Story } from '@/models/GraphqlModel';
import ThreeService from '@/services/ThreeService';
import Measurements from '@/Three/defaults.measurements';
import { BoxBufferGeometry, Mesh, Vector3, Group, MeshBasicMaterial } from 'three';
import MoveObject from './moveObject';
import CustomAnimation from './animation';
import AnimationDefaults from '@/Three/defaults.animation';
import MetadataLabel from '@/Three/shapes.metadataLabel';
import Common from './common';
import { Entity } from 'coghent-vue-3-component-library/lib';
import TWEEN from '@tweenjs/tween.js';
import { MediaFile, Relation } from 'coghent-vue-3-component-library/lib/queries';

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
    zoomSettings: any,
  ) => Promise<Group>;
  getAssetsFromFrame: (activeStory: Entity, frame: number) => Array<Entity>;
  connectRelationMetadata: (
    parent: Frame | Story,
    child: Asset | Frame,
    _currentAssetIndex: number,
  ) => ComponentMetadata;
  getMediaInfoForAsset: (
    _assetID: string,
    _primaryMediafile: string,
    _assets: Array<Asset>,
  ) => null | MediaFile;
  updateAssetMediafileToSetMediafile: (_asset: Asset, _relationMetadata: Relation, _originalMediafile: MediaFile) => Promise<MediaFile>;
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
    const height = Number(_asset.geometry.parameters.height);
    const width = Number(_asset.geometry.parameters.width);

    if (height > width) {
      const diagonalOfSquare = Math.SQRT2 * _asset.geometry.parameters.height;
      scale =
        (diagonalOfSquare / 2) * _scale + Measurements().spotLight.spaceAroundObject;
    } else {
      const diagonalOfSquare = Math.SQRT2 * _asset.geometry.parameters.width;
      scale =
        (diagonalOfSquare / 2) * _scale + Measurements().spotLight.spaceAroundObject;
    }
    return scale;
  };

  const moveSpotlightToAsset = async (
    spotlight: Mesh,
    asset: Mesh<BoxBufferGeometry, any>,
    scale: number,
    position?: Vector3,
  ) => {
    const scaleForSpotlight = getAssetSpotlightScale(asset, scale);
    CustomAnimation().scale(spotlight as Mesh<any, MeshBasicMaterial>, scaleForSpotlight);
    await MoveObject().startMoving(
      spotlight,
      position ? position : new Vector3(asset.position.x, asset.position.y, 0),
    );
  };

  const zoom = async (
    assetImageCube: Mesh<BoxBufferGeometry, any>,
    position: Vector3,
    scale: number,
    spotlight: Mesh,
  ) => {
    assetImageCube.material.opacity = 1;
    assetImageCube.rotateZ(assetImageCube.rotation.z > 0 ? -0.05 : 0.05);
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
    zoomSettings: any,
  ) => {
    const labelPosition: Vector3 = zoomSettings.zoomPosition;

    const labelText = await MetadataLabel(
      new Vector3(labelPosition.x, labelPosition.y, 0.1),
    ).label(text);

    const metadataInfo = (
      await MetadataLabel(new Vector3(labelPosition.x, labelPosition.y, 0.1)).create(
        labelText,
        color,
      )
    ).metadata;
    const correction = (object.geometry.parameters.width / 2) * zoomSettings.scale;
    if (zoomSettings.zoomPosition.x < 0) {
      metadataInfo.position.x += correction;
      metadataInfo.position.x += labelText.dimensions.x / 2;
      metadataInfo.position.x += labelText.dimensions.y;
      metadataInfo.position.x += Measurements().spacing;
    } else {
      metadataInfo.position.x -= correction;
      metadataInfo.position.x -= labelText.dimensions.x / 2;
      metadataInfo.position.x -= labelText.dimensions.y;
      metadataInfo.position.x -= Measurements().spacing;
    }
    metadataInfo.position.y += labelText.dimensions.y + Measurements().text.paddingAround;
    metadataInfo.position.setZ(0.3);
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

  const connectRelationMetadata = (parent: Frame | Story, child: Asset | Frame, _currentAssetIndex: number) => {
    // console.log(`useAsset | connectRelationMetadata | Frame`, parent)
    // console.log(`useAsset | connectRelationMetadata | Child`, child)
    const frame = parent as Frame
    const assets = frame.assets as Array<Asset>
    // console.log(`useAsset | connectRelationMetadata | Assets of frame`, assets)
    const assetDuplicates = assets.filter(_asset => _asset.id === child.id)
    // console.log(`useAsset | connectRelationMetadata | assetDuplicatesof assets`, assetDuplicates)

    const indexes: Array<number> = []
    let setMetadata = 0
    if (assetDuplicates.length > 1) {
      for (const [index, asset] of assets.entries()) {
        if (asset.id === child.id) {
          indexes.push(index)
        }
      }

      const itemToMatch = indexes.indexOf(_currentAssetIndex)
      itemToMatch != -1 ? setMetadata = itemToMatch : null
    }
    // console.log(`useAsset | connectRelationMetadata | setMetadata`, setMetadata)
    const metadataForAsset = frame.relationMetadata.filter(
      (metadata) => Common().FilterOutIdAfterSlash(metadata.key) == child.id,
    )[setMetadata];
    // console.log(`useAsset | connectRelationMetadata | metadataForAsset ID`, child.id)
    // console.log(`useAsset | connectRelationMetadata | metadataForAsset`, metadataForAsset)
    return metadataForAsset;
  };

  const getMediaInfoForAsset = (
    _assetID: string,
    _primaryMediafile: string,
    _assets: Array<Asset>,
  ) => {
    let mediafile: null | MediaFile = null;
    if (_assets.length >= 0) {
      for (const asset of _assets) {
        if (asset.id === _assetID) {
          if (asset.mediafiles.length >= 0) {
            for (const file of asset.mediafiles) {
              if (
                file.original_file_location &&
                file.original_file_location === _primaryMediafile
              ) {
                mediafile = file as MediaFile;
              }
            }
          }
        }
      }
    }
    return mediafile;
  };

  // This overrride the mediafile if property setMediafile is set in the relationdata
  // Wanted to do this in the graphql by just setting the primary mediafile but this was not possible..
  const updateAssetMediafileToSetMediafile = async (_asset: Asset, _relationMetadata: Relation, _originalMediafile: MediaFile): Promise<MediaFile> => {
    return new Promise((resolve, reject) => {
      if (_relationMetadata.setMediafile && _relationMetadata.setMediafile !== null) {
        const setMediafileIndex = _relationMetadata.setMediafile - 1
        if (_asset.mediafiles[setMediafileIndex]) {
          resolve(_asset.mediafiles[setMediafileIndex])
        }
      } else resolve(_originalMediafile)
    })
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
    updateAssetMediafileToSetMediafile,
  };
};

export default useAsset;
