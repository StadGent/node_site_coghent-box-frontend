import { BoxGeometry, Group, Mesh, MeshBasicMaterial, Vector3 } from 'three';
import Colors from './defaults.color';
import Layers from './defaults.layers';
import Measurements from './defaults.measurements';
import CircleHelper from './helper.circle';
import GroupHelper from './helper.group';
import TextHelper from './helper.text';
import SchemaCircle from './schema.circle';
import schemaCube, { CubeParams, CubeSchema } from './schema.cube';
import { FontParams } from './schema.text';

const MetadataLabel = (_position: Vector3): {
  create: (text: string) => Group;
} => {

  const label = (text: string) => {
    const labelText = TextHelper().CreateText(text, new Vector3(_position.x, _position.y, _position.z + Layers.fraction), { width: 0, height: 0 } as CubeParams, { color: Colors().white } as FontParams, 1) as Mesh<BoxGeometry, any>;
    labelText.position.setY(_position.y - (Measurements().text.size / 2));
    labelText.position.setX(_position.x - ((text.replace(/\s/g, '').length / 2) * Measurements().text.size));
    return labelText;
  }

  const labelBox = (_width: number, _height: number, _color: number) => {
    const cube = schemaCube().CreateCube({
      position: _position,
      params: { width: _width, height: _height, color: _color },
    } as CubeSchema);
    return cube;
  };

  const circles = (box: Mesh<BoxGeometry, MeshBasicMaterial>, color: number) => {
    const schema = CircleHelper().CreateSchema(
      new Vector3(
        box.position.x - box.geometry.parameters.width / 2,
        box.position.y,
        box.position.z,
      ),
      box.geometry.parameters.height / 2,
      color,
    );
    const schema2 = CircleHelper().CreateSchema(
      new Vector3(
        box.position.x + box.geometry.parameters.width / 2,
        box.position.y,
        box.position.z,
      ),
      box.geometry.parameters.height / 2,
      color,
    );
    const circle = SchemaCircle().CreateCircle(schema);
    const circle2 = SchemaCircle().CreateCircle(schema2);
    return { left: circle, right: circle2 };
  }


  const create = (text: string) => {
    const labelText = label(text);
    const textWidth = text.replace(/\s/g, '').length * Measurements().text.size;
    const textHeight = Measurements().text.size + Measurements().text.paddingAround;
    const box = labelBox(textWidth, textHeight, Colors().green);
    return GroupHelper().CreateGroup([box, labelText, circles(box, Colors().green).left, circles(box, Colors().green).right]);
  };

  return { create };

};

export default MetadataLabel;