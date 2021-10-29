import { Vector3, Mesh } from 'three';
import ChapeHelper from './Chapehelper';
import DefaultsHelper from './DefaultsHelper';

const Correction = (): {
  EndOfLineObjectPositionsRight: (index: number) => Vector3;
  EndOfLineObjectPositionsLeft: (index: number) => Vector3;
  CorrectImageBoxPositionRight: (index: number) => Vector3;
  CorrectImageBoxPositionLeft: (index: number) => Vector3;
  CorrectTextBoxPosition: (position: Vector3, textBox: Mesh, correctX?: number) => void;
} => {
  const EndOfLineObjectPositionsRight = (index: number) => {
    return {
      x: DefaultsHelper().CircleConnectPoints(new Vector3(0, 0, 0))[index][2].x,
      y: DefaultsHelper().CircleConnectPoints(new Vector3(0, 0, 0))[index][2].y,
      z: DefaultsHelper().CircleConnectPoints(new Vector3(0, 0, 0))[index][2].z,
    } as Vector3;
  };
  const EndOfLineObjectPositionsLeft = (index: number) => {
    return {
      x: DefaultsHelper().CircleConnectPoints(new Vector3(0, 0, 0))[index][2].x - 3,
      y: DefaultsHelper().CircleConnectPoints(new Vector3(0, 0, 0))[index][2].y,
      z: DefaultsHelper().CircleConnectPoints(new Vector3(0, 0, 0))[index][2].z,
    } as Vector3;
  };

  const CorrectImageBoxPositionRight = (index: number) => {
    return {
      x: DefaultsHelper().CircleConnectPoints(new Vector3(0, 0, 0))[index][2].x + 1.1,
      y: DefaultsHelper().CircleConnectPoints(new Vector3(0, 0, 0))[index][2].y - 1,
      z: DefaultsHelper().CircleConnectPoints(new Vector3(0, 0, 0))[index][2].z,
    } as Vector3;
  };
  const CorrectImageBoxPositionLeft = (index: number) => {
    return {
      x: DefaultsHelper().CircleConnectPoints(new Vector3(0, 0, 0))[index][2].x - 1.1,
      y: DefaultsHelper().CircleConnectPoints(new Vector3(0, 0, 0))[index][2].y - 1,
      z: DefaultsHelper().CircleConnectPoints(new Vector3(0, 0, 0))[index][2].z,
    } as Vector3;
  };

  const CorrectTextBoxPosition = (position: Vector3, textBox: Mesh, correctX = 1.7) => {
    if (position.x > 0) {
      ChapeHelper().SetPosition(
        {
          x: position.x + correctX,
          y: position.y,
          z: position.z,
        } as Vector3,
        textBox,
      );
    } else {
      ChapeHelper().SetPosition(
        {
          x: position.x - correctX,
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
