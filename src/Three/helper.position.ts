import { Vector3 } from 'three';

const PositionHelper = (): {
  objectIsOnX: (_object: Vector3, _destination: Vector3, _step: number) => boolean;
  objectIsOnY: (_object: Vector3, _destination: Vector3, _step: number) => boolean;
} => {

  const objectIsOnX = (_object: Vector3, _destination: Vector3, _step: number) => {
    return _object.x <= _destination.x + _step && _object.x >= _destination.x - _step;
  };

  const objectIsOnY = (_object: Vector3, _destination: Vector3, _step: number) => {
    return _object.y >= _destination.y - _step && _object.y <= _destination.y + _step;
  };

  return {
    objectIsOnX,
    objectIsOnY,
  };
};

export default PositionHelper;