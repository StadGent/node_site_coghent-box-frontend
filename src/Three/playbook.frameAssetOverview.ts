import useAsset from '@/composables/useAsset';
import { Asset, Story } from '@/models/GraphqlModel';
import FrameOverview from '@/screens/FrameOverview';
import ThreeService from '@/services/ThreeService';
import { BoxBufferGeometry, Group, Mesh, Object3D, Vector3 } from 'three';
import Layers from './defaults.layers';
import HorizontalProgressBar from './shapes.horizontalProgressBar';
import { PlayBookFunctions } from '@/composables/playbook';
import Timing from './defaults.timing';
import { Frame as modelFrame } from '@/models/GraphqlModel';
import Common from '@/composables/common';
import MoveObject from '@/composables/moveObject';
import Defaults from './defaults.config';
import LineHelper from './helper.line';
import GroupHelper from './helper.group';
import useFrame from '@/composables/useFrame';
import ZoneHelper, { Zone } from './helper.zones';
import Tools from './helper.tools';

const useFrameAssetOverview = (
  threeService: ThreeService,
  activeStoryData: Story,
  playBook: PlayBookFunctions,
  spotlight: Mesh,
  zones: Array<Zone>,
): {
  create: (
    currentFrame: number,
    storyColor: number,
    timestamp: number,
    audioDuration: number,
  ) => void;
} => {
  const group: Group = new Group();
  const positions: Array<Vector3> = [];
  let assets: Array<Asset> = [];
  let storyColor: number;
  let highlightWithMetaInfo: Group;

  const displayAllAssets = (frame: modelFrame, timestamp: number) => {
    threeService.state.scene.remove(group);
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
        threeService.AddToScene(group);
        threeService.AddToScene(spotlight);
        await MoveObject().startMoving(spotlight, Object.values(data)[0]);
      },
      timestamp,
      `Add all assets to scene.`,
    );
  };

  const displayProgressBar = (
    storyColor: number,
    currentTime: number,
    maxTime: number,
    checkpoints: Array<number>,
  ) => {
    threeService.AddGroupsToScene(
      HorizontalProgressBar().create(
        new Vector3(0, -7, Layers.scene),
        checkpoints,
        maxTime,
        currentTime,
        storyColor,
      ),
    );
  };

  const resetImage = (
    asset: Object3D<Event>,
    scale: number,
    imageCube: Group,
    currentAsset: number,
  ) => {
    threeService.state.scene.remove(imageCube);
    asset.scale.set(0, 0, 0);
    asset.scale.set(scale, scale, 0);
    asset.position.set(
      positions[currentAsset].x,
      positions[currentAsset].y,
      positions[currentAsset].z,
    );
  };

  const setAssetsInactive = (displayedAsset: Mesh<BoxBufferGeometry, any>) => {
    const inactiveAssets = group.children.filter((_asset) => _asset != displayedAsset);
    inactiveAssets.forEach((_asset) => {
      useAsset(threeService).setInactive(_asset as Mesh<BoxBufferGeometry, any>);
    });
  };

  const calculateZoomSettingsOfAsset = (asset: Mesh<BoxBufferGeometry, any>) => {
    const inZone = ZoneHelper(threeService.state.sceneDimensions).objectIsInZone(
      asset,
      zones,
    );
    const zoomTo = ZoneHelper(threeService.state.sceneDimensions).getMiddleOfZone(inZone);
    const zoneDimensions = ZoneHelper(threeService.state.sceneDimensions).zoneDimensions(
      Defaults().screenZones(),
    );
    let scale =
      zoneDimensions.width / asset.geometry.parameters.width - Defaults().scaleReducer();
    if (
      Common().firstIsBiggest(
        asset.geometry.parameters.height,
        asset.geometry.parameters.width,
      )
    ) {
      scale =
        zoneDimensions.height / (asset.geometry.parameters.height - 1) -
        Defaults().scaleReducer();
      while (scale * asset.geometry.parameters.width > zoneDimensions.width) {
        scale -= 0.05;
      }
      scale = scale - Defaults().scaleReducer();
    }
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

    threeService.AddToScene(highlightWithMetaInfo);
  };

  const create = (
    currentFrame: number,
    _storyColor: number,
    timestamp: number,
    audioDuration: number,
  ) => {
    const assetsWithTimestampStart = useFrame().getStartTimestampsWithTheirAsset(
      activeStoryData.frames[currentFrame],
    );
    assets = useAsset(threeService).getAssetsFromFrame(activeStoryData, currentFrame);
    storyColor = _storyColor;
    if (assets.length > 0) {
      displayAllAssets(activeStoryData.frames[currentFrame], timestamp);
      playBook.addToPlayBook(
        () =>
          displayProgressBar(
            storyColor,
            0,
            audioDuration,
            Object.values(assetsWithTimestampStart),
          ),
        timestamp,
        `Display progressbar.`,
      );
      group.children.forEach((asset, index) => {
        const relationMetadata = Common().connectRelationMetadata(
          activeStoryData.frames[currentFrame],
          assets[index],
        );
        if (relationMetadata.timestamp_start) {
          playBook.addToPlayBook(
            async () => {
              if (Defaults().showZonesInOverview()) {
                Tools().displayZones(threeService, zones);
              }
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
              displayProgressBar(
                storyColor,
                Object.values(assetsWithTimestampStart)[index],
                audioDuration,
                Object.values(assetsWithTimestampStart),
              );
            },
            relationMetadata.timestamp_start + Timing.frameOverview.spotLightMoved,
            `Update progressbar checkpoint.`,
          );
          playBook.addToPlayBook(
            () => {
              spotlight.scale.set(1,1,0);
              setAssetsInactive(asset as Mesh<BoxBufferGeometry, any>);
              zoomAndHighlightAsset(
                asset as Mesh<BoxBufferGeometry, any>,
                index,
                Defaults().zoomOfAsset(),
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
