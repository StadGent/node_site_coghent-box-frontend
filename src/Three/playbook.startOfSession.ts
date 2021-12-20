import MoveObject from '@/composables/moveObject';
import ScanQR from '@/screens/ScanQR';
import ThreeService from '@/services/ThreeService';
import { Mesh, Object3D, Vector3 } from 'three';
import Colors from './defaults.color';
import Defaults from './defaults.config';
import Layers from './defaults.layers';
import Measurements from './defaults.measurements';
import Positions from './defaults.positions';
import customText from './defaults.text';
import Timing from './defaults.timing';
import SchemaText, { FontParams, TextSchema } from './schema.text';

const useStartOfSession = (
  threeService: ThreeService,
  spotlight: Mesh,
): {
  create: () => void;
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

  const countdown = (count?: number) => {
    const schema = {
      text: `1`,
      position: new Vector3(0, 2, Layers.presentation),
      fontParams: { size: customText.size.veryBig, color: Colors().white } as FontParams,
    } as TextSchema;
    const text = SchemaText().LoadText(schema, 1);
    text.name = 'countdown';
  };

  const create = () => {
    showScanImage();
    setTimeout(async () => {
      threeService.ClearScene();
      setSpotlightOnPosition();
      await MoveObject().startMoving(spotlight, new Vector3(0, 2.5, Layers.scene));
    }, Timing.startOfSession.videoDelay);
    countdown();
  };

  return { create };
};

export default useStartOfSession;
