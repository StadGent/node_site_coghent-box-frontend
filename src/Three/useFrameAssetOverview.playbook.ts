import useAsset from '@/composables/useAsset';
import { Asset, Story } from '@/models/GraphqlModel';
import FrameOverview from '@/screens/FrameOverview';
import ThreeService from '@/services/ThreeService';
import { BoxBufferGeometry, Group, Mesh, Object3D, Vector3 } from 'three';
import Layers from './defaults.layers';
import HorizontalProgressBar from './HorizontalProgressBar';
import { PlayBookFunctions } from '@/composables/playbook';
import Timing from './defaults.timing';
import { Frame as modelFrame } from '@/models/GraphqlModel';
import Common from '@/composables/common';
import MoveObject from '@/composables/moveObject';
import Defaults from './defaults.config';
import LineHelper from './LineHelper';
import GroupHelper from './GroupHelper';

const useFrameAssetOverview = (
  threeService: ThreeService,
  activeStoryData: Story,
  playBook: PlayBookFunctions,
  spotlight: Mesh,
): {
  create: (currentFrame: number, storyColor: number, timestamp: number) => void;
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
      group.add(FrameOverview(threeService).addImage(asset, position));
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

  const displayProgressBar = (storyColor: number, currentFrame: number) => {
    threeService.AddGroupsToScene(
      HorizontalProgressBar().create(
        new Vector3(0, -7, Layers.scene),
        [1000, 2000, 3000],
        5000,
        currentFrame * 1000,
        storyColor,
      ),
    );
  };

  const resetImage = (
    asset: Object3D<Event>,
    imageCube: Group,
    currentAsset: number,
  ) => {
    threeService.state.scene.remove(imageCube);
    asset.scale.set(1, 1, 0);
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

  const zoomAndHighlightAsset = (
    asset: Mesh<BoxBufferGeometry, any>,
    currentAsset: number,
    scale: number,
  ) => {
    useAsset(threeService).zoom(asset as Mesh<BoxBufferGeometry, any>, spotlight, scale);
    const collections = useAsset(threeService).getCollections(assets[currentAsset]);
    const title = useAsset(threeService).getTitle(assets[currentAsset]);
    const metadataInfo = useAsset(threeService).addMetadata(asset,storyColor, scale, `${title}, Me (${collections[0].value})`)
    highlightWithMetaInfo = GroupHelper().CreateGroup([LineHelper().drawLineArroundCube(asset,storyColor), metadataInfo]);
    
    threeService.AddToScene(highlightWithMetaInfo);
  };

  const create = (currentFrame: number, _storyColor: number, timestamp: number) => {
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
              await useAsset(threeService).moveSpotlightToAsset(
                spotlight,
                asset as Mesh<BoxBufferGeometry, any>,
              );
            },
            relationMetadata.timestamp_start,
            `Move spotlight to asset ${assets[index].id}.`,
          );
          playBook.addToPlayBook(
            () => displayProgressBar(storyColor, currentFrame),
            relationMetadata.timestamp_start,
            `Display progressbar.`,
          );
          playBook.addToPlayBook(
            () => {
              setAssetsInactive(asset as Mesh<BoxBufferGeometry, any>);
              zoomAndHighlightAsset(
                asset as Mesh<BoxBufferGeometry, any>,
                index,
                Defaults().zoomOfAsset(),
              );
            },
            useAsset(threeService).setZoomTiming(relationMetadata) + Timing.frameOverview.spotLightMoved,
            `Zoom and highlight asset + set other assets inactive`,
          );

          playBook.addToPlayBook(
            async () => {
              resetImage(asset as Object3D<Event>, highlightWithMetaInfo, index);
              await useAsset(threeService).moveSpotlightToAsset(
                spotlight,
                asset as Mesh<BoxBufferGeometry, any>,
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
