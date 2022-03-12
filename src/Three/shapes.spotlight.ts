import { Mesh, Vector3 } from 'three';
import CircleHelper from './helper.circle';
import SchemaCircle from './schema.circle';
import Colors from './defaults.color';
import Layers from './defaults.layers';
import Measurements from './defaults.measurements';
const TWEEN = require('@tweenjs/tween.js');

export type SpotLightParams = {
  radius: number;
  spaceAroundObject: number;
  opacity: number;
};

export type SpotlightFunctions = {
  SpotLight: () => Mesh;
  create: (startPosition: Vector3, radius: number, color?: number) => Mesh;
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
        color || Colors().progressGrey,
        Measurements().spotLight.opacity,
      ),
      true,
    );

    move(startPosition, radius);
    return spotlight;
  };

  const move = (position: Vector3, widestLenght: number) => {
    // spotlight.position.set(position.x, position.y, Layers.scene);
    console.log(widestLenght);
    const newScale = {
      x: widestLenght / 2 + 250,
      y: widestLenght / 2 + 250,
      z: position.z,
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
          z: Layers.scene,
        },
        1000,
      )
      .easing(TWEEN.Easing.Cubic.InOut)
      .start();
  };

  return { SpotLight, create, move };
};

export default Spot;
