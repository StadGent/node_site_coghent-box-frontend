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
import DotWithinDot from './shapes.dotWithinDot';

type MetadataLabelWithConnection = {
  metadata: Group,
  connection?: Group,
};

const MetadataLabel = (_position: Vector3): {
  create: (text: string, _color: number) => MetadataLabelWithConnection;
} => {

  const label = (text: string) => {
    const labelText = TextHelper().CreateText(text, new Vector3(_position.x, _position.y, _position.z + Layers.fraction), { width: 0, height: 0 } as CubeParams, { color: Colors().white, size: Measurements().text.size.smaller } as FontParams, 1) as Mesh<BoxGeometry, any>;
    const lengthOfText = ((text.length * Measurements().text.size.smaller))
    labelText.position.setY(_position.y - (Measurements().text.size.smaller / 2));
    labelText.position.setX(_position.x - lengthOfText / 3 - Measurements().text.paddingAround);
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
  };

  const connection = (box: Mesh<BoxGeometry, MeshBasicMaterial>, _color: number) => {
    const innerRadius = box.geometry.parameters.height / 10;
    const outerRadius = box.geometry.parameters.height / 6;
    const topDot = DotWithinDot().create(
      innerRadius,
      outerRadius,
      new Vector3(
        box.position.x,
        box.position.y - box.geometry.parameters.height / 2,
        box.position.z,
      ),
      _color,
      Colors().white
    );
    const cube = schemaCube().CreateCube({
      position: new Vector3(
        topDot.position.x,
        topDot.position.y - outerRadius,
        box.position.z,
      ),
      params: { width: outerRadius, height: outerRadius * 5, color: Colors().pink },
    } as CubeSchema);
    const bottomDot = DotWithinDot().create(
      innerRadius,
      outerRadius,
      new Vector3(
        box.position.x,
        cube.position.y - outerRadius * 5 / 2,
        box.position.z,
      ),
      _color,
      Colors().white
    );
    return {
      top: topDot,
      bottom: bottomDot,
      cube: cube
    };
  }


  const create = (_text: string, _color: number) => {
    const labelText = label(_text);
    const textWidth = _text.length * Measurements().text.size.smaller;
    const textHeight = Measurements().text.size.smaller;
    const box = labelBox(textWidth, textHeight + Measurements().text.paddingAround, _color);
    const connect = connection(box, _color);
    const metadataLabel = GroupHelper().CreateGroup([
      box,
      labelText,
      circles(box, _color).left,
      circles(box, _color).right,
    ]);
    return {
      metadata: metadataLabel,
    };
  };

  return { create };

};

export default MetadataLabel;