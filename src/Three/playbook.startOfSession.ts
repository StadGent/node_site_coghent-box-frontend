import CustomAnimation from '@/composables/animation';
import Common from '@/composables/common';
import MoveObject from '@/composables/moveObject';
import ScanQR from '@/screens/ScanQR';
import { Tags } from '@/services/TaggingService';
import ThreeService from '@/services/ThreeService';
import ZoneService from '@/services/ZoneService';
import { Mesh, MeshBasicMaterial, Vector3 } from 'three';
import AnimationDefaults from './defaults.animation';
import Layers from './defaults.layers';
import Measurements from './defaults.measurements';
import Timing from './defaults.timing';

const useStartOfSession = (
  threeService: ThreeService,
  zoneService: ZoneService,
  spotlight: Mesh,
): {
  create: () => Promise<true | false>;
} => {
  const setSpotlightOnPosition = () => {
    threeService.AddToScene(spotlight, Tags.Spotlight, 'Spotlight for the start of the session.');
    spotlight.scale.set(
      Measurements().spotLight.radius,
      Measurements().spotLight.radius,
      0,
    );
    spotlight.position.set(
      zoneService.zoneCenters[0].x + 2,
      zoneService.zoneCenters[0].y,
      zoneService.zoneCenters[0].z,
    );
  };

  const showScanImage = () => {
    setSpotlightOnPosition();
    const scanText = ScanQR(
      new Vector3(
        zoneService.zoneCenters[0].x,
        zoneService.zoneCenters[0].y - 1,
        zoneService.zoneCenters[0].z,
      ),
    ).create();
    threeService.AddGroupsToScene(scanText, Tags.startSessionText, 'Scan your ticket text.');
    return scanText;
  };


  const create = async () => {
    showScanImage();
    await Common().awaitTimeout(Timing.startOfSession.videoDelay);
    await MoveObject().startMoving(spotlight, new Vector3(0, 0, Layers.scene));
    await CustomAnimation().circularCountdown(
      threeService,
      new Vector3(0, 0, Layers.scene),
      Measurements().startOfSession.countdownCircleRadius,
      Measurements().startOfSession.countdownCircleThickness)
    ;
    await CustomAnimation().shrink(spotlight as Mesh<any, MeshBasicMaterial>, Measurements().storyCircle.radius, AnimationDefaults.values.scaleStep);
    return true;
  };

  return { create };
};

export default useStartOfSession;
