import useAsset from '@/composables/useAsset';
import { Asset, Story } from '@/models/GraphqlModel';
import FrameOverview from '@/screens/FrameOverview';
import ThreeService from '@/services/ThreeService';
import { BoxBufferGeometry, Group, Mesh, Object3D, Vector3 } from 'three';
import Layers from './defaults.layers';
import HorizontalProgressBar from './HorizontalProgressBar';
import { PlayBookFunctions } from '@/composables/playbook';
import { SpotlightFunctions } from './Spotlight';
import Timing from './defaults.timing';
import { Metadata } from 'coghent-vue-3-component-library/lib/queries';

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

  const displayAllAssets = (timestamp: number) => {
    let pos = -8;
    for (const asset of assets) {
      const position = new Vector3(pos, 0, Layers.presentation);
      positions.push(position);
      group.add(FrameOverview().addImage(asset, position));
      pos += 6;
    }

    playBook.addToPlayBook(() => {
      threeService.ClearScene();
      threeService.AddToScene(group);
      spot.move(positions[0], 4);
      threeService.AddToScene(spot.SpotLight());
    }, timestamp);
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
    asset.scale.set(1, 1, 1);
    asset.position.set(
      positions[currentAsset].x,
      positions[currentAsset].y,
      positions[currentAsset].z,
    );
  };

  const setAssetsInactive = (displayedAsset: Mesh<BoxBufferGeometry, any>) => {
    const inactiveAssets = group.children.filter((_asset) => _asset != displayedAsset);
    inactiveAssets.forEach((_asset) => {
      useAsset().setInactive(_asset as Mesh<BoxBufferGeometry, any>);
    });
  };

  const zoomAndHighlightAsset = (
    asset: Mesh<BoxBufferGeometry, any>,
    currentAsset: number,
  ) => {
    useAsset().zoom(asset as Mesh<BoxBufferGeometry, any>, threeService.state.height);
    highlightedImage = useAsset().addMetadataToZoomedImage(
      assets[currentAsset],
      asset as Mesh<BoxBufferGeometry, any>,
      storyColor,
    );
    threeService.AddToScene(highlightedImage);
  };

  const moveSpotlightToAsset = (
    asset: Mesh<BoxBufferGeometry, any>,
    timestamp: number,
  ) => {
    playBook.addToPlayBook(() => {
      spot.move(asset.position, asset.geometry.parameters.height + 0.05);
      threeService.AddToScene(spot.SpotLight());
      useAsset().setActive(asset);
    }, timestamp);
  };

  const create = (currentFrame: number, _storyColor: number, timestamp: number) => {
    assets = useAsset().getAssetsFromFrame(activeStoryData, currentFrame - 1);
    storyColor = _storyColor;

    displayAllAssets(timestamp);
    group.children.forEach((asset, index) => {
      moveSpotlightToAsset(
        asset as Mesh<BoxBufferGeometry, any>,
        parseInt(assets[index].timestamps[0].value) - Timing.frameOverview.moveSpotlight,
      );
      playBook.addToPlayBook(
        () => displayProgressBar(storyColor, currentFrame),
        parseInt(assets[index].timestamps[0].value) - Timing.frameOverview.progressBar,
      );
      playBook.addToPlayBook(() => {
        setAssetsInactive(asset as Mesh<BoxBufferGeometry, any>);
        zoomAndHighlightAsset(asset as Mesh<BoxBufferGeometry, any>, index);
      }, parseInt(assets[index].timestamps[0].value));

      playBook.addToPlayBook(() => {
        resetImage(asset as Object3D<Event>, highlightedImage, index);
      }, parseInt(assets[index].timestamps[0].value));
    });
  };

  return { create };
};

export default useFrameAssetOverview;
