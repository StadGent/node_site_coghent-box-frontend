import { Vector3 } from 'three';

const DefaultLines = () => {
  const line1 = (point: Vector3) => {
    return [
      point,
      { x: point.x + 1, y: point.y + 1 },
      { x: point.x + 5, y: point.y + 1 },
    ] as Array<Vector3>;
  };
  const line2 = (point: Vector3) => {
    return [
      point,
      { x: point.x + 1, y: point.y },
      { x: point.x + 2, y: point.y + 1 },
    ] as Array<Vector3>;
  };
  const line3 = (point: Vector3) => {
    return [
      point,
      { x: point.x + 1, y: point.y - 1 },
      { x: point.x + 4, y: point.y - 1 },
    ] as Array<Vector3>;
  };
  const line4 = (point: Vector3) => {
    return [
      point,
      { x: point.x - 3, y: point.y },
      { x: point.x - 4, y: point.y - 1 },
    ] as Array<Vector3>;
  };
  const line5 = (point: Vector3) => {
    return [
      point,
      { x: point.x - 2, y: point.y + 2 },
      { x: point.x - 3, y: point.y + 2 },
    ] as Array<Vector3>;
  };

  return {
    line1,
    line2,
    line3,
    line4,
    line5,
  };
};

export default DefaultLines;
