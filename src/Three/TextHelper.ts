import { Vector3, Mesh } from 'three';
import SchemaText from './Textschema';

const TextHelper = (): {
  CreateTextFromRecord: (words: Record<string, Vector3>) => Array<Mesh>;
  CreateText: (words: string, position: Vector3) => Mesh;
} => {
  const textSchema = SchemaText();
  const CreateText = (word: string, position: Vector3) => {
    const schema = {
      text: word,
      position: position as Vector3,
      fontParams: {
        color: 0x02a77f,
        size: 0.3,
        path: '/Fonts/myFont.json',
      },
      textBoxParams: {
        height: 1,
        width: 3,
      },
    };
    return textSchema.LoadText(schema);
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
          height: 1,
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
