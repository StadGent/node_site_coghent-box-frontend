import useAsset from '@/composables/useAsset';
import { Asset, Story } from '@/models/GraphqlModel';
import FrameOverview from '@/screens/FrameOverview';
import ThreeService from '@/services/ThreeService';
import { BoxBufferGeometry, Group, Mesh, MeshBasicMaterial, Object3D, Vector3 } from 'three';
import Layers from './defaults.layers';
import { PlayBookFunctions } from '@/composables/playbook';
import { Frame as modelFrame } from '@/models/GraphqlModel';
import Common from '@/composables/common';
import Tools from './helper.tools';
import ZoneService from '@/services/ZoneService';
import { Tags } from '@/services/TaggingService';
import AnimationDefaults from './defaults.animation';
import CustomAnimation from '@/composables/animation';
import { GarabageHelperForWall } from '@/Three/helper.wall.garbage';
import Measurements from './defaults.measurements';
import Development from './defaults.development';
import MoveObject from '@/composables/moveObject';

const useFrameAssetOverview = (
  threeService: ThreeService,
  zoneService: ZoneService,
  activeStoryData: Story,
  playBook: PlayBookFunctions,
  spotlight: Mesh,
  garbageHelper: GarabageHelperForWall,
): {
  create: (
    currentFrame: number,
    storyColor: number,
    timestamp: number,
  ) => void;
} => {
  const group: Group = new Group();
  const positions: Array<Vector3> = [];
  let assets: Array<Asset> = [];
  let storyColor: number;

  const displayAllAssets = (frame: modelFrame, timestamp: number) => {
    threeService.RemoveFromScene(group);
    const data: Record<number, Vector3> = {};
    for (const asset of assets) {
      const relationMetadata = useAsset(threeService).connectRelationMetadata(frame, asset);
      const position = new Vector3(0, 0, Layers.scene);
      if (relationMetadata?.position != null || undefined) {
        position.x = relationMetadata.position.x;
        position.y = relationMetadata.position.y;
      }
      data[relationMetadata.timestamp_start] = position;
      positions.push(position);
      group.add(
        FrameOverview(threeService).addImage(asset, relationMetadata.scale, position),
      );
    }

    playBook.addToPlayBook(
      async () => {
        threeService.AddToScene(group, Tags.GroupOfAssets, ' Group of all the assets from the frame');
        await CustomAnimation().fadeInGroups([group], AnimationDefaults.values.opacityActive, AnimationDefaults.values.fadeStep);
      },
      timestamp,
      `Add all assets to scene.`,
    );
  };

  const resetImage = async (
    asset: Object3D<Event>,
    scale: number,
    currentAsset: number,
    spotlight: Mesh,
  ) => {
    garbageHelper.highlightedAsset();
    

    await useAsset(threeService).moveSpotlightToAsset(
      spotlight,
      asset as unknown as Mesh<BoxBufferGeometry, any>,
      scale,
    ),
    CustomAnimation().shrink(asset as unknown as Mesh<any, MeshBasicMaterial>, scale, AnimationDefaults.values.scaleStep);
    await Common().awaitTimeout(250);
    await CustomAnimation().shrink(spotlight as unknown as Mesh<any, MeshBasicMaterial>, scale + (Measurements().spotLight.spaceAroundObject*2), AnimationDefaults.values.scaleStep);
    await Common().awaitTimeout(150);
    await Promise.all([
      MoveObject().startMoving(asset, positions[currentAsset]),
      MoveObject().startMoving(spotlight, positions[currentAsset]),
    // spotlight.position.set(positions[currentAsset].x, positions[currentAsset].y, positions[currentAsset].z),
  ]);
  };

  const setAssetsInactive = async (displayedAsset: Mesh<BoxBufferGeometry, any>) => {
    const inactiveAssets = group.children.filter((_asset) => _asset != displayedAsset);
    inactiveAssets.forEach(async (_asset) => {
      await useAsset(threeService).setInactive(_asset as Mesh<BoxBufferGeometry, any>);
    });
  };

  const calculateZoomSettingsOfAsset = (asset: Mesh<BoxBufferGeometry, any>) => {
    const inZone = zoneService.objectIsInZone(asset);

    let scale: number;
    if (
      Common().firstIsBiggest(
        asset.geometry.parameters.height,
        asset.geometry.parameters.width,
      )
    ) {
      scale = zoneService.zoneDimensions.y / asset.geometry.parameters.height;
      while (scale * asset.geometry.parameters.width > zoneService.zoneDimensions.x) {
        scale -= 0.05;
      }
    } else {
      scale = zoneService.zoneDimensions.x / asset.geometry.parameters.width;
      while (scale * asset.geometry.parameters.height > zoneService.zoneDimensions.y) {
        scale -= 0.05;
      }
    }
    scale = scale - AnimationDefaults.values.scaleReducer;
    return { scale: scale, zoomPosition: inZone.center };
  };

  const zoomAndHighlightAsset = async (
    asset: Mesh<BoxBufferGeometry, any>,
    currentAsset: number,
  ) => {
    const zoomSettings = calculateZoomSettingsOfAsset(asset);
    await useAsset(threeService).zoom(
      asset as Mesh<BoxBufferGeometry, any>,
      zoomSettings.zoomPosition,
      zoomSettings.scale,
      spotlight
    );
    const collections = useAsset(threeService).getCollections(assets[currentAsset]);
    const title = useAsset(threeService).getTitle(assets[currentAsset]);
    const metadataInfo = useAsset(threeService).addMetadata(
      asset,
      storyColor,
      `${title}, ${collections[0]?`(${collections[0].value}0`:''}`,
    );
    threeService.AddGroupsToScene([metadataInfo], Tags.HighlightedMetadata, 'Metadata for image.');
  };

  const create = (
    currentFrame: number,
    _storyColor: number,
    timestamp: number,
  ) => {
    assets = useAsset(threeService).getAssetsFromFrame(activeStoryData, currentFrame);
    storyColor = _storyColor;
    if (assets.length > 0) {
      displayAllAssets(activeStoryData.frames[currentFrame], timestamp);
      group.children.forEach((asset, index) => {
        const relationMetadata = useAsset(threeService).connectRelationMetadata(
          activeStoryData.frames[currentFrame],
          assets[index],
        );
        if (relationMetadata.timestamp_start) {
          playBook.addToPlayBook(
            async () => {
              if (Development().showZonesInOverview()) {
                Tools().displayZones(threeService, zoneService.zones);
              }
              await setAssetsInactive(asset as Mesh<BoxBufferGeometry, any>);
              await CustomAnimation()
                .grow(
                  spotlight as Mesh<any,
                    MeshBasicMaterial>,
                  useAsset(threeService).getAssetSpotlightScale(
                    asset as Mesh<BoxBufferGeometry, any>,
                    relationMetadata.scale),
                  AnimationDefaults.values.scaleStep);
              await useAsset(threeService).moveSpotlightToAsset(
                spotlight,
                asset as Mesh<BoxBufferGeometry, any>,
                relationMetadata.scale,
              );
            },
            relationMetadata.timestamp_start,
            `Move spotlight to asset ${assets[index].id}.`,
          );
        }
        if (relationMetadata.timestamp_zoom) {
          playBook.addToPlayBook(
            async () => {
              await zoomAndHighlightAsset(
                asset as Mesh<BoxBufferGeometry, any>,
                index,
              );
            },
            relationMetadata.timestamp_zoom,
            `Zoom and highlight asset + set other assets inactive`,
          );
        }
        if (relationMetadata.timestamp_end && relationMetadata.timestamp_zoom) {
          playBook.addToPlayBook(
            async () => {
              await resetImage(
                asset as Object3D<Event>,
                relationMetadata.scale,
                index,
                spotlight,
              );
            },
            relationMetadata.timestamp_end,
            `Reset image position of asset: ${assets[index].id} and spotlight.`,
          );
        }
      });
    }
  };

  return { create };
};

export default useFrameAssetOverview;
