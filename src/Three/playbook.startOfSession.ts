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
  create: (_showVideo: boolean) => Promise<true | false>;
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
    const video = document.getElementById(Videos.startVideoId) as HTMLVideoElement;
    if (globals.startVideoElement != null && video) {
      globals.threeService?.AddToScene(globals.startVideoElement, Tags.startSessionVideo)
      video.play();
      await Common().awaitTimeout((video.duration * 1000))
      globals.threeService?.RemoveFromScene(globals.startVideoElement)
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

  const create = async (_showVideo: boolean) => {
    await MoveObject().startMoving(spotlight, new Vector3(0, 0, Layers.scene));
    _showVideo === false ? await startVideo() : null;
    return true;
  };

  return { showScanImage, create };
};

export default useStartOfSession;
