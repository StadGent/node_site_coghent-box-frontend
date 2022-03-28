import useAsset from '@/composables/useAsset';
import { Asset, Frame, Story } from '@/models/GraphqlModel';
import FrameOverview from '@/screens/FrameOverview';
import ThreeService from '@/services/ThreeService';
import {
  BoxBufferGeometry,
  Group,
  Mesh,
  MeshBasicMaterial,
  Object3D,
  Texture,
  Vector3,
} from 'three';
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
import { Entity } from 'coghent-vue-3-component-library/lib';
import Colors from './defaults.color';
import { tweenPromise } from './helper.tweenPromise';
import TWEEN from '@tweenjs/tween.js';
import tempUrls from '@/temp-urls';
import VideoHelper from './helper.video';

const useFrameAssetOverview = (
  threeService: ThreeService,
  zoneService: ZoneService,
  activeStory: Entity,
  playBook: PlayBookFunctions,
  spotlight: Mesh,
  garbageHelper: GarabageHelperForWall,
): {
  create: (currentFrame: number, storyColor: number, timestamp: number) => Promise<void>;
} => {
  const group: Group = new Group();
  const positions: Array<Vector3> = [];
  let assets: Array<Asset> = [];
  let storyColor: number;

  const displayAllAssets = async (
    frame: modelFrame,
    timestamp: number,
    currentFrame: number,
  ) => {
    threeService.RemoveFromScene(group);
    const data: Record<number, Vector3> = {};
    const images: Array<Mesh> = [];
    const scaleTo: Array<number> = [];
    for (const [i, asset] of assets.entries()) {
      const relationMetadata = useAsset(threeService).connectRelationMetadata(
        frame,
        asset,
      );
      const position = new Vector3(0, 0, -1);
      if (relationMetadata?.position != null || undefined) {
        position.x = relationMetadata.position.x;
        position.y = relationMetadata.position.y;
      }
      data[relationMetadata.timestamp_start] = position;
      positions.push(position);

      let image;
      if (asset.mediafiles[0] && Common().isVideo(asset.mediafiles[0].filename)) {
        if (Development().showVideoLogs()) console.log('| Asset is video', asset.mediafiles[0].original_file_location)
        image = VideoHelper().videoElementAsCube(
          asset.id,
          asset.mediafiles[0].original_file_location,
          new Vector3(
            asset.mediafiles[0]?.mediainfo.width,
            asset.mediafiles[0]?.mediainfo.height,
            0,
          ),
          position,
        );
        image.scale.set(0.0001, 0.0001, 0.0001)
      } else {
        image = await FrameOverview(threeService).addImage(asset, 0, position);
        image.scale.set(0, 0, 0)

      }
      scaleTo[i] = relationMetadata.scale;
      images.push(image);
      group.add(image);
    }

    threeService.AddToScene(
      group,
      Tags.GroupOfAssets,
      ' Group of all the assets from the frame',
    );
    await Common().awaitTimeout(1000);
    for (const [i, _child] of group.children.entries()) {
      const _mesh = _child as Mesh<any, MeshBasicMaterial>;
      _mesh.scale.set(0, 0, 0);
      _mesh.material.opacity = 0.9;
      const tween = new TWEEN.Tween(_mesh.scale)
        .to(
          {
            x: scaleTo[i],
            y: scaleTo[i],
            z: 1,
          },
          1000,
        )
        .yoyo(true)
        .easing(TWEEN.Easing.Cubic.InOut)
        .start();

      await tweenPromise(tween);
    }
  };

  const resetImage = async (
    asset: Object3D<Event>,
    scale: number,
    currentAsset: number,
    spotlight: Mesh,
  ) => {
    garbageHelper.highlightedAsset();
    const spotlightScale = useAsset(threeService).getAssetSpotlightScale(
      asset as unknown as Mesh<BoxBufferGeometry, any>,
      scale,
    );
    CustomAnimation().shrink(
      asset as unknown as Mesh<any, MeshBasicMaterial>,
      scale,
      AnimationDefaults.values.scaleStep,
    );
    await Common().awaitTimeout(250);
    await CustomAnimation().shrink(
      spotlight as unknown as Mesh<any, MeshBasicMaterial>,
      spotlightScale,
      AnimationDefaults.values.scaleStep,
    );
    await Common().awaitTimeout(150);
    await Promise.all([
      MoveObject().startMoving(asset, positions[currentAsset]),
      MoveObject().startMoving(
        spotlight,
        new Vector3(positions[currentAsset].x, positions[currentAsset].y, 0),
      ),
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
    Tools().dotOnPosition(threeService, inZone.center, Colors().yellow);
    Tools().dotOnPosition(threeService, inZone.start, Colors().lightBlue);
    Tools().dotOnPosition(threeService, inZone.end, Colors().pink);

    let scale = 1000 / asset.geometry.parameters.height;

    if (scale > 1) {
      scale = 1;
    }

    return { scale: scale, zoomPosition: inZone.center };
  };

  const zoomAndHighlightAsset = async (
    asset: Mesh<BoxBufferGeometry, any>,
    currentAsset: number,
    isVideo: string | undefined = undefined,
  ) => {
    const zoomSettings = calculateZoomSettingsOfAsset(asset);
    await useAsset(threeService).zoom(
      asset as Mesh<BoxBufferGeometry, any>,
      zoomSettings.zoomPosition,
      zoomSettings.scale,
      spotlight,
    );

    if (isVideo) {
      const video = document.getElementById(isVideo) as HTMLVideoElement
      video.play();
    }

    const collections = useAsset(threeService).getCollections(assets[currentAsset]);
    const title = useAsset(threeService).getTitle(assets[currentAsset]);
    const metadataInfo = await useAsset(threeService).addMetadata(
      asset,
      storyColor,
      `${title} ${collections[0] ? `, (${collections[0].value}0` : ''}`,
      zoomSettings
    );
    threeService.AddGroupsToScene(
      [metadataInfo],
      Tags.HighlightedMetadata,
      'Metadata for image.',
    );
  };

  const create = async (currentFrame: number, _storyColor: number, timestamp: number) => {
    assets = useAsset(threeService).getAssetsFromFrame(
      activeStory,
      currentFrame,
    ) as unknown as Array<Asset>;
    storyColor = _storyColor;
    if (assets && assets.length > 0) {
      await displayAllAssets(
        activeStory.frames?.[currentFrame] as unknown as Frame,
        timestamp,
        currentFrame,
      );
      group.children.forEach((asset, index) => {
        const relationMetadata = useAsset(threeService).connectRelationMetadata(
          activeStory.frames?.[currentFrame] as unknown as Frame,
          assets[index],
        );
        if (relationMetadata.timestamp_start) {
          playBook.addToPlayBook(
            async () => {
              if (Development().showZonesInOverview()) {
                // Tools().displayZones(threeService, zoneService.zones);
              }
              await setAssetsInactive(asset as Mesh<BoxBufferGeometry, any>);
              await CustomAnimation().grow(
                spotlight as Mesh<any, MeshBasicMaterial>,
                useAsset(threeService).getAssetSpotlightScale(
                  asset as Mesh<BoxBufferGeometry, any>,
                  relationMetadata.scale,
                ),
                AnimationDefaults.values.scaleStep,
              );
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
              //@ts-ignore
              // const isVideo = tempUrls[activeStory.id][currentFrame]?.videos[index];
              const theAsset = asset as Mesh<BoxBufferGeometry, any>
              console.log('theAsset', theAsset)
              await zoomAndHighlightAsset(
                theAsset,
                index,
                theAsset.name,
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
        } else {
          playBook.addToPlayBook(
            () => {
              return
            },
            relationMetadata.timestamp_end,
            `Timestamp added when image has no timestamp_zoom.`,
          );
        }
      });
    }
  };

  return { create };
};

export default useFrameAssetOverview;
