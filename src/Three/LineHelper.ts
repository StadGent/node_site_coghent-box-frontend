import { Vector3, Line, LineBasicMaterial, BufferGeometry } from 'three';
import BaseChapes from './BaseChapes';
import Defaults from './defaults.config';
import { LineSchema } from './LineSchema';

const LineHelper = (): {
  GetEndOfLine: (line: Line<BufferGeometry, LineBasicMaterial>) => Vector3;
  CreateSchema: (positions: Array<Vector3>, color?: number) => LineSchema;
} => {
  const GetEndOfLine = (line: Line<BufferGeometry, LineBasicMaterial>) => {
    const position = {
      x: line.geometry.attributes.position.array[6],
      y: line.geometry.attributes.position.array[7],
    };
    return position as Vector3;
  };

  const CreateSchema = (positions: Array<Vector3>, color?: number) => {
    return {
      positions: positions as Array<Vector3>,
      params: { color: color || 0x02a77f },
      endObject: BaseChapes().DrawCircle(0.08, color || 0x02a77f, 50),
    } as LineSchema;
  };

  return { GetEndOfLine, CreateSchema };
};

export default LineHelper;
