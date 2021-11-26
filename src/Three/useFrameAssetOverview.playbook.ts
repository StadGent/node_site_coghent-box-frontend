import useAsset from '@/composables/useAsset';
import { Asset, Story } from '@/models/GraphqlModel';
import FrameOverview from '@/screens/FrameOverview';
import ThreeService from '@/services/ThreeService';
import { BoxBufferGeometry, Group, Mesh, Object3D, Vector3 } from 'three';
import Layers from './defaults.layers';
import HorizontalProgressBar from './HorizontalProgressBar';
import { PlayBookFunctions } from '@/composables/playbook'
import { SpotlightFunctions } from './Spotlight';

const useFrameAssetOverview = (
  threeService: ThreeService,
  activeStoryData: Story,
  playBook: PlayBookFunctions,
  spot: SpotlightFunctions,
): {
  create: (currentFrame: number, storyColor: number) => void;
} => {
  const group: Group = new Group();
  const positions: Array<Vector3> = [];let assets: Array<Asset> = [];
  let storyColor: number;
  let highlightedImage: any;

  const displayAllAssets = () => {
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
      spot.move(positions[0], 4)
      threeService.AddToScene(spot.SpotLight())
    });
  };

  const displayProgressBar = (
    asset: Object3D<Event>,
    imageCube: Mesh<BoxBufferGeometry, any>,
    currentAsset: number,
    storyColor: number,
    currentFrame: number,
  ) => {
    threeService.state.scene.remove(imageCube);
    asset.scale.set(1, 1, 1);
    asset.position.set(
      positions[currentAsset].x,
      positions[currentAsset].y,
      positions[currentAsset].z,
    );
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

  const setAssetsInactive = (displayedAsset: Mesh<BoxBufferGeometry, any>) => {
    const inactiveAssets = group.children.filter((_asset) => _asset != displayedAsset);
    inactiveAssets.forEach((_asset) => {
      useAsset().setInactive(_asset as Mesh<BoxBufferGeometry, any>);
    });
  };

  const zoomAndHighlightAsset = (asset: Mesh<BoxBufferGeometry, any>, currentAsset: number) => {
    useAsset().zoom(asset as Mesh<BoxBufferGeometry, any>, threeService.state.height);
    highlightedImage = useAsset().addMetadataToZoomedImage(
      assets[currentAsset],
      asset as Mesh<BoxBufferGeometry, any>,
      storyColor,
    );
    threeService.AddToScene(highlightedImage);
  };

  const moveSpotlightToAsset = (asset: Mesh<BoxBufferGeometry, any>) => {
    playBook.addToPlayBook(() => {
      spot.move(asset.position, asset.geometry.parameters.height + 0.05);
      threeService.AddToScene(spot.SpotLight())
      useAsset().setActive(asset);
    })
  }

  const create = (currentFrame: number, _storyColor: number) => {
    assets = useAsset().getAssetsFromFrame(activeStoryData, currentFrame - 1);
    storyColor= _storyColor;
    displayAllAssets();

    group.children.forEach((asset, index) => {
      moveSpotlightToAsset(asset as Mesh<BoxBufferGeometry, any>);
      playBook.addToPlayBook(() => {
        setAssetsInactive(asset as Mesh<BoxBufferGeometry, any>);
        zoomAndHighlightAsset(asset as Mesh<BoxBufferGeometry, any>, index);
      });
      playBook.addToPlayBook(() =>
        displayProgressBar(
          asset as Object3D<Event>,
          highlightedImage,
          index,
          storyColor,
          currentFrame,
        ),
      );
    });
    // playBook.addToPlayBook(() => moveSpotlight(frameAssetSchemas[0].position, 4));
    // playBook.addToPlayBook(() => moveSpotlight(frameAssetSchemas[1].position, 4));
    // playBook.addToPlayBook(() => moveSpotlight(frameAssetSchemas[2].position, 4));
    // playBook.addToPlayBook(() => moveSpotlight(frameAssetSchemas[2].position, 4));
  };

  return { create };
};

export default useFrameAssetOverview;
