import { Vector3, Mesh } from 'three';
import CircleHelper from './CircleHelper';
import { CirclePoint, CircleSchema } from './CircleSchema';
import { CubeSchema } from './CubeSchema';
import DefaultLines from './LinesDefault';
import SchemaText, { TextSchema } from './Textschema';

const circleHelper = CircleHelper();

const Defaults = (): {
  circlePoints: Array<CirclePoint>;
  LinePositions: () => any;
  Circle: CircleSchema;
  ImageCube: CubeSchema;
  TextSchemas: (words: Record<string, Vector3>) => Array<Mesh>;
} => {
  const circlePoints = [
    { angle: 25, radius: 3 },
    { angle: 90, radius: 3 },
    { angle: 155, radius: 3 },
    { angle: 235, radius: 3 },
    { angle: 310, radius: 3 },
  ];

  const LinePositions = () => {
    return [
      DefaultLines().line1(circleHelper.CalculatePointOfCircle(circlePoints[0])),
      DefaultLines().line2(circleHelper.CalculatePointOfCircle(circlePoints[1])),
      DefaultLines().line3(circleHelper.CalculatePointOfCircle(circlePoints[2])),
      DefaultLines().line4(circleHelper.CalculatePointOfCircle(circlePoints[3])),
      DefaultLines().line5(circleHelper.CalculatePointOfCircle(circlePoints[4])),
    ];
  };

  const Circle = {
    position: { x: 0, y: 0, z: 0 } as Vector3,
    params: { radius: 2 },
  };

  const ImageCube = {
    position: { x:0,y:0,z:0} as Vector3,
      params: {
        width: 2,
        height: 2,
        url: 'https://pixy.org/src/21/219269.jpg',
      }
  };

  const TextSchemas = (words: Record<string, Vector3>) => {
    const txtMeshes: Array<Mesh>  = [];
    for (const key in words) {
      const schema = {
        text: key,
        position: words[key] as Vector3,
        fontParams: {
          size: 0.3,
          path: '/Fonts/myFont.json',
        },
        textBoxParams: {
          height: 1,
          width: 3,
        },
      };
      txtMeshes.push(SchemaText().LoadText(schema));
    }
    return txtMeshes;
  };

  return {
    circlePoints,
    LinePositions,
    Circle,
    ImageCube,
    TextSchemas,
  };
};

export default Defaults;
