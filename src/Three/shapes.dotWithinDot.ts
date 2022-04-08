import { BoxGeometry, CircleGeometry, Group, Mesh, MeshBasicMaterial, Texture, Vector3 } from 'three'
import Images from './defaults.images';
import Measurements from './defaults.measurements';
import CircleHelper from './helper.circle';
import CubeHelper from './helper.cube';
import SchemaCircle from './schema.circle';
import SchemaCube from './schema.cube';

export type DotWithinDotObjects = {
  dot: Mesh<CircleGeometry, MeshBasicMaterial>,
  checkmark: Mesh<BoxGeometry, MeshBasicMaterial>,
  innerDot: Mesh<CircleGeometry, MeshBasicMaterial>,
}

export const checkmarks: Array<Texture> = []

const DotWithinDot = (): {
  create: (_innerRadius: number, _radius: number, _position: Vector3, _color: number, _innerColor: number) => Promise<DotWithinDotObjects>;
} => {

  const checkMarkIcon = async (_position: Vector3, _width: number) => {
    const schema = CubeHelper().CreateSchema(
      new Vector3(
        _position.x,
        _position.y,
        _position.z + 0.00001,
      ),
      Images.story.checkmark,
      new Vector3(_width, _width, 0),
    );
    return await SchemaCube().CreateImageCubeAsync(schema, checkmarks);
  };
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
    return SchemaCircle().CreateCircle(innerdotSchema)
  };

  const create = async (_innerRadius: number, _radius: number, _position: Vector3, _color: number, _innerColor: number) => {
    const outer = outerCircle(_position, _radius, _color);
    const inner = innerCircle(_position, _innerRadius, _innerColor);
    const checkmark = await checkMarkIcon(_position, Measurements().progressBar.checkMarkRadius)

    return {
      dot: outer,
      checkmark: checkmark,
      innerDot: inner,
    }
  };

  return { create }
};

export default DotWithinDot;