import { Vector3, Mesh } from 'three';
import ChapeHelper from './Chapehelper';
import Defaults from './defaults.config';

const Correction = (): {
  EndOfLineObjectPositionsRight: (index: number) => Vector3;
  EndOfLineObjectPositionsLeft: (index: number) => Vector3;
  CorrectImageBoxPositionRight: (index: number) => Vector3;
  CorrectImageBoxPositionLeft: (index: number) => Vector3;
  CorrectTextBoxPosition: (position: Vector3, textBox: Mesh) => void;
} => {
  const EndOfLineObjectPositionsRight = (index: number) => {
    return {
      x: Defaults().LinePositions()[index][2].x,
      y: Defaults().LinePositions()[index][2].y,
      z: Defaults().LinePositions()[index][2].z,
    } as Vector3;
  };
  const EndOfLineObjectPositionsLeft = (index: number) => {
    return {
      x: Defaults().LinePositions()[index][2].x - 3,
      y: Defaults().LinePositions()[index][2].y,
      z: Defaults().LinePositions()[index][2].z,
    } as Vector3;
  };

  const CorrectImageBoxPositionRight = (index: number) => {
    return {
      x: Defaults().LinePositions()[index][2].x + 1.1,
      y: Defaults().LinePositions()[index][2].y - 1,
      z: Defaults().LinePositions()[index][2].z,
    } as Vector3;
  };
  const CorrectImageBoxPositionLeft = (index: number) => {
    return {
      x: Defaults().LinePositions()[index][2].x - 1.1,
      y: Defaults().LinePositions()[index][2].y - 1,
      z: Defaults().LinePositions()[index][2].z,
    } as Vector3;
  };

  const CorrectTextBoxPosition = (position: Vector3, textBox: Mesh) => {
    if (position.x > 0) {
      ChapeHelper().SetPosition(
        {
          x: position.x + 1.7,
          y: position.y,
          z: position.z,
        } as Vector3,
        textBox,
      );
    } else {
      ChapeHelper().SetPosition(
        {
          x: position.x - 1.5,
          y: position.y,
          z: position.z,
        } as Vector3,
        textBox,
      );
    }
  };
  return {
    EndOfLineObjectPositionsRight,
    EndOfLineObjectPositionsLeft,
    CorrectImageBoxPositionRight,
    CorrectImageBoxPositionLeft,
    CorrectTextBoxPosition,
  };
};

export default Correction;
