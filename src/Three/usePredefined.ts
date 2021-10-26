import {
  Mesh,
  MeshBasicMaterial,
  BoxBufferGeometry,
  Group,
  Vector3,
  Vector2,
} from 'three';
import Frame1 from '@/frames/Frame1';
import Defaults from './defaults.config';
import BaseChapes from './BaseChapes';
import { LineSchema } from './LineSchema';

const usePredefined = (): {
  BaseStoryCircle: () =>
    | Array<Group>
    | Mesh<BoxBufferGeometry, MeshBasicMaterial>[]
    | any;
} => {
  const BaseStoryCircle = () => {
    const words: Record<string, Vector3> = {
      Migratie: Defaults().LinePositions()[0][2] as Vector3,
      Economie: Defaults().LinePositions()[1][2] as Vector3,
      Turkije: Defaults().LinePositions()[2][2] as Vector3,
      Familie: Defaults().LinePositions()[3][2] as Vector3,
      Vakantie: Defaults().LinePositions()[4][2] as Vector3,
    };
    const lines: Array<LineSchema> = [
      {
        positions: Defaults().LinePositions()[0] as Vector2[],
        endObject: BaseChapes().DrawCircle(0.08, 0x02a77f, 50),
      },
      {
        positions: Defaults().LinePositions()[1] as Vector2[],
        endObject: BaseChapes().DrawCircle(0.08, 0x02a77f, 50),
      },
      {
        positions: Defaults().LinePositions()[2] as Vector2[],
        endObject: BaseChapes().DrawCircle(0.08, 0x02a77f, 50),
      },
      {
        positions: Defaults().LinePositions()[3] as Vector2[],
        endObject: BaseChapes().DrawCircle(0.08, 0x02a77f, 50),
      },
      {
        positions: Defaults().LinePositions()[4] as Vector2[],
        endObject: BaseChapes().DrawCircle(0.08, 0x02a77f, 50),
      },
    ];
    const circle = Defaults().Circle();
    const frame1 = Frame1().Frame(lines, words, circle, true);

    return frame1;
  };

  return { BaseStoryCircle };
};

export default usePredefined;
