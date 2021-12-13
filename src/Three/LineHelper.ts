import {
  Vector3,
  Line,
  LineBasicMaterial,
  BufferGeometry,
  Group,
  Object3D,
  Mesh,
  MeshBasicMaterial,
  BoxGeometry,
} from 'three';
import BaseChapes from './BaseChapes';
import DefaultColors from './defaults.color';
import Layers from './defaults.layers';
import { LineSchema } from './LineSchema';

const LineHelper = (): {
  GetEndOfLine: (
    line: Line<BufferGeometry, LineBasicMaterial> | Object3D<Event>,
  ) => Vector3;
  CreateSchema: (positions: Array<Vector3>, color?: number) => LineSchema;
  drawLineArroundCube: (
    cube: Mesh<BoxGeometry, MeshBasicMaterial>,
    color: number,
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
  ) => {
    const startPointX =
      cube.position.x -
      cube.position.x * 0.03 * 2.03 -
      cube.geometry.parameters.width * cube.scale.x / 2 -
      0.08;
    const startPointY =
      cube.position.y -
      cube.position.y * 0.03 * 2.03 -
      cube.geometry.parameters.height * cube.scale.y / 2 -
      0.06;
    const path: Array<Vector3> = [
      new Vector3(startPointX, startPointY, Layers.presentation),
      new Vector3(
        startPointX + cube.geometry.parameters.width * cube.scale.x + 0.16,
        startPointY,
        Layers.presentation,
      ),
      new Vector3(
        startPointX + cube.geometry.parameters.width * cube.scale.x + 0.16,
        startPointY + cube.geometry.parameters.height * cube.scale.y + 0.16,
        Layers.presentation,
      ),
      new Vector3(
        startPointX,
        startPointY + cube.geometry.parameters.height * cube.scale.y + 0.16,
        Layers.presentation,
      ),
      new Vector3(startPointX, startPointY, Layers.presentation),
    ];

    const geometry = new BufferGeometry().setFromPoints(path);
    const material = new LineBasicMaterial({ color: color, linewidth: 3 });
    return new Line(geometry, material);
  };

  return { GetEndOfLine, CreateSchema, drawLineArroundCube };
};

export default LineHelper;
