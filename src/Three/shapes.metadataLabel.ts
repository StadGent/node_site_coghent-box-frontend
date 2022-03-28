import Common from '@/composables/common';
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

type Label = {
  text: Mesh<BoxGeometry, any>,
  dimensions: Vector3
}

const MetadataLabel = (_position: Vector3): {
  label: (text: string) => Promise<Label>
  create: (text: Label, _color: number) => Promise<MetadataLabelWithConnection>;
} => {
  let dotWidth = 0;
  const label = async (text: string) => {
    const labelText = await TextHelper().CreateText(text, new Vector3(_position.x, _position.y, _position.z + Layers.fraction), { width: 0, height: 0 } as CubeParams, { color: Colors().white, size: Measurements().text.size.medium } as FontParams, 1) as Mesh<BoxGeometry, any>;
    return { text: labelText, dimensions: getSizeStoryText(labelText) };
  }

  const labelBox = (_width: number, _height: number, _color: number) => {
    const position = _position
    const cube = schemaCube().CreateCube({
      position: position,
      params: { width: _width, height: _height, color: _color },
    } as CubeSchema);
    return cube;
  };

  const circles = (box: Mesh<BoxGeometry, MeshBasicMaterial>, color: number) => {
    dotWidth = box.geometry.parameters.height / 2
    const schema = CircleHelper().CreateSchema(
      new Vector3(
        box.position.x - box.geometry.parameters.width / 2,
        box.position.y,
        box.position.z,
      ),
      dotWidth,
      color,
    );
    const schema2 = CircleHelper().CreateSchema(
      new Vector3(
        box.position.x + box.geometry.parameters.width / 2,
        box.position.y,
        box.position.z,
      ),
      dotWidth,
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


  const create = async (_label: Label, _color: number) => {
    _label.text.position.y = _label.text.position.y - (_label.dimensions.y / 2)
    _label.text.position.x = _position.x - (_label.dimensions.x / 2)


    const box = labelBox(_label.dimensions.x, _label.dimensions.y + Measurements().text.paddingAround, _color);
    // const connect = connection(box, _color);
    const endCircles = circles(box, _color)
    const metadataLabel = GroupHelper().CreateGroup([
      box,
      _label.text,
      endCircles.left,
      endCircles.right,
    ]);
    return {
      metadata: metadataLabel,
    };
  };

  return { label, create };

};

export default MetadataLabel;