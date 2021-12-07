import useAsset from '@/composables/useAsset';
import { Asset, Story } from '@/models/GraphqlModel';
import FrameOverview from '@/screens/FrameOverview';
import ThreeService from '@/services/ThreeService';
import { BoxBufferGeometry, Group, Mesh, Object3D, Vector3 } from 'three';
import Layers from './defaults.layers';
import HorizontalProgressBar from './HorizontalProgressBar';
import { PlayBookFunctions } from '@/composables/playbook';
import Frame from '@/composables/frame';
import { SpotlightFunctions } from './Spotlight';
import Timing from './defaults.timing';
import { Frame as modelFrame } from '@/models/GraphqlModel';
import Defaults from './defaults.config';
import Common from '@/composables/common';

const useFrameAssetOverview = (
  threeService: ThreeService,
  activeStoryData: Story,
  playBook: PlayBookFunctions,
  spot: SpotlightFunctions,
): {
  create: (currentFrame: number, storyColor: number, timestamp: number) => void;
} => {
  const group: Group = new Group();
  const positions: Array<Vector3> = [];
  let assets: Array<Asset> = [];
  let storyColor: number;
  let highlightedImage: any;

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

    playBook.addToPlayBook(() => {
      threeService.AddToScene(group);
      spot.move(Object.values(data)[0], 4);
      threeService.AddToScene(spot.SpotLight());
    }, timestamp,`Add all assets to scene.`);
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
    imageCube: Mesh<BoxBufferGeometry, any>,
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
    spot: SpotlightFunctions,
    currentAsset: number,
    scale: number,
  ) => {
    useAsset(threeService).zoom(asset as Mesh<BoxBufferGeometry, any>, spot, scale);

    highlightedImage = useAsset(threeService).addMetadataToZoomedImage(
      assets[currentAsset],
      asset as Mesh<BoxBufferGeometry, any>,
      storyColor,
    );
    threeService.AddToScene(highlightedImage);
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
            () =>
              useAsset(threeService).moveSpotlightToAsset(
                spot,
                asset as Mesh<BoxBufferGeometry, any>,
              ),
            relationMetadata.timestamp_start,
            `Move spotlight to asset ${assets[index].id}.`
          );
          playBook.addToPlayBook(
            () => displayProgressBar(storyColor, currentFrame),
            relationMetadata.timestamp_start,
            `Display progressbar.`
          );
          playBook.addToPlayBook(() => {
            setAssetsInactive(asset as Mesh<BoxBufferGeometry, any>);
            zoomAndHighlightAsset(
              asset as Mesh<BoxBufferGeometry, any>,
              spot,
              index,
              Defaults().zoomOfAsset(),
            );
          }, relationMetadata.timestamp_start + Timing.frameOverview.spotLightMoved);

          playBook.addToPlayBook(() => {
            resetImage(asset as Object3D<Event>, highlightedImage, index);
            useAsset(threeService).moveSpotlightToAsset(
              spot,
              asset as Mesh<BoxBufferGeometry, any>,
            );
          }, relationMetadata.timestamp_end,
            `Reset image position of asset: ${assets[index].id} and spotlight.`
          );
        }
      });
    }
  };

  return { create };
};

export default useFrameAssetOverview;
