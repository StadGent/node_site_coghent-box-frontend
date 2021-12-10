import { Mesh, Vector3 } from 'three';
import CircleHelper from './CircleHelper';
import SchemaCircle from './CircleSchema';
import Colors from './defaults.color';
import Layers from './defaults.layers';

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
        new Vector3(startPosition.x, startPosition.y, Layers.scene),
        1,
        color || Colors().white,
        0.2,
      ),
      Layers.scene,
      true,
    );
    move(startPosition, radius);
    return spotlight;
  };

  const move = (position: Vector3, widestLenght: number) => {
    spotlight.position.set(position.x, position.y, Layers.scene);
    spotlight.scale.set(widestLenght / 2 + 1, widestLenght / 2 + 1, Layers.scene);
  };

  return { SpotLight, create, move };
};

export default Spot;
