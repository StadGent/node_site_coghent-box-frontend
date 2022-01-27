import CustomAnimation from '@/composables/animation';
import Common from '@/composables/common';
import MoveObject from '@/composables/moveObject';
import ScanQR from '@/screens/ScanQR';
import { Tags } from '@/services/TaggingService';
import ThreeService from '@/services/ThreeService';
import ZoneService from '@/services/ZoneService';
import { Mesh, MeshBasicMaterial, Vector3 } from 'three';
import AnimationDefaults from './defaults.animation';
import Colors from './defaults.color';
import Defaults from './defaults.config';
import Layers from './defaults.layers';
import Measurements from './defaults.measurements';
import Timing from './defaults.timing';
import TextHelper from './helper.text';
import { CubeParams } from './schema.cube';
import { FontParams } from './schema.text';

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

  const createCountDownNumber = (countdown: number) => {
    return TextHelper().CreateText(
      `${countdown}`,
      new Vector3(-.5, -0.5, Layers.scene),
      {} as CubeParams,
      { size: Measurements().text.size.veryBig, color: Colors().white } as FontParams,
    );
  };

  const countdown = async (maxCount: number) => {
    let currentCount = maxCount;
    while (currentCount != 0) {
      const text = createCountDownNumber(currentCount);
      threeService.AddToScene(text, Tags.startOfSessionCountdown, 'StartOfSession countdown timer text.');
      await Common().awaitTimeout(999);
      currentCount--;
      threeService.RemoveFromScene(text);
    }
  };

  const create = async () => {
    showScanImage();
    await Common().awaitTimeout(Timing.startOfSession.videoDelay);
    await MoveObject().startMoving(spotlight, new Vector3(0, 0, Layers.scene));
    countdown(Defaults().countdown());
    await CustomAnimation().circularCountdown(threeService,new Vector3(0, 0, Layers.scene));
    await CustomAnimation().shrink(spotlight as Mesh<any, MeshBasicMaterial>, Measurements().storyCircle.radius, AnimationDefaults.values.scaleStep);
    return true;
  };

  return { create };
};

export default useStartOfSession;
