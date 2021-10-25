import BaseChapes from '@/Three/BaseChapes';
import ChapeHelper from '@/Three/Chapehelper';
import SchemaCircle from '@/Three/CircleSchema';
import CubeHelper from '@/Three/CubeHelper';
import SchemaCube from '@/Three/CubeSchema';
import Defaults from '@/Three/defaults.config';
import SchemaLine from '@/Three/LineSchema';
import {
  Group,
  Mesh,
  CircleGeometry,
  MeshBasicMaterial,
  Vector2,
  Vector3,
  Line,
  LineBasicMaterial,
  BufferGeometry,
  BoxBufferGeometry,
} from 'three';

const Frame1 = (): {
  Lines: () => Array<Group>;
  mainCircle: () => Mesh<CircleGeometry, MeshBasicMaterial>;
  outerCircle: () => Line<BufferGeometry, LineBasicMaterial>;
  ImageCubes: (line: Group) => Mesh<BoxBufferGeometry, MeshBasicMaterial>;
} => {
  const chapeHelper = ChapeHelper();
  const cubeHelper = CubeHelper();

  const line_schema = SchemaLine();
  const circle_schema = SchemaCircle();
  const cube_schema = SchemaCube();

  const defaults = Defaults();

  const lineStartPoints = chapeHelper.GetCirclePointsForCircle(defaults.circlePoints);
  const lines: Array<Group> = [];
  const mainCircle = () => {
    return circle_schema.CreateCircle(defaults.Circle);
  };
  const outerCircle = () => {
    return circle_schema.CreateOuterCircle(defaults.Circle.params.radius + 1);
  };

  const Lines = () => {
    for (let index = 0; index < lineStartPoints.length; index++) {
      lines.push(
        line_schema.CreateLine({
          positions: defaults.LinePositions()[index] as Vector2[],
          endObject: BaseChapes().DrawCircle(0.08, 0x02a77f, 50),
        }),
      );
    }
    return lines;
  };

  const ImageCubes = (line: Group) => {
    const cube = cube_schema.CreateImageCube(defaults.ImageCube);
    chapeHelper.SetPosition(
      {
        x: line.children[1].position.x + cubeHelper.GetCubeParams(cube).width / 2 + 0.1,
        y: line.children[1].position.y,
        z: 0,
      } as Vector3,
      cube,
    );
    return cube;
  };

  return { Lines, mainCircle, outerCircle, ImageCubes };
};
export default Frame1;
