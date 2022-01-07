import {
  Vector3,
  Line,
  LineBasicMaterial,
  BufferGeometry,
  Object3D,
  Mesh,
  MeshBasicMaterial,
  BoxGeometry,
} from 'three';
import BaseChapes from './shapes.base';
import DefaultColors from './defaults.color';
import Layers from './defaults.layers';
import { LineSchema } from './schema.line';

const LineHelper = (): {
  GetEndOfLine: (
    line: Line<BufferGeometry, LineBasicMaterial> | Object3D<Event>,
  ) => Vector3;
  CreateSchema: (positions: Array<Vector3>, color?: number) => LineSchema;
  drawLineArroundCube: (
    cube: Mesh<BoxGeometry, MeshBasicMaterial>,
    color: number,
    layer?: number,
  ) => Line;
} => {
  const GetEndOfLine = (line: any) => {
    const position = {
      x: line.geometry.attributes.position.array[6],
      y: line.geometry.attributes.position.array[7],
    };
    return position as Vector3;
  };

  const CreateSchema = (positions: Array<Vector3>, color?: number) => {
    return {
      positions: positions as Array<Vector3>,
      params: { color: color || DefaultColors().green },
      endObject: BaseChapes().DrawCircle(0.08, color || DefaultColors().green, 50),
    } as LineSchema;
  };

  const drawLineArroundCube = (
    cube: Mesh<BoxGeometry, MeshBasicMaterial>,
    color: number,
    layer?: number,
  ) => {
    const marginFromObject = 0.16;
    const linewidth = 3;
    const startPointX =
      cube.position.x -
      (cube.geometry.parameters.width * cube.scale.x) / 2 -
      marginFromObject/2;
    const startPointY =
      cube.position.y -
      (cube.geometry.parameters.height * cube.scale.y) / 2 -
      marginFromObject/2;
    const path: Array<Vector3> = [
      new Vector3(startPointX, startPointY, layer || Layers.scene),
      new Vector3(
        startPointX + cube.geometry.parameters.width * cube.scale.x + marginFromObject,
        startPointY,
        layer || Layers.scene,
      ),
      new Vector3(
        startPointX + cube.geometry.parameters.width * cube.scale.x + marginFromObject,
        startPointY + cube.geometry.parameters.height * cube.scale.y + marginFromObject,
        layer || Layers.scene,
      ),
      new Vector3(
        startPointX,
        startPointY + cube.geometry.parameters.height * cube.scale.y + marginFromObject,
        layer ||Layers.scene,
      ),
      new Vector3(startPointX, startPointY, layer || Layers.scene),
    ];

    const geometry = new BufferGeometry().setFromPoints(path);
    const material = new LineBasicMaterial({ color: color, linewidth: linewidth });
    return new Line(geometry, material);
  };

  return { GetEndOfLine, CreateSchema, drawLineArroundCube };
};

export default LineHelper;
