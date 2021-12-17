import Correction from '@/Three/helper.correction';
import CubeHelper from '@/Three/helper.cube';
import SchemaCube from '@/Three/schema.cube';
import DefaultColors from '@/Three/defaults.color';
import DefaultsHelper from '@/Three/helper.defaults';
import LineHelper from '@/Three/helper.line';
import SchemaLine from '@/Three/schema.line';
import { Group, Mesh, Object3D, Vector3 } from 'three';

const StoryCircleChild = (): {
  ConnectPointsNextImage: (positions: Array<Vector3>) => {
    cubes: Mesh[];
    lines: Group[];
  };
} => {
  const ConnectPointsNextImage = (positions: Array<Vector3>) => {
    const lines: Array<Group> = [];
    const endPositions: Array<Vector3> = [];
    for (let i = 0; i < positions.length; i++) {
      if (i < 3) {
        const lineSchema = LineHelper().CreateSchema(
          DefaultsHelper().Lines({
            x: positions[i].x + 1,
            y: positions[i].y + 1,
            z: positions[i].z,
          } as Vector3)[i] as Array<Vector3>,
          DefaultColors().white,
        );
        const line = SchemaLine().CreateLine(lineSchema);
        endPositions.push(LineHelper().GetEndOfLine(line.children[0] as Object3D<Event>));
        lines.push(line);
      } else {
        const lineSchema = LineHelper().CreateSchema(
          DefaultsHelper().Lines({
            x: positions[i].x - 1,
            y: positions[i].y + 1,
            z: positions[i].z,
          } as Vector3)[i] as Array<Vector3>,
          DefaultColors().white,
        );
        const line = SchemaLine().CreateLine(lineSchema);
        endPositions.push(LineHelper().GetEndOfLine(line.children[0] as Object3D<Event>));
        lines.push(line);
      }
    }
    const cubes = AddImagesToLine(endPositions);
    return { cubes: cubes, lines: lines };
  };

  const AddImagesToLine = (positions: Array<Vector3>) => {
    const cubes: Array<Mesh> = [];
    for (let i = 0; i < positions.length; i++) {
      const schema = CubeHelper().CreateSchema(
        positions[i],
        'http://localhost:8001/download/9ce891fe75a8e75d82019665d2585a83-2005-0025_1.JPG',
      );
      const cube = SchemaCube().CreateImageCube(schema);
      Correction().CorrectTextBoxPosition(positions[i], cube, 1.1);
      cubes.push(cube);
    }
    return cubes;
  };

  return { ConnectPointsNextImage };
};

export default StoryCircleChild;
