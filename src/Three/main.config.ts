import { Vector2, Vector3 } from 'three';
import BaseChapes from './BaseChapes';
import ChapeHelper from './Chapehelper';
import { CircleSchema } from './CircleSchema';
import { LineSchema } from './LineSchema';

type Main = {
  lines: Array<LineSchema>;
  circles: Array<CircleSchema>
};

export const main: Main = {
  lines: [
    {
      positions: [{ x: 0, y: 0 } as Vector2, { x: 4, y: 0 } as Vector2],
      endObject: BaseChapes().DrawCircle(0.08, 0x02a77f, 50),
    },
    {
      positions: [{ x: 0, y: 1 } as Vector2, { x: 4, y: 1 } as Vector2],
      endObject: BaseChapes().DrawCircle(0.08, 0x02a77f, 50),
    },
    {
      positions: [{ x: 0, y: 2 } as Vector2, { x: 4, y: 2 } as Vector2],
    },
  ],
  circles: [
    {
      position: { x: 0, y: 0, z:0 } as Vector3,
      params: {radius: 2},
    },
  ],
};
