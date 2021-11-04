import { Vector3, Line, LineBasicMaterial, BufferGeometry, Group, Object3D } from 'three';
import BaseChapes from './BaseChapes';
import DefaultColors from './defaults.color';
import { LineSchema } from './LineSchema';

const LineHelper = (): {
  GetEndOfLine: (
    line: Line<BufferGeometry, LineBasicMaterial> | Object3D<Event>,
  ) => Vector3;
  CreateSchema: (positions: Array<Vector3>, color?: number) => LineSchema;
} => {
  const GetEndOfLine = (line: any) => {
    const position = {
      x: line.geometry.attributes.position.array[6],
      y: line.geometry.attributes.position.array[7],
    };
    return position as Vector3;
  };

  const CreateSchema = (positions: Array<Vector3>, color?: number) => {
    return {
      positions: positions as Array<Vector3>,
      params: { color: color || DefaultColors().green },
      endObject: BaseChapes().DrawCircle(0.08, color || DefaultColors().green, 50),
    } as LineSchema;
  };

  return { GetEndOfLine, CreateSchema };
};

export default LineHelper;
