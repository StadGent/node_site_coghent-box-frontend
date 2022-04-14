import { BoxGeometry, Color, Mesh, MeshBasicMaterial, Vector3 } from 'three';
import CircleHelper from './helper.circle';
import SchemaCircle from './schema.circle';
import Colors from './defaults.color';
import Layers from './defaults.layers';
import Measurements from './defaults.measurements';
import BaseChapes from './shapes.base';
import schemaCube, { CubeSchema } from './schema.cube';
import TWEEN from '@tweenjs/tween.js';

export type SpotLightParams = {
  radius: number;
  spaceAroundObject: number;
  opacity: number;
};

export type SpotlightFunctions = {
  SpotLight: () => Mesh;
  create: (startPosition: Vector3, radius: number, color?: number) => Mesh;
  spotLightBackground: () => Mesh<BoxGeometry, MeshBasicMaterial>;
  move: (position: Vector3, height: number) => void;
};

const Spot = (): SpotlightFunctions => {
  let spotlight: Mesh;

  const SpotLight = () => spotlight;
  const create = (startPosition: Vector3, radius: number, color?: number) => {
    spotlight = SchemaCircle().CreateCircle(
      CircleHelper().CreateSchema(
        new Vector3(startPosition.x, startPosition.y, startPosition.z),
        1,
        color || Colors().black,
        Measurements().spotLight.opacity,
      ),
      true,
    );

    spotlight.position.z = 0;
    //@ts-ignore
    spotlight.material.colorWrite = false;

    move(startPosition, radius);
    return spotlight;
  };

  const spotLightBackground = () => {
    const cube = schemaCube().CreateCube({
      position: new Vector3(0, 0, -0.1),
      params: {
        width: 5760,
        height: 1080,
      },
    } as CubeSchema);
    cube.material.color = new Color(Colors().black);
    cube.material.color.convertSRGBToLinear();
    cube.material.opacity = 0;
    cube.renderOrder = 3;

    return cube;
  };

  const move = (position: Vector3, widestLenght: number) => {
    // spotlight.position.set(position.x, position.y, Layers.scene);
    const newScale = {
      x: widestLenght / 2 + 250,
      y: widestLenght / 2 + 250,
      z: 0,
    };
    new TWEEN.Tween(spotlight.scale)
      .to(newScale, 1000)
      .easing(TWEEN.Easing.Cubic.InOut)
      .start();
    new TWEEN.Tween(spotlight.position)
      .to(
        {
          x: position.x,
          y: position.y,
          z: 0,
        },
        1000,
      )
      .easing(TWEEN.Easing.Cubic.InOut)
      .start();
  };

  return { SpotLight, spotLightBackground, create, move };
};

export default Spot;
