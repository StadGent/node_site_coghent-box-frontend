import { Color, Mesh, Vector3 } from 'three';
import CircleHelper from './CircleHelper';
import SchemaCircle from './CircleSchema';
import SchemaCube from './CubeSchema';
import Layers from './defaults.layers';

const Spot = (): {
  SpotLight: () => Mesh;
  create: (startPosition: Vector3) => Mesh;
  move: (position: Vector3, height: number) => void;
  block: (startPosition: Vector3, height: number) => Mesh;
} => {
  let spotlight: Mesh;

  const SpotLight = () => spotlight;
  const create = (startPosition: Vector3, color?: number) => {
    spotlight = SchemaCircle().CreateCircle(
      CircleHelper().CreateSchema(
        new Vector3(startPosition.x, startPosition.y, Layers.scene),
        1,
        color || 0xc4c4c4,
      ),
    );
    return spotlight;
  };

  const move = (position: Vector3, widestLenght: number) => {
    spotlight.position.set(position.x, position.y, Layers.scene);
    spotlight.scale.set(widestLenght / 2 + 0.5, widestLenght / 2 + 0.5, Layers.scene);
  };
  const block = (startPosition: Vector3, height: number) => {
    return SchemaCube().CreateCube({
      position: startPosition,
      params: { width: height, height: 2 },
    });
  };

  return { SpotLight, create, block, move };
};

export default Spot;
