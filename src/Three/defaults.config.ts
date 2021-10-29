import { CircleGeometry, Mesh, MeshBasicMaterial, Vector3 } from 'three';
import BaseChapes from './BaseChapes';
import { CirclePoint, CircleSchema } from './CircleSchema';
import { CubeSchema } from './CubeSchema';
import { TextSchema } from './Textschema';

const Defaults = (): {
  circlePoints: () => Array<CirclePoint>;
  StoryPausePositions: () => Array<Vector3>;
  StoryColors: () => Array<number>;
  Circle: () => CircleSchema;
  ImageCube: () => CubeSchema;
  Word: (text: string, position: Vector3) => TextSchema;
  EndCircle: () => Mesh<CircleGeometry, MeshBasicMaterial>;
} => {
  const circlePoints = () => {
    return [
      { angle: 25, radius: 3 },
      { angle: 90, radius: 3 },
      { angle: 155, radius: 3 },
      { angle: 235, radius: 3 },
      { angle: 310, radius: 3 },
    ];
  };

  const StoryPausePositions = () => {
    return [
      new Vector3(-24, 0, 0),
      new Vector3(-14, 0, 0),
      new Vector3(10, 0, 0),
      new Vector3(20, 0, 0),
    ];
  };

  const StoryColors = () => {
    return [0xfdc20b, 0xb65099, 0x02a77f, 0x9fcdd];
  };

  const Circle = () => {
    return {
      position: { x: 0, y: 0, z: 0 } as Vector3,
      params: { radius: 2 },
    };
  };

  const ImageCube = () => {
    return {
      position: { x: 0, y: 0, z: 0 } as Vector3,
      params: {
        width: 2,
        height: 2,
        url: 'https://pixy.org/src/21/219269.jpg',
      },
    };
  };

  const Word = (text: string, position: Vector3) => {
    return {
      text: text,
      position: position as Vector3,
      fontParams: {
        color: 0xffffff,
        size: 0.3,
        path: '/Fonts/myFont.json',
      },
      textBoxParams: {
        height: 1,
        width: 3,
        color: 0x02a77f,
      },
    };
  };

  const EndCircle = () => {
    return BaseChapes().DrawCircle(0.08, 0x02a77f, 50);
  };

  return {
    circlePoints,
    StoryPausePositions,
    StoryColors,
    Circle,
    ImageCube,
    Word,
    EndCircle,
  };
};

export default Defaults;
