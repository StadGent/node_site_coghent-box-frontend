import { CircleGeometry, Mesh, MeshBasicMaterial, Vector3 } from 'three';
import BaseChapes from './BaseChapes';
import CircleHelper from './CircleHelper';
import { CirclePoint, CircleSchema } from './CircleSchema';
import { CubeSchema } from './CubeSchema';
import DefaultLines from './LinesDefault';
import { TextSchema } from './Textschema';

const circleHelper = CircleHelper();

const Defaults = (): {
  circlePoints: () => Array<CirclePoint>;
  LinePositions: () => any;
  Circle: () => CircleSchema;
  ImageCube: () => CubeSchema;
  Word: (text: string) => TextSchema;
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

  const LinePositions = () => {
    return [
      DefaultLines().line1(circleHelper.CalculatePointOfCircle(circlePoints()[0])),
      DefaultLines().line2(circleHelper.CalculatePointOfCircle(circlePoints()[1])),
      DefaultLines().line3(circleHelper.CalculatePointOfCircle(circlePoints()[2])),
      DefaultLines().line4(circleHelper.CalculatePointOfCircle(circlePoints()[3])),
      DefaultLines().line5(circleHelper.CalculatePointOfCircle(circlePoints()[4])),
    ];
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

  const Word = (text: string) => {
    return {
      text: text,
      position: { x: 0, y: 0, z: 0 } as Vector3,
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
    LinePositions,
    Circle,
    ImageCube,
    Word,
    EndCircle,
  };
};

export default Defaults;
