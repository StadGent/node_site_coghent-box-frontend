import { Vector3, Mesh } from 'three';
import { CubeParams } from './CubeSchema';
import SchemaText, { FontParams } from './Textschema';

const TextHelper = (): {
  CreateTextFromRecord: (words: Record<string, Vector3>) => Array<Mesh>;
  CreateText: (
    words: string,
    position: Vector3,
    textBox?: CubeParams,
    params?: FontParams,
  ) => Mesh;
} => {
  const textSchema = SchemaText();
  const CreateText = (
    word: string,
    position: Vector3,
    textBox?: CubeParams,
    params?: FontParams,
  ) => {
    const schema = {
      text: word,
      position: { x: position.x - 0.5, y: position.y, z: position.z } as Vector3,
      fontParams: {
        color: 0xfffffff,
        size: params?.size || 0.3,
        path: '/Fonts/myFont.json',
      },
      textBoxParams: {
        height: textBox?.height || 2,
        width: textBox?.width || 3,
        color: textBox?.color || 0x000000,
      },
    };
    return textSchema.LoadText(schema, position);
  };
  const CreateTextFromRecord = (words: Record<string, Vector3>) => {
    const txtMeshes: Array<Mesh> = [];
    for (const key in words) {
      const schema = {
        text: key,
        position: words[key] as Vector3,
        fontParams: {
          color: 0x02a77f,
          size: 0.3,
          path: '/Fonts/myFont.json',
        },
        textBoxParams: {
          height: 2,
          width: 3,
        },
      };
      txtMeshes.push(textSchema.LoadText(schema));
    }
    return txtMeshes;
  };
  return { CreateText, CreateTextFromRecord };
};

export default TextHelper;
