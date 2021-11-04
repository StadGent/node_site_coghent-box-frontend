import { Vector3, Mesh } from 'three';
import { CubeParams } from './CubeSchema';
import DefaultColors from './defaults.color';
import SchemaText, { FontParams } from './Textschema';

const TextHelper = (): {
  CreateTextFromRecord: (words: Record<string, Vector3>, color?: number) => Array<Mesh>;
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
      position: position as Vector3,
      fontParams: {
        color: params?.color || DefaultColors().white,
        size: params?.size || 0.3,
        path: '/Fonts/myFont.json',
      },
      textBoxParams: {
        height: textBox?.height || 2,
        width: textBox?.width || 3,
        color: textBox?.color || DefaultColors().black,
      },
    };
    return textSchema.LoadText(schema, position);
  };
  const CreateTextFromRecord = (words: Record<string, Vector3>, color?: number) => {
    const txtMeshes: Array<Mesh> = [];
    for (const key in words) {
      const schema = {
        text: key,
        position: words[key] as Vector3,
        fontParams: {
          color: color || DefaultColors().green,
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
