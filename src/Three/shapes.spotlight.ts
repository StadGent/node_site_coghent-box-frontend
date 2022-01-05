import { Mesh, Vector3 } from 'three';
import CircleHelper from './helper.circle';
import SchemaCircle from './schema.circle';
import Colors from './defaults.color';
import Layers from './defaults.layers';

export type SpotLightParams ={
  radius: number;
  spaceAroundObject: number;
}

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
        new Vector3(startPosition.x, startPosition.y, Layers.background),
        1,
        color || Colors().white,
        0.2,
      ),
      true,
    );
    move(startPosition, radius);
    return spotlight;
  };

  const move = (position: Vector3, widestLenght: number) => {
    spotlight.position.set(position.x, position.y, Layers.background);
    spotlight.scale.set(widestLenght / 2 + 1, widestLenght / 2 + 1, Layers.background);
  };

  return { SpotLight, create, move };
};

export default Spot;
