import { CircleGeometry, Mesh, MeshBasicMaterial, Vector3 } from 'three';
import BaseChapes from './BaseChapes';
import { CirclePoint, CircleSchema } from './CircleSchema';
import { CubeSchema } from './CubeSchema';
import Colors from './defaults.color';
import { TextSchema } from './Textschema';

const Defaults = (): {
  pixelInMeter: () => number;
  zoomOfAsset: () => number;
  circlePoints: () => Array<CirclePoint>;
  StoryColors: () => Array<number>;
  Circle: () => CircleSchema;
  ImageCube: () => CubeSchema;
  Word: (text: string, position: Vector3) => TextSchema;
  EndCircle: () => Mesh<CircleGeometry, MeshBasicMaterial>;
} => {

  const pixelInMeter = () => 0.003;
  const zoomOfAsset = () => 1.5;
  
  const circlePoints = () => {
    return [
      { angle: 25, radius: 3 },
      { angle: 90, radius: 3 },
      { angle: 155, radius: 3 },
      { angle: 235, radius: 3 },
      { angle: 310, radius: 3 },
    ];
  };

  const StoryColors = () => {
    return [
      Colors().pink,
      Colors().yellow,
      Colors().green,
      Colors().lightBlue,
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

  const Word = (text: string, position: Vector3) => {
    return {
      text: text,
      position: position as Vector3,
      fontParams: {
        color: Colors().white,
        size: 0.3,
        path: '/Fonts/myFont.json',
      },
      textBoxParams: {
        height: 1,
        width: 3,
        color: Colors().green,
      },
    };
  };

  const EndCircle = () => {
    return BaseChapes().DrawCircle(0.08, Colors().green, 50);
  };

  return {
    pixelInMeter,
    zoomOfAsset,
    circlePoints,
    StoryColors,
    Circle,
    ImageCube,
    Word,
    EndCircle,
  };
};

export default Defaults;
