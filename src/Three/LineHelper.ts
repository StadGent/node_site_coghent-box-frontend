import { Vector3, Line, LineBasicMaterial, BufferGeometry, Vector2 } from 'three';
import Defaults from './defaults.config';
import { LineSchema } from './LineSchema';

const LineHelper = (): {
  GetEndOfLine: (line: Line<BufferGeometry, LineBasicMaterial>) => Vector3;
  CreateSchema: (positions: Array<Vector2>) => LineSchema;
} => {
  const GetEndOfLine = (line: Line<BufferGeometry, LineBasicMaterial>) => {
    const position = {
      x: line.geometry.attributes.position.array[6],
      y: line.geometry.attributes.position.array[7],
    };
    return position as Vector3;
  };

  const CreateSchema = (positions: Array<Vector2>) => {
    return {
      positions: positions,
      endObject: Defaults().EndCircle(),
    };
  };

  return { GetEndOfLine, CreateSchema };
};

export default LineHelper;
