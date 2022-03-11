import { CircleGeometry, Mesh, MeshBasicMaterial, Vector3 } from 'three';
import BaseChapes from './shapes.base';
import { CirclePoint, CircleSchema } from './schema.circle';
import { CubeSchema } from './schema.cube';
import Colors from './defaults.color';
import { TextSchema } from './schema.text';

const Defaults = (): {
  pixelInMeter: () => number;
  screenZones: () => number;
  zonePadding: () => number;
  screenZonePadding: () => number;
  boundaryPadding: () => number;
  maxFrames: () => number;
  countdown: () => number;
  fontPath: () => string;
  showplayHeadWhenNoAudio: () => true | false;
  circlePoints: () => Array<CirclePoint>;
  Circle: () => CircleSchema;
  ImageCube: () => CubeSchema;
  Word: (text: string, position: Vector3) => TextSchema;
  EndCircle: () => Mesh<CircleGeometry, MeshBasicMaterial>;
} => {
  const pixelInMeter = () => 0.003;
  const screenZones = () => 6;
  const zonePadding = () => 10;
  const screenZonePadding = () => 2;
  const boundaryPadding = () => 1;

  const maxFrames = () => 2;
  const countdown = () => 3;

  const fontPath = () => '/Fonts/myFont.json';

  const showplayHeadWhenNoAudio = () => true

  const circlePoints = () => {
    return [
      { angle: 25, radius: 3 },
      { angle: 90, radius: 3 },
      { angle: 155, radius: 3 },
      { angle: 235, radius: 3 },
      { angle: 310, radius: 3 },
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
    screenZones,
    zonePadding,
    screenZonePadding,
    boundaryPadding,
    maxFrames,
    countdown,
    fontPath,
    showplayHeadWhenNoAudio,
    circlePoints,
    Circle,
    ImageCube,
    Word,
    EndCircle,
  };
};

export default Defaults;
