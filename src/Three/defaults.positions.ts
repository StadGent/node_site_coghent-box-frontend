import { Vector3 } from 'three';
import Layers from './defaults.layers';

const Positions = (): {
  StoryPausePositions: () => Array<Vector3>;
  CenterWordPositions: () => Array<Vector3>;
  QRCodeScannerImage: Vector3;
  endOfSession: () => Vector3;
} => {
  const CenterWordPositions = () => {
    return [
      new Vector3(0.5, 2, 0),
      new Vector3(-1.5, 1, 0),
      new Vector3(-2, -1.5, 0),
      new Vector3(3, 1, 0),
      new Vector3(3, -1.5, 0),
      new Vector3(1, -3, 0),
    ];
  };

  const StoryPausePositions = () => {
    return [
      new Vector3(-15, 0, 0),
      new Vector3(15, 0, 0),
      new Vector3(-7, 0, 0),
      new Vector3(-7, 0, 0),
    ];
  };

  const QRCodeScannerImage = new Vector3(0,-1,Layers.presentation);

  const endOfSession = () => new Vector3(18,2,0); 

  return {
    StoryPausePositions,
    CenterWordPositions,
    QRCodeScannerImage,
    endOfSession,
  }
};

export default Positions;