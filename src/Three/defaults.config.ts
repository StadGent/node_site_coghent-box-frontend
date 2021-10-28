import { CircleGeometry, Mesh, MeshBasicMaterial, Vector3 } from 'three';
import BaseChapes from './BaseChapes';
import ChapeHelper from './Chapehelper';
import CircleHelper from './CircleHelper';
import { CirclePoint, CircleSchema } from './CircleSchema';
import { CubeSchema } from './CubeSchema';
import DefaultLines from './LinesDefault';
import { TextSchema } from './Textschema';

const circleHelper = CircleHelper();

const Defaults = (): {
  circlePoints: () => Array<CirclePoint>;
  LinePositions: () => any;
  Lines: (position: Vector3) => any;
  EndOfLineObjectPositionsRight: (index: number) => Vector3;
  EndOfLineObjectPositionsLeft: (index: number) => Vector3;
  CorrectTextBoxPosition: (position: Vector3, textBox: Mesh) => void;
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

  const Lines = (position: Vector3) => {
    return [
      DefaultLines().line1(position),
      DefaultLines().line2(position),
      DefaultLines().line3(position),
      DefaultLines().line4(position),
      DefaultLines().line5(position),
    ];
  };

  const EndOfLineObjectPositionsRight = (index: number) => {
    return {
      x: Defaults().LinePositions()[index][2].x,
      y: Defaults().LinePositions()[index][2].y,
      z: Defaults().LinePositions()[index][2].z,
    } as Vector3;
  };
  const EndOfLineObjectPositionsLeft = (index: number) => {
    return {
      x: Defaults().LinePositions()[index][2].x - 3,
      y: Defaults().LinePositions()[index][2].y,
      z: Defaults().LinePositions()[index][2].z,
    } as Vector3;
  };

  const CorrectTextBoxPosition = (position: Vector3, textBox: Mesh) => {
    if (position.x > 0) {
      ChapeHelper().SetPosition(
        {
          x: position.x + 1.7,
          y: position.y,
          z: position.z,
        } as Vector3,
        textBox,
      );
    } else {
      ChapeHelper().SetPosition(
        {
          x: position.x - 1.5,
          y: position.y,
          z: position.z,
        } as Vector3,
        textBox,
      );
    }
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
    Lines,
    EndOfLineObjectPositionsRight,
    EndOfLineObjectPositionsLeft,
    CorrectTextBoxPosition,
    Circle,
    ImageCube,
    Word,
    EndCircle,
  };
};

export default Defaults;
