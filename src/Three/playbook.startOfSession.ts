import CustomAnimation from '@/composables/animation';
import Common from '@/composables/common';
import MoveObject from '@/composables/moveObject';
import ScanQR from '@/screens/ScanQR';
import globals from '@/services/GlobalData';
import { Tags } from '@/services/TaggingService';
import ThreeService from '@/services/ThreeService';
import ZoneService from '@/services/ZoneService';
import { Group, Mesh, Vector3 } from 'three';
import Layers from './defaults.layers';
import Measurements from './defaults.measurements';
import Videos from './defaults.videos';
import VideoHelper from './helper.video';
import WallGarbageHelper from './helper.wall.garbage';

const useStartOfSession = (
  threeService: ThreeService,
  zoneService: ZoneService,
  spotlight: Mesh,
): {
  showScanImage: () => Promise<Array<Group>>;
  create: () => Promise<true | false>;
} => {
  const setSpotlightOnPosition = () => {
    // threeService.AddToScene(
    //   spotlight,
    //   Tags.Spotlight,
    //   'Spotlight for the start of the session.',
    // );
    // spotlight.scale.set(
    //   Measurements().spotLight.radius,
    //   Measurements().spotLight.radius,
    //   0,
    // );
    // spotlight.position.set(
    //   zoneService.zoneCenters[0].x + 2,
    //   zoneService.zoneCenters[0].y,
    //   zoneService.zoneCenters[0].z,
    // );
  };

  const showScanImage = async () => {
    setSpotlightOnPosition();
    const scanText = await ScanQR(
      new Vector3(
        zoneService.zoneCenters[0].x,
        zoneService.zoneCenters[0].y + 200,
        zoneService.zoneCenters[0].z,
      ),
    ).create();
    threeService.AddGroupsToScene(
      scanText,
      Tags.startSessionText,
      'Scan your ticket text.',
    );

    return scanText;
  };

  const startVideo = async () => {
    WallGarbageHelper(threeService, globals.taggingService).startOfSession()
    if (globals.startVideoElement != null) {
      const videoCube = VideoHelper().videoElementAsCube(Videos.startVideoId, Videos.startOfSession, new Vector3(1920, 1080, 0), new Vector3(0, 0, 0))
      globals.threeService?.AddToScene(videoCube, Tags.startSessionVideo)
      globals.startVideoElement.play()
      await Common().awaitTimeout((globals.startVideoElement.duration * 1000) + 100)
      globals.threeService?.RemoveFromScene(videoCube)
    } else {
      await countdown()
    }
  }

  const countdown = async () => {
    await CustomAnimation().circularCountdown(
      threeService,
      new Vector3(0, 0, Layers.scene),
      Measurements().startOfSession.countdownCircleRadius,
      Measurements().startOfSession.countdownCircleThickness,
      [
        Tags.StartOfSessionRing,
        Tags.StartOfSessionCountdownNumber,
        Tags.StartOfSessionProgressRing,
      ],
      new Vector3(-50, -50, 0),
      Measurements().text.size.veryBig,
    );
  }

  const create = async () => {
    await MoveObject().startMoving(spotlight, new Vector3(0, 0, Layers.scene));
    await startVideo()

    return true;
  };

  return { showScanImage, create };
};

export default useStartOfSession;
