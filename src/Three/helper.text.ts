import { Vector3, Mesh, Group } from 'three';
import CubeHelper from './helper.cube';
import SchemaCube, { CubeParams } from './schema.cube';
import DefaultColors from './defaults.color';
import GroupHelper from './helper.group';
import SchemaText, { FontParams } from './schema.text';
import Measurements from './defaults.measurements';
import Defaults from './defaults.config';

const TextHelper = (): {
  CreateTextFromRecord: (words: Record<string, Vector3>, color?: number) => Array<Mesh>;
  CreateText: (
    words: string,
    position: Vector3,
    textBox?: CubeParams,
    params?: FontParams,
    opacity?: number,
  ) => Mesh;
  displayTextFromRecordWithIcon: (
    textRecord: Record<string, Vector3>,
    color: number,
    icon: string,
    iconPosition: Vector3,
    iconDimensions: Vector3,
  ) => Array<Group>;
} => {
  const textSchema = SchemaText();
  const CreateText = (
    word: string,
    position: Vector3,
    textBox?: CubeParams,
    params?: FontParams,
    opacity?: number,
  ) => {
    const schema = {
      text: word,
      position: position as Vector3,
      fontParams: {
        color: params?.color || DefaultColors().white,
        size: params?.size || Measurements().text.size.small,
        path: Defaults().fontPath(),
      },
      textBoxParams: {
        height: textBox?.height || 0.5,
        width: textBox?.width || 3,
        color: textBox?.color || DefaultColors().black,
      },
    };
    return textSchema.LoadText(schema, opacity || 1);
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
      txtMeshes.push(textSchema.LoadText(schema, 1));
    }
    return txtMeshes;
  };
  const displayTextFromRecordWithIcon = (
    textRecord: Record<string, Vector3>,
    color: number,
    icon: string,
    iconPosition: Vector3,
    iconDimensions: Vector3,
  ) => {
    const groups: Array<Group> = [];
    const text = CreateTextFromRecord(textRecord, color);
    const iconSchema = CubeHelper().CreateSchema(iconPosition, icon, iconDimensions);
    const iconCube = SchemaCube().CreateImageCube(iconSchema);
    GroupHelper().AddObjectsTogroups(text, groups);
    GroupHelper().AddObjectsTogroups([iconCube], groups);
    return groups;
  };

  return { CreateText, CreateTextFromRecord, displayTextFromRecordWithIcon };
};

export default TextHelper;
