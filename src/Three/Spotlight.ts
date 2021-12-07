import { Mesh, Vector3 } from 'three';
import CircleHelper from './CircleHelper';
import SchemaCircle from './CircleSchema';
import Colors from './defaults.color';
import Layers from './defaults.layers';

export type SpotlightFunctions = {
  SpotLight: () => Mesh;
  create: (startPosition: Vector3, radius: number,color?: number) => Mesh;
  move: (position: Vector3, height: number) => void;
  moveTo: (from: Vector3, to: Vector3, steps: number) => Array<Vector3>;
}

const Spot = (): SpotlightFunctions => {
  let spotlight: Mesh;

  const SpotLight = () => spotlight;
  const create = (startPosition: Vector3, radius: number, color?: number) => {
    spotlight = SchemaCircle().CreateCircle(
      CircleHelper().CreateSchema(
        new Vector3(startPosition.x, startPosition.y, Layers.scene),
        1,
        color || Colors().white,
        0.2
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

  const moveTo = (from: Vector3, to: Vector3, steps: number) => {
    const positions: Array<Vector3> = [];
    for (let i = 0; i < steps; i++) {
      positions.push(new Vector3(from.x - to.x / 60, from.y - to.y / 60, Layers.scene));
    }
    return positions;
  };

  return { SpotLight, create, move, moveTo };
};

export default Spot;
