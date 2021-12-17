import { Vector3, Mesh } from 'three';
import ChapeHelper from './helper.chape';
import DefaultsHelper from './helper.defaults';

const Correction = (): {
  EndOfLineObjectPositionsRight: (index: number) => Vector3;
  EndOfLineObjectPositionsLeft: (index: number) => Vector3;
  CorrectTextBoxPosition: (position: Vector3, textBox: Mesh, correctX?: number) => void;
  CorrectionForDotOnProgressBar: (position: Vector3, width: number) => Vector3;
  CorrectImageBoxPositionRight: (index: number) => Vector3;
  CorrectImageBoxPositionLeft: (index: number) => Vector3;

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

  const CorrectTextBoxPosition = (position: Vector3, textBox: Mesh, correctX = 1.2) => {
    if (position.x > 1) {
      ChapeHelper().SetPosition(
        {
          x: position.x - correctX,
          y: position.y,
          z: position.z,
        } as Vector3,
        textBox,
      );
    } else if (position.x < 1) {
      ChapeHelper().SetPosition(
        {
          x: position.x + correctX,
          y: position.y,
          z: position.z,
        } as Vector3,
        textBox,
      );
    }
  };

  const CorrectionForDotOnProgressBar = (position: Vector3, width: number) => {
    const correction = position;
    if(position.x > 0.01){
      correction.x = position.x + width/2
    }else if(position.x < 0){
      correction.x = position.x - width/2
    }
    if(position.y > 0.01){
      correction.y = position.y + width/2
    }else if(position.x < 0){
      correction.y = position.y - width/2
    }
    return correction;
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

  return {
    EndOfLineObjectPositionsRight,
    EndOfLineObjectPositionsLeft,
    CorrectTextBoxPosition,
    CorrectionForDotOnProgressBar,
    CorrectImageBoxPositionRight,
    CorrectImageBoxPositionLeft,
  };
};

export default Correction;
