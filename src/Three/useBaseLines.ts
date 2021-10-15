import { Position } from '@/models/ThreeServiceModel';
import { Line, BufferGeometry, LineBasicMaterial } from 'three';
import useBaseChapes from './useBaseChapes';

const useBaseLines = (): {
  DrawLineR1: (pos: Position) => Line<BufferGeometry, LineBasicMaterial>;
  DrawLineR2: (pos: Position) => Line<BufferGeometry, LineBasicMaterial>;
  DrawLineR3: (pos: Position) => Line<BufferGeometry, LineBasicMaterial>;
  DrawLineL1: (pos: Position) => Line<BufferGeometry, LineBasicMaterial>;
  DrawLineL2: (pos: Position) => Line<BufferGeometry, LineBasicMaterial>;
} => {
  const baseChapeHelper = useBaseChapes();
  const DrawLineR1 = (pos: Position) => {
    return baseChapeHelper.DrawLine(
      [
        { x: pos.x, y: pos.y },
        { x: pos.x + 1, y: pos.y + 1 },
        { x: pos.x + 3, y: pos.y + 1 },
      ],
      { color: 0x02a77f },
    );
  };
  const DrawLineR2 = (pos: Position) => {
    return baseChapeHelper.DrawLine(
      [
        { x: pos.x, y: pos.y },
        { x: pos.x + 1, y: pos.y },
        { x: pos.x + 2, y: pos.y + 1 },
      ],
      { color: 0x02a77f },
    );
  };
  const DrawLineR3 = (pos: Position) => {
    return baseChapeHelper.DrawLine(
      [
        { x: pos.x, y: pos.y },
        { x: pos.x + 1, y: pos.y - 1 },
        { x: pos.x + 4, y: pos.y - 1 },
      ],
      { color: 0x02a77f },
    );
  };
  const DrawLineL1 = (pos: Position) => {
    return baseChapeHelper.DrawLine(
      [
        { x: pos.x, y: pos.y },
        { x: pos.x - 3, y: pos.y },
        { x: pos.x - 4, y: pos.y - 1 },
      ],
      { color: 0x02a77f },
    );
  };
  const DrawLineL2 = (pos: Position) => {
    return baseChapeHelper.DrawLine(
      [
        { x: pos.x, y: pos.y },
        { x: pos.x - 2, y: pos.y + 2 },
        { x: pos.x - 3, y: pos.y + 2 },
      ],
      { color: 0x02a77f },
    );
  };

  return { DrawLineR1, DrawLineR2, DrawLineR3, DrawLineL1, DrawLineL2 };
};

export default useBaseLines;
