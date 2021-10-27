import Defaults from '@/Three/defaults.config';
import LineHelper from '@/Three/LineHelper';
import SchemaLine from '@/Three/LineSchema';
import { Group, Vector3 } from 'three';

const StoryCircleChild = (): {
  ConnectPointsWithLine: (positions: Array<Vector3>) => Array<Group>;
} => {
  const ConnectPointsWithLine = (positions: Array<Vector3>) => {
    const lines: Array<Group> = [];
    for (let i = 0; i < positions.length; i++) {
      if (i < 3) {
        const lineSchema = LineHelper().CreateSchema(
          Defaults().Lines({
            x: positions[i].x + 1,
            y: positions[i].y + 1,
            z: positions[i].z,
          } as Vector3)[i] as Array<Vector3>,
          0xffffff,
        );
        lines.push(SchemaLine().CreateLine(lineSchema));
      } else {
        const lineSchema = LineHelper().CreateSchema(
          Defaults().Lines({
            x: positions[i].x - 1,
            y: positions[i].y + 1,
            z: positions[i].z,
          } as Vector3)[i] as Array<Vector3>,
          0xffffff,
        );
        lines.push(SchemaLine().CreateLine(lineSchema));
      }
    }
    return lines;
  };

  return { ConnectPointsWithLine };
};

export default StoryCircleChild;
