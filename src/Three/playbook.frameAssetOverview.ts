import useAsset from '@/composables/useAsset';
import { Asset, Story } from '@/models/GraphqlModel';
import FrameOverview from '@/screens/FrameOverview';
import ThreeService from '@/services/ThreeService';
import { BoxBufferGeometry, Group, Mesh, Object3D, Vector3 } from 'three';
import Layers from './defaults.layers';
import { PlayBookFunctions } from '@/composables/playbook';
import Timing from './defaults.timing';
import { Frame as modelFrame } from '@/models/GraphqlModel';
import Common from '@/composables/common';
import MoveObject from '@/composables/moveObject';
import Defaults from './defaults.config';
import LineHelper from './helper.line';
import GroupHelper from './helper.group';
import Tools from './helper.tools';
import ZoneService from '@/services/ZoneService';
import { Tags } from '@/services/TaggingService';
import AnimationDefaults from './defaults.animation';

const useFrameAssetOverview = (
  threeService: ThreeService,
  zoneService: ZoneService,
  activeStoryData: Story,
  playBook: PlayBookFunctions,
  spotlight: Mesh,
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
  let highlightWithMetaInfo: Group;

  const displayAllAssets = (frame: modelFrame, timestamp: number) => {
    threeService.RemoveFromScene(group);
    const data: Record<number, Vector3> = {};
    for (const asset of assets) {
      const relationMetadata = Common().connectRelationMetadata(frame, asset);
      const position = new Vector3(0, 0, Layers.presentation);
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
        threeService.AddToScene(spotlight, Tags.Spotlight, 'Spotlight to move over all the assets of the frame.');
        await MoveObject().startMoving(spotlight, Object.values(data)[0]);
      },
      timestamp,
      `Add all assets to scene.`,
    );
  };

  const resetImage = (
    asset: Object3D<Event>,
    scale: number,
    imageCube: Group,
    currentAsset: number,
  ) => {
    threeService.RemoveFromScene(imageCube);
    asset.scale.set(0, 0, 0);
    asset.scale.set(scale, scale, 0);
    asset.position.set(
      positions[currentAsset].x,
      positions[currentAsset].y,
      positions[currentAsset].z,
    );
  };

  const setAssetsInactive = async (displayedAsset: Mesh<BoxBufferGeometry, any>) => {
    const inactiveAssets = group.children.filter((_asset) => _asset != displayedAsset);
    inactiveAssets.forEach(async (_asset) => {
      await useAsset(threeService).setInactive(_asset as Mesh<BoxBufferGeometry, any>);
    });
  };

  const calculateZoomSettingsOfAsset = (asset: Mesh<BoxBufferGeometry, any>) => {
    const inZone = zoneService.objectIsInZone(asset);
    const zoomTo = zoneService.getMiddleOfZone(inZone);

    let scale = zoneService.zoneDimensions.x / asset.geometry.parameters.width;
    while (scale * asset.geometry.parameters.height > zoneService.zoneDimensions.y) {
      scale -= 0.05;
    }
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
    }
    scale = scale - AnimationDefaults.values.scaleReducer;
    return { scale: scale, zoomPosition: zoomTo };
  };

  const zoomAndHighlightAsset = (
    asset: Mesh<BoxBufferGeometry, any>,
    currentAsset: number,
    scale: number,
  ) => {
    const zoomSettings = calculateZoomSettingsOfAsset(asset);
    useAsset(threeService).zoom(
      asset as Mesh<BoxBufferGeometry, any>,
      zoomSettings.zoomPosition,
      zoomSettings.scale,
    );
    const collections = useAsset(threeService).getCollections(assets[currentAsset]);
    const title = useAsset(threeService).getTitle(assets[currentAsset]);
    const metadataInfo = useAsset(threeService).addMetadata(
      zoomSettings.zoomPosition,
      asset,
      storyColor,
      scale,
      `${title}, Me (${collections[0].value})`,
    );
    highlightWithMetaInfo = GroupHelper().CreateGroup([
      LineHelper().drawLineArroundCube(asset, storyColor),
      metadataInfo,
    ]);

    threeService.AddToScene(highlightWithMetaInfo, Tags.Highlight, 'Highlight with metadata info.');
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
        const relationMetadata = Common().connectRelationMetadata(
          activeStoryData.frames[currentFrame],
          assets[index],
        );
        if (relationMetadata.timestamp_start) {
          playBook.addToPlayBook(
            async () => {
              if (Defaults().showZonesInOverview()) {
                Tools().displayZones(threeService, zoneService.zones);
                zoneService.zones.forEach(_zone => {
                  Tools().dotOnPosition(threeService, zoneService.getMiddleOfZone(_zone));
                });
              }
              await setAssetsInactive(asset as Mesh<BoxBufferGeometry, any>);
              await useAsset(threeService).moveSpotlightToAsset(
                spotlight,
                asset as Mesh<BoxBufferGeometry, any>,
                relationMetadata.scale,
              );
            },
            relationMetadata.timestamp_start,
            `Move spotlight to asset ${assets[index].id}.`,
          );
          playBook.addToPlayBook(
            () => {
              spotlight.scale.set(0.1, 0.1, 0);
              zoomAndHighlightAsset(
                asset as Mesh<BoxBufferGeometry, any>,
                index,
                AnimationDefaults.values.zoomOfAsset,
              );
            },
            useAsset(threeService).setZoomTiming(relationMetadata) +
            Timing.frameOverview.spotLightMoved,
            `Zoom and highlight asset + set other assets inactive`,
          );
          playBook.addToPlayBook(
            async () => {
              resetImage(
                asset as Object3D<Event>,
                relationMetadata.scale,
                highlightWithMetaInfo,
                index,
              );
              await useAsset(threeService).moveSpotlightToAsset(
                spotlight,
                asset as Mesh<BoxBufferGeometry, any>,
                relationMetadata.scale,
              );
            },
            relationMetadata.timestamp_end + Timing.frameOverview.spotLightMoved,
            `Reset image position of asset: ${assets[index].id} and spotlight.`,
          );
        }
      });
    }
  };

  return { create };
};

export default useFrameAssetOverview;
