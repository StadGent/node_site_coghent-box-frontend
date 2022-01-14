import { CircleGeometry, Group, Mesh, MeshBasicMaterial, Vector3 } from 'three'
import Layers from './defaults.layers';
import CircleHelper from './helper.circle';
import GroupHelper from './helper.group';
import SchemaCircle from './schema.circle';

const DotWithinDot = (): {
  create: (_innerRadius: number, _radius: number, _position: Vector3, _color: number, _innerColor: number) => Group;
} => {

  const innerCircle = (_position: Vector3, _radius: number, _color: number) => {
    const innerdotSchema = CircleHelper().CreateSchema(
      new Vector3(
        _position.x,
        _position.y,
        _position.z + Layers.fraction,
      ),
      _radius,
      _color,
    );
    return SchemaCircle().CreateCircle(innerdotSchema);
  };
  const outerCircle = (_position: Vector3, _radius: number, _color: number) => {
    const innerdotSchema = CircleHelper().CreateSchema(
      new Vector3(
        _position.x,
        _position.y,
        _position.z,
      ),
      _radius,
      _color,
    );
    return SchemaCircle().CreateCircle(innerdotSchema);
  };

  const create = (_innerRadius: number, _radius: number, _position: Vector3, _color: number, _innerColor: number) => {
    const inner = innerCircle(_position, _innerRadius, _innerColor);
    const outer = outerCircle(_position, _radius, _color);
    return GroupHelper().CreateGroup([inner,outer]);
  };

  return { create }
};

export default DotWithinDot;