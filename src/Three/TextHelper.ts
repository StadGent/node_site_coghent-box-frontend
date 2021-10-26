import { Vector3, Mesh } from 'three';
import SchemaText from './Textschema';

const TextHelper = (): {
  CreateTextFromRecord: (words: Record<string, Vector3>) => Array<Mesh>;
} => {
  const textSchema = SchemaText();
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
  return { CreateTextFromRecord };
};

export default TextHelper;
