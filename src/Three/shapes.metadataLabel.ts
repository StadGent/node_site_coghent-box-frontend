import { BoxGeometry, Group, Mesh, MeshBasicMaterial, Vector3 } from 'three';
import Colors from './defaults.color';
import Layers from './defaults.layers';
import Measurements from './defaults.measurements';
import CircleHelper from './helper.circle';
import GroupHelper from './helper.group';
import { getSizeStoryText } from './helper.move';
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
  label: (text: string) => Promise<Mesh<BoxGeometry, any>>
  create: (text: string, _color: number) => Promise<MetadataLabelWithConnection>;
} => {

  const label = async (text: string) => {
    const labelText = await TextHelper().CreateText(text, new Vector3(_position.x, _position.y, _position.z + Layers.fraction), { width: 0, height: 0 } as CubeParams, { color: Colors().white, size: Measurements().text.size.medium } as FontParams, 1) as Mesh<BoxGeometry, any>;
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

  // const connection = (box: Mesh<BoxGeometry, MeshBasicMaterial>, _color: number) => {
  //   const innerRadius = box.geometry.parameters.height / 10;
  //   const outerRadius = box.geometry.parameters.height / 6;
  //   const topDot = DotWithinDot().create(
  //     innerRadius,
  //     outerRadius,
  //     new Vector3(
  //       box.position.x,
  //       box.position.y - box.geometry.parameters.height / 2,
  //       box.position.z,
  //     ),
  //     _color,
  //     Colors().white
  //   );
  //   const cube = schemaCube().CreateCube({
  //     position: new Vector3(
  //       topDot.position.x,
  //       topDot.position.y - outerRadius,
  //       box.position.z,
  //     ),
  //     params: { width: outerRadius, height: outerRadius * 5, color: Colors().pink },
  //   } as CubeSchema);
  //   const bottomDot = DotWithinDot().create(
  //     innerRadius,
  //     outerRadius,
  //     new Vector3(
  //       box.position.x,
  //       cube.position.y - outerRadius * 5 / 2,
  //       box.position.z,
  //     ),
  //     _color,
  //     Colors().white
  //   );
  //   return {
  //     top: topDot,
  //     bottom: bottomDot,
  //     cube: cube
  //   };
  // }


  const create = async (_text: string, _color: number) => {
    const labelText = await label(_text);
    const textDimensions = getSizeStoryText(labelText)
    // const textHeight = Measurements().text.size.medium;
    labelText.position.x = labelText.position.x - (textDimensions.x / 2)
    labelText.position.y = labelText.position.y - (textDimensions.y / 2)
    const box = labelBox(textDimensions.x, textDimensions.y + Measurements().text.paddingAround, _color);
    // const connect = connection(box, _color);
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

  return { label, create };

};

export default MetadataLabel;