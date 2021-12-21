import Common from '@/composables/common';
import MoveObject from '@/composables/moveObject';
import ScanQR from '@/screens/ScanQR';
import ThreeService from '@/services/ThreeService';
import { Mesh, Vector3 } from 'three';
import Colors from './defaults.color';
import Defaults from './defaults.config';
import Layers from './defaults.layers';
import Measurements from './defaults.measurements';
import Positions from './defaults.positions';
import customText from './defaults.text';
import Timing from './defaults.timing';
import TextHelper from './helper.text';
import { CubeParams } from './schema.cube';
import { FontParams } from './schema.text';

const useStartOfSession = (
  threeService: ThreeService,
  spotlight: Mesh,
): {
  create: () => Promise<true | false>;
} => {
  const setSpotlightOnPosition = () => {
    threeService.AddToScene(spotlight);
    spotlight.scale.set(
      Measurements().spotLight.radius,
      Measurements().spotLight.radius,
      0,
    );
    spotlight.position.set(
      Positions().QRCodeScanner().x,
      Positions().QRCodeScanner().y,
      Positions().QRCodeScanner().z,
    );
  };

  const showScanImage = () => {
    setSpotlightOnPosition();
    const scanText = ScanQR(
      new Vector3(
        Positions().QRCodeScanner().x,
        Positions().QRCodeScanner().y,
        Positions().QRCodeScanner().z,
      ),
    ).create();
    threeService.AddGroupsToScene(scanText);
    return scanText;
  };

  const createCountDownNumber = (countdown: number) => {
    return TextHelper().CreateText(
      `${countdown}`,
      new Vector3(1, 0, Layers.presentation),
      {} as CubeParams,
      { size: customText.size.veryBig, color: Colors().white } as FontParams,
    );
  };

  const countdown = async (maxCount: number) => {
    let currentCount = maxCount;
    while(currentCount != 0){
      const text = createCountDownNumber(currentCount);
      threeService.AddToScene(text);
      await Common().awaitTimeout(1000);
      currentCount--;
      threeService.state.scene.remove(text);
    }
  };

  const create = async () => {
    showScanImage();
    await Common().awaitTimeout(Timing.startOfSession.videoDelay);
    threeService.ClearScene();
    setSpotlightOnPosition();
    await MoveObject().startMoving(spotlight, new Vector3(0, 1, Layers.scene));
    await countdown(Defaults().countdown());
    return true;
  };

  return { create };
};

export default useStartOfSession;
