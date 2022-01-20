import { CircleGeometry, Group, Mesh, MeshBasicMaterial, Vector3 } from 'three'
import Layers from './defaults.layers';
import CircleHelper from './helper.circle';
import GroupHelper from './helper.group';
import SchemaCircle from './schema.circle';

export type DotWithinDotObjects = {
  dot: Mesh<CircleGeometry, MeshBasicMaterial>,
  innerDot: Mesh<CircleGeometry, MeshBasicMaterial>,
}

const DotWithinDot = (): {
  create: (_innerRadius: number, _radius: number, _position: Vector3, _color: number, _innerColor: number) => DotWithinDotObjects;
} => {

  const innerCircle = (_position: Vector3, _radius: number, _color: number) => {
    const innerdotSchema = CircleHelper().CreateSchema(
      new Vector3(
        _position.x,
        _position.y,
        _position.z + 0.0001,
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
    const outer = outerCircle(_position, _radius, _color);
    const inner = innerCircle(_position, _innerRadius, _innerColor);
    
    return {
      dot: outer,
      innerDot: inner,
    }
  };

  return { create }
};

export default DotWithinDot;