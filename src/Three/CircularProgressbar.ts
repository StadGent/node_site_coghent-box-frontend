import { MeshBasicMaterial, Mesh, RingGeometry, Vector3, Group } from 'three';
import ChapeHelper from './Chapehelper';
import CircleHelper from './CircleHelper';
import SchemaCircle, { CircleSchema } from './CircleSchema';
import Correction from './Correction';
import Colors from './defaults.color';
import Layers from './defaults.layers';
import GroupHelper from './GroupHelper';

const CircularProgressBar = (): {
  create: (
    position: Vector3,
    radius: number,
    segments: number,
    progress: number,
    color?: number,
  ) => Mesh;
  createActiveSegment: (
    position: Vector3,
    radius: number,
    segments: number,
    progress: number,
    color?: number,
  ) => Array<Group>;
} => {
  const create = (
    position: Vector3,
    radius: number,
    segments: number,
    progress: number,
    color?: number,
  ) => {
    const geometry = new RingGeometry(
      radius,
      radius + 0.3,
      360 / segments,
      45,
      6.3 / 360 - (6.3 / 360 / segments) * progress,
      (6.3 / 360 / segments) * progress * 360,
    );
    const material = new MeshBasicMaterial({
      color: color || Colors().white,
      opacity: 0.1,
    });
    const mesh = new Mesh(geometry, material);
    ChapeHelper().SetPosition(position, mesh);
    mesh.position.z = Layers.presentation;
    return mesh;
  };

  const createActiveSegment = (
    position: Vector3,
    radius: number,
    segments: number,
    progress: number,
    color?: number,
  ) => {
    const mesh = create(position, radius, segments, progress, color || Colors().white);
    const points = CircleHelper().SplitCircleInSegments(position, radius, segments);
    const schemas = CircleHelper().CreateSchemas(points, 0.4, color || Colors().white);
    const circles: Array<Group> = [];
    for (let i = 0; i < schemas.length; i++) {
      let innerSchema: CircleSchema = {} as CircleSchema;
      if(progress - 1 > i){
        innerSchema = CircleHelper().CreateSchema(schemas[i].position, 0.2, color || Colors().white);
      }else{
        innerSchema = CircleHelper().CreateSchema(schemas[i].position, 0.2, Colors().white);
      }
      schemas[i].position = Correction().CorrectionForDotOnProgressBar(schemas[i].position, 0.15);
      innerSchema.position = Correction().CorrectionForDotOnProgressBar(
        schemas[i].position,
        0.15,
      );
      const circle = SchemaCircle().CreateCircle(schemas[i], Layers.presentation);
      const innerCircle = SchemaCircle().CreateCircle(innerSchema, Layers.presentation);
      circles.push(GroupHelper().CreateGroup([circle, innerCircle]))
    }
    GroupHelper().AddObjectsTogroups([mesh], circles)
    return circles;
  };

  return { create, createActiveSegment };
};

export default CircularProgressBar;