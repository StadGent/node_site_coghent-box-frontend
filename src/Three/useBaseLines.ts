import { Line, BufferGeometry, LineBasicMaterial, Vector2 } from 'three';
import BaseChapes from './BaseChapes';

const useBaseLines = (): {
  DrawLineR1: (pos: Vector2) => Line<BufferGeometry, LineBasicMaterial>;
  DrawLineR2: (pos: Vector2) => Line<BufferGeometry, LineBasicMaterial>;
  DrawLineR3: (pos: Vector2) => Line<BufferGeometry, LineBasicMaterial>;
  DrawLineL1: (pos: Vector2) => Line<BufferGeometry, LineBasicMaterial>;
  DrawLineL2: (pos: Vector2) => Line<BufferGeometry, LineBasicMaterial>;
} => {
  const baseChapeHelper = BaseChapes();
  const DrawLineR1 = (pos: Vector2) => {
    return baseChapeHelper.DrawLine(
      [
        { x: pos.x, y: pos.y },
        { x: pos.x + 1, y: pos.y + 1 },
        { x: pos.x + 3, y: pos.y + 1 },
      ] as Vector2[],
      { color: 0x02a77f },
    );
  };
  const DrawLineR2 = (pos: Vector2) => {
    return baseChapeHelper.DrawLine(
      [
        { x: pos.x, y: pos.y },
        { x: pos.x + 1, y: pos.y },
        { x: pos.x + 2, y: pos.y + 1 },
      ] as Vector2[],
      { color: 0x02a77f },
    );
  };
  const DrawLineR3 = (pos: Vector2) => {
    return baseChapeHelper.DrawLine(
      [
        { x: pos.x, y: pos.y },
        { x: pos.x + 1, y: pos.y - 1 },
        { x: pos.x + 4, y: pos.y - 1 },
      ] as Vector2[],
      { color: 0x02a77f },
    );
  };
  const DrawLineL1 = (pos: Vector2) => {
    return baseChapeHelper.DrawLine(
      [
        { x: pos.x, y: pos.y },
        { x: pos.x - 3, y: pos.y },
        { x: pos.x - 4, y: pos.y - 1 },
      ] as Vector2[],
      { color: 0x02a77f },
    );
  };
  const DrawLineL2 = (pos: Vector2) => {
    return baseChapeHelper.DrawLine(
      [
        { x: pos.x, y: pos.y },
        { x: pos.x - 2, y: pos.y + 2 },
        { x: pos.x - 3, y: pos.y + 2 },
      ] as Vector2[],
      { color: 0x02a77f },
    );
  };

  return { DrawLineR1, DrawLineR2, DrawLineR3, DrawLineL1, DrawLineL2 };
};

export default useBaseLines;
