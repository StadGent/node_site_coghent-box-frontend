import {
  CircleGeometry,
  Group,
  LineBasicMaterialParameters,
  Mesh,
  MeshBasicMaterial,
  Vector2,
  Vector3,
} from 'three';
import BaseChapes from './BaseChapes';
import ChapeHelper from './Chapehelper';
import GroupHelper from './GroupHelper';

export type LineSchema = {
  positions: Array<Vector2>;
  params?: LineBasicMaterialParameters;
  endObject?: Mesh<CircleGeometry, MeshBasicMaterial>;
};

const SchemaLine = (): {
  CreateLine: (schema: LineSchema) => Group;
  CreateLines: (schemas: Array<LineSchema>) => Array<Group>;
} => {
  const baseChapes = BaseChapes();
  const chapeHelper = ChapeHelper();
  const grouphelper = GroupHelper();

  const CreateLine = (schema: LineSchema) => {
    if (schema.endObject) {
      chapeHelper.SetPosition(
        {
          x: schema.positions[schema.positions.length - 1].x,
          y: schema.positions[schema.positions.length - 1].y,
          z: 0,
        } as Vector3,
        schema.endObject,
      );
    }
    const line = baseChapes.DrawLine(schema.positions, schema.params || {color: 0x02a77f});
    const group = grouphelper.CreateGroup([
      line,
      schema.endObject as Mesh<CircleGeometry, MeshBasicMaterial>,
    ]);

    return group;
  };

  const CreateLines = (schemas: Array<LineSchema>) => {
    const lines: Array<Group> = [];
    schemas.forEach((schema: LineSchema) => {
      lines.push(CreateLine(schema));
    });
    return lines;
  };
  return {
    CreateLine,
    CreateLines,
  };
};

export default SchemaLine;