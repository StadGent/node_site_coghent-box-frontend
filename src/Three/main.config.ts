import { Vector2 } from 'three';
import BaseChapes from './BaseChapes';
import { LineSchema } from './LineSchema';

type Main = {
  lines: Array<LineSchema>;
};

export const main: Main = {
  lines: [
    {
      positions: [{ x: 0, y: 0 } as Vector2, { x: 4, y: 0 } as Vector2],
      endObject: BaseChapes().DrawCircle(0.08, 0x02a77f),
    },
    {
      positions: [{ x: 0, y: 1 } as Vector2, { x: 4, y: 1 } as Vector2],
    },
    {
      positions: [{ x: 0, y: 2 } as Vector2, { x: 4, y: 2 } as Vector2],
    },
  ],
};
